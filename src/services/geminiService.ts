import { GoogleGenAI } from "@google/genai";
import { Language, UserProgress, ProgressLog } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generatePersonalizedCompliment(
  lang: Language,
  progress: UserProgress,
  todayLog: ProgressLog
): Promise<string> {
  const model = "gemini-3-flash-preview";
  
  const mood = todayLog.mood || "neutral";
  const streak = progress.streak;
  const totalCompleted = Object.values(progress.logs).reduce((acc: number, log: ProgressLog) => acc + log.exercises.length + (log.journaled ? 1 : 0), 0);
  
  const systemInstruction = lang === 'en' 
    ? "You are Lumina, a supportive and empathetic mental wellness companion. Your goal is to provide a short, personalized, and highly encouraging compliment or thought for the user based on their current mood and progress. Keep it under 20 words. Be gentle and kind."
    : "Você é Lumina, um companheiro de bem-estar mental empático e encorajador. Seu objetivo é fornecer um elogio ou pensamento curto, personalizado e altamente encorajador para o usuário com base em seu humor e progresso atual. Mantenha menos de 20 palavras. Seja gentil e carinhoso.";

  const prompt = lang === 'en'
    ? `User's current mood: ${mood}. 
       Current streak: ${streak} days. 
       Total activities completed: ${totalCompleted}.
       Generate a personalized compliment in English.`
    : `Humor atual do usuário: ${mood}. 
       Sequência atual: ${streak} dias. 
       Total de atividades concluídas: ${totalCompleted}.
       Gere um elogio personalizado em Português.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    return response.text || (lang === 'en' ? "You are doing great!" : "Você está indo muito bem!");
  } catch (error) {
    console.error("Error generating compliment:", error);
    return lang === 'en' ? "You are doing great!" : "Você está indo muito bem!";
  }
}
