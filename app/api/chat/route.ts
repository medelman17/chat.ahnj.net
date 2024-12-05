import { convertToCoreMessages, generateObject, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getContext } from "@/lib/ai/context";
import { z } from "zod";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log(`[api/chat] messages: ${JSON.stringify(messages, null, 2)}`);

    // Get the last message
    const lastMessage = messages[messages.length - 1];

    console.log(`[api/chat] lastMessage: ${lastMessage}`);

    const similarQuestions = await understandQuery(lastMessage.content);

    console.log(`[api/chat] similarQuestions: ${similarQuestions}`);

    const context = await Promise.all(
      similarQuestions.map(async (question) => await getContext(question, "")),
    ).then((results) => {
      // Flatten the array of arrays and remove duplicates based on 'name'
      const uniqueResults = Array.from(
        new Map(results.flat().map((item) => [item.id, item]))
          .values(),
      );
      return uniqueResults;
    })
      .then((uniqueResults) =>
        uniqueResults.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      )
      .then(async (uniqueResults) => {
        let context = "";
        for (const result of uniqueResults) {
          context +=
            `START CONTEXT BLOCK\n${result.metadata?.text} [file: ${result.metadata?.filename}; page: ${result.metadata?.page_number}; score: ${result.score}]\nEND OF CONTEXT BLOCK\n\n`;
        }
        return context;
      });

    // // Get the context from the last message
    // const context = await getContext(lastMessage.content, "");

    console.log(`[api/chat] context: ${context}`);

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await streamText({
      model: openai("gpt-4o"),
      system:
        `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Atlantic Highlands, New Jersey.
      ${context}
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      `,
      messages: convertToCoreMessages(messages),
    });
    // Convert the response into a friendly text-stream
    return response.toDataStreamResponse();
  } catch (e) {
    throw e;
  }
}

async function understandQuery(query: string) {
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
}

// export async function POST(req: Request) {
//   try {
//     const { messages } = await req.json();

//     // Ask OpenAI for a streaming chat completion given the prompt
//     const response = await streamText({
//       model: openai("gpt-4o"),
//       messages: convertToCoreMessages(messages),
//       system: `You are a helpful assistant acting as the users' second brain.
//     Use tools on every request.
//     Be sure to getInformation from your knowledge base before answering any questions.
//     If a response requires multiple tools, call one tool after another without responding to the user.
//     If a response requires information from an additional tool to generate a response, call the appropriate tools in order before responding to the user.
//     ONLY respond to questions using information from tool calls.
//     if no relevant information is found in the tool calls, respond, "Sorry, I don't know."
//     Be sure to adhere to any instructions in tool calls ie. if they say to responsd like "...", do exactly that.
//     If the relevant information is not a direct match to the users prompt, you can be creative in deducing the answer.
//     If you are unsure, use the getInformation tool and you can use common sense to reason based on the information you do have.
//     Use your abilities as a reasoning machine to answer questions based on the information you do have.
// `,
//       tools: {
//         getInformation: tool({
//           description:
//             `get information from your knowledge base to answer questions.`,
//           parameters: z.object({
//             question: z.string().describe("the users question"),
//             similarQuestions: z.array(z.string()).describe(
//               "similar questions to the user's query",
//             ),
//           }),
//           execute: async ({ similarQuestions, question }) => {
//             const results = await Promise.all(
//               [
//                 ...similarQuestions.map(
//                   async (q) => await getContext(q, ""),
//                 ),
//                 Promise.resolve(await getContext(question, "")),
//               ],
//             );

//             // console.log(`similar questions: ${results}`);
//             // Flatten the array of arrays and remove duplicates based on 'name'
//             const uniqueResults = Array.from(
//               new Map(results.flat().map((item) => [item.id, item]))
//                 .values(),
//             );
//             return uniqueResults;
//           },
//         }),
//         understandQuery: tool({
//           description:
//             `understand the users query. use this tool on every prompt.`,
//           parameters: z.object({
//             query: z.string().describe("the users query"),
//             toolsToCallInOrder: z
//               .array(z.string())
//               .describe(
//                 "these are the tools you need to call in the order necessary to respond to the users query",
//               ),
//           }),
//           execute: async ({ query }) => {
//             const { object } = await generateObject({
//               model: openai("gpt-4o"),
//               system:
//                 "You are a query understanding assistant. Analyze the user query and generate similar questions.",
//               schema: z.object({
//                 questions: z
//                   .array(z.string())
//                   .max(3)
//                   .describe(
//                     "similar questions to the user's query. be concise.",
//                   ),
//               }),
//               prompt: `Analyze this query: "${query}". Provide the following:
//                       3 similar questions that could help answer the user's query`,
//             });
//             return object.questions;
//           },
//         }),
//       },
//     });
//     // Convert the response into a friendly text-stream
//     return response.toDataStreamResponse();
//   } catch (e) {
//     throw e;
//   }
// }
