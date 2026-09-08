import React, { useState } from 'react';
import { sounds } from '../utils/audio';
import { Gift, Sparkles, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onWin: (dopamine: number, iqChange: number, rewardTitle: string) => void;
}

const ROULETTE_REWARDS = [
  { title: 'РЕДКИЙ СКИБИДИ МУСОР', dopamine: 1000, iq: -10, icon: '🚽' },
  { title: 'ПУСТАЯ БАНКА ИЗ-ПОД ПИВА', dopamine: 450, iq: -5, icon: '🍺' },
  { title: 'ФОНК РЕМИКС 10 ЧАСОВ', dopamine: 2500, iq: -25, icon: '🎧' },
  { title: 'ПОХВАЛА ОТ АНОНИМА В ИНТЕРНЕТЕ', dopamine: 5000, iq: -50, icon: '💬' },
  { title: 'АБСОЛЮТНОЕ НИЧЕГО', dopamine: 100, iq: 0, icon: '🕳️' },
  { title: 'СИГМА ВЗГЛЯД +9999 АУРЫ', dopamine: 10000, iq: -100, icon: '🗿' },
];

export const DopamineRouletteModal: React.FC<Props> = ({ isOpen, onClose, onWin }) => {
  const [spinning, setSpinning] = useState(false);
  const [wonItem, setWonItem] = useState<{ title: string; dopamine: number; iq: number; icon: string } | null>(null);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setWonItem(null);
    sounds.airhorn();

    let count = 0;
    const interval = setInterval(() => {
      sounds.slap();
      count++;
      if (count >= 12) {
        clearInterval(interval);
        const randomReward = ROULETTE_REWARDS[Math.floor(Math.random() * ROULETTE_REWARDS.length)];
        setWonItem(randomReward);
        setSpinning(false);
        sounds.chaChing();
        sounds.vineBoom();
        onWin(randomReward.dopamine, randomReward.iq, randomReward.title);
      }
    }, 110);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-amber-500/80 p-6 shadow-2xl shadow-amber-500/20 text-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl animate-bounce">
          🎰
        </div>

        <h3 className="text-xl font-black text-amber-400 uppercase tracking-wider mb-1">
          ХАЛЯВНЫЙ ДОФАМИНОВЫЙ ЛУТБОКС!
        </h3>
        <p className="text-xs text-zinc-400 mb-6">
          Крути колесо деградации! 100% гарантия снижения когнитивных способностей.
        </p>

        {wonItem ? (
          <div className="mb-6 p-4 rounded-xl bg-zinc-800/90 border-2 border-emerald-500 animate-scale-up">
            <div className="text-4xl mb-2">{wonItem.icon}</div>
            <div className="text-xs font-bold text-zinc-400">ВАШ ДЕШЕВЫЙ ПРИЗ:</div>
            <div className="text-lg font-black text-white">{wonItem.title}</div>
            <div className="mt-2 text-sm font-black text-emerald-400">
              +{wonItem.dopamine.toLocaleString()} Дофамина!
            </div>
            {wonItem.iq < 0 && (
              <div className="text-xs font-bold text-rose-400">{wonItem.iq} к интеллекту</div>
            )}
          </div>
        ) : (
          <div className="mb-6 py-6 px-4 rounded-xl bg-zinc-800/40 border border-zinc-700/60 flex flex-col items-center justify-center">
            <div className="text-3xl mb-1">{spinning ? '🔄' : '🎁'}</div>
            <div className="text-xs font-semibold text-zinc-400">
              {spinning ? 'ВЫЧИСЛЯЕМ УРОВЕНЬ СКУФИЗАЦИИ...' : 'Нажми кнопку ниже, чтобы забрать дозу'}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            id="btn-spin-roulette"
            onClick={handleSpin}
            disabled={spinning}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-zinc-950 font-black uppercase text-sm tracking-wider shadow-lg shadow-orange-500/30 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{spinning ? 'КРУТИМ...' : wonItem ? 'КРУТИТЬ ЕЩЁ РАЗ!' : 'КРУТИТЬ РУЛЕТКУ!'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
