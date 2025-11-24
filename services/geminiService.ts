import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check API key
export const checkApiKey = () => {
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    return false;
  }
  return true;
};

// 1. Plant Doctor: Vision Analysis
export const analyzePlantImage = async (base64Image: string, mimeType: string) => {
  if (!checkApiKey()) throw new Error("API Key missing");

  try {
    // Using gemini-3-pro-preview for superior visual reasoning and accuracy
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: `You are a specialized agricultural AI assistant. Perform a strict pathological analysis of this image.

            **Strict Analysis Protocol:**

            1.  **Image Validation (CRITICAL)**: 
                *   Is this a plant? If NO, stop immediately and return: "### ⚠️ Analysis Paused\n\nThis does not appear to be a plant. Please upload a clear photo of a crop, leaf, or fruit."
                *   Is the image blurry or too dark? If YES, stop and return: "### ⚠️ Image Unclear\n\nAnalysis is not possible due to poor image quality. Please ensure good lighting and focus."

            2.  **Health Assessment**:
                *   Does the plant look healthy? Be conservative. Do not force a diagnosis if the plant looks vibrant and free of lesions/discoloration.
                *   If **Healthy**: State explicitly "The plant appears healthy." and provide care tips for maintenance.

            3.  **Disease Diagnosis (Only if symptoms exist)**:
                *   Identify the specific disease, pest, or deficiency.
                *   Describe the visual evidence (e.g., "Circular brown spots with yellow halos...").
                *   Assign a **Confidence Score** (0-100%).

            4.  **Action Plan**:
                *   **Immediate Treatment**: Organic and chemical options.
                *   **Prevention**: Long-term cultural practices.

            Format the output in clean Markdown. Use **Bold** for key terms and lists for readability.`
          }
        ]
      }
    });
    return response.text || "Could not analyze the image.";
  } catch (error) {
    console.error("Error analyzing plant:", error);
    throw error;
  }
};

// 2. Farm Advisor: Chat
let chatSession: Chat | null = null;

export const initChatSession = (systemInstruction?: string) => {
  if (!checkApiKey()) return;
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction || "You are AgroWise, a helpful, practical, and knowledgeable farming assistant. Keep answers concise but informative.",
    }
  });
};

export const sendMessageToAdvisor = async (message: string) => {
  if (!chatSession) initChatSession();
  if (!chatSession) throw new Error("Chat session could not be initialized");

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({ message });
    return response.text || "I didn't catch that. Could you repeat?";
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};

// 3. Market Insights: Search Grounding
export const getMarketInsights = async (query: string) => {
  if (!checkApiKey()) throw new Error("API Key missing");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide the latest market insights, prices, and trends for: ${query}. Focus on recent data.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract web sources
    const sources = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({ uri: web.uri, title: web.title }));

    return { text, sources };
  } catch (error) {
    console.error("Market insights error:", error);
    throw error;
  }
};

// 4. Weather & Location: Maps Grounding
export const getWeatherForecast = async (lat: number, lng: number) => {
  if (!checkApiKey()) throw new Error("API Key missing");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `What is the current weather and 3-day farming forecast for coordinates ${lat}, ${lng}? Include advice for irrigation and field work.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Weather error:", error);
    return "Unable to fetch weather data at this moment.";
  }
};