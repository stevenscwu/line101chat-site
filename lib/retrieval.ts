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
        "The pipeline integrates SonarQube findings with Azure Virtual Machine orchestration, Azure Functions, and OpenAI/Azure OpenAI reasoning for contextual prioritization. / 流程整合 SonarQube、Azure 虛擬機器、Azure Functions 與 OpenAI/Azure OpenAI 以進行情境化排序。"
    },
    {
      id: "result-1",
      score: 0.86,
      source: "experiment-results.md",
      content:
        "Experimental data indicates reduced triage time and improved focus on high-severity vulnerabilities with human-in-the-loop validation. / 實驗結果顯示分流時間下降，且在人機協作下可更聚焦高風險弱點。"
    },
    {
      id: "security-1",
      score: 0.84,
      source: "security-education.md",
      content:
        "SAST identifies code-level weakness patterns, while DAST validates runtime exposure; both feed a vulnerability triage model using CWE, CVSS, exploitability, and business impact. / SAST 著重程式碼層弱點，DAST 著重執行期暴露，兩者共同輸入以 CWE、CVSS、可利用性與業務衝擊為基礎之弱點分流模型。"
    },
    {
      id: "pdf-20250709",
      score: 0.82,
      source: "thesis/20250709.pdf",
      content:
        "Thesis oral-defense package dated 2025-07-09 is available in the Thesis section for direct reading and citation reference. / 2025-07-09 口試文件已整合於 Thesis 區塊，可直接閱讀與引用。"
    }
  ];

  return mockCorpus.filter((item) =>
    [item.content, item.source].join(" ").toLowerCase().includes(query.toLowerCase())
  );
}
