import { useState, useCallback } from 'react';
import { sendMessage, startChat } from '../services/geminiService';
import type { ChatMessage, ChatSession } from '../types';

export const useChatManager = (
  session: ChatSession,
  setSession: (session: ChatSession) => void
) => {
  const [isLoading, setIsLoading] = useState(false);

  const postMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // Ensure chat is (re)started with the correct language for the current session
    startChat(session.language);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: Date.now(),
    };

    const updatedMessages = [...session.messages, userMessage];
    setSession({ ...session, messages: updatedMessages }); // Update parent state immediately with user message
    setIsLoading(true);

    try {
      const botResponseText = await sendMessage(text);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: botResponseText,
        sender: 'bot',
        timestamp: Date.now(),
      };
      setSession({ ...session, messages: [...updatedMessages, botMessage] });
    } catch (error) {
      const errorMessageText = error instanceof Error ? error.message : String(error);
      console.error("Error sending message:", errorMessageText);
      const errorMessage: ChatMessage = {
        id: `bot-error-${Date.now()}`,
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: 'bot',
        timestamp: Date.now(),
      };
      setSession({ ...session, messages: [...updatedMessages, errorMessage] });
    } finally {
      setIsLoading(false);
    }
  }, [session, setSession]);

  return { isLoading, postMessage };
};