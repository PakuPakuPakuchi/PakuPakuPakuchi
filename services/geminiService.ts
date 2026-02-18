
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiCardResponse, CardElement } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateCardLore = async (prompt: string, element: CardElement): Promise<GeminiCardResponse> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `以下のプロンプトに基づいて、ダークファンタジーなトレーディングカードのステータスとテキストを日本語で作成してください。
プロンプト: "${prompt}"
属性（大罪・感情）: ${element}

【制約】
- HPは410〜500の範囲で設定。
- ATKは90〜110の範囲で設定。
- 固有効果: キャラクターのパッシブスキル。
- HiGA技: SR以上限定の必殺技。かっこいい漢字とルビの組み合わせなどを推奨。
- Concept: 世界観を表すフレーバーテキスト。`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "キャラクター名" },
          type: { type: Type.STRING, description: "キャラクターの称号・肩書き" },
          uniqueEffect: { type: Type.STRING, description: "固有効果の説明" },
          higaSkill: { type: Type.STRING, description: "HiGA技（必殺技名）" },
          concept: { type: Type.STRING, description: "Concept（世界観テキスト）" },
          hp: { type: Type.NUMBER, description: "HP (410-500)" },
          atk: { type: Type.NUMBER, description: "ATK (90-110)" },
        },
        required: ["name", "type", "uniqueEffect", "higaSkill", "concept", "hp", "atk"],
      },
    },
  });

  return JSON.parse(response.text || '{}') as GeminiCardResponse;
};

export const generateCardIllustration = async (prompt: string, element: CardElement): Promise<string | null> => {
  const ai = getAI();
  const fullPrompt = `Professional TCG digital art of ${prompt}. Theme: ${element}. Dark fantasy, cinematic lighting, sharp details, symmetrical composition. High-end trading card game style. No text.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: fullPrompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "3:4"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};
