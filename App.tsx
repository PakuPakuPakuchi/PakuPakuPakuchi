
import React, { useState, useRef } from 'react';
import { CardData, CardElement, CardRarity } from './types';
import CardPreview from './components/CardPreview';
import ControlPanel from './components/ControlPanel';
import { generateCardLore, generateCardIllustration } from './services/geminiService';
import * as htmlToImage from 'html-to-image';

const INITIAL_CARD: CardData = {
  name: '虚飾の王・ルシフェル',
  type: '終焉を告げる天堕騎士',
  rarity: CardRarity.UR,
  element: CardElement.VANITY,
  hp: 495,
  atk: 108,
  uniqueEffect: '場に出た時、相手の全ステータスを半減させ、自身のATKを+20する。',
  higaSkill: '終焉の黙示録 (アポカリプス)',
  concept: '美しき嘘で世界を塗り替える。真実など、この王の前では無価値に等しい。',
  imageUrl: 'https://picsum.photos/seed/tcg_ur/400/600',
};

const App: React.FC = () => {
  const [card, setCard] = useState<CardData>(INITIAL_CARD);
  const [appBgImage, setAppBgImage] = useState<string | null>(null);
  const [loadingLore, setLoadingLore] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleGenerateLore = async () => {
    setLoadingLore(true);
    try {
      const lore = await generateCardLore(card.name, card.element);
      setCard(prev => ({
        ...prev,
        ...lore
      }));
    } catch (error) {
      console.error("設定生成に失敗しました:", error);
      alert("AIによる設定生成に失敗しました。");
    } finally {
      setLoadingLore(false);
    }
  };

  const handleGenerateImage = async () => {
    setLoadingImage(true);
    try {
      const imageUrl = await generateCardIllustration(card.name, card.element);
      if (imageUrl) {
        setCard(prev => ({ ...prev, imageUrl }));
      }
    } catch (error) {
      console.error("イラスト生成に失敗しました:", error);
      alert("AIによるイラスト生成に失敗しました。");
    } finally {
      setLoadingImage(false);
    }
  };

  const downloadCard = async () => {
    if (cardRef.current === null) return;
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        pixelRatio: 3,
        backgroundColor: 'transparent',
      });
      const link = document.createElement('a');
      link.download = `TCG_${card.name || 'card'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("画像の保存に失敗しました:", error);
      alert("エラーが発生しました。");
    }
  };

  const downloadIllustration = () => {
    if (!card.imageUrl) return;
    const link = document.createElement('a');
    link.download = `ART_${card.name || 'illustration'}.png`;
    link.href = card.imageUrl;
    link.click();
  };

  const handleAppBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAppBgImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col items-center pb-12 overflow-x-hidden">
      {/* Dynamic App Background */}
      <div 
        className="fixed inset-0 z-[-1] bg-slate-950 transition-all duration-700 ease-in-out"
        style={{
          backgroundImage: appBgImage ? `url(${appBgImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: appBgImage ? 'brightness(0.3) blur(4px)' : 'none'
        }}
      >
        {!appBgImage && (
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#1e293b,transparent)]"></div>
        )}
      </div>

      {/* Header */}
      <header className="w-full py-4 px-8 flex justify-between items-center border-b border-white/5 bg-slate-900/40 backdrop-blur-2xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-800 rounded-xl flex items-center justify-center shadow-lg border border-white/20">
             <span className="font-tcg-title text-2xl font-black text-white">F</span>
          </div>
          <div>
            <h1 className="font-tcg-modern text-xl tracking-tighter leading-none font-black text-white">TCG FORGE</h1>
            <p className="text-[9px] text-indigo-400 uppercase tracking-widest font-black mt-1">Sin & Emotion Engine</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <label className="hidden md:flex items-center gap-2 cursor-pointer px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 rounded-full transition text-xs font-bold">
            背景変更
            <input type="file" accept="image/*" onChange={handleAppBgChange} className="hidden" />
          </label>
          <button 
            onClick={downloadCard}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-black rounded-full hover:bg-indigo-500 transition shadow-xl shadow-indigo-900/40 text-xs uppercase tracking-wider border border-white/20"
          >
            カードを保存
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="container mx-auto px-4 mt-10 flex flex-col lg:flex-row items-start justify-center gap-12 max-w-7xl">
        {/* Left: Preview Area */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black mb-1 font-tcg-title tracking-tight text-white drop-shadow-lg">PREVIEW</h2>
            <div className="h-1.5 w-16 bg-indigo-500 mx-auto rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
          </div>
          
          <div className="sticky top-32 flex flex-col items-center">
            <CardPreview card={card} />
            
            <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-[340px]">
               <button 
                onClick={downloadIllustration}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-xl text-[11px] font-bold hover:bg-slate-800 transition shadow-lg"
               >
                 イラストのみ保存
               </button>
               <div className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-xl text-[11px] font-bold shadow-lg">
                 <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                 HD出力対応
               </div>
            </div>
          </div>
        </div>

        {/* Right: Controls Area */}
        <div className="w-full lg:w-1/2">
           <ControlPanel 
              card={card} 
              setCard={setCard} 
              onGenerateLore={handleGenerateLore}
              onGenerateImage={handleGenerateImage}
              isLoadingLore={loadingLore}
              isLoadingImage={loadingImage}
           />
        </div>
      </main>

      {/* Hidden container for rendering at high res */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
         <div ref={cardRef}>
            <CardPreview card={card} />
         </div>
      </div>
    </div>
  );
};

export default App;
