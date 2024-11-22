"use client";

import { useRef } from "react";
import { useChat, Message } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ErrorBoundary from "./ErrorBoundary";

interface ChatMessagesProps {
  messages: Message[];
}

function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="space-y-4">
      {messages.map((m) => (
        <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
          <div className={`rounded-lg p-2 ${m.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
            {m.content}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ErrorFallbackProps {
  error: Error;
}

function ErrorFallback({ error }: ErrorFallbackProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}

export default function MunicipalCodeChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Municipal Code Chatbot</CardTitle>
      </CardHeader>
      <CardContent>
        <ErrorBoundary fallback={error ? <ErrorFallback error={error} /> : null}>
          <ChatMessages messages={messages} />
        </ErrorBoundary>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <form ref={formRef} onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about the municipal code..."
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
