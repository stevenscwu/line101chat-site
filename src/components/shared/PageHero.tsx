import { Section } from "@/components/layout/Section";

type PageHeroProps = {
  kicker: string;
  title: string;
  description: string;
};

export function PageHero({ kicker, title, description }: PageHeroProps) {
  return (
    <Section tone="dark" className="py-16 md:py-20">
      <div className="max-w-3xl space-y-4">
        <p className="text-xs uppercase tracking-[0.14em] text-white/55">{kicker}</p>
        <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl md:leading-[1.1]">
          {title}
        </h1>
        <p className="text-base leading-relaxed text-white/74 md:text-lg">{description}</p>
      </div>
    </Section>
  );
}
