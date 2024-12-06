if (!process.env.PINECONE_API_KEY) {
  throw new Error("PINECONE_API_KEY is not set");
}

if (!process.env.PINECONE_INDEX_NAME) {
  throw new Error("PINECONE_INDEX_NAME is not set");
}

if (!process.env.PINECONE_ENVIRONMENT) {
  throw new Error("PINECONE_ENVIRONMENT is not set");
}

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;
const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT;

export { PINECONE_API_KEY, PINECONE_ENVIRONMENT, PINECONE_INDEX_NAME };
