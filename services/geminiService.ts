import { GoogleGenAI, Chat, Type } from "@google/genai";
import { LanguageCode, SUPPORTED_LANGUAGES } from "../types";

// FIX: Initialize GoogleGenAI with a named apiKey parameter as per guidelines.
// The API key is assumed to be available in process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
let chat: Chat;

export const startChat = (language: LanguageCode = 'en', systemInstruction?: string) => {
  const languageName = SUPPORTED_LANGUAGES[language] || 'English';
  const defaultInstruction = `You are a helpful assistant for farmers. All your responses must be in ${languageName}.`;
  
  // FIX: Use the correct model 'gemini-2.5-flash' and initialization for chat.
  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: [],
    config: {
        systemInstruction: systemInstruction || defaultInstruction,
    },
  });
};

export const sendMessage = async (message: string) => {
  if (!chat) {
    startChat();
  }
  
  // FIX: Send message and extract text correctly from the response.
  const response = await chat.sendMessage({ message });
  return response.text;
};

export const sendMessageStream = async (message: string) => {
    if (!chat) {
      startChat();
    }
    // FIX: Use sendMessageStream for streaming responses.
    return await chat.sendMessageStream({ message });
};


export const predictCropPrice = async (cropName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze the current market trends for ${cropName} and provide a brief price prediction for the next 3 months. Be optimistic but realistic. Keep it concise and easy to understand for a farmer. Output JSON.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    prediction: { type: Type.STRING, description: 'The detailed price prediction text.' },
                    trend: { type: Type.STRING, description: 'The market trend (UP, DOWN, or STABLE).' },
                    confidence: { type: Type.STRING, description: 'The confidence level of the prediction (High, Medium, or Low).' }
                }
            }
        }
    });
    return response.text;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error predicting crop price:", errorMessage);
    return JSON.stringify({ error: "Could not fetch price prediction at this time." });
  }
};