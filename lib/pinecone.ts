import {
  type Index,
  Pinecone,
  type PineconeRecord,
  type ScoredPineconeRecord,
} from "@pinecone-database/pinecone";

export type Metadata = {
  url: string;
  text: string;
  chunk: string;
  hash: string;
};

// The function `getMatchesFromEmbeddings` is used to retrieve matches for the given embeddings
const getMatchesFromEmbeddings = async (
  embeddings: number[],
  topK: number,
  namespace: string,
): Promise<ScoredPineconeRecord<Metadata>[]> => {
  // Obtain a client for Pinecone
  const pinecone = new Pinecone();

  const indexName: string = process.env.PINECONE_INDEX || "";
  if (indexName === "") {
    throw new Error("PINECONE_INDEX environment variable not set");
  }

  // Retrieve the list of indexes to check if expected index exists
  const indexes = (await pinecone.listIndexes())?.indexes;
  if (!indexes || indexes.filter((i) => i.name === indexName).length !== 1) {
    throw new Error(`Index ${indexName} does not exist`);
  }

  // Get the Pinecone index
  const index = pinecone!.Index<Metadata>(indexName);

  // Get the namespace
  const pineconeNamespace = index.namespace(namespace ?? "");

  try {
    // Query the index with the defined request
    const queryResult = await pineconeNamespace.query({
      vector: embeddings,
      topK,
      includeMetadata: true,
    });
    return queryResult.matches || [];
  } catch (e) {
    // Log the error and throw it
    console.log("Error querying embeddings: ", e);
    throw new Error(`Error querying embeddings: ${e}`);
  }
};

export { getMatchesFromEmbeddings };

const sliceIntoChunks = <T>(arr: T[], chunkSize: number) => {
  return Array.from(
    { length: Math.ceil(arr.length / chunkSize) },
    (_, i) => arr.slice(i * chunkSize, (i + 1) * chunkSize),
  );
};

export const chunkedUpsert = async (
  index: Index,
  vectors: Array<PineconeRecord>,
  namespace: string,
  chunkSize = 10,
) => {
  // Split the vectors into chunks
  const chunks = sliceIntoChunks<PineconeRecord>(vectors, chunkSize);

  try {
    // Upsert each chunk of vectors into the index
    await Promise.allSettled(
      chunks.map(async () => {
        try {
          await index.namespace(namespace).upsert(vectors);
        } catch (e) {
          console.log("Error upserting chunk", e);
        }
      }),
    );

    return true;
  } catch (e) {
    throw new Error(`Error upserting vectors into index: ${e}`);
  }
};

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
