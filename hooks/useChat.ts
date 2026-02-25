import { useEffect, useState, useCallback, useRef } from "react";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

const STORAGE_KEY = "chat_messages";
const MAX_STORED = 100;

function loadFromStorage(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((m: ChatMessage) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));
  } catch {
    return [];
  }
}

function saveToStorage(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  try {
    const toStore = messages.slice(-MAX_STORED);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch {}
}

export const useChat = (url: string) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadFromStorage(),
  );
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    saveToStorage(messages);
  }, [messages]);

  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onmessage = (event) => {
      try {
        const { event: ev, data } = JSON.parse(event.data);
        if (ev === "receive_message") {
          const aiMsg: ChatMessage = {
            id: Date.now().toString(),
            text: data,
            sender: "assistant",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsTyping(false);
        }
      } catch (e) {
        console.error("Parse error", e);
      }
    };
    socketRef.current = ws;
    return () => ws.close();
  }, [url]);

  const sendMessage = useCallback((text: string, nick: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          event: "message",
          data: {
            text,
            nick: nick || "Mehmon",
          },
        }),
      );

      const userMessage: ChatMessage = {
        id: `u-${Date.now()}`,
        text,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return { messages, sendMessage, isTyping, clearMessages };
};
