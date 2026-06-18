import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { programs } from "../data";
import { SeoPage, siteUrl } from "../seo-pages";

type Props = {
  page: SeoPage;
};

export function SeoLandingPage({ page }: Props) {
  const relatedPrograms = programs.filter((program) => page.relatedProgramCategories.includes(program.category.en));
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.title,
        item: `${siteUrl}${page.slug}`,
      },
    ],
  };

  return (
    <main className="seoPage" lang={page.language}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <header className="seoHero">
        <Link className="backLink" href="/">
          <ArrowLeft size={16} />
          Dashboard
        </Link>
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.heading}</h1>
        <p>{page.intro}</p>
      </header>

      <section className="seoArticle">
        {page.sections.map((section) => (
          <article key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>

      <section className="seoPrograms">
        <div className="sectionIntro">
          <p className="eyebrow">{page.language === "ja" ? "関連制度" : "Related programs"}</p>
          <h2>{page.language === "ja" ? "公式リンク付き制度" : "Programs with official links"}</h2>
        </div>
        <div className="seoProgramList">
          {relatedPrograms.slice(0, 12).map((program) => (
            <a href={program.officialLink} target="_blank" rel="noreferrer" key={program.name.en}>
              <span>{program.category[page.language]}</span>
              <strong>{program.name[page.language]}</strong>
              <p>{program.useCase[page.language]}</p>
              <ArrowUpRight size={16} />
            </a>
          ))}
        </div>
      </section>

      <section className="seoFaq">
        <div className="sectionIntro">
          <p className="eyebrow">FAQ</p>
          <h2>{page.language === "ja" ? "よくある質問" : "Common questions"}</h2>
        </div>
        {page.faqs.map((faq) => (
          <article key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
