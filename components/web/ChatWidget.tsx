"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI assistant. Ask me anything about properties or interior design!",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message! How can I assist you today?",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
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
          size="sm"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 h-14 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="relative">
            <MessageCircle className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
            </span>
          </div>
          <span className="font-semibold">AI Chat</span>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-[420px] h-[650px] flex flex-col shadow-2xl border-2 animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <MessageCircle className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="font-semibold leading-none">AI Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-full hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full px-4 py-4">
              <div className="space-y-4 pr-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2 items-start",
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start",
                    )}
                  >
                    {message.sender === "assistant" && (
                      <Avatar className="h-8 w-8 mt-1 border">
                        <AvatarFallback className="bg-muted text-xs">
                          AI
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2.5 max-w-[75%] break-words",
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted text-foreground border",
                      )}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <span className="text-[10px] opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {message.sender === "user" && (
                      <Avatar className="h-8 w-8 mt-1 border">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          ME
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-2 items-start">
                    <Avatar className="h-8 w-8 mt-1 border">
                      <AvatarFallback className="bg-muted text-xs">
                        AI
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-2xl px-4 py-3 border">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
                        <span
                          className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <span
                          className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </CardContent>

          {/* Input Area */}
          <div className="border-t p-4 bg-card">
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
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border-input bg-background"
                disabled={isTyping}
              />
              <Button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                size="icon"
                className="rounded-full h-10 w-10 shrink-0"
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
