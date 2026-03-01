export type IngestDocument = {
  id: string;
  text: string;
  source: string;
};

export async function ingestDocuments(docs: IngestDocument[]) {
  return docs.map((doc) => ({
    id: doc.id,
    source: doc.source,
    chunkCount: Math.max(1, Math.ceil(doc.text.length / 600))
  }));
}
