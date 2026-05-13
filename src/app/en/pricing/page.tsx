import { permanentRedirect } from "next/navigation";

export default function EnglishPricingRedirectPage() {
  permanentRedirect("/en/free-assessment");
}
