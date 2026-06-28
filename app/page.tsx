"use client";

import {
  ArrowUpRight,
  Bell,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Filter,
  Globe2,
  Moon,
  Save,
  Search,
  ShieldCheck,
  Sun,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { checklist, Language, localSources, priorityLabels, programs } from "./data";

type Theme = "light" | "dark";

type SubsidyAlert = {
  id: string;
  programName: string;
  category: string;
  severity: "info" | "warning" | "urgent";
  title: string;
  summary: string;
  sourceUrl: string;
  detectedAt: string;
  deadlineDate?: string;
};

type AlertsResponse = {
  ok: boolean;
  storageConfigured: boolean;
  alerts: SubsidyAlert[];
  lastRunAt?: string;
};

type CompanyProfile = {
  companyName: string;
  companyNameKana: string;
  corporateNumber: string;
  representativeName: string;
  representativeTitle: string;
  postalCode: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  employees: string;
  fullTimeEmployees: string;
  partTimeEmployees: string;
  foundedYear: string;
  fiscalYearEnd: string;
  annualSales: string;
  operatingProfit: string;
  ordinaryProfit: string;
  totalAssets: string;
  paidLeaveDays: string;
  averageWage: string;
  minimumWage: string;
  plannedWageIncrease: string;
  capital: string;
  industry: string;
  mainProducts: string;
  prefecture: string;
  contactPerson: string;
  contactDepartment: string;
  gbizId: string;
  jgrantsAccount: string;
  bankName: string;
  bankBranch: string;
  accountType: string;
  accountNumber: string;
  accountHolder: string;
  projectTitle: string;
  projectPurpose: string;
  projectStartDate: string;
  projectEndDate: string;
  projectCost: string;
  requestedAmount: string;
  vendorName: string;
  equipmentName: string;
  documentsMemo: string;
};

const emptyCompanyProfile: CompanyProfile = {
  companyName: "",
  companyNameKana: "",
  corporateNumber: "",
  representativeName: "",
  representativeTitle: "",
  postalCode: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  employees: "",
  fullTimeEmployees: "",
  partTimeEmployees: "",
  foundedYear: "",
  fiscalYearEnd: "",
  annualSales: "",
  operatingProfit: "",
  ordinaryProfit: "",
  totalAssets: "",
  paidLeaveDays: "",
  averageWage: "",
  minimumWage: "",
  plannedWageIncrease: "",
  capital: "",
  industry: "",
  mainProducts: "",
  prefecture: "",
  contactPerson: "",
  contactDepartment: "",
  gbizId: "",
  jgrantsAccount: "",
  bankName: "",
  bankBranch: "",
  accountType: "",
  accountNumber: "",
  accountHolder: "",
  projectTitle: "",
  projectPurpose: "",
  projectStartDate: "",
  projectEndDate: "",
  projectCost: "",
  requestedAmount: "",
  vendorName: "",
  equipmentName: "",
  documentsMemo: "",
};

const quickFilters = [
  { label: { en: "SME", ja: "中小企業" }, value: "sme" },
  { label: { en: "Employees", ja: "従業員" }, value: "employees" },
  { label: { en: "Foreign", ja: "外国人・外資" }, value: "foreign" },
  { label: { en: "Equipment", ja: "設備" }, value: "equipment" },
  { label: { en: "Training", ja: "研修" }, value: "training" },
  { label: { en: "Local", ja: "自治体" }, value: "local" },
];

const watchKeywordFilters = [
  { en: "solar", ja: "太陽光" },
  { en: "pellet stove", ja: "ペレットストーブ" },
  { en: "wage increase", ja: "賃上げ" },
  { en: "energy saving", ja: "省エネ" },
  { en: "equipment", ja: "設備投資" },
  { en: "digital", ja: "デジタル化" },
  { en: "AI", ja: "AI" },
  { en: "training", ja: "人材育成" },
  { en: "export", ja: "海外展開" },
  { en: "new business", ja: "新規事業" },
  { en: "hiring", ja: "採用" },
  { en: "Tokyo", ja: "東京都" },
];

const profileSections: Array<{
  title: { en: string; ja: string };
  fields: Array<{
    key: keyof CompanyProfile;
    label: { en: string; ja: string };
    wide?: boolean;
    multiline?: boolean;
  }>;
}> = [
  {
    title: { en: "Company basics", ja: "会社基本情報" },
    fields: [
      { key: "companyName", label: { en: "Company name", ja: "会社名" } },
      { key: "companyNameKana", label: { en: "Company name kana", ja: "会社名カナ" } },
      { key: "corporateNumber", label: { en: "Corporate number", ja: "法人番号" } },
      { key: "representativeName", label: { en: "Representative", ja: "代表者氏名" } },
      { key: "representativeTitle", label: { en: "Representative title", ja: "代表者役職" } },
      { key: "foundedYear", label: { en: "Founded year", ja: "設立年" } },
      { key: "capital", label: { en: "Capital", ja: "資本金" } },
      { key: "fiscalYearEnd", label: { en: "Fiscal year end", ja: "決算月" } },
      { key: "industry", label: { en: "Industry", ja: "業種" } },
      { key: "mainProducts", label: { en: "Main products/services", ja: "主な商品・サービス" }, wide: true },
    ],
  },
  {
    title: { en: "Address and contact", ja: "所在地・連絡先" },
    fields: [
      { key: "postalCode", label: { en: "Postal code", ja: "郵便番号" } },
      { key: "prefecture", label: { en: "Prefecture", ja: "都道府県" } },
      { key: "address", label: { en: "Address", ja: "所在地" }, wide: true },
      { key: "phone", label: { en: "Phone", ja: "電話番号" } },
      { key: "email", label: { en: "Email", ja: "メールアドレス" } },
      { key: "website", label: { en: "Website", ja: "Webサイト" } },
      { key: "contactDepartment", label: { en: "Contact department", ja: "担当部署" } },
      { key: "contactPerson", label: { en: "Contact person", ja: "担当者" } },
    ],
  },
  {
    title: { en: "Employees and wages", ja: "従業員・賃上げ情報" },
    fields: [
      { key: "employees", label: { en: "Total employees", ja: "従業員数" } },
      { key: "fullTimeEmployees", label: { en: "Full-time employees", ja: "正社員数" } },
      { key: "partTimeEmployees", label: { en: "Part-time employees", ja: "パート・非正規人数" } },
      { key: "paidLeaveDays", label: { en: "Average paid leave days", ja: "平均有給休暇取得日数" } },
      { key: "averageWage", label: { en: "Average wage", ja: "平均賃金" } },
      { key: "minimumWage", label: { en: "Lowest hourly wage", ja: "最低時間給" } },
      { key: "plannedWageIncrease", label: { en: "Planned wage increase", ja: "賃上げ予定" }, wide: true },
    ],
  },
  {
    title: { en: "Financials", ja: "財務情報" },
    fields: [
      { key: "annualSales", label: { en: "Annual sales", ja: "売上高" } },
      { key: "operatingProfit", label: { en: "Operating profit", ja: "営業利益" } },
      { key: "ordinaryProfit", label: { en: "Ordinary profit", ja: "経常利益" } },
      { key: "totalAssets", label: { en: "Total assets", ja: "総資産" } },
    ],
  },
  {
    title: { en: "Project plan", ja: "申請事業計画" },
    fields: [
      { key: "projectTitle", label: { en: "Project title", ja: "事業名" }, wide: true },
      { key: "projectPurpose", label: { en: "Purpose and expected effect", ja: "目的・期待効果" }, wide: true, multiline: true },
      { key: "projectStartDate", label: { en: "Project start date", ja: "事業開始予定日" } },
      { key: "projectEndDate", label: { en: "Project end date", ja: "事業完了予定日" } },
      { key: "projectCost", label: { en: "Total project cost", ja: "総事業費" } },
      { key: "requestedAmount", label: { en: "Requested subsidy amount", ja: "補助金申請額" } },
      { key: "vendorName", label: { en: "Vendor / supplier", ja: "発注先・見積先" } },
      { key: "equipmentName", label: { en: "Equipment / system name", ja: "設備・システム名" } },
    ],
  },
  {
    title: { en: "IDs, bank, and documents", ja: "ID・口座・添付書類" },
    fields: [
      { key: "gbizId", label: { en: "G Biz ID status", ja: "GビズID状況" } },
      { key: "jgrantsAccount", label: { en: "JGrants account", ja: "Jグランツアカウント" } },
      { key: "bankName", label: { en: "Bank", ja: "金融機関名" } },
      { key: "bankBranch", label: { en: "Branch", ja: "支店名" } },
      { key: "accountType", label: { en: "Account type", ja: "口座種別" } },
      { key: "accountNumber", label: { en: "Account number", ja: "口座番号" } },
      { key: "accountHolder", label: { en: "Account holder", ja: "口座名義" } },
      {
        key: "documentsMemo",
        label: { en: "Document memo", ja: "添付書類メモ" },
        wide: true,
        multiline: true,
      },
    ],
  },
];

const seoLinks = [
  {
    href: "/ja/chusho-kigyo-hojokin",
    label: { en: "SME subsidies in Japanese", ja: "中小企業補助金ガイド" },
    text: { en: "Japanese guide for SME grants", ja: "日本語で主要な中小企業補助金を確認" },
  },
  {
    href: "/ja/koyo-joseikin",
    label: { en: "Employment grants in Japanese", ja: "雇用関係助成金ガイド" },
    text: { en: "Hiring, training, and wage support", ja: "採用・研修・賃上げ支援を確認" },
  },
  {
    href: "/en/sme-subsidies-japan",
    label: { en: "SME Subsidies Japan", ja: "SME Subsidies Japan" },
    text: { en: "English guide for Japan SME grants", ja: "英語で日本の中小企業補助金を確認" },
  },
  {
    href: "/en/japan-employer-grants",
    label: { en: "Japan Employer Grants", ja: "Japan Employer Grants" },
    text: { en: "English guide for employer subsidies", ja: "英語で雇用助成金を確認" },
  },
  {
    href: "/en/foreign-employee-subsidies-japan",
    label: { en: "Foreign Employee Support", ja: "Foreign Employee Support" },
    text: { en: "Foreign staff and foreign-owned company support", ja: "外国人従業員・外資系企業向け支援" },
  },
];

const ui = {
  en: {
    lastChecked: "Admin subsidy map · last checked 2026-06-17",
    title: "Japan SME Subsidies Admin",
    heroText:
      "A searchable working list for government SME subsidies, employer grants, foreign employee support, and local incentive sources in Japan.",
    language: "Language",
    english: "English",
    japanese: "日本語",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    trackedSources: "tracked sources",
    highPriority: "high-priority checks",
    foreignRelated: "foreign-related entries",
    filters: "Filters",
    search: "Search",
    searchPlaceholder: "AI, wages, foreign, Tokyo...",
    category: "Category",
    all: "All",
    quickView: "Quick view",
    note:
      "Local subsidies change constantly. Use the portals plus prefecture and city sites before committing admin time to any application.",
    programs: "Programs",
    matches: "matches",
    reset: "Reset",
    officialSite: "Official site",
    localSearch: "Local search",
    localTitle: "Where admins should check by region",
    beforeApplying: "Before applying",
    checklist: "Admin checklist",
    topicPages: "SEO topic pages",
  },
  ja: {
    lastChecked: "管理用補助金マップ・最終確認日 2026-06-17",
    title: "日本の中小企業補助金管理",
    heroText:
      "日本の中小企業向け補助金、雇用関係助成金、外国人従業員支援、自治体インセンティブを検索できる管理用リストです。",
    language: "言語",
    english: "English",
    japanese: "日本語",
    theme: "テーマ",
    light: "ライト",
    dark: "ダーク",
    trackedSources: "登録ソース",
    highPriority: "重要チェック",
    foreignRelated: "外国人・外資関連",
    filters: "絞り込み",
    search: "検索",
    searchPlaceholder: "AI、賃上げ、外国人、東京...",
    category: "カテゴリ",
    all: "すべて",
    quickView: "クイック表示",
    note:
      "自治体の補助金は頻繁に変わります。申請準備に入る前に、ポータル、都道府県、市区町村サイトを確認してください。",
    programs: "制度一覧",
    matches: "件",
    reset: "リセット",
    officialSite: "公式サイト",
    localSearch: "自治体検索",
    localTitle: "管理者が地域別に確認すべきサイト",
    beforeApplying: "申請前",
    checklist: "管理チェックリスト",
    topicPages: "検索向けガイド",
  },
} satisfies Record<Language, Record<string, string>>;

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [quickFilter, setQuickFilter] = useState("");
  const [language, setLanguage] = useState<Language>("ja");
  const [theme, setTheme] = useState<Theme>("light");
  const [alertsData, setAlertsData] = useState<AlertsResponse | null>(null);
  const [watchedKeywords, setWatchedKeywords] = useState<string[]>([]);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(emptyCompanyProfile);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileSaveMode, setProfileSaveMode] = useState<"idle" | "redis" | "local">("idle");
  const [profileSaving, setProfileSaving] = useState(false);

  const copy = ui[language];

  useEffect(() => {
    const savedKeywords = window.localStorage.getItem("subsidy-watch-keywords");
    const savedProfile = window.localStorage.getItem("subsidy-company-profile");

    if (savedKeywords) {
      try {
        setWatchedKeywords(JSON.parse(savedKeywords) as string[]);
      } catch {
        setWatchedKeywords([]);
      }
    }

    if (savedProfile) {
      try {
        setCompanyProfile({ ...emptyCompanyProfile, ...(JSON.parse(savedProfile) as Partial<CompanyProfile>) });
      } catch {
        setCompanyProfile(emptyCompanyProfile);
      }
    }

    fetch("/api/company-profile", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { ok: boolean; profile: Partial<CompanyProfile> | null }) => {
        if (data.profile) {
          setCompanyProfile({ ...emptyCompanyProfile, ...data.profile });
        }
      })
      .catch(() => {
        // Keep the local browser copy when Redis cannot be reached.
      });
  }, []);

  useEffect(() => {
    window.localStorage.setItem("subsidy-watch-keywords", JSON.stringify(watchedKeywords));
  }, [watchedKeywords]);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/subsidy-alerts", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: AlertsResponse) => {
        if (isMounted) {
          setAlertsData(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAlertsData({ ok: false, storageConfigured: false, alerts: [] });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleWatchedKeyword = (keyword: string) => {
    setWatchedKeywords((currentKeywords) =>
      currentKeywords.includes(keyword)
        ? currentKeywords.filter((currentKeyword) => currentKeyword !== keyword)
        : [...currentKeywords, keyword],
    );
  };

  const updateProfile = (field: keyof CompanyProfile, value: string) => {
    setCompanyProfile((currentProfile) => ({ ...currentProfile, [field]: value }));
    setProfileSaved(false);
    setProfileSaveMode("idle");
  };

  const saveProfile = async () => {
    setProfileSaving(true);
    window.localStorage.setItem("subsidy-company-profile", JSON.stringify(companyProfile));

    try {
      const response = await fetch("/api/company-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyProfile),
      });

      if (!response.ok) {
        throw new Error("Profile save failed");
      }

      const result = (await response.json()) as { storageConfigured: boolean };

      setProfileSaved(true);
      setProfileSaveMode(result.storageConfigured ? "redis" : "local");
    } catch {
      setProfileSaved(true);
      setProfileSaveMode("local");
    } finally {
      setProfileSaving(false);
    }
  };

  const categories = useMemo(() => {
    const categoryMap = new Map<string, string>();
    programs.forEach((program) => {
      categoryMap.set(program.category.en, program.category[language]);
    });

    return [{ key: "all", label: copy.all }, ...Array.from(categoryMap, ([key, label]) => ({ key, label }))];
  }, [copy.all, language]);

  const filteredPrograms = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return programs.filter((program) => {
      const categoryMatch = category === "all" || program.category.en === category;
      const searchText = [
        program.name.en,
        program.name.ja,
        program.category.en,
        program.category.ja,
        program.audience.en,
        program.audience.ja,
        program.useCase.en,
        program.useCase.ja,
        program.adminAction.en,
        program.adminAction.ja,
        program.tags.map((tag) => `${tag.en} ${tag.ja}`).join(" "),
      ]
        .join(" ")
        .toLowerCase();
      const queryMatch = !normalizedQuery || searchText.includes(normalizedQuery);
      const quickMatch = !quickFilter || searchText.includes(quickFilter);
      const watchedKeywordMatch =
        watchedKeywords.length === 0 || watchedKeywords.some((keyword) => searchText.includes(keyword.toLowerCase()));

      return categoryMatch && queryMatch && quickMatch && watchedKeywordMatch;
    });
  }, [category, query, quickFilter, watchedKeywords]);

  const counts = {
    total: programs.length,
    high: programs.filter((program) => program.priority === "High").length,
    foreign: programs.filter((program) => program.tags.some((tag) => tag.en.includes("foreign"))).length,
  };

  const alertPrograms = useMemo(() => {
    return new Map(programs.map((program) => [program.name.en, program]));
  }, []);

  const alertsByProgram = useMemo(() => {
    const alertMap = new Map<string, SubsidyAlert[]>();

    (alertsData?.alerts ?? []).forEach((alert) => {
      const currentAlerts = alertMap.get(alert.programName) ?? [];
      currentAlerts.push(alert);
      alertMap.set(alert.programName, currentAlerts);
    });

    return alertMap;
  }, [alertsData?.alerts]);

  const formatDate = (dateText?: string) => {
    if (!dateText) {
      return language === "ja" ? "日付確認中" : "Date pending";
    }

    return new Date(`${dateText}T00:00:00`).toLocaleDateString(language === "ja" ? "ja-JP" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysUntil = (dateText?: string) => {
    if (!dateText) {
      return null;
    }

    const today = new Date();
    const target = new Date(`${dateText}T00:00:00`);
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    return Math.ceil((target.getTime() - todayLocal.getTime()) / 86400000);
  };

  return (
    <main lang={language} data-theme={theme}>
      <section className="hero">
        <div className="heroOverlay" />
        <div className="heroContent">
          <div className="heroTopline">
            <p className="eyebrow">{copy.lastChecked}</p>
            <div className="languageControl" aria-label={copy.language}>
              <button
                className={language === "en" ? "languageButton active" : "languageButton"}
                onClick={() => setLanguage("en")}
                type="button"
              >
                {copy.english}
              </button>
              <button
                className={language === "ja" ? "languageButton active" : "languageButton"}
                onClick={() => setLanguage("ja")}
                type="button"
              >
                {copy.japanese}
              </button>
            </div>
            <div className="themeControl" aria-label={copy.theme}>
              <button
                className={theme === "light" ? "themeButton active" : "themeButton"}
                onClick={() => setTheme("light")}
                title={copy.light}
                type="button"
              >
                <Sun size={16} />
                <span>{copy.light}</span>
              </button>
              <button
                className={theme === "dark" ? "themeButton active" : "themeButton"}
                onClick={() => setTheme("dark")}
                title={copy.dark}
                type="button"
              >
                <Moon size={16} />
                <span>{copy.dark}</span>
              </button>
            </div>
          </div>
          <h1>{copy.title}</h1>
          <p className="heroText">{copy.heroText}</p>
          <div className="heroActions">
            <a className="primaryLink" href="https://j-net21.smrj.go.jp/snavi/" target="_blank" rel="noreferrer">
              J-Net21 <ArrowUpRight size={16} />
            </a>
            <a className="secondaryLink" href="https://mirasapo-plus.go.jp/" target="_blank" rel="noreferrer">
              Mirasapo Plus <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <section className="statsBand">
        <div className="stat">
          <Building2 size={20} />
          <span>{counts.total}</span>
          <p>{copy.trackedSources}</p>
        </div>
        <div className="stat">
          <ShieldCheck size={20} />
          <span>{counts.high}</span>
          <p>{copy.highPriority}</p>
        </div>
        <div className="stat">
          <Globe2 size={20} />
          <span>{counts.foreign}</span>
          <p>{copy.foreignRelated}</p>
        </div>
      </section>

      <section className="alertsBand" aria-label={language === "ja" ? "最新通知" : "Latest alerts"}>
        <div className="alertsHeader">
          <div>
            <p className="eyebrow">{language === "ja" ? "最新通知" : "Latest alerts"}</p>
            <h2>
              {alertsData?.storageConfigured
                ? language === "ja"
                  ? "自動クロール通知"
                  : "Automatic subsidy notifications"
                : language === "ja"
                  ? "通知保存にはUpstash Redisの設定が必要です"
                  : "Connect Upstash Redis to store crawler notifications"}
            </h2>
          </div>
          {alertsData?.lastRunAt ? (
            <span className="lastRun">
              <CalendarClock size={16} />
              {language === "ja" ? "最終確認" : "Last run"}:{" "}
              {new Date(alertsData.lastRunAt).toLocaleDateString(language === "ja" ? "ja-JP" : "en-US")}
            </span>
          ) : null}
        </div>
        {alertsData?.alerts.length ? (
          <div className="alertList">
            {alertsData.alerts.slice(0, 4).map((alert) => {
              const program = alertPrograms.get(alert.programName);
              const daysUntil = getDaysUntil(alert.deadlineDate);
              const alertTitle =
                language === "ja"
                  ? daysUntil === 0
                    ? "本日が締切候補です"
                    : daysUntil && daysUntil > 0
                      ? `締切候補まであと${daysUntil}日`
                      : "新しい更新候補があります"
                  : alert.title;
              const programName = program ? program.name[language] : alert.programName;
              const categoryName = program ? program.category[language] : alert.category;

              return (
                <article className={`alertItem alert${alert.severity}`} key={alert.id}>
                  <div className="alertIcon">
                    <Bell size={19} />
                  </div>
                  <div className="alertBody">
                    <div className="alertMeta">
                      <span>{categoryName}</span>
                      <strong>{formatDate(alert.deadlineDate)}</strong>
                    </div>
                    <h3>{alertTitle}</h3>
                    <h4>{programName}</h4>
                    {program ? (
                      <>
                        <p>{program.useCase[language]}</p>
                        <div className="alertDetail">
                          <CheckCircle2 size={15} />
                          <span>{program.adminAction[language]}</span>
                        </div>
                      </>
                    ) : (
                      <p>{language === "ja" ? "公式サイトで申請日程と締切を確認してください。" : alert.summary}</p>
                    )}
                    <a href={alert.sourceUrl} target="_blank" rel="noreferrer">
                      {language === "ja" ? "公式サイトで確認" : "Verify on official site"} <ArrowUpRight size={14} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="emptyAlerts">
            {language === "ja"
              ? "保存済みの新しい補助金通知はまだありません。"
              : "No new subsidy updates are stored yet."}
          </p>
        )}
      </section>

      <section className="applicantTools">
        <div className={profileOpen ? "companyPanel open" : "companyPanel"}>
          <button
            className="toolHeader collapsibleHeader"
            onClick={() => setProfileOpen((currentValue) => !currentValue)}
            type="button"
            aria-expanded={profileOpen}
          >
            <div>
              <p className="eyebrow">{language === "ja" ? "申請情報メモ" : "Application profile"}</p>
              <h2>{language === "ja" ? "会社情報を事前に保存" : "Save company details"}</h2>
            </div>
            <span className="headerActions">
              <ClipboardList size={22} />
              <ChevronDown size={22} />
            </span>
          </button>

          {profileOpen ? (
            <>
              <div className="profileSections">
                {profileSections.map((section) => (
                  <section className="profileSection" key={section.title.en}>
                    <h3>{section.title[language]}</h3>
                    <div className="profileGrid">
                      {section.fields.map((field) => (
                        <label className={field.wide ? "profileField wide" : "profileField"} key={field.key}>
                          <span>{field.label[language]}</span>
                          {field.multiline ? (
                            <textarea
                              value={companyProfile[field.key]}
                              onChange={(event) => updateProfile(field.key, event.target.value)}
                            />
                          ) : (
                            <input
                              value={companyProfile[field.key]}
                              onChange={(event) => updateProfile(field.key, event.target.value)}
                            />
                          )}
                        </label>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <div className="profileActions">
                <button onClick={saveProfile} type="button" disabled={profileSaving}>
                  <Save size={17} />
                  {profileSaving
                    ? language === "ja"
                      ? "保存中..."
                      : "Saving..."
                    : language === "ja"
                      ? "会社情報を保存"
                      : "Save profile"}
                </button>
                <span>
                  {profileSaved
                    ? language === "ja"
                      ? profileSaveMode === "redis"
                        ? "Redisに保存しました"
                        : "保存しました"
                      : profileSaveMode === "redis"
                        ? "Saved to Redis"
                        : "Saved"
                    : ""}
                </span>
              </div>
            </>
          ) : null}
        </div>
      </section>

      <section className="infoBand">
        <div className="sectionIntro">
          <p className="eyebrow">{copy.localSearch}</p>
          <h2>{copy.localTitle}</h2>
        </div>
        <div className="sourceTable">
          {localSources.map(([area, source, link]) => (
            <a href={link} target="_blank" rel="noreferrer" key={`${area.en}-${source.en}`}>
              <span>{area[language]}</span>
              <strong>{source[language]}</strong>
              <ArrowUpRight size={16} />
            </a>
          ))}
        </div>
      </section>

      <section className="checklistSection">
        <div className="sectionIntro">
          <p className="eyebrow">{copy.beforeApplying}</p>
          <h2>{copy.checklist}</h2>
        </div>
        <div className="checklist">
          {checklist.map((item) => (
            <div className="checkItem" key={item.en}>
              <Users size={18} />
              <p>{item[language]}</p>
            </div>
          ))}
        </div>
      </section>

      <nav className="topicBand" aria-label={copy.topicPages}>
        {seoLinks.map((link) => (
          <a href={link.href} key={link.href}>
            <strong>{link.label[language]}</strong>
            <span>{link.text[language]}</span>
            <ArrowUpRight size={15} />
          </a>
        ))}
      </nav>

      <section className="workspace">
        <aside className="controlPanel" aria-label={copy.filters}>
          <div className="panelTitle">
            <Filter size={18} />
            <h2>{copy.filters}</h2>
          </div>

          <label className="field">
            <span>{copy.search}</span>
            <div className="searchBox">
              <Search size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.searchPlaceholder}
              />
            </div>
          </label>

          <label className="field">
            <span>{copy.category}</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="field">
            <span>{copy.quickView}</span>
            <div className="chips">
              {quickFilters.map((filter) => (
                <button
                  className={quickFilter === filter.value ? "chip active" : "chip"}
                  key={filter.value}
                  onClick={() => setQuickFilter(quickFilter === filter.value ? "" : filter.value)}
                  type="button"
                >
                  {filter.label[language]}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <span>{language === "ja" ? "通知キーワード" : "Alert keywords"}</span>
            <div className="chips watchFilterChips">
              {watchKeywordFilters.map((filter) => {
                const keyword = filter[language];
                const active = watchedKeywords.includes(keyword);

                return (
                  <button
                    className={active ? "chip active" : "chip"}
                    key={filter.en}
                    onClick={() => toggleWatchedKeyword(keyword)}
                    type="button"
                  >
                    {keyword}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="note">{copy.note}</div>
        </aside>

        <section className="results" aria-label={copy.programs}>
          <div className="resultsHeader">
            <div>
              <p className="eyebrow">{copy.programs}</p>
              <h2>
                {filteredPrograms.length} {copy.matches}
              </h2>
            </div>
            <button
              className="resetButton"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setQuickFilter("");
                setWatchedKeywords([]);
              }}
              type="button"
            >
              {copy.reset}
            </button>
          </div>

          <div className="programGrid">
            {filteredPrograms.length ? (
              filteredPrograms.map((program) => {
                const programAlerts = alertsByProgram.get(program.name.en) ?? [];
                const closestDeadline = programAlerts.find((alert) => alert.deadlineDate);
                const daysUntil = getDaysUntil(closestDeadline?.deadlineDate);

                return (
                  <article className="programCard" key={program.name.en}>
                    <div className="cardTopline">
                      <span>{program.category[language]}</span>
                      <strong className={`priority priority${program.priority}`}>
                        {priorityLabels[program.priority][language]}
                      </strong>
                      {closestDeadline ? (
                        <strong className="deadlineBadge">
                          {language === "ja"
                            ? daysUntil !== null && daysUntil >= 0
                              ? `締切候補 ${daysUntil}日前`
                              : "締切候補あり"
                            : daysUntil !== null && daysUntil >= 0
                              ? `Deadline in ${daysUntil}d`
                              : "Deadline alert"}
                        </strong>
                      ) : null}
                    </div>
                    <h3>{program.name[language]}</h3>
                    <p className="jpName">{program.name[language === "en" ? "ja" : "en"]}</p>
                    <p className="audience">{program.audience[language]}</p>
                    <p>{program.useCase[language]}</p>
                    <div className="adminAction">
                      <CheckCircle2 size={17} />
                      <span>{program.adminAction[language]}</span>
                    </div>
                    <div className="tagRow">
                      {program.tags.slice(0, 3).map((tag) => (
                        <span key={tag.en}>{tag[language]}</span>
                      ))}
                    </div>
                    <a className="cardLink" href={program.officialLink} target="_blank" rel="noreferrer">
                      {copy.officialSite} <ArrowUpRight size={16} />
                    </a>
                  </article>
                );
              })
            ) : (
              <div className="emptyResults">
                <Search size={22} />
                <h3>{language === "ja" ? "条件に一致する補助金がありません" : "No matching subsidies"}</h3>
                <p>
                  {language === "ja"
                    ? "検索語、カテゴリ、通知キーワードを少し広げて確認してください。"
                    : "Try broadening the search, category, or alert keyword filters."}
                </p>
                <button
                  onClick={() => {
                    setQuery("");
                    setCategory("all");
                    setQuickFilter("");
                    setWatchedKeywords([]);
                  }}
                  type="button"
                >
                  {copy.reset}
                </button>
              </div>
            )}
          </div>
        </section>
      </section>

      <footer className="makerFooter">
        <span>Made by Shivankar Mehta</span>
        <a href="mailto:shivankarmehta60@gmail.com">shivankarmehta60@gmail.com</a>
      </footer>
    </main>
  );
}
