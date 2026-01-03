import { GoogleGenAI } from "@google/genai";

export const removeWatermark = async (
  imageBase64: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    // Strictly follow the initialization rule from guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Ensure the base64 string doesn't have the data:image/xxx prefix
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates returned from Gemini.");
    }

    const parts = candidates[0].content.parts;
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in response. The model might have returned only text.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};