import { useState, useCallback, useEffect } from 'react';

export interface TradeSignalResponse {
  assetSymbol: string;
  timeframe: number;
  timeframeString: string;
  timestamp: number;
  action: 'BUY' | 'SELL' | 'HOLD' | 'UNKNOWN';
  confidence: number;
  reasoning: string;
  risks?: string;
  targets?: {
    entry?: string;
    tp1?: string;
    tp2?: string;
    sl?: string;
  };
  metrics?: {
    volatility: 'Low' | 'Medium' | 'High';
    trendStrength: number; // 0 to 100
    support: string;
    resistance: string;
  };
}

export function useAITradeSignal(
  currentAssetSymbol?: string, 
  currentTimeframe?: number,
  mtfEnabled: boolean = false,
  mtfSmallTimeframe: number = 5,
  mtfLargeTimeframe: number = 240
) {
  const [signal, setSignal] = useState<TradeSignalResponse | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to format timeframe
  const formatTf = (tf: number) => tf >= 1440 ? `D${tf / 1440}` : tf >= 60 ? `H${tf / 60}` : `M${tf}`;
  const currentTimeframeString = mtfEnabled 
    ? `${formatTf(mtfLargeTimeframe)} \u2192 ${formatTf(mtfSmallTimeframe)} (MTF)` 
    : formatTf(currentTimeframe || 15);

  // Reset current signal if asset or timeframe changes
  useEffect(() => {
    setSignal(null);
    setError(null);
  }, [currentAssetSymbol, currentTimeframe, mtfEnabled, mtfSmallTimeframe, mtfLargeTimeframe]);

  const resetSignal = useCallback(() => {
    setSignal(null);
    setError(null);
  }, []);

  const scanMarket = useCallback(async (marketContext: string, language: string = 'en') => {
    if (!currentAssetSymbol || !currentTimeframe) return;

    setIsScanning(true);
    setError(null);
    setSignal(null);

    try {
      // Safely pulling the API key from environment variables
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!API_KEY) {
        throw new Error("API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
      }
      
      const fullPrompt = `
You are an elite, highly logical AI quantitative trading algorithm named "PHASE-X CORE".
Your sole purpose is to analyze the provided live market data and emit a strict trading signal.

### Live Market Context (HIDDEN FROM USER)
Active Timeframe Context: ${currentTimeframeString}
${marketContext}

### INSTRUCTIONS:
1. Thoroughly analyze the live market context, considering the specific Timeframe (${currentTimeframeString}) and the currently active/selected indicator.
2. Determine the most logical market action globally: BUY, SELL, or HOLD.
3. Be ruthless and precise. Do not use conversational language. 
4. Include a "risks" section evaluating potential pitfalls, market context risks, or conflicting indicator signals.
5. You MUST write your analysis, reasoning, and risks in the ${language === 'ar' ? 'Arabic' : 'English'} language. Do NOT change the JSON keys.
6. Output your analysis STRICTLY in the following JSON format ONLY. 
Do NOT wrap it in markdown block quotes. Just the raw JSON object.

REQUIRED JSON FORMAT:
{
  "action": "BUY" | "SELL" | "HOLD",
  "confidence": <number between 0 and 100>,
  "reasoning": "<A brief, highly technical 2-3 sentence explanation of why this action was chosen based on the Phase X indicators provided and the timeframe>",
  "risks": "<1-2 sentences outlining the primary risks and contextual factors to watch out for>",
  "targets": {
    "entry": "<suggested entry price or 'Market'>",
    "tp1": "<Take Profit 1>",
    "sl": "<Stop Loss>"
  },
  "metrics": {
    "volatility": "Low" | "Medium" | "High",
    "trendStrength": <number 0-100 indicating momentum/trend power>,
    "support": "<price level>",
    "resistance": "<price level>"
  }
}
`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.1, // Keep it highly deterministic
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch AI signal');
      }

      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      // Clean up the text in case Gemini wraps it in markdown like \`\`\`json ... \`\`\`
      let cleanJson = resultText.trim();
      if (cleanJson.startsWith('\`\`\`json')) {
        cleanJson = cleanJson.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
      } else if (cleanJson.startsWith('\`\`\`')) {
        cleanJson = cleanJson.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
      }

      const parsedData = JSON.parse(cleanJson);
      
      const parsedSignal: TradeSignalResponse = {
        ...parsedData,
        assetSymbol: currentAssetSymbol,
        timeframe: currentTimeframe,
        timeframeString: currentTimeframeString,
        timestamp: Date.now()
      };

      setSignal(parsedSignal);

    } catch (err: any) {
      console.error('AI Signal Error:', err);
      setError('System Failure: Unable to compute market data.');
    } finally {
      setIsScanning(false);
    }
  }, [currentAssetSymbol, currentTimeframe, currentTimeframeString, mtfEnabled, mtfLargeTimeframe, mtfSmallTimeframe]);

  return {
    signal,
    isScanning,
    error,
    scanMarket,
    resetSignal,
  };
}
