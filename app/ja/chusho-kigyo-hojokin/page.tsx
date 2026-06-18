import { SeoLandingPage } from "../../components/SeoLandingPage";
import { createSeoMetadata, getSeoPage } from "../../seo-pages";

const page = getSeoPage("/ja/chusho-kigyo-hojokin")!;

export const metadata = createSeoMetadata(page);

export default function ChushoKigyoHojokinPage() {
  return <SeoLandingPage page={page} />;
}
