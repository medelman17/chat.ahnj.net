"use client";

import { useChat } from "ai/react";
import { Message } from "ai";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown, { Options } from "react-markdown";
import React from "react";
import { LoadingIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
// import { useWindowSize } from "usehooks-ts";

export default function Chat() {
  const [toolCall, setToolCall] = useState<string>();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    maxSteps: 4,
    onToolCall({ toolCall }) {
      setToolCall(toolCall.toolName);
    },
    onError: (error) => {
      toast.error("There was an error processing your request.");
      console.error(error);
    },
  });

  useEffect(() => {
    if (messages.length > 0) setIsExpanded(true);
  }, [messages]);

  const currentToolCall = useMemo(() => {
    const tools = messages?.slice(-1)[0]?.toolInvocations;
    if (tools && toolCall === tools[0].toolName) {
      return tools[0].toolName;
    } else {
      return undefined;
    }
  }, [toolCall, messages]);

  const awaitingResponse = useMemo(() => {
    if (isLoading && currentToolCall === undefined && messages.slice(-1)[0].role === "user") {
      return true;
    } else {
      return false;
    }
  }, [isLoading, currentToolCall, messages]);

  const userQuery: Message | undefined = messages.filter((m) => m.role === "user").slice(-1)[0];

  const lastAssistantMessage: Message | undefined = messages.filter((m) => m.role !== "user").slice(-1)[0];

  return (
    <div className="flex justify-center items-start sm:pt-16 min-h-screen w-full dark:bg-neutral-900 px-4 md:px-0 py-4">
      <div className="flex flex-col items-center w-full max-w-[500px]">
        {/* <ProjectOverview /> */}
        <motion.div
          animate={{
            minHeight: isExpanded ? 200 : 0,
            padding: isExpanded ? 12 : 0,
          }}
          transition={{
            type: "spring",
            bounce: 0.5,
          }}
          className={cn("rounded-lg w-full ", isExpanded ? "bg-neutral-200 dark:bg-neutral-800" : "bg-transparent")}
        >
          <div className="flex flex-col w-full justify-between gap-2">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                className={`bg-neutral-100 text-base w-full text-neutral-700 dark:bg-neutral-700 dark:placeholder:text-neutral-400 dark:text-neutral-300`}
                minLength={3}
                required
                value={input}
                placeholder={"Ask about the municipal code..."}
                onChange={handleInputChange}
              />
            </form>
            <motion.div
              transition={{
                type: "spring",
              }}
              className="min-h-fit flex flex-col gap-2"
            >
              <AnimatePresence>
                {awaitingResponse || currentToolCall ? (
                  <div className="px-2 min-h-12">
                    <div className="dark:text-neutral-400 text-neutral-500 text-sm w-fit mb-1">{userQuery.content}</div>
                    <Loading tool={currentToolCall} />
                  </div>
                ) : lastAssistantMessage ? (
                  <div className="px-2 min-h-12">
                    <div className="dark:text-neutral-400 text-neutral-500 text-sm w-fit mb-1">{userQuery.content}</div>
                    <AssistantMessage message={lastAssistantMessage} />
                  </div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  //   return (
  //     <>
  //       {messages.map((m) => (
  //         <div key={m.id} className="whitespace-pre-wrap">
  //           {m.role === "user" ? "User: " : "AI: "}
  //           {m.content}
  //         </div>
  //       ))}

  //       {error && (
  //         <>
  //           <div>An error occurred.</div>
  //           <button type="button" onClick={() => reload()}>
  //             Retry
  //           </button>
  //         </>
  //       )}

  //       {isLoading && (
  //         <div>
  //           <Spinner />
  //           <button type="button" onClick={() => stop()}>
  //             Stop
  //           </button>
  //         </div>
  //       )}

  //       <form onSubmit={handleSubmit}>
  //         <input
  //           name="prompt"
  //           value={input}
  //           onChange={handleInputChange}
  //           disabled={isLoading}
  //           placeholder="Ask about the municipal code..."
  //           className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
  //         />
  //       </form>
  //     </>
  //   );
}

const AssistantMessage = ({ message }: { message: Message | undefined }) => {
  if (message === undefined) return "HELLO";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={message.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="whitespace-pre-wrap font-mono anti text-sm text-neutral-800 dark:text-neutral-200 overflow-hidden"
        id="markdown"
      >
        <MemoizedReactMarkdown className={"max-h-72 overflow-y-scroll no-scrollbar-gutter"}>
          {message.content}
        </MemoizedReactMarkdown>
      </motion.div>
    </AnimatePresence>
  );
};

const Loading = ({ tool }: { tool?: string }) => {
  const toolName =
    tool === "getInformation" ? "Getting information" : tool === "addResource" ? "Adding information" : "Thinking";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: "spring" }}
        className="overflow-hidden flex justify-start items-center"
      >
        <div className="flex flex-row gap-2 items-center">
          <div className="animate-spin dark:text-neutral-400 text-neutral-500">
            <LoadingIcon />
          </div>
          <div className="text-neutral-500 dark:text-neutral-400 text-sm">{toolName}...</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const MemoizedReactMarkdown: React.FC<Options> = React.memo(
  ReactMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children && prevProps.className === nextProps.className
);
