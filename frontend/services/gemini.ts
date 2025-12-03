
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Contact, Deal, Event } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
// Only initialize if key exists to avoid errors
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
const GEMINI_MODEL = "gemini-2.5-flash";

export const generateMarketingCopy = async (
  topic: string,
  tone: string,
  targetAudience: string
): Promise<{ subject: string; body: string }> => {
  // Mock fallback if no API key
  if (!apiKey || !ai) {
    console.warn("No API Key found, using mock response");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
    return {
      subject: `[Draft] Campaign for ${targetAudience}: ${topic}`,
      body: `Hi ${targetAudience},\n\nWe are excited to announce our latest update regarding ${topic}. This campaign is designed with a ${tone} tone to resonate with your needs.\n\nBest,\nThe Team`
    };
  }

  const prompt = `Write a marketing email for a campaign about "${topic}".
  The tone should be ${tone}.
  The target audience is ${targetAudience}.
  
  Return the response in strict JSON format with "subject" and "body" keys.`;

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING },
          body: { type: Type.STRING },
        },
        required: ["subject", "body"],
      } as Schema,
    },
  });

  const text = response.text;
  if (!text) return { subject: "", body: "" };

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON", e);
    return { subject: "Error generating content", body: text };
  }
};

export const getAIAdvisorResponse = async (history: { role: string, parts: { text: string }[] }[], message: string) => {
  if (!apiKey) throw new Error("API Key not found");

  const chat = ai.chats.create({
    model: GEMINI_MODEL,
    history: history,
    config: {
      systemInstruction: "You are a world-class Marketing Strategist named Visionary Space. specific, actionable, and data-driven advice. Keep responses concise (under 200 words) unless asked for details.",
    }
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};

export const analyzeSentiment = async (text: string): Promise<'Positive' | 'Neutral' | 'Negative'> => {
  if (!apiKey) return 'Neutral';

  const result = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: `Analyze the sentiment of this text: "${text}". Return ONLY one word: Positive, Neutral, or Negative.`,
  });

  const sentiment = result.text?.trim();
  if (sentiment?.includes("Positive")) return "Positive";
  if (sentiment?.includes("Negative")) return "Negative";
  return "Neutral";
};

export const predictLeadScore = async (contact: Contact): Promise<{ score: number; reason: string }> => {
  if (!apiKey) return { score: 50, reason: "AI Analysis unavailable" };

  const prompt = `Predict a lead score (0-100) for a contact with these details:
  Name: ${contact.name}
  Company: ${contact.company}
  Status: ${contact.status}
  Last Contact: ${contact.lastContact}
  Country: ${contact.country}
  
  Return JSON with "score" (number) and "reason" (short string).`;

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          reason: { type: Type.STRING },
        },
        required: ["score", "reason"],
      } as Schema,
    }
  });

  const text = response.text;
  if (!text) return { score: 50, reason: "Analysis failed" };

  try {
    return JSON.parse(text);
  } catch {
    return { score: 50, reason: "Analysis failed" };
  }
};

export const generateAssetTags = async (assetName: string): Promise<string[]> => {
  if (!apiKey) return ["AI Tag 1", "AI Tag 2"];

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: `Generate 3 relevant one-word tags for a digital asset named "${assetName}". Return as JSON array of strings.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch {
    return ["Asset"];
  }
};

export const generateSocialHashtags = async (content: string): Promise<string[]> => {
  if (!apiKey) return ["#VisionarySpace", "#Growth"];

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: `Generate 5 viral hashtags for this social media post: "${content}". Return only the hashtags in a JSON array of strings.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch {
    return ["#Marketing"];
  }
};

export const analyzeDealProbability = async (deal: Deal): Promise<{ score: number; reasoning: string }> => {
  if (!apiKey) return { score: 50, reasoning: "AI not connected." };

  const prompt = `Act as a Sales Director. Analyze the following deal and predict the probability of it closing (0-100) and provide a reasoning.
    
    Deal Title: ${deal.title}
    Value: $${deal.value}
    Stage: ${deal.stage} (Stages are: Discovery -> Qualified -> Proposal -> Negotiation -> Closed)
    Contact: ${deal.contactName}
    Expected Close Date: ${deal.expectedCloseDate}
    Country: ${deal.country}

    Consider:
    - Negotiation and Proposal stages imply higher probability than Discovery.
    - Large values might take longer or have higher scrutiny.
    - Titles implying "Enterprise" or "Global" are complex.

    Return JSON with "score" (number) and "reasoning" (string, max 30 words).
    `;

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          reasoning: { type: Type.STRING }
        },
        required: ["score", "reasoning"]
      } as Schema
    }
  });

  try {
    return JSON.parse(response.text || '{"score": 50, "reasoning": "Could not analyze."}');
  } catch {
    return { score: 50, reasoning: "AI analysis failed." };
  }
};

export const predictEventAttendance = async (event: Event, contact: Contact): Promise<{ score: number; reasoning: string }> => {
  if (!apiKey) return { score: Math.floor(Math.random() * 100), reasoning: "AI Offline Mode" };

  const prompt = `Predict the probability (0-100) that this contact will attend the event.
    
    Event: "${event.name}"
    Description: "${event.description}"
    Location: "${event.location}"
    Date: "${event.date}"
    Country: "${event.country}"

    Contact: "${contact.name}"
    Status: "${contact.status}"
    Location: "${contact.country}"
    Lead Score: ${contact.score}

    Logic:
    - High probability if Contact Country matches Event Country.
    - Higher if Contact Status is 'Customer'.
    - Lower if location mismatch (e.g. US vs UK) unless event is Virtual.
    
    Return JSON with "score" (number) and "reasoning" (string, max 15 words).`;

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          reasoning: { type: Type.STRING }
        },
        required: ["score", "reasoning"]
      } as Schema
    }
  });

  try {
    return JSON.parse(response.text || '{"score": 50, "reasoning": "Analysis failed"}');
  } catch {
    return { score: 50, reasoning: "Analysis failed" };
  }
};
