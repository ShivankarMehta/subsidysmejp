import { SeoLandingPage } from "../../components/SeoLandingPage";
import { createSeoMetadata, getSeoPage } from "../../seo-pages";

const page = getSeoPage("/en/foreign-employee-subsidies-japan")!;

export const metadata = createSeoMetadata(page);

export default function ForeignEmployeeSubsidiesJapanPage() {
  return <SeoLandingPage page={page} />;
}
