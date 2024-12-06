import { Message } from "ai/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// import { MessageActions } from "./message-actions";

interface AssistantMessageProps {
  message: Message;
  isLoading?: boolean;
}

export function AssistantMessage({ message, isLoading }: AssistantMessageProps) {
  return (
    <div className="flex items-start space-x-4 mb-4">
      <Avatar className="w-8 h-8">
        <AvatarFallback>
          <Bot className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        {isLoading && (
          <div className="flex items-center text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse mr-2"></div>
            Thinking...
          </div>
        )}
        <div className="bg-muted p-3 rounded-lg">
          <ReactMarkdown remarkPlugins={[remarkGfm]} className="text-sm prose prose-sm max-w-none">
            {message.content}
          </ReactMarkdown>
        </div>
        {/* <MessageActions content={message.content} /> */}
      </div>
    </div>
  );
}
