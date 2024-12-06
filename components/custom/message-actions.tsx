import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import clipboardCopy from "clipboard-copy";

interface MessageActionsProps {
  content: string;
}

export function MessageActions({ content }: MessageActionsProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await clipboardCopy(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex justify-start">
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground"
        onClick={handleCopy}
        aria-label={isCopied ? "Copied to clipboard" : "Copy to clipboard"}
      >
        {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </Button>
    </div>
  );
}
