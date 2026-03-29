import { ProjectTag } from "@/components/work/ProjectTag";

type WorksPageHeroProps = {
  kicker: string;
  title: string;
  description: string;
  filters: string[];
};

export function WorksPageHero({ kicker, title, description, filters }: WorksPageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_16%_20%,rgba(34,211,238,0.16),transparent_46%),linear-gradient(165deg,#0a1325,#0f1f39_48%,#081020)] py-20 md:py-28">
      <div className="pointer-events-none absolute -right-24 -top-16 h-72 w-72 rounded-full bg-cyan-300/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-28 bottom-0 h-72 w-72 rounded-full bg-indigo-400/12 blur-3xl" />

      <div className="mx-auto w-full max-w-[1240px] px-5 md:px-10 lg:px-16">
        <div className="max-w-4xl space-y-6">
          <p className="text-xs uppercase tracking-[0.16em] text-white/58">{kicker}</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl md:leading-[1.08]">
            {title}
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-white/74 md:text-lg">{description}</p>
          <div className="flex flex-wrap gap-2.5 pt-2">
            {filters.map((filter) => (
              <ProjectTag key={filter}>{filter}</ProjectTag>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
