import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are the AI Assistant for 'RailSahayak', an Indian Railways companion app.
Your tone is helpful, urgent (when needed), and distinctly Indian context-aware.
You help users with:
1. Station navigation (Platform numbers, exits).
2. Food recommendations based on stop time.
3. Porter/Coolie negotiation tips.
4. Analyzing crowdsourced text to categorize it (Issue vs Info).

If the user asks about specific live train status, clarify that you are using simulated data for this prototype.
Keep responses concise as users might be in a rush.`;

export const chatWithGemini = async (message: string, history: {role: 'user' | 'model', text: string}[]): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text || "Sorry, I couldn't process that request right now.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Network patchy? I'm having trouble connecting to the railway brain.";
  }
};

export const analyzeStationUpdate = async (text: string): Promise<{ type: 'ISSUE' | 'INFO' | 'CROWD', severity: 'LOW' | 'MEDIUM' | 'HIGH' }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this station report: "${text}". Return JSON with 'type' (ISSUE, INFO, or CROWD) and 'severity' (LOW, MEDIUM, HIGH).`,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const jsonStr = response.text?.trim();
    if (jsonStr) {
        return JSON.parse(jsonStr);
    }
    return { type: 'INFO', severity: 'LOW' };
  } catch (error) {
    console.error("Analysis Error:", error);
    return { type: 'INFO', severity: 'LOW' };
  }
}
