
import React from 'react';
import { CardData, CardElement, CardRarity } from '../types';

interface ControlPanelProps {
  card: CardData;
  setCard: (card: CardData) => void;
  onGenerateLore: () => void;
  onGenerateImage: () => void;
  isLoadingLore: boolean;
  isLoadingImage: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  card, 
  setCard, 
  onGenerateLore, 
  onGenerateImage,
  isLoadingLore,
  isLoadingImage
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumberField = ['hp', 'atk'].includes(name);
    const newValue = isNumberField ? Number(value) : value;
    setCard({ ...card, [name]: newValue });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCard({ ...card, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const elements = Object.values(CardElement);

  return (
    <div className="bg-slate-900/70 border border-white/10 p-8 rounded-3xl shadow-2xl space-y-8 overflow-y-auto max-h-[85vh] backdrop-blur-xl">
      {/* AI Assistant */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-blue-400 flex items-center gap-2 uppercase tracking-widest">
          <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
          AI デザイナー
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onGenerateLore}
            disabled={isLoadingLore}
            className="px-4 py-3 bg-blue-700 hover:bg-blue-600 rounded-xl text-xs font-black transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40"
          >
            {isLoadingLore ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "✨ データ構築"}
          </button>
          <button
            onClick={onGenerateImage}
            disabled={isLoadingImage}
            className="px-4 py-3 bg-indigo-700 hover:bg-indigo-600 rounded-xl text-xs font-black transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/40"
          >
            {isLoadingImage ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "🎨 イラスト創生"}
          </button>
        </div>
      </section>

      {/* Basic Stats */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">基本ステータス</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-slate-400">キャラクター名</label>
            <input name="name" value={card.name} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-blue-500" placeholder="名前を入力" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-slate-400">肩書き・称号</label>
            <input name="type" value={card.type} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-blue-500" placeholder="例: 絶望の観測者" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-slate-400">レアリティ</label>
            <select name="rarity" value={card.rarity} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm">
              {Object.values(CardRarity).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-slate-400">属性 (大罪・感情)</label>
            <select name="element" value={card.element} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm">
              {elements.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Parameters */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">能力値</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-red-500 uppercase tracking-widest">HP (体力)</label>
            <input type="number" name="hp" value={card.hp} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm font-tcg-modern" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest">ATK (攻撃力)</label>
            <input type="number" name="atk" value={card.atk} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm font-tcg-modern" />
          </div>
        </div>
      </section>

      {/* Abilities and Text */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">テキスト情報</h3>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-400">固有効果 (パッシブ)</label>
          <textarea name="uniqueEffect" value={card.uniqueEffect} onChange={handleChange} rows={2} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs resize-none" placeholder="固有能力..." />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-pink-500">HiGA技 (必殺技)</label>
          <input name="higaSkill" value={card.higaSkill} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm font-bold text-pink-100" placeholder="技名..." />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-400">Concept (世界観背景)</label>
          <textarea name="concept" value={card.concept} onChange={handleChange} rows={2} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-[11px] italic resize-none text-slate-400" placeholder="フレーバーテキスト..." />
        </div>
      </section>

      {/* Image Upload */}
      <section className="space-y-4">
        <label htmlFor="card-image-upload" className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition">
          <span className="text-xs font-black text-slate-400">イラストをアップロード</span>
          <input id="card-image-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      </section>
    </div>
  );
};

export default ControlPanel;
