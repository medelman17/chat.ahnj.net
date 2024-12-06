import { getMatchesFromEmbeddings } from "@/lib/pinecone";
import { getEmbeddings } from "@/lib/ai/embeddings";

export type Metadata = {
  url: string;
  text: string;
  chunk: string;
};

// The function `getContext` is used to retrieve the context of a given message
export const getContext = async (
  message: string,
  namespace: string,
  minScore = 0.3,
) => {
  // Get the embeddings of the input message
  const embedding = await getEmbeddings(message);

  // console.log(`Embedding: ${embedding}`);

  // Retrieve the matches for the embeddings from the specified namespace
  const matches = await getMatchesFromEmbeddings(embedding, 3, namespace);

  // console.log(`Matches: ${matches}`);

  // Filter out the matches that have a score lower than the minimum score
  const qualifyingDocs = matches.filter((m) => m.score && m.score > minScore);

  // console.log(`Qualifying docs: ${qualifyingDocs}`);

  return qualifyingDocs.sort((a, b) => (b.score || 0) - (a.score || 0));
};
