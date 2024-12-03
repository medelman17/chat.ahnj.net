import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split(".")
    .filter((i) => i !== "");
};

export const generateEmbedding = async (value: string) => {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: value.replace(/\n/g, " "),
  });
  return embedding;
};

export async function getEmbeddings(input: string) {
  try {
    const result = await generateEmbedding(input);
    return result.data[0].embedding as number[];
  } catch (e) {
    console.log("Error calling OpenAI embedding API: ", e);
    throw new Error(`Error calling OpenAI embedding API: ${e}`);
  }
}
