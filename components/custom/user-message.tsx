import { Message } from "ai/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserMessageProps {
  message: Message;
}

export function UserMessage({ message }: UserMessageProps) {
  return (
    <div className="flex items-start space-x-4 mb-4">
      <Avatar className="w-8 h-8">
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="bg-primary text-primary-foreground p-3 rounded-lg inline-block">
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
    </div>
  );
}
