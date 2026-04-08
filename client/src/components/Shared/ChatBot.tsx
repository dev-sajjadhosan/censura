"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    messages: [
      {
        id: "1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Hi! I'm your Censura AI assistant. How can I help you discover great content today?",
          },
        ],
      },
    ],
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Auto-scroll logic to keep the latest message in view
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInputValue("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage({ text: suggestion });
  };

  // Helper to extract text content from UIMessage parts
  const getMessageText = (msg: (typeof messages)[number]) => {
    return msg.parts
      .filter((p) => p.type === "text")
      .map((p) => (p as { type: "text"; text: string }).text)
      .join("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {!isOpen ? (
        <Button
          size="icon"
          aria-label="Open chat"
          className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-tr from-primary to-orange-400 hover:from-primary/90 hover:to-orange-400/90 text-primary-foreground transition-all duration-300 hover:scale-110 active:scale-95"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="size-6 fill-current" />
        </Button>
      ) : (
        <Card className="w-[340px] md:w-[380px] h-[500px] flex flex-col shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border-muted/50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 rounded-[24px]">
          {/* Header */}
          <div className="px-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full  shadow-inner flex items-center justify-center">
                <Bot className="size-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-sm tracking-tight">
                  Censura Chatbot
                </div>
                <div className="text-xs flex items-center gap-1.5 opacity-90 font-medium">
                  <span className="relative flex size-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full size-2 bg-green-400"></span>
                  </span>
                  Online
                </div>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              variant={"ghost"}
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            className="flex-1 p-5 bg-card/60 backdrop-blur-3xl overflow-y-auto scrollbar-none relative"
          >
            {/* Soft gradient overlay at the top */}
            <div className="sticky top-0 left-0 right-0 h-4 bg-gradient-to-b from-card/60 to-transparent pointer-events-none z-10" />

            <div className="space-y-5 pb-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                    (m.role as string) === "user" ? "flex-row-reverse" : "",
                  )}
                >
                  <div
                    className={cn(
                      "size-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                      m.role === "assistant"
                        ? "bg-primary/10 text-primary"
                        : "bg-gradient-to-tr from-secondary to-muted text-foreground border border-muted",
                    )}
                  >
                    {m.role === "assistant" ? (
                      <Bot className="size-4" />
                    ) : (
                      <User className="size-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm max-w-[75%]",
                      m.role === "assistant"
                        ? "bg-secondary text-secondary-foreground rounded-tl-sm border border-muted/50"
                        : "bg-primary text-primary-foreground rounded-tr-sm bg-linear-to-bl from-primary to-primary/90",
                    )}
                  >
                    {getMessageText(m)}
                  </div>
                </div>
              ))}

              {/* Initial Quick Suggestions */}
              {messages.length === 1 && !isLoading && (
                <div className="flex flex-wrap gap-2 mt-2 ml-11">
                  {["Trending Movies", "Top Action Shows", "Subscriptions"].map(
                    (suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-[10px] bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-full px-3 py-1 transition-colors text-primary font-medium"
                      >
                        {suggestion}
                      </button>
                    ),
                  )}
                </div>
              )}

              {/* Loading Animation */}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="size-8 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-primary/10 text-primary">
                    <Bot className="size-4" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-secondary text-secondary-foreground rounded-tl-sm border border-muted/50 shadow-sm">
                    <span className="inline-flex gap-1">
                      <span className="size-1.5 rounded-full bg-primary/50 animate-bounce"></span>
                      <span className="size-1.5 rounded-full bg-primary/50 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="size-1.5 rounded-full bg-primary/50 animate-bounce [animation-delay:0.4s]"></span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Form */}
          <div className="px-3 py-3 bg-card border-t border-muted/30">
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 bg-secondary/50 p-1.5 rounded-full border border-muted/50 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/50 transition-all shadow-inner"
            >
              <Input
                placeholder="Ask about movies, shows..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="border-0 bg-transparent ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 shadow-none h-10"
              />
              <Button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                size="icon"
                aria-label="Send message"
                className="shrink-0 size-10 rounded-full bg-primary hover:bg-primary/90 shadow-md transition-transform active:scale-95"
              >
                <Send className="size-4" />
              </Button>
            </form>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] text-muted-foreground uppercase font-bold tracking-widest opacity-70">
              <Sparkles className="size-3 text-primary" />
              Powered by AI
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
