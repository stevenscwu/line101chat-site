export type RetrievedChunk = {
  id: string;
  score: number;
  content: string;
  source: string;
};

export async function retrieveRelevantChunks(query: string): Promise<RetrievedChunk[]> {
  const mockCorpus: RetrievedChunk[] = [
    {
      id: "identity-1",
      score: 0.91,
      source: "identity-blueprint.md",
      content:
        "Brand identity anchor: a 50+ IT man learning Japanese in public, sharing real progress and building stable family-support income."
    },
    {
      id: "system-1",
      score: 0.86,
      source: "weekly-system.md",
      content:
        "Weekly loop: learn Japanese daily, publish short-form content, repurpose into long-form summaries, and review conversion metrics each weekend."
    },
    {
      id: "content-1",
      score: 0.84,
      source: "content-pillars.md",
      content:
        "Core pillars: Japanese learning logs, IT x Japanese crossover insights, and transparent family-income progress."
    },
    {
      id: "monetize-1",
      score: 0.82,
      source: "monetization-path.md",
      content:
        "Monetization ladder: free content -> low-ticket resources -> paid community -> coaching or workshops for mature learners."
    }
  ];

  return mockCorpus.filter((item) =>
    [item.content, item.source].join(" ").toLowerCase().includes(query.toLowerCase())
  );
}
