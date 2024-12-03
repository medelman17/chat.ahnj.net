import { convertToCoreMessages, generateObject, streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { getContext } from "@/lib/ai/context";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await streamText({
      model: openai("gpt-4o"),
      messages: convertToCoreMessages(messages),
      system: `You are a helpful assistant acting as the users' second brain.
    Use tools on every request.
    Be sure to getInformation from your knowledge base before answering any questions.
    If a response requires multiple tools, call one tool after another without responding to the user.
    If a response requires information from an additional tool to generate a response, call the appropriate tools in order before responding to the user.
    ONLY respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."
    Be sure to adhere to any instructions in tool calls ie. if they say to responsd like "...", do exactly that.
    If the relevant information is not a direct match to the users prompt, you can be creative in deducing the answer.
    If you are unsure, use the getInformation tool and you can use common sense to reason based on the information you do have.
    Use your abilities as a reasoning machine to answer questions based on the information you do have.
    Format your responses in markdown.
`,
      tools: {
        getInformation: tool({
          description:
            `get information from your knowledge base to answer questions.`,
          parameters: z.object({
            question: z.string().describe("the users question"),
            similarQuestions: z.array(z.string()).describe(
              "keywords to search",
            ),
          }),
          execute: async ({ similarQuestions }) => {
            const results = await Promise.all(
              similarQuestions.map(
                async (question) => await getContext(question, ""),
              ),
            );

            console.log(`similar questions: ${results}`);
            // Flatten the array of arrays and remove duplicates based on 'name'
            const uniqueResults = Array.from(
              new Map(results.flat().map((item) => [item.id, item]))
                .values(),
            );
            return uniqueResults;
          },
        }),
        understandQuery: tool({
          description:
            `understand the users query. use this tool on every prompt.`,
          parameters: z.object({
            query: z.string().describe("the users query"),
            toolsToCallInOrder: z
              .array(z.string())
              .describe(
                "these are the tools you need to call in the order necessary to respond to the users query",
              ),
          }),
          execute: async ({ query }) => {
            const { object } = await generateObject({
              model: openai("gpt-4o"),
              system:
                "You are a query understanding assistant. Analyze the user query and generate similar questions.",
              schema: z.object({
                questions: z
                  .array(z.string())
                  .max(3)
                  .describe(
                    "similar questions to the user's query. be concise.",
                  ),
              }),
              prompt: `Analyze this query: "${query}". Provide the following:
                      3 similar questions that could help answer the user's query`,
            });
            return object.questions;
          },
        }),
      },
    });
    // Convert the response into a friendly text-stream
    return response.toDataStreamResponse();
  } catch (e) {
    throw e;
  }
}
