import { programs } from "../data";

export type SubsidyAlertSeverity = "info" | "warning" | "urgent";

export type SubsidyAlert = {
  id: string;
  programName: string;
  category: string;
  severity: SubsidyAlertSeverity;
  title: string;
  summary: string;
  sourceUrl: string;
  detectedAt: string;
  deadlineDate?: string;
  confidence: "high" | "medium" | "low";
};

type ProgramSnapshot = {
  programName: string;
  sourceUrl: string;
  contentHash: string;
  checkedAt: string;
  dates: string[];
  excerpts: string[];
};

type MonitorStore = {
  snapshots: Record<string, ProgramSnapshot>;
  alerts: SubsidyAlert[];
  lastRunAt?: string;
};

type CrawlResult = {
  checked: number;
  createdAlerts: number;
  storageConfigured: boolean;
  alerts: SubsidyAlert[];
  errors: Array<{ programName: string; message: string }>;
};

const STORE_KEY = "subsidy-monitor:store";
const MAX_ALERTS = 80;
const REQUEST_TIMEOUT_MS = 15000;
const DEADLINE_WINDOW_DAYS = 30;

const deadlineKeywords = [
  "deadline",
  "application deadline",
  "application period",
  "apply by",
  "submission",
  "締切",
  "締め切り",
  "申請期限",
  "応募締切",
  "公募締切",
  "受付締切",
  "申請期間",
  "公募期間",
  "募集期間",
];

function getStorageConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return { url: url.replace(/\/$/, ""), token };
}

async function redisCommand<T>(command: unknown[]): Promise<T | null> {
  const config = getStorageConfig();

  if (!config) {
    return null;
  }

  const response = await fetch(`${config.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([command]),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Redis request failed with ${response.status}`);
  }

  const [payload] = (await response.json()) as Array<{ result: T | null }>;
  return payload?.result ?? null;
}

async function readStore(): Promise<MonitorStore> {
  const rawStore = await redisCommand<string>(["GET", STORE_KEY]);

  if (!rawStore) {
    return { snapshots: {}, alerts: [] };
  }

  try {
    return JSON.parse(rawStore) as MonitorStore;
  } catch {
    return { snapshots: {}, alerts: [] };
  }
}

async function writeStore(store: MonitorStore) {
  await redisCommand(["SET", STORE_KEY, JSON.stringify(store)]);
}

function normalizeText(input: string) {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function hashText(input: string) {
  let hash = 5381;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 33) ^ input.charCodeAt(index);
  }

  return (hash >>> 0).toString(16);
}

function getNearbyExcerpts(text: string) {
  const lowerText = text.toLowerCase();
  const excerpts = new Set<string>();

  deadlineKeywords.forEach((keyword) => {
    const index = lowerText.indexOf(keyword.toLowerCase());

    if (index >= 0) {
      const start = Math.max(0, index - 120);
      const end = Math.min(text.length, index + 240);
      excerpts.add(text.slice(start, end).trim());
    }
  });

  return Array.from(excerpts).slice(0, 4);
}

function toIsoDate(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(year, month - 1, day));

  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return null;
  }

  return date.toISOString().slice(0, 10);
}

function extractDates(text: string) {
  const dates = new Set<string>();
  const currentYear = new Date().getFullYear();
  const patterns = [
    /(?:20\d{2})[./-](?:0?[1-9]|1[0-2])[./-](?:0?[1-9]|[12]\d|3[01])/g,
    /(?:20\d{2})年(?:0?[1-9]|1[0-2])月(?:0?[1-9]|[12]\d|3[01])日?/g,
    /(?:0?[1-9]|1[0-2])月(?:0?[1-9]|[12]\d|3[01])日/g,
  ];

  patterns.forEach((pattern) => {
    for (const match of text.matchAll(pattern)) {
      const value = match[0];
      const numeric = value.match(/\d+/g)?.map(Number);

      if (!numeric) {
        continue;
      }

      const [year, month, day] = numeric.length === 3 ? numeric : [currentYear, numeric[0], numeric[1]];
      const isoDate = toIsoDate(year, month, day);

      if (isoDate) {
        dates.add(isoDate);
      }
    }
  });

  return Array.from(dates).sort();
}

function dateDistanceDays(dateText: string) {
  const today = new Date();
  const target = new Date(`${dateText}T00:00:00Z`);
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

  return Math.ceil((target.getTime() - todayUtc) / 86400000);
}

function buildDeadlineAlerts(snapshot: ProgramSnapshot, category: string, detectedAt: string) {
  return snapshot.dates
    .map((date) => ({ date, daysAway: dateDistanceDays(date) }))
    .filter(({ daysAway }) => daysAway >= 0 && daysAway <= DEADLINE_WINDOW_DAYS)
    .slice(0, 2)
    .map(({ date, daysAway }) => {
      const severity: SubsidyAlertSeverity = daysAway <= 7 ? "urgent" : daysAway <= 14 ? "warning" : "info";

      return {
        id: `${snapshot.programName}-${date}-deadline`,
        programName: snapshot.programName,
        category,
        severity,
        title: daysAway === 0 ? "Possible deadline today" : `Possible deadline in ${daysAway} days`,
        summary: `A date near deadline/application wording was detected: ${date}. Please verify on the official source before acting.`,
        sourceUrl: snapshot.sourceUrl,
        detectedAt,
        deadlineDate: date,
        confidence: snapshot.excerpts.length > 0 ? "medium" : "low",
      } satisfies SubsidyAlert;
    });
}

function buildChangeAlert(snapshot: ProgramSnapshot, previous: ProgramSnapshot | undefined, category: string) {
  if (!previous || previous.contentHash === snapshot.contentHash) {
    return null;
  }

  return {
    id: `${snapshot.programName}-${snapshot.contentHash}-changed`,
    programName: snapshot.programName,
    category,
    severity: "info",
    title: "Official page changed",
    summary:
      snapshot.excerpts[0] ??
      "The official subsidy page content changed since the last crawl. Review the source for new notices, schedules, or requirements.",
    sourceUrl: snapshot.sourceUrl,
    detectedAt: snapshot.checkedAt,
    confidence: snapshot.excerpts.length > 0 ? "medium" : "low",
  } satisfies SubsidyAlert;
}

async function fetchWithTimeout(url: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, {
      headers: {
        "User-Agent": "SubsidyMonitor/1.0 (+https://vercel.app)",
      },
      signal: controller.signal,
      cache: "no-store",
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function crawlProgram(program: (typeof programs)[number]): Promise<ProgramSnapshot> {
  const response = await fetchWithTimeout(program.officialLink);

  if (!response.ok) {
    throw new Error(`Official page returned ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const rawText = await response.text();
  const text = contentType.includes("text/html") ? normalizeText(rawText) : rawText.slice(0, 25000);
  const deadlineText = getNearbyExcerpts(text).join(" ");

  return {
    programName: program.name.en,
    sourceUrl: program.officialLink,
    contentHash: hashText(text.slice(0, 80000)),
    checkedAt: new Date().toISOString(),
    dates: extractDates(deadlineText || text.slice(0, 25000)),
    excerpts: getNearbyExcerpts(text),
  };
}

async function runInBatches<T, R>(items: T[], batchSize: number, worker: (item: T) => Promise<R>) {
  const results: R[] = [];

  for (let index = 0; index < items.length; index += batchSize) {
    const batch = items.slice(index, index + batchSize);
    results.push(...(await Promise.all(batch.map(worker))));
  }

  return results;
}

export async function runSubsidyMonitor(): Promise<CrawlResult> {
  const storageConfigured = Boolean(getStorageConfig());
  const store = storageConfigured ? await readStore() : { snapshots: {}, alerts: [] };
  const nextSnapshots = { ...store.snapshots };
  const nextAlerts = [...store.alerts];
  const errors: CrawlResult["errors"] = [];

  const crawlOutputs = await runInBatches(programs, 4, async (program) => {
    try {
      const snapshot = await crawlProgram(program);
      const previous = store.snapshots[program.name.en];
      const changeAlert = buildChangeAlert(snapshot, previous, program.category.en);
      const deadlineAlerts = buildDeadlineAlerts(snapshot, program.category.en, snapshot.checkedAt);

      nextSnapshots[program.name.en] = snapshot;

      return [changeAlert, ...deadlineAlerts].filter(Boolean) as SubsidyAlert[];
    } catch (error) {
      errors.push({
        programName: program.name.en,
        message: error instanceof Error ? error.message : "Unknown crawl error",
      });

      return [];
    }
  });

  const existingAlertIds = new Set(nextAlerts.map((alert) => alert.id));
  const createdAlerts = crawlOutputs.flat().filter((alert) => !existingAlertIds.has(alert.id));

  nextAlerts.unshift(...createdAlerts);

  if (storageConfigured) {
    await writeStore({
      snapshots: nextSnapshots,
      alerts: nextAlerts.slice(0, MAX_ALERTS),
      lastRunAt: new Date().toISOString(),
    });
  }

  return {
    checked: programs.length - errors.length,
    createdAlerts: createdAlerts.length,
    storageConfigured,
    alerts: createdAlerts,
    errors,
  };
}

export async function getSubsidyAlerts() {
  const storageConfigured = Boolean(getStorageConfig());

  if (!storageConfigured) {
    return {
      storageConfigured,
      alerts: [] as SubsidyAlert[],
      lastRunAt: undefined as string | undefined,
    };
  }

  const store = await readStore();

  return {
    storageConfigured,
    alerts: store.alerts.slice(0, 30),
    lastRunAt: store.lastRunAt,
  };
}
