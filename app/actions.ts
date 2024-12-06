"use server";

import { generateObject } from "ai";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";

export const generateChatTitle = async (text: string) => {
  const result = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: z.object({
      title: z
        .string()
        .describe(
          "A max three word title for a chat based on the messages provided as context",
        ),
    }),
    prompt:
      "Generate a title for a chat based on the following messages. Try and extract as much info from the messages as possible. If the messages are just numbers or incoherent, just return chat.\n\n " +
      text,
  });
  return result.object.title;
};
