import dotenv from "dotenv";
import { loadUnstructuredElements } from "@/lib/unstructured";
import { Document } from "@langchain/core/documents";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

dotenv.config({ path: ".env.local" });

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

const pinecone = new PineconeClient();
// Will automatically read the PINECONE_API_KEY and PINECONE_ENVIRONMENT env vars
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

async function main() {
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
    maxConcurrency: 5,
    // You can pass a namespace here too
    // namespace: "foo",
  });

  const elements = await loadUnstructuredElements();

  const documents = elements.map((element) => {
    return new Document({
      pageContent: element.text,
      metadata: { type: element.type, ...element.metadata },
      id: element.element_id,
    });
  });

  const result = await vectorStore.addDocuments(documents, {
    ids: documents.map((_, i) => i.toString()),
  });

  console.log(result);
}

main().then(() => console.log("Done")).catch(console.error).finally(() =>
  process.exit(0)
);
