import policy from "@/content/privacy.json";

export const metadata = {
  title: policy.title,
  description: "How 說日語 and its companion website handle lessons, recordings, optional transcription, transfers and deletion.",
};

export default function Privacy() {
  return (
    <main id="main" className="reading-page" lang="en">
      <span className="eyebrow">說日語 · 日本語</span>
      <h1>{policy.title}</h1>
      <p>Last updated: {policy.updated}</p>
      <p className="lead">{policy.introduction}</p>
      {policy.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
      ))}
      <p>Privacy contact: <a href={`mailto:${policy.contact}`}>{policy.contact}</a></p>
    </main>
  );
}