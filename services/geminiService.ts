
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Summarizes long tech articles into a concise "Byte-sized" summary.
 */
export const getArticleSummary = async (articleTitle: string, articleExcerpt: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Lütfen şu makaleyi teknoloji meraklıları için 3-4 maddelik, çarpıcı ve profesyonel bir "Özet" haline getir: \n\nBaşlık: ${articleTitle}\nÖzet: ${articleExcerpt}`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "Özet şu an oluşturulamıyor, lütfen sonra tekrar deneyin.";
  }
};

/**
 * Advanced search that uses Gemini to find relevant tech topics.
 */
export const searchTechTopics = async (query: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Kullanıcı şu teknoloji konusunu arıyor: "${query}". Lütfen bu konuyla ilgili en güncel trendleri ve anahtar kavramları 2 paragrafta açıkla.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    
    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { text, sources };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return null;
  }
};
