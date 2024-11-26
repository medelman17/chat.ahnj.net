import { Pinecone } from "@pinecone-database/pinecone";

export const createClient = () =>
  new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || "",
  });

export async function createIndex(pc: Pinecone, name: string) {
  try {
    if (await indexExists(pc, name)) {
      return;
    } else {
      await pc.createIndex({
        name,
        dimension: 1536,
        metric: "cosine",
        waitUntilReady: true,
        spec: {
          serverless: {
            cloud: "aws",
            region: "us-east-1",
          },
        },
      });
    }
  } catch (error: unknown) {
    throw error;
  }
}

export async function describeIndex(pc: Pinecone, name: string) {
  return await pc.describeIndex(name);
}

export async function indexExists(pc: Pinecone, name: string) {
  const indexes = (await pc.listIndexes()).indexes || [];
  for (const index of indexes) {
    if (index.name === name) {
      return true;
    }
  }
  return false;
}
