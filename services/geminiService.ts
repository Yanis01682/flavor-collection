import { GoogleGenAI, Type } from "@google/genai";
import { FoodAnalysisResult } from "../types";

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeFoodImage = async (base64Data: string, mimeType: string): Promise<FoodAnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Schema for structured output
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: "The name of the dish. Keep it concise.",
      },
      notes: {
        type: Type.STRING,
        description: "A short, appetizing description of the food appearance and likely taste (max 2 sentences).",
      },
    },
    required: ["name", "notes"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image", // Optimized for image tasks
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: "Analyze this food image. Provide the likely name of the dish and a short appetizing note in Chinese (Simplified).",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");

    const result = JSON.parse(jsonText) as FoodAnalysisResult;
    return result;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
