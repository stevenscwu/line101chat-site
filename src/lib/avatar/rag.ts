import { readFile } from "node:fs/promises";
import path from "node:path";

import type { RagDocument, RagSnippet } from "@/lib/avatar/types";

const KNOWLEDGE_FILES = [
  "celine.md",
  "line101chat.md",
  "use-cases.md",
  "pricing-placeholder.md",
  "technical-process.md",
] as const;

const MAX_SNIPPETS = 3;
const MAX_SNIPPET_LENGTH = 1_300;
const MIN_RELEVANCE_SCORE = 4;
let knowledgePromise: Promise<RagDocument[]> | null = null;

function getKnowledgePath(fileName: string) {
  return path.join(process.cwd(), "content", "avatar", "knowledge", fileName);
}

function titleFromMarkdown(content: string, fileName: string) {
  return (
    content.match(/^#\s+(.+)$/m)?.[1]?.trim() ||
    fileName.replace(/\.md$/i, "")
  );
}

function splitDocument(fileName: string, content: string): RagDocument[] {
  const title = titleFromMarkdown(content, fileName);
  const sections = content
    .split(/\n(?=##\s+)/g)
    .map((section) => section.trim())
    .filter(Boolean);

  return sections.map((section, index) => ({
    id: `${fileName}:${index}`,
    title:
      section.match(/^##\s+(.+)$/m)?.[1]?.trim() ||
      (index === 0 ? title : `${title} ${index + 1}`),
    source: `content/avatar/knowledge/${fileName}`,
    content: section,
  }));
}

async function loadKnowledgeDocuments() {
  const documents = await Promise.all(
    KNOWLEDGE_FILES.map(async (fileName) => {
      try {
        const content = await readFile(getKnowledgePath(fileName), "utf8");
        return splitDocument(fileName, content);
      } catch (error) {
        console.error("[avatar-rag] knowledge file unavailable", {
          fileName,
          errorType: error instanceof Error ? error.name : "UnknownError",
        });
        return [];
      }
    }),
  );

  return documents.flat();
}

export function getKnowledgeDocuments() {
  knowledgePromise ||= loadKnowledgeDocuments();
  return knowledgePromise;
}

function tokenize(value: string) {
  const normalized = value.toLowerCase();
  const tokens = new Set<string>();

  for (const word of normalized.match(/[a-z0-9][a-z0-9-]{1,}/g) || []) {
    tokens.add(word);
  }

  for (const sequence of normalized.match(/[\u3400-\u9fff]{2,}/gu) || []) {
    tokens.add(sequence);
    for (let index = 0; index < sequence.length - 1; index += 1) {
      tokens.add(sequence.slice(index, index + 2));
    }
  }

  return tokens;
}

function topicBoost(query: string, document: RagDocument) {
  const topics: Array<[RegExp, RegExp]> = [
    [/celine|妳是誰|你是誰|個性|persona|分身是誰/iu, /celine|身分|個性|persona|對話方式/iu],
    [/rag|知識庫|來源|pdf|文件/iu, /rag|知識庫|來源|pdf|文件/iu],
    [/學校|招生|系所|教育/iu, /學校|招生|系所|教育/iu],
    [/顧問|老師|診所|房仲|門市|零售|創作者|b2b/iu, /顧問|老師|診所|房仲|門市|零售|創作者|b2b/iu],
    [/google\s*drive|雲端硬碟/iu, /google\s*drive|雲端硬碟/iu],
    [/ollama|本地|私有/iu, /ollama|本地|私有/iu],
    [/價格|費用|報價|收費|pricing|cost/iu, /價格|費用|報價|收費|pricing|cost/iu],
    [/line|網站|語音|voice|video|影片/iu, /line|網站|語音|voice|video|影片/iu],
  ];

  return topics.reduce(
    (score, [queryPattern, documentPattern]) =>
      queryPattern.test(query) && documentPattern.test(document.content)
        ? score + 5
        : score,
    0,
  );
}

function scoreDocument(query: string, document: RagDocument) {
  const queryTokens = tokenize(query);
  const documentTokens = tokenize(`${document.title}\n${document.content}`);
  let score = topicBoost(query, document);

  for (const token of queryTokens) {
    if (documentTokens.has(token)) {
      score += token.length >= 4 ? 3 : 1;
    }
  }

  return score;
}

export async function retrieveKnowledge(
  query: string,
  limit = MAX_SNIPPETS,
): Promise<RagSnippet[]> {
  const documents = await getKnowledgeDocuments();

  return documents
    .map((document) => ({
      ...document,
      score: scoreDocument(query, document),
    }))
    .filter((document) => document.score >= MIN_RELEVANCE_SCORE)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((document) => ({
      ...document,
      content: document.content.slice(0, MAX_SNIPPET_LENGTH),
    }));
}

export function formatKnowledgeContext(snippets: RagSnippet[]) {
  if (!snippets.length) {
    return [
      "No LINE101Chat product knowledge was retrieved for this turn.",
      "If the user is chatting casually, discussing life or work, asking general knowledge, or sharing a feeling, respond naturally using your general conversational ability.",
      "Do not mention missing knowledge and do not force the topic toward business.",
      "Only say you lack verified information when the user is asking for a specific factual claim about LINE101Chat, pricing, deployment, customers, policy, or another fact that requires owner-approved knowledge.",
    ].join("\n");
  }

  return [
    "Use only the following verified LINE101Chat knowledge snippets for factual product claims:",
    ...snippets.map(
      (snippet, index) =>
        `[Source ${index + 1}: ${snippet.title} | ${snippet.source}]\n${snippet.content}`,
    ),
  ].join("\n\n");
}
