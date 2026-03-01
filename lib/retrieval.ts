export type RetrievedChunk = {
  id: string;
  score: number;
  content: string;
  source: string;
};

export async function retrieveRelevantChunks(query: string): Promise<RetrievedChunk[]> {
  const mockCorpus: RetrievedChunk[] = [
    {
      id: "arch-1",
      score: 0.91,
      source: "thesis-architecture.md",
      content:
        "The pipeline integrates SonarQube findings with Azure Function orchestration and GPT-4.1 reasoning for contextual prioritization."
    },
    {
      id: "result-1",
      score: 0.86,
      source: "experiment-results.md",
      content:
        "Experimental data indicates reduced triage time and improved focus on high-severity vulnerabilities."
    }
  ];

  return mockCorpus.filter((item) =>
    [item.content, item.source].join(" ").toLowerCase().includes(query.toLowerCase())
  );
}
