import { SeoLandingPage } from "../../components/SeoLandingPage";
import { createSeoMetadata, getSeoPage } from "../../seo-pages";

const page = getSeoPage("/ja/koyo-joseikin")!;

export const metadata = createSeoMetadata(page);

export default function KoyoJoseikinPage() {
  return <SeoLandingPage page={page} />;
}
