import { MessageSquare, X } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  isOpen: boolean;
  onClick: () => void;
  agentName?: string;
};

export default function FloatingAgentButton({ isOpen, onClick, agentName = "Logic" }: Props) {
  return (
    <div className="fixed bottom-5 right-5 z-40">
      <motion.button
        onClick={onClick}
        aria-label={isOpen ? "Close agent chat" : "Open agent chat"}
        className="relative h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-[var(--theme-color)] to-purple-600 text-white flex items-center justify-center hover:shadow-xl transition-shadow"
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        {!isOpen && (
          <span className="absolute -top-2 -left-2 text-xs px-2 py-0.5 rounded-full bg-white/90 text-[var(--theme-color)] shadow">
            {agentName}
          </span>
        )}
      </motion.button>
    </div>
  );
}
