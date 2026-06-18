"use client";

import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Filter,
  Globe2,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { checklist, Language, localSources, priorityLabels, programs } from "./data";

type Theme = "light" | "dark";

const quickFilters = [
  { label: { en: "SME", ja: "中小企業" }, value: "sme" },
  { label: { en: "Employees", ja: "従業員" }, value: "employees" },
  { label: { en: "Foreign", ja: "外国人・外資" }, value: "foreign" },
  { label: { en: "Equipment", ja: "設備" }, value: "equipment" },
  { label: { en: "Training", ja: "研修" }, value: "training" },
  { label: { en: "Local", ja: "自治体" }, value: "local" },
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

  const copy = ui[language];

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

      return categoryMatch && queryMatch && quickMatch;
    });
  }, [category, query, quickFilter]);

  const counts = {
    total: programs.length,
    high: programs.filter((program) => program.priority === "High").length,
    foreign: programs.filter((program) => program.tags.some((tag) => tag.en.includes("foreign"))).length,
  };

  return (
    <main lang={language} data-theme={theme}>
      <section className="hero">
        <div className="heroOverlay" />
        <div className="heroContent">
          <div className="heroTopline">
            <p className="eyebrow">{copy.lastChecked}</p>
            <div className="makerBadge">
              <span>Shivankar Mehta</span>
              <a href="mailto:shivankarmehta60@gmail.com">shivankarmehta60@gmail.com</a>
            </div>
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
              }}
              type="button"
            >
              {copy.reset}
            </button>
          </div>

          <div className="programGrid">
            {filteredPrograms.map((program) => (
              <article className="programCard" key={program.name.en}>
                <div className="cardTopline">
                  <span>{program.category[language]}</span>
                  <strong className={`priority priority${program.priority}`}>
                    {priorityLabels[program.priority][language]}
                  </strong>
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
            ))}
          </div>
        </section>
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

      <footer className="makerFooter">
        <span>Made by Shivankar Mehta</span>
        <a href="mailto:shivankarmehta60@gmail.com">shivankarmehta60@gmail.com</a>
      </footer>
    </main>
  );
}
