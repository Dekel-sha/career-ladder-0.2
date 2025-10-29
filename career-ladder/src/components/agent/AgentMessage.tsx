import React from "react";
import { cn } from "@/lib/cn";

type Props = {
  role: "user" | "assistant";
  content: string;
};

export default function AgentMessage({ role, content }: Props) {
  const isUser = role === "user";
  return (
    <div className={cn("w-full flex gap-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[var(--theme-color)] to-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
          AI
        </div>
      )}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm",
          isUser
            ? "bg-indigo-600 text-white rounded-br-sm"
            : "bg-card text-primary border border-custom rounded-bl-sm"
        )}
      >
        {content}
      </div>
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold shrink-0">
          U
        </div>
      )}
    </div>
  );
}

