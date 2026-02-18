
import React from 'react';
import { CardData, CardElement, CardRarity } from '../types';

interface CardPreviewProps {
  card: CardData;
  id?: string;
}

const ELEMENT_COLORS: Record<CardElement, string> = {
  [CardElement.SLOTH]: 'from-slate-600 to-slate-800 border-slate-500',
  [CardElement.WRATH]: 'from-red-900 to-red-600 border-red-500',
  [CardElement.ENVY]: 'from-emerald-900 to-emerald-600 border-emerald-500',
  [CardElement.PRIDE]: 'from-amber-700 to-yellow-600 border-yellow-500',
  [CardElement.LUST]: 'from-pink-900 to-pink-600 border-pink-500',
  [CardElement.GLUTTONY]: 'from-orange-900 to-orange-700 border-orange-600',
  [CardElement.GREED]: 'from-yellow-900 to-amber-800 border-amber-700',
  [CardElement.MELANCHOLY]: 'from-indigo-950 to-indigo-800 border-indigo-400',
  [CardElement.PESSIMISM]: 'from-gray-900 to-blue-950 border-blue-400',
  [CardElement.VANITY]: 'from-purple-950 to-purple-800 border-purple-400',
};

const ELEMENT_ICONS: Record<CardElement, string> = {
  [CardElement.SLOTH]: '🕒',
  [CardElement.WRATH]: '🪓',
  [CardElement.ENVY]: '✂️',
  [CardElement.PRIDE]: '👓',
  [CardElement.LUST]: '❤️',
  [CardElement.GLUTTONY]: '🦷',
  [CardElement.GREED]: '🔑',
  [CardElement.MELANCHOLY]: '🎩',
  [CardElement.PESSIMISM]: '💧',
  [CardElement.VANITY]: '👁️',
};

const RARITY_STYLING: Record<CardRarity, string> = {
  [CardRarity.N]: 'border-slate-400',
  [CardRarity.R]: 'border-blue-400',
  [CardRarity.SR]: 'border-yellow-300 shadow-[0_0_12px_rgba(253,224,71,0.6)]',
  [CardRarity.SSR]: 'border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.7)]',
  [CardRarity.UR]: 'border-white shadow-[0_0_25px_rgba(255,255,255,0.8)] border-[4px]',
};

const CardPreview: React.FC<CardPreviewProps> = ({ card, id }) => {
  const isSRPlus = card.rarity === CardRarity.SR || card.rarity === CardRarity.SSR || card.rarity === CardRarity.UR;
  const isUR = card.rarity === CardRarity.UR;

  return (
    <div id={id} className="relative group select-none">
      {/* Outer Glow */}
      <div className={`absolute -inset-1.5 bg-gradient-to-br ${ELEMENT_COLORS[card.element]} rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000`}></div>
      
      {/* Card Body */}
      <div className={`relative w-[340px] h-[480px] bg-slate-950 rounded-2xl border-[5px] overflow-hidden flex flex-col ${RARITY_STYLING[card.rarity]} text-white shadow-2xl`}>
        
        {/* Header Area */}
        <div className={`h-20 flex justify-between items-center px-4 pt-1 bg-gradient-to-r ${ELEMENT_COLORS[card.element]} border-b-2 border-inherit shadow-lg z-10`}>
          <div className="flex flex-col flex-1 min-w-0 pr-2">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 leading-tight mb-0.5 drop-shadow-sm truncate">
              {card.type || "肩書き未設定"}
            </span>
            {/* 描画切れを防ぐために十分なpadding-bottomを確保し、leadingを調整 */}
            <h2 className="text-[20px] font-black leading-snug pb-1 truncate drop-shadow-md">
              {card.name || "キャラクター名"}
            </h2>
          </div>
          <div className="flex flex-col items-center justify-center bg-slate-950/60 px-2 py-2 rounded-xl border border-white/20 backdrop-blur-md min-w-[58px] shadow-inner">
            <span className="text-xl leading-none mb-1">{ELEMENT_ICONS[card.element]}</span>
            {/* 優雅なフォント（Cinzel）を適用 */}
            <span className="font-tcg-title text-[9px] font-black tracking-widest leading-none opacity-90 text-center">
              {card.element}
            </span>
          </div>
        </div>

        {/* Image Area */}
        <div className="relative h-48 bg-black border-b border-white/10 overflow-hidden">
          {card.imageUrl ? (
            <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-800">
              <span className="text-[8px] font-tcg-modern tracking-widest">NO DATA</span>
            </div>
          )}
          
          {/* Rarity Emblem */}
          <div className={`absolute bottom-2 right-2 flex items-center justify-center min-w-[36px] px-2 py-0.5 rounded italic font-black text-sm tracking-tighter shadow-lg ${isUR ? 'bg-white text-black' : 'bg-slate-950/80 text-white border border-white/20'}`}>
            {card.rarity}
          </div>
        </div>

        {/* HP & ATK Bar */}
        <div className="flex bg-slate-900 border-y border-white/5 py-1.5 px-5 gap-8">
          <div className="flex items-center gap-2">
             <span className="text-[9px] font-black text-red-500 italic drop-shadow-[0_0_3px_rgba(239,68,68,0.6)]">HP</span>
             <span className="font-tcg-modern text-xl font-bold tracking-tighter leading-none">{card.hp}</span>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[9px] font-black text-orange-400 italic drop-shadow-[0_0_3px_rgba(251,146,60,0.6)]">ATK</span>
             <span className="font-tcg-modern text-xl font-bold tracking-tighter leading-none">{card.atk}</span>
          </div>
        </div>

        {/* Info Area */}
        <div className="flex-1 p-3.5 bg-gradient-to-b from-slate-900 to-black overflow-y-auto space-y-3 scrollbar-hide">
          {/* Unique Effect */}
          <div>
            <div className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1 border-b border-blue-500/30 pb-0.5 w-max">固有効果</div>
            <p className="text-[11px] leading-relaxed font-medium text-slate-100 line-clamp-2">
              {card.uniqueEffect || "固有能力がここに表示されます。"}
            </p>
          </div>

          {/* HiGA Skill (SR+) */}
          {isSRPlus && (
            <div className="bg-white/5 p-2 rounded-lg border border-white/10 shadow-inner">
              <div className="text-[8px] font-black text-pink-500 uppercase tracking-widest mb-1">HiGA技</div>
              <p className="text-[11px] font-black text-pink-100 italic tracking-wide">
                【{card.higaSkill || "未覚醒"}】
              </p>
            </div>
          )}

          {/* Concept (Flavor Text) */}
          <div className="pt-2 border-t border-white/5">
            <p className="text-[9.5px] italic text-slate-500 leading-tight font-serif opacity-80">
              {card.concept ? `"${card.concept}"` : "世界は静かに、その時を待っている。"}
            </p>
          </div>
        </div>

        {/* Decorative Bottom Bar */}
        <div className={`h-1.5 bg-gradient-to-r ${ELEMENT_COLORS[card.element]} opacity-60`}></div>
      </div>
    </div>
  );
};

export default CardPreview;
