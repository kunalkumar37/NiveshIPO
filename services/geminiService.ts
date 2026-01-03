
import { GoogleGenAI, Type } from "@google/genai";
import { IPO, RiskAnalysis, WeightPreferences, GroundingSource, MarketNews } from "../types";

const extractSources = (response: any): GroundingSource[] => {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (!chunks) return [];
  
  return chunks
    .filter((chunk: any) => chunk.web && chunk.web.uri)
    .map((chunk: any) => ({
      title: chunk.web.title || 'Source',
      uri: chunk.web.uri
    }));
};

const parseJsonFromText = (text: string) => {
  try {
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/({[\s\S]*})|(\[[\s\S]*\])/);
    let parsed;
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    } else {
      parsed = JSON.parse(text);
    }
    return parsed;
  } catch (e) {
    console.warn("Could not parse JSON from AI response", text);
    return null;
  }
};

export const getLiveIPOData = async (): Promise<{ data: IPO[], sources: GroundingSource[], news: MarketNews[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Fetch two things:
      1. The latest real-time Indian IPO data (Mainboard & SME) from NSE and BSE. Include 8 IPOs with details: companyName, symbol, status, ipoType, issueSize, priceBand, lotSize, dates, gmp, prediction, description, sector, riskScore, registrar, leadManager, and subscription stats.
      2. 5-7 trending Indian Stock Market news items specifically about IPOs or major market moves. Each news item needs: title, url (real source link), source (name of publisher), and time (e.g., '10m ago').
      
      Return as a single JSON object: { "ipos": [...], "news": [...] }`,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const sources = extractSources(response);
    const result = parseJsonFromText(response.text || "{}");
    
    let ipos = result?.ipos || [];
    let news = result?.news || [];
    
    if (!Array.isArray(ipos)) ipos = [];
    if (!Array.isArray(news)) news = [];
    
    news = news.map((n: any, idx: number) => ({
      ...n,
      id: n.id || `news-${idx}-${Date.now()}`
    }));

    return { data: ipos, sources, news };
  } catch (error) {
    console.error("Error fetching IPO data:", error);
    return { data: [], sources: [], news: [] };
  }
};

export const getRiskAnalysis = async (ipo: IPO, weights: WeightPreferences): Promise<RiskAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Perform an ultra-detailed AI risk analysis for the Indian IPO: ${ipo.companyName} (${ipo.symbol}). 
  User Weightings: Fundamentals ${weights.fundamentals}%, Valuation ${weights.valuation}%, Sentiment ${weights.sentiment}%.
  Provide: risk levels, summary, red flags, strengths, suitabilityScore, investorPersona, sectorOutlook, and listingStrategy. Return ONLY clean JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        tools: [{ googleSearch: {} }],
      }
    });

    const sources = extractSources(response);
    const analysis = parseJsonFromText(response.text || "{}") as RiskAnalysis;
    
    return {
      fundamentals: analysis?.fundamentals || 'Moderate',
      stability: analysis?.stability || 'Moderate',
      pricing: analysis?.pricing || 'Moderate',
      sentiment: analysis?.sentiment || 'Moderate',
      summary: analysis?.summary || 'Analysis in progress...',
      redFlags: analysis?.redFlags || [],
      strengths: analysis?.strengths || [],
      sources: sources,
      suitabilityScore: analysis?.suitabilityScore || 50,
      investorPersona: analysis?.investorPersona || 'Diversified Investor',
      sectorOutlook: analysis?.sectorOutlook || 'Market Outlook Stable',
      listingStrategy: analysis?.listingStrategy || 'Wait and Watch'
    };
  } catch (error) {
    console.error("Error generating risk analysis:", error);
    return {
      fundamentals: 'Moderate',
      stability: 'Moderate',
      pricing: 'Moderate',
      sentiment: 'Moderate',
      summary: 'Fallback analysis due to connectivity issues.',
      redFlags: [], strengths: [], sources: [], suitabilityScore: 50, investorPersona: 'General Investor', sectorOutlook: 'Stable', listingStrategy: 'Dynamic'
    };
  }
};

export const chatWithFinancialAI = async (message: string, history: { role: string, parts: { text: string }[] }[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        { role: 'user', parts: [{ text: `You are NiveshAI, a world-class financial analyst and stock market expert.
        Rules:
        1. YOU ONLY TALK ABOUT FINANCIAL MARKETS, STOCKS, IPOS, AND MACROECONOMICS.
        2. If a user asks non-financial questions, politely redirect them back to market analysis.
        3. Point-to-point bullet formats only.
        4. Highlight metrics like **PE Ratio**, **Market Cap**, **GMP**, **EBITDA** in BOLD.
        5. Be extremely precise and data-driven.` }] },
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are an expert financial advisor named NiveshAI. Answer strictly market-related queries. Use structured bullet points. Bold all important financial metrics."
      }
    });

    return {
      text: response.text || "Connection error in the financial grid.",
      sources: extractSources(response)
    };
  } catch (error) {
    console.error("Chat error:", error);
    return { text: "Market analysis terminal offline.", sources: [] };
  }
};

export const transcribeAudio = async (base64Audio: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { inlineData: { mimeType: 'audio/wav', data: base64Audio } },
            { text: "Transcribe this audio exactly. Only return the transcription text." }
          ]
        }
      ]
    });
    return response.text || "";
  } catch (error) {
    console.error("Transcription error:", error);
    return "Error transcribing audio.";
  }
};
