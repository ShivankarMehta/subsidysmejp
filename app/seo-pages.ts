import type { Metadata } from "next";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://subsidysmejp.vercel.app";

export type SeoPage = {
  slug: string;
  language: "en" | "ja";
  title: string;
  description: string;
  keywords: string[];
  eyebrow: string;
  heading: string;
  intro: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  relatedProgramCategories: string[];
};

export const seoPages: SeoPage[] = [
  {
    slug: "/en/sme-subsidies-japan",
    language: "en",
    title: "SME Subsidies Japan: Government Grants and Official Links",
    description:
      "English guide to Japan SME subsidies, METI grants, digitalization support, energy subsidies, export support, and local government incentives.",
    keywords: ["SME subsidies Japan", "Japan SME grants", "Japanese government grants for SMEs"],
    eyebrow: "English guide",
    heading: "SME Subsidies in Japan",
    intro:
      "Japan offers national and local support programs for small and medium-sized enterprises, including investment subsidies, digitalization support, energy-saving grants, export assistance, R&D support, and succession or M&A measures. This page summarizes the main subsidy areas and links to official sources that admins should verify before applying.",
    sections: [
      {
        heading: "Main subsidy categories",
        body:
          "The strongest national programs usually support productivity, labor-saving investment, IT and AI adoption, new business expansion, energy efficiency, overseas expansion, and business succession. Eligibility depends on company size, industry, investment timing, wage plans, and whether costs are incurred before or after approval.",
      },
      {
        heading: "How SMEs should use this page",
        body:
          "Start with the programs listed below, then confirm the latest call documents on the official site. Many applications require G Biz ID Prime, quotes, business plans, financial statements, and post-award reporting. Local government grants should be checked separately through J-Net21 and prefecture or city websites.",
      },
      {
        heading: "Common mistakes",
        body:
          "Do not sign contracts or place orders before checking the rules. Many subsidies reject expenses that begin before the grant decision. Admins should also check double-subsidy restrictions, wage increase requirements, and reporting obligations after receiving funds.",
      },
    ],
    faqs: [
      {
        question: "Are Japan SME subsidies available to foreign-owned companies?",
        answer:
          "Some programs may be available to Japan-incorporated foreign-owned companies if they meet SME, location, tax, and business requirements. Always verify the specific call guidelines.",
      },
      {
        question: "Where can I find local government SME subsidies in Japan?",
        answer:
          "Use J-Net21, prefecture websites, city websites, and local chambers of commerce. Local programs change frequently and are not all listed in one permanent database.",
      },
    ],
    relatedProgramCategories: ["SME Investment", "IT / AI", "Energy", "Export", "Growth", "New Business"],
  },
  {
    slug: "/en/japan-employer-grants",
    language: "en",
    title: "Japan Employer Grants: Hiring, Training, Wages, and Retention Subsidies",
    description:
      "Guide to Japanese employer grants from MHLW, including Career Up Subsidy, Human Resource Development Subsidy, wage support, hiring support, and retention grants.",
    keywords: ["Japan employer grants", "MHLW subsidies", "Japan hiring subsidy", "Japan training subsidy"],
    eyebrow: "Employer grants",
    heading: "Japan Employer Grants for Hiring, Training, and Wages",
    intro:
      "Japan's Ministry of Health, Labour and Welfare offers several employer grants for workforce development, regular employment conversion, wage improvements, work-life balance, hiring, and employment maintenance. These grants can be useful for SMEs that need to hire, train, retain, or improve conditions for employees.",
    sections: [
      {
        heading: "Best programs to check first",
        body:
          "For many SMEs, the Career Up Subsidy and Human Resource Development Subsidy are the first programs to review. Wage-related projects may also fit the Business Improvement Subsidy when productivity investment is tied to minimum wage increases.",
      },
      {
        heading: "Timing matters",
        body:
          "Employment grants often require a plan or approved process before the company changes employment status, starts training, or hires a target worker. Admins should confirm the timing with the Labor Bureau or official MHLW page before taking action.",
      },
      {
        heading: "Documentation to prepare",
        body:
          "Common documents include employment contracts, wage ledgers, attendance records, training plans, work rules, payroll records, and proof that employees meet the target category.",
      },
    ],
    faqs: [
      {
        question: "Can foreign employees be included in Japanese employer grants?",
        answer:
          "They may be included when the worker, employment status, residence status, and program rules fit. Confirm with the Labor Bureau before applying.",
      },
      {
        question: "Are employer grants the same as SME investment subsidies?",
        answer:
          "No. Employer grants usually support hiring, training, wages, retention, and employment management. SME subsidies often support equipment, software, R&D, or business expansion.",
      },
    ],
    relatedProgramCategories: ["Employment / Wages", "Training", "Hiring", "Wage Increase", "Retention / HR Systems"],
  },
  {
    slug: "/en/foreign-employee-subsidies-japan",
    language: "en",
    title: "Foreign Employee Support and Subsidies in Japan for Employers",
    description:
      "Guide for employers in Japan hiring or training foreign employees, with official MHLW and JETRO links plus related training and employment grants.",
    keywords: ["foreign employee subsidies Japan", "Japan foreign worker support", "foreign hiring Japan grant"],
    eyebrow: "Foreign employees",
    heading: "Foreign Employee Support in Japan",
    intro:
      "Employers in Japan that hire foreign nationals should track both compliance guidance and grant opportunities. Not every foreign-worker support program is a cash subsidy, but related employer grants may support training, regular employment conversion, wage improvements, and workplace management improvements.",
    sections: [
      {
        heading: "What employers should check",
        body:
          "Start with MHLW foreign worker employment management guidance, Hello Work or Foreign Worker Employment Service Centers, and related employer grants such as Human Resource Development Subsidy and Career Up Subsidy.",
      },
      {
        heading: "Training and workplace integration",
        body:
          "If a company trains foreign employees for job-related skills, Japanese workplace communication, safety, or reskilling, the Human Resource Development Subsidy may be worth checking if the course rules fit.",
      },
      {
        heading: "Foreign-owned companies",
        body:
          "Foreign-owned companies entering Japan should also check JETRO Invest Japan and local government investment incentives, especially for office setup, R&D centers, hiring, or regional investment.",
      },
    ],
    faqs: [
      {
        question: "Is there one national foreign employee subsidy in Japan?",
        answer:
          "There is not one universal cash subsidy for every foreign employee. Employers should check MHLW guidance, training grants, employment conversion grants, and local foreign talent programs.",
      },
      {
        question: "Can Japanese language training be subsidized?",
        answer:
          "It depends on the grant course and training purpose. Job-related training may fit some Human Resource Development Subsidy courses, but eligibility must be confirmed.",
      },
    ],
    relatedProgramCategories: ["Foreign Employees", "Training", "Employment / Wages", "Foreign Company / Local Investment"],
  },
  {
    slug: "/ja/chusho-kigyo-hojokin",
    language: "ja",
    title: "日本の中小企業補助金一覧：公式リンクと申請前チェック",
    description:
      "中小企業向けの日本政府補助金、IT導入、省力化投資、省エネ、海外展開、事業承継、自治体支援を確認できる管理者向けガイド。",
    keywords: ["中小企業 補助金", "日本 補助金 中小企業", "中小企業庁 補助金", "省力化 補助金"],
    eyebrow: "日本語ガイド",
    heading: "日本の中小企業補助金",
    intro:
      "日本では、中小企業向けに設備投資、省力化、IT・AI導入、省エネ、海外展開、研究開発、事業承継、新規事業などの支援制度があります。制度名や締切は頻繁に変わるため、申請前に必ず公式サイトと公募要領を確認してください。",
    sections: [
      {
        heading: "まず確認したい制度",
        body:
          "省力化投資補助金、ものづくり補助金、デジタル化・AI導入補助金、小規模事業者持続化補助金、新事業進出補助金、省エネ関連補助金は、多くの中小企業が最初に確認すべき代表的な制度です。",
      },
      {
        heading: "自治体補助金の探し方",
        body:
          "自治体の制度は都道府県・市区町村ごとに異なります。J-Net21、都道府県サイト、市区町村サイト、商工会議所、商工会を定期的に確認してください。",
      },
      {
        heading: "申請前の注意点",
        body:
          "交付決定前の発注や契約が対象外になる制度が多くあります。GビズID、見積書、決算書、納税証明書、賃上げ要件、実績報告、重複補助の制限を事前に確認してください。",
      },
    ],
    faqs: [
      {
        question: "中小企業補助金は外資系企業でも使えますか？",
        answer:
          "日本法人として設立され、制度上の中小企業要件や所在地要件などを満たす場合は対象となる可能性があります。必ず公募要領で確認してください。",
      },
      {
        question: "どの補助金から確認すればよいですか？",
        answer:
          "設備投資なら省力化投資補助金やものづくり補助金、ITならデジタル化・AI導入補助金、販路開拓なら小規模事業者持続化補助金を確認してください。",
      },
    ],
    relatedProgramCategories: ["SME Investment", "IT / AI", "Energy", "Export", "Growth", "New Business"],
  },
  {
    slug: "/ja/koyo-joseikin",
    language: "ja",
    title: "雇用関係助成金ガイド：採用・研修・賃上げ・外国人雇用",
    description:
      "厚生労働省の雇用関係助成金、キャリアアップ助成金、人材開発支援助成金、業務改善助成金、外国人雇用支援を整理した管理者向けガイド。",
    keywords: ["雇用 助成金", "キャリアアップ助成金", "人材開発支援助成金", "外国人 雇用 助成金"],
    eyebrow: "雇用助成金",
    heading: "日本の雇用関係助成金",
    intro:
      "雇用関係助成金は、採用、正社員化、研修、賃上げ、定着、育児・介護との両立、雇用維持などを支援する制度です。中小企業が従業員の待遇改善や人材育成を進める際に確認すべき制度群です。",
    sections: [
      {
        heading: "代表的な制度",
        body:
          "キャリアアップ助成金、人材開発支援助成金、業務改善助成金、トライアル雇用助成金、両立支援等助成金、人材確保等支援助成金などを確認してください。",
      },
      {
        heading: "外国人従業員に関する確認",
        body:
          "外国人従業員については、在留資格、雇用契約、労働条件、対象労働者の要件を確認する必要があります。制度によっては対象となる可能性がありますが、事前に労働局等で確認してください。",
      },
      {
        heading: "申請タイミング",
        body:
          "雇用関係助成金は、計画届や事前手続きが必要なものがあります。採用、訓練、正社員化、賃金改定の前に公式ページと労働局で確認してください。",
      },
    ],
    faqs: [
      {
        question: "外国人従業員も助成金の対象になりますか？",
        answer:
          "雇用形態、在留資格、制度要件を満たす場合は対象となる可能性があります。制度ごとの公募要領と労働局で確認してください。",
      },
      {
        question: "研修費用は助成されますか？",
        answer:
          "職務に関連する訓練やリスキリングは、人材開発支援助成金の対象となる可能性があります。コースごとの要件を確認してください。",
      },
    ],
    relatedProgramCategories: ["Employment / Wages", "Training", "Hiring", "Wage Increase", "Foreign Employees"],
  },
];

export function getSeoPage(slug: string) {
  return seoPages.find((page) => page.slug === slug);
}

export function createSeoMetadata(page: SeoPage): Metadata {
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: page.slug,
      languages: {
        en: "/en/sme-subsidies-japan",
        ja: "/ja/chusho-kigyo-hojokin",
      },
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${siteUrl}${page.slug}`,
      type: "article",
      locale: page.language === "ja" ? "ja_JP" : "en_US",
    },
  };
}
