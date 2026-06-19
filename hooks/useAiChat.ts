import { useCallback, useEffect, useState } from "react";
import { API_URL } from "@/lib/config";
import { ChatMessage } from "@/hooks/useChat";

const STORAGE_KEY = "ai_chat_messages";
const MAX_STORED = 100;

function loadFromStorage(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    return parsed.map((message) => ({
      ...message,
      timestamp: new Date(message.timestamp),
    }));
  } catch {
    return [];
  }
}

function saveToStorage(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(messages.slice(-MAX_STORED)),
    );
  } catch {}
}

export const useAiChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadFromStorage(),
  );
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    saveToStorage(messages);
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    const message = text.trim();
    if (!message || isTyping) return;
    const aiChatUrl = `${API_URL}/chat/ai`;

    const userMessage: ChatMessage = {
      id: `ai-u-${Date.now()}`,
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setError(null);

    try {
      if (process.env.NODE_ENV === "development") {
        console.info("[AI_CHAT_DEBUG]", { url: aiChatUrl });
      }

      const response = await fetch(aiChatUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        reply?: string;
        message?: string;
      };

      if (!response.ok || !data.reply) {
        if (process.env.NODE_ENV === "development") {
          console.error("[AI_CHAT_ERROR]", {
            status: response.status,
            body: data,
          });
        }
        throw new Error(data.message || "AI chat failed");
      }

      const assistantMessage: ChatMessage = {
        id: `ai-a-${Date.now()}`,
        text: data.reply,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const friendlyMessage =
        "AI chat is unavailable right now. Please try again or use Admin Chat for help.";
      setError(friendlyMessage);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-e-${Date.now()}`,
          text: friendlyMessage,
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [isTyping]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return { messages, sendMessage, isTyping, clearMessages, error };
};
