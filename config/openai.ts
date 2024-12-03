if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export { OPENAI_API_KEY };
