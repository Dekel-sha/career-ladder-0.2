import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Minimize2 } from "lucide-react";
import AgentMessage from "./AgentMessage";

type Props = {
  isOpen: boolean;
  agentName?: string;
};

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "career-ladder.agent.chat";

export default function AgentChatWindow({ isOpen, agentName = "Logic" }: Props) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Safe load from localStorage
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        setMessages(JSON.parse(raw));
      } else {
        setMessages([
          { role: "assistant", content: `Hi! I'm ${agentName}. How can I help with your job search?` },
        ]);
      }
    } catch {
      setMessages([{ role: "assistant", content: `Hi! I'm ${agentName}.` }]);
    }
  }, [agentName]);

  // Persist to localStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      }
    } catch {
      // ignore
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isOpen]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Msg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    // Mock assistant reply (replace with real API later)
    setTimeout(() => {
      const reply: Msg = {
        role: "assistant",
        content:
          "Got it. I’ll log that. (This is a local mock reply — we can wire this to Gemini/Supabase later.)",
      };
      setMessages((m) => [...m, reply]);
    }, 350);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.18 }}
        className="fixed bottom-24 right-5 z-40 w-[min(92vw,380px)]"
      >
        <div className="bg-card border border-custom rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-custom bg-card/80 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--theme-color)] to-purple-600" />
              <div>
                <div className="font-semibold text-sm text-primary">Chat with {agentName}</div>
                <div className="text-xs text-secondary">Career Ladder Assistant</div>
              </div>
            </div>
            {/* Minimize hint — closing is controlled by parent via FloatingAgentButton */}
            <div className="text-secondary">
              <Minimize2 className="h-4 w-4" />
            </div>
          </div>

          <div ref={scrollRef} className="max-h-[50vh] overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <AgentMessage key={i} role={m.role} content={m.content} />
            ))}
          </div>

          <div className="p-3 border-t border-custom">
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-xl border border-custom bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--theme-color)]"
                placeholder={`Ask ${agentName} anything...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
              />
              <button
                onClick={send}
                className="rounded-xl px-3 py-2 text-white bg-gradient-to-br from-[var(--theme-color)] to-purple-600 hover:shadow"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
