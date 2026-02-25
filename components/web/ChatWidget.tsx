"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  MessageCircle,
  Loader2,
  Trash2,
  HeadsetIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/useChat";
import { userVar } from "@/apollo/store";
import { useReactiveVar } from "@apollo/client";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const user = useReactiveVar(userVar);

  const {
    messages: socketMessages,
    sendMessage,
    isTyping,
    clearMessages,
  } = useChat("ws://localhost:3001");

  const initialGreeting = {
    id: "welcome",
    text: "Welcome to NextTech Support! Ask us about our computers, laptops, peripherals, and accessories. We're happy to assist you find the perfect tech solution.",
    sender: "assistant" as const,
    timestamp: new Date(),
  };

  const allMessages = [initialGreeting, ...socketMessages];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages, isTyping]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isOpen && window.innerWidth < 640) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue, user?.memberNick || "Guest");
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 h-12 sm:h-14 px-4 sm:px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-pink-600 hover:bg-pink-500 text-white cursor-pointer"
        >
          <div className="relative">
            <HeadsetIcon className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
          <span className="font-semibold text-sm sm:text-base">Chat</span>
        </Button>
      )}

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card
          className={cn(
            "fixed z-50 flex flex-col shadow-2xl border-2 animate-in slide-in-from-bottom-5 fade-in duration-300 overflow-hidden dark:bg-[radial-gradient(35%_80%_at_30%_0%,--theme(--color-foreground/.1),transparent)]",
            "inset-x-0 bottom-0 rounded-t-[2rem] rounded-b-none h-[90dvh]",
            "sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[650px] sm:rounded-[2rem]",
          )}
        >
          {/* Header */}
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3 pt-4 sm:pb-4 border-b shrink-0">
            {/* Drag handle for mobile */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-muted-foreground/20 rounded-full sm:hidden" />

            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border-2 border-pink-500">
                <AvatarFallback className="bg-pink-500 text-white">
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <h3 className="font-semibold leading-none text-sm sm:text-base">
                  NextTech Support
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Clear chat button */}
              <Button
                onClick={clearMessages}
                size="icon"
                variant="ghost"
                title="Clear chat history"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-muted text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                size="icon"
                variant="ghost"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-muted cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 p-0 bg-muted/5 min-h-0">
            <ScrollArea className="h-full px-3 sm:px-4 py-3 sm:py-4">
              <div className="space-y-3 sm:space-y-4 pr-2 sm:pr-4">
                {allMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2 items-end",
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start",
                    )}
                  >
                    {message.sender === "assistant" && (
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8 mb-0.5 border shrink-0">
                        <AvatarFallback className="bg-muted text-[10px]">
                          AI
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 max-w-[80%] sm:max-w-[75%] break-words shadow-sm",
                        message.sender === "user"
                          ? "bg-pink-500 text-white rounded-br-sm"
                          : "text-foreground border rounded-bl-sm",
                      )}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <span className="text-[9px] opacity-60 mt-0.5 block text-right">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-2 items-end">
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 mb-0.5 border shrink-0">
                      <AvatarFallback className="bg-muted text-[10px]">
                        AI
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-2xl rounded-bl-sm px-4 py-3 border shadow-sm">
                      <div className="flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </CardContent>

          {/* Input Area */}
          <div className="border-t p-3 sm:p-4  shrink-0 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 rounded-xl h-10 sm:h-11 text-sm"
                disabled={isTyping}
                autoComplete="off"
              />
              <Button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                size="icon"
                className="rounded-full h-10 w-10 sm:h-11 sm:w-11 shrink-0 bg-pink-500 hover:bg-pink-600 shadow-md"
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
}
