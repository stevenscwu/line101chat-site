type ProjectMetaLineProps = {
  label?: string;
  value: string;
};

export function ProjectMetaLine({ label = "Tech Stack", value }: ProjectMetaLineProps) {
  return (
    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
      <span className="font-semibold text-slate-600">{label}</span>
      <span className="mx-2 text-slate-300">/</span>
      {value}
    </p>
  );
}
