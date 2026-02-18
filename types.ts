
export enum CardRarity {
  N = 'N',
  R = 'R',
  SR = 'SR',
  SSR = 'SSR',
  UR = 'UR'
}

export enum CardElement {
  SLOTH = '怠惰',
  WRATH = '憤怒',
  ENVY = '嫉妬',
  PRIDE = '傲慢',
  LUST = '色欲',
  GLUTTONY = '暴食',
  GREED = '強欲',
  // UR専用
  MELANCHOLY = '憂鬱',
  PESSIMISM = '悲観',
  VANITY = '虚飾'
}

export interface CardData {
  name: string;
  type: string; // キャラクターの称号・肩書き
  rarity: CardRarity;
  element: CardElement;
  hp: number;
  atk: number;
  uniqueEffect: string; // 固有効果
  higaSkill: string;    // HiGA技 (SR以上)
  concept: string;      // Concept (フレーバー)
  imageUrl: string;
}

export interface GeminiCardResponse {
  name: string;
  type: string;
  uniqueEffect: string;
  higaSkill: string;
  concept: string;
  hp: number;
  atk: number;
}
