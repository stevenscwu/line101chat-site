import { ContactContent } from "@/app/contact/page";
import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata("en", "contact");

export default function EnglishContactPage() {
  return <ContactContent locale="en" />;
}
