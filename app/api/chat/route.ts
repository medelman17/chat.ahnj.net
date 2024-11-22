import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

// Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Use the streamText function to handle the chat completion
  const result = await streamText({
    model: openai("gpt-4-turbo"), // Upgrade to a newer model if available
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that answers questions about the local municipal code. Provide accurate and concise information based on the municipal code.",
      },
      ...messages,
    ],
  });

  // Return the response as a data stream
  return result.toDataStreamResponse();
}
