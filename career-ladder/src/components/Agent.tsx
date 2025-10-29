import { useState } from 'react';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { useGemini } from '@/hooks/useGemini';
import { toast } from 'sonner';

export default function Agent() {
  const [input, setInput] = useState('');
  const { messages, isLoading, error, ask, clearMessages } = useGemini();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    try {
      const newMessages = [
        ...messages,
        { role: 'user' as const, content: userMessage }
      ];
      
      await ask(newMessages);
      toast.success('Message sent successfully!');
    } catch (err) {
      toast.error('Failed to send message');
      console.error('Error sending message:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-card border border-token rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-surface rounded-lg">
            <Bot className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">AI Assistant</h2>
        </div>
        <button
          onClick={clearMessages}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-surface hover:bg-primary hover:text-white transition-colors rounded-lg text-foreground"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="h-12 w-12 text-foreground opacity-30 mx-auto mb-4" />
            <p className="text-foreground opacity-50">Start a conversation with the AI assistant</p>
            <p className="text-sm text-foreground opacity-40 mt-2">
              Ask about job applications, career advice, or anything else!
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-surface text-foreground'
                }`}>
                  {message.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-surface text-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="p-2 rounded-lg bg-surface text-foreground">
              <Bot className="h-4 w-4" />
            </div>
            <div className="p-3 rounded-lg bg-surface text-foreground">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask the AI assistant anything..."
          className="flex-1 p-3 border border-token rounded-lg bg-background text-foreground placeholder:text-foreground opacity-70 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows={3}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </div>
  );
}
