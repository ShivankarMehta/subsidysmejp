import { SeoLandingPage } from "../../components/SeoLandingPage";
import { createSeoMetadata, getSeoPage } from "../../seo-pages";

const page = getSeoPage("/en/sme-subsidies-japan")!;

export const metadata = createSeoMetadata(page);

export default function SmeSubsidiesJapanPage() {
  return <SeoLandingPage page={page} />;
}
