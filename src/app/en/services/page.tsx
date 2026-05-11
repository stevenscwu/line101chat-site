import { ServicesContent } from "@/app/services/page";
import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata("en", "services");

export default function EnglishServicesPage() {
  return <ServicesContent locale="en" />;
}
