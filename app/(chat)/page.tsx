"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserMessage } from "@/components/custom/user-message";
import { AssistantMessage } from "@/components/custom/assistant-message";
import { useChat } from "ai/react";
import type { Message } from "ai";
import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Send } from "lucide-react";
import Link from "next/link";
// import { messages as mockMessages } from "@/lib/mocks";
const initialMessages: Message[] = [];

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    initialMessages,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Reference to the scroll area container element
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      // Set scroll position to bottom of container
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]); // Re-run when messages array updates

  return (
    <div className="h-dvh w-full p-4 flex items-center justify-center sm:p-4">
      <Card className="w-full h-dvh sm:h-[calc(100dvh-2rem)] sm:max-w-2xl flex flex-col absolute sm:relative inset-0 sm:inset-auto rounded-none sm:rounded-lg">
        <CardHeader className="">
          <CardTitle>AHNJ Municipal Code Chatbot</CardTitle>
          <CardDescription className="text-xs">
            NOT an official website of the{" "}
            <Link href="https://www.ahnj.org" target="_blank">
              Borough of Atlantic Highlands, NJ
            </Link>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-4 overflow-hidden">
          <ScrollArea ref={scrollAreaRef} className="h-full pr-4" type="always">
            <div className="flex flex-col gap-4">
              {messages.map((message, index) =>
                message.role === "user" ? (
                  <UserMessage key={message.id} message={message} />
                ) : message.role === "assistant" ? (
                  <AssistantMessage
                    key={message.id}
                    message={message}
                    isLoading={isLoading && index === messages.length - 1}
                  />
                ) : null
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-4 pt-2 border-t flex flex-col gap-2">
          <div className="flex gap-2 w-full">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about the municipal code..."
              className="flex-1"
            />
            <Button type="submit" size="icon" className="shrink-0" disabled={isLoading}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
          <CardDescription className="text-xs">
            NOT an official website of the{" "}
            <Link href="https://www.ahnj.org" target="_blank">
              Borough of Atlantic Highlands, NJ
            </Link>
            .
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}

export interface ChatProps {
  title: string;
}
