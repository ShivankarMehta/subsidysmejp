import { SeoLandingPage } from "../../components/SeoLandingPage";
import { createSeoMetadata, getSeoPage } from "../../seo-pages";

const page = getSeoPage("/en/japan-employer-grants")!;

export const metadata = createSeoMetadata(page);

export default function JapanEmployerGrantsPage() {
  return <SeoLandingPage page={page} />;
}
