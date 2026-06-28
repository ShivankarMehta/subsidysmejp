import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PROFILE_KEY = "subsidy-monitor:company-profile";

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

export async function GET() {
  const rawProfile = await redisCommand<string>(["GET", PROFILE_KEY]);

  return NextResponse.json({
    ok: true,
    storageConfigured: Boolean(getStorageConfig()),
    profile: rawProfile ? JSON.parse(rawProfile) : null,
  });
}

export async function POST(request: Request) {
  const profile = await request.json();

  if (!profile || typeof profile !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid profile" }, { status: 400 });
  }

  await redisCommand(["SET", PROFILE_KEY, JSON.stringify(profile)]);

  return NextResponse.json({
    ok: true,
    storageConfigured: Boolean(getStorageConfig()),
  });
}
