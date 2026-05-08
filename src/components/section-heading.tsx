type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-black leading-tight tracking-[0] text-slate-950 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
