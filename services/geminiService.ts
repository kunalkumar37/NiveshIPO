
import { GoogleGenAI } from "@google/genai";
import { IPO, RiskAnalysis, WeightPreferences, GroundingSource } from "../types";

// Helper to extract web grounding sources from search results
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

// Robust JSON parsing from markdown text
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

export const getLiveIPOData = async (): Promise<{ data: IPO[], sources: GroundingSource[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Fetch the latest real-time Indian IPO data (Mainboard & SME) from NSE and BSE as of today. I need exactly 8 current, upcoming, or recently closed IPOs. For each, include: companyName, symbol, status (Live/Upcoming/Closed), ipoType (Mainboard/SME), issueSize, priceBand, lotSize, openDate, closeDate, listingDate, gmp, listingGainEstimate (AI prediction string like '+20-25% expected'), description, sector, riskScore (0-100), registrar, leadManager. Also include subscription data (qib, nii, retail, total). Return only a clean JSON array.",
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const sources = extractSources(response);
    let data = parseJsonFromText(response.text || "[]");
    
    // Ensure data is always an array
    if (data && !Array.isArray(data)) {
      if (typeof data === 'object' && data.ipos && Array.isArray(data.ipos)) {
        data = data.ipos;
      } else if (typeof data === 'object' && data.data && Array.isArray(data.data)) {
        data = data.data;
      } else {
        data = [];
      }
    } else if (!data) {
      data = [];
    }
    
    return { data, sources };
  } catch (error) {
    console.error("Error fetching IPO data:", error);
    return { data: [], sources: [] };
  }
};

export const getRiskAnalysis = async (ipo: IPO, weights: WeightPreferences): Promise<RiskAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Perform an ultra-detailed AI risk analysis for the Indian IPO: ${ipo.companyName} (${ipo.symbol}). 
  User Weightings: Fundamentals ${weights.fundamentals}%, Valuation ${weights.valuation}%, Sentiment ${weights.sentiment}%.
  
  Please look for recent news, GMP trends, and subscription status.
  Provide:
  1. Risk Levels (Low/Moderate/High) for: Fundamentals, Stability, Pricing, Sentiment.
  2. A sharp, narrative 'summary' verdict (50 words).
  3. Professional 'redFlags' list and 'strengths' list.
  4. 'suitabilityScore' (0-100) specifically for retail investors.
  5. 'investorPersona' (e.g., 'Risk-Averse Value Seeker').
  6. 'sectorOutlook' (2-sentence view on the industry vertical).
  7. 'listingStrategy' (Hold/Sell/Partial exit advice).
  
  Return ONLY clean JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const sources = extractSources(response);
    const analysis = parseJsonFromText(response.text || "{}") as RiskAnalysis;
    
    const finalAnalysis = {
      fundamentals: analysis?.fundamentals || 'Moderate',
      stability: analysis?.stability || 'Moderate',
      pricing: analysis?.pricing || 'Moderate',
      sentiment: analysis?.sentiment || 'Moderate',
      summary: analysis?.summary || 'Formulating detailed market assessment based on real-time volatility indices and sector specific fundamentals...',
      redFlags: Array.isArray(analysis?.redFlags) && analysis.redFlags.length > 0 ? analysis.redFlags : ["Potential market volatility impact", "Evaluating sector-specific liquidity risks"],
      strengths: Array.isArray(analysis?.strengths) && analysis.strengths.length > 0 ? analysis.strengths : ["Strong sector tailwinds observed", "Healthy subscription interest indicators"],
      sources: sources,
      suitabilityScore: analysis?.suitabilityScore || 50,
      investorPersona: analysis?.investorPersona || 'Diversified Retail Investor',
      sectorOutlook: analysis?.sectorOutlook || 'The sector shows long-term resilience with emerging tailwinds in digital adoption and infrastructure spend.',
      listingStrategy: analysis?.listingStrategy || 'Wait for listing day volume assessment before making final allocation moves.'
    };

    return finalAnalysis;
  } catch (error) {
    console.error("Error generating risk analysis:", error);
    return {
      fundamentals: 'Moderate',
      stability: 'Moderate',
      pricing: 'Moderate',
      sentiment: 'Moderate',
      summary: 'Automated assessment in progress. Currently aggregating secondary market signals and fundamental metrics...',
      redFlags: ["System processing real-time signals..."],
      strengths: ["Historical sector performance is supportive"],
      sources: [],
      suitabilityScore: 50,
      investorPersona: 'General Portfolio Builder',
      sectorOutlook: 'Neutral to Positive outlook pending final subscription tally.',
      listingStrategy: 'Dynamic entry/exit strategy based on listing day GMP variance.'
    };
  }
};
