import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_UPGRADES } from './data/gameContent';
import { Upgrade, FloatingText } from './types';
import { sounds } from './utils/audio';
import { SoundboardBar } from './components/SoundboardBar';
import { SoapAndSubwayCanvas } from './components/SoapAndSubwayCanvas';
import { DoomScrollFeed } from './components/DoomScrollFeed';
import { DopamineRouletteModal } from './components/DopamineRouletteModal';
import { FakeDonationStoreModal } from './components/FakeDonationStoreModal';
import { NihilistManifestoModal } from './components/NihilistManifestoModal';
import {
  Sparkles,
  ShoppingBag,
  FileText,
  Gift,
  Flame,
  Zap,
  TrendingDown,
  Skull,
  Award,
  RefreshCw,
} from 'lucide-react';

export default function App() {
  // Game State
  const [dopamine, setDopamine] = useState<number>(() => {
    const saved = localStorage.getItem('brainrot_dopamine');
    return saved ? parseFloat(saved) : 0;
  });

  const [iq, setIq] = useState<number>(() => {
    const saved = localStorage.getItem('brainrot_iq');
    return saved ? parseInt(saved, 10) : 120;
  });

  const [upgrades, setUpgrades] = useState<Upgrade[]>(() => {
    const saved = localStorage.getItem('brainrot_upgrades');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_UPGRADES;
      }
    }
    return INITIAL_UPGRADES;
  });

  const [combo, setCombo] = useState<number>(0);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [avatarMode, setAvatarMode] = useState<'skuf' | 'sigma' | 'cat' | 'toilet'>('skuf');

  // Modals State
  const [showRoulette, setShowRoulette] = useState<boolean>(false);
  const [showShop, setShowShop] = useState<boolean>(false);
  const [showManifesto, setShowManifesto] = useState<boolean>(false);

  // Active View Tab on smaller screens
  const [activeTab, setActiveTab] = useState<'game' | 'feed' | 'upgrades'>('game');

  const comboTimerRef = useRef<number | null>(null);

  // Calculate DPS (Dopamine Per Second)
  const dps = upgrades.reduce((sum, u) => sum + u.dps * u.count, 0);

  // Click multiplier from combo
  const clickPower = Math.max(1, 1 + Math.floor(combo / 5) * 2 + Math.floor(dps * 0.05));

  // Save to localStorage periodically
  useEffect(() => {
    localStorage.setItem('brainrot_dopamine', dopamine.toString());
    localStorage.setItem('brainrot_iq', iq.toString());
    localStorage.setItem('brainrot_upgrades', JSON.stringify(upgrades));
  }, [dopamine, iq, upgrades]);

  // Idle tick loop (every 100ms)
  useEffect(() => {
    const timer = setInterval(() => {
      if (dps > 0) {
        setDopamine((prev) => prev + dps / 10);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [dps]);

  // Sudden Dopamine Pop-up (every 50s random surprise)
  useEffect(() => {
    const popupTimer = setInterval(() => {
      setShowRoulette(true);
      sounds.airhorn();
    }, 50000);
    return () => clearInterval(popupTimer);
  }, []);

  // Avatar click handler
  const handleAvatarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Audio effect
    try {
      const sfx = [sounds.slap, sounds.vineBoom, sounds.bruh, sounds.fart];
      const pickSfx = sfx[Math.floor(Math.random() * sfx.length)];
      pickSfx.call(sounds);
    } catch {
      // safe fallback
    }

    // Screen Shake
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 200);

    // Combo system
    setCombo((c) => c + 1);
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = window.setTimeout(() => setCombo(0), 1800);

    // Dopamine gain
    const gained = clickPower;
    setDopamine((d) => d + gained);

    // IQ loss!
    if (Math.random() > 0.4) {
      setIq((prev) => prev - 1);
    }

    // Spawn floating text safely with coordinate fallbacks
    const rect = e.currentTarget.getBoundingClientRect();
    const x =
      (e.clientX && e.clientX > 0 ? e.clientX - rect.left : rect.width / 2) +
      (Math.random() * 40 - 20);
    const y =
      (e.clientY && e.clientY > 0 ? e.clientY - rect.top : rect.height / 2) - 20;

    const funnyWords = ['+ДОФАМИН!', 'СИГМА!', 'СКУФ УДАР!', 'КРИНЖ!', 'БАЗА!', 'АЛЬТУШКА!', 'ЧУШПАН!', 'РИЗЗ!'];
    const textLabel = combo > 5 && Math.random() > 0.5 
      ? funnyWords[Math.floor(Math.random() * funnyWords.length)]
      : `+${gained}`;

    const newFloat: FloatingText = {
      id: Date.now() + Math.random(),
      x,
      y,
      text: textLabel,
      color: combo > 10 ? '#f43f5e' : combo > 5 ? '#f59e0b' : '#38bdf8',
    };

    setFloatingTexts((prev) => [...prev.slice(-15), newFloat]);
  };

  // Buy upgrade
  const handleBuyUpgrade = (upgrade: Upgrade) => {
    if (dopamine < upgrade.cost) return;

    sounds.chaChing();
    setDopamine((prev) => prev - upgrade.cost);
    setIq((prev) => prev - upgrade.iqDrain);

    setUpgrades((prev) =>
      prev.map((u) => {
        if (u.id === upgrade.id) {
          const nextCount = u.count + 1;
          const nextCost = Math.floor(u.baseCost * Math.pow(1.22, nextCount));
          return { ...u, count: nextCount, cost: nextCost };
        }
        return u;
      })
    );
  };

  // Reset progress button
  const handleReset = () => {
    if (confirm('Сбросить весь накопленный мусор и вернуть свой чистый мозг?')) {
      sounds.metalPipe();
      setDopamine(0);
      setIq(120);
      setUpgrades(INITIAL_UPGRADES);
      localStorage.clear();
    }
  };

  // Avatar Icons map
  const avatarVisuals = {
    skuf: {
      emoji: '🧔‍♂️',
      name: 'Скуф Обыкновенный',
      sub: 'В майке-алкоголичке у телевизора',
      bg: 'from-amber-700/40 via-orange-800/30 to-zinc-900',
    },
    sigma: {
      emoji: '🗿',
      name: 'Патрик Сигмач',
      sub: 'Суровый взгляд под бразильский фонк',
      bg: 'from-purple-900/50 via-indigo-900/40 to-zinc-900',
    },
    cat: {
      emoji: '🐱',
      name: 'Мяукающий Дегенерат',
      sub: 'Крутит головой без остановки',
      bg: 'from-pink-900/50 via-rose-900/40 to-zinc-900',
    },
    toilet: {
      emoji: '🚽',
      name: 'Скибиди Сингулярность',
      sub: 'Апогей интернет-деградации',
      bg: 'from-cyan-900/50 via-blue-900/40 to-zinc-900',
    },
  };

  return (
    <div className={`min-h-screen flex flex-col bg-zinc-950 text-zinc-100 ${isShaking ? 'screen-shake' : ''}`}>
      {/* Top Meme Soundboard & Phonk Loop Bar */}
      <SoundboardBar />

      {/* Main Top Header */}
      <header className="px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-xl shadow-lg shadow-rose-600/30 font-unbounded">
            ☣️
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-fuchsia-400 font-unbounded">
              СИМУЛЯТОР ДЕГРАДАЦИИ 3000
            </h1>
            <p className="text-[10px] text-zinc-400 flex items-center gap-2">
              <span>Жанр: Чистый Брейнрот</span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span className="text-emerald-400 font-bold animate-pulse">● Онлайн: 142 981 зомби</span>
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="btn-open-roulette"
            onClick={() => setShowRoulette(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-zinc-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Gift className="w-4 h-4 animate-bounce" />
            <span className="hidden sm:inline">Халявный</span> Лутбокс
          </button>

          <button
            id="btn-open-shop"
            onClick={() => setShowShop(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-fuchsia-600/20 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Донат</span>
          </button>

          <button
            id="btn-open-manifesto"
            onClick={() => setShowManifesto(true)}
            className="px-3 py-1.5 rounded-xl bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700/80 text-xs font-black uppercase tracking-wider active:scale-95 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-red-400" />
            <span>Дизайн-Док Нигилиста</span>
          </button>
        </div>
      </header>

      {/* Metrics Dash */}
      <div className="px-4 py-2.5 bg-zinc-900/50 border-b border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
        {/* Metric 1: Dopamine */}
        <div className="p-2 rounded-xl bg-zinc-900/80 border border-amber-500/30">
          <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" /> Дофамин (НГ)
          </span>
          <div className="text-lg sm:text-xl font-black text-amber-300 font-unbounded truncate">
            {Math.floor(dopamine).toLocaleString()}
          </div>
        </div>

        {/* Metric 2: DPS */}
        <div className="p-2 rounded-xl bg-zinc-900/80 border border-emerald-500/30">
          <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center justify-center gap-1">
            <Zap className="w-3 h-3" /> Приток / сек
          </span>
          <div className="text-lg sm:text-xl font-black text-emerald-300 font-unbounded">
            +{dps.toLocaleString()}/с
          </div>
        </div>

        {/* Metric 3: IQ Drain */}
        <div className={`p-2 rounded-xl border transition-colors ${
          iq < 0 ? 'bg-red-950/60 border-red-500 text-red-400 animate-pulse' : 'bg-zinc-900/80 border-rose-500/30'
        }`}>
          <span className="text-[10px] uppercase font-bold text-rose-400 flex items-center justify-center gap-1">
            <TrendingDown className="w-3 h-3" /> Уровень IQ
          </span>
          <div className="text-lg sm:text-xl font-black font-unbounded">
            {iq}
          </div>
          <span className="text-[9px] text-zinc-500 block -mt-0.5">
            {iq <= -50 ? 'ОКОНЧАТЕЛЬНО ОТУПЕЛ 💀' : iq <= 40 ? 'Уровень хлебушка' : 'Убывает с каждым тапом'}
          </span>
        </div>

        {/* Metric 4: Combo / Click Power */}
        <div className="p-2 rounded-xl bg-zinc-900/80 border border-cyan-500/30">
          <span className="text-[10px] uppercase font-bold text-cyan-400 flex items-center justify-center gap-1">
            <Flame className="w-3 h-3" /> Сила клика (x{clickPower})
          </span>
          <div className="text-lg sm:text-xl font-black text-cyan-300 font-unbounded">
            {combo > 0 ? `КОМБО x${combo}` : `+${clickPower}`}
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="flex md:hidden border-b border-zinc-800 bg-zinc-900/70 p-1">
        <button
          onClick={() => setActiveTab('game')}
          className={`flex-1 py-2 text-xs font-black uppercase rounded-lg transition-all ${
            activeTab === 'game' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400'
          }`}
        >
          🕹️ Тапалка
        </button>
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 py-2 text-xs font-black uppercase rounded-lg transition-all ${
            activeTab === 'feed' ? 'bg-purple-600 text-white' : 'text-zinc-400'
          }`}
        >
          📱 Думскролл
        </button>
        <button
          onClick={() => setActiveTab('upgrades')}
          className={`flex-1 py-2 text-xs font-black uppercase rounded-lg transition-all ${
            activeTab === 'upgrades' ? 'bg-rose-600 text-white' : 'text-zinc-400'
          }`}
        >
          ⚡ Апгрейды ({upgrades.filter((u) => dopamine >= u.cost).length})
        </button>
      </div>

      {/* Main Grid Content */}
      <main className="flex-1 p-3 sm:p-5 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        {/* LEFT / CENTER COLUMN: Clicker + Split-screen ASMR */}
        <section
          className={`md:col-span-7 flex flex-col gap-4 ${
            activeTab !== 'game' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Avatar Switcher Bar */}
          <div className="flex items-center justify-between bg-zinc-900/70 p-2 rounded-xl border border-zinc-800">
            <span className="text-xs font-bold text-zinc-400">Персонаж:</span>
            <div className="flex gap-1">
              {(['skuf', 'sigma', 'cat', 'toilet'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    sounds.slap();
                    setAvatarMode(mode);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                    avatarMode === mode
                      ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/30'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {avatarVisuals[mode].emoji} {avatarVisuals[mode].name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Core Interactive Clicker Box */}
          <div
            id="main-clicker-card"
            onClick={handleAvatarClick}
            className={`relative w-full h-[270px] sm:h-[310px] rounded-2xl bg-gradient-to-b ${avatarVisuals[avatarMode].bg} border-2 border-amber-500/60 p-6 flex flex-col items-center justify-center cursor-pointer select-none active:scale-[0.98] transition-all shadow-xl shadow-amber-500/10 overflow-hidden group`}
          >
            {/* Background Glitch & Concentric Rings */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              <div className="w-64 h-64 rounded-full border-4 border-amber-400/40 animate-ping" />
              <div className="w-96 h-96 rounded-full border-2 border-rose-500/30" />
            </div>

            {/* Click Instructions Tag */}
            <div className="absolute top-3 px-3 py-1 rounded-full bg-black/60 border border-white/20 text-[11px] font-black tracking-widest text-amber-300 uppercase animate-pulse pointer-events-none">
              ТАПАЙ НЕ ДУМАЯ! КАЖДЫЙ ТАП СЖИГАЕТ МОЗГ!
            </div>

            {/* Large Reacting Emoji Character */}
            <div className="relative text-7xl sm:text-8xl select-none transform transition-transform group-active:scale-90 group-hover:scale-105 filter drop-shadow-2xl pointer-events-none">
              {avatarVisuals[avatarMode].emoji}
            </div>

            <div className="mt-3 text-center pointer-events-none">
              <h2 className="text-base sm:text-lg font-black text-white font-unbounded">
                {avatarVisuals[avatarMode].name}
              </h2>
              <p className="text-xs text-zinc-400">{avatarVisuals[avatarMode].sub}</p>
            </div>

            {/* Combo Streak pill */}
            {combo > 3 && (
              <div className="absolute bottom-3 px-3 py-0.5 rounded-full bg-rose-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-600/50 animate-bounce pointer-events-none">
                🔥 КОМБО: x{combo}!
              </div>
            )}

            {/* Floating text particles on tap */}
            {floatingTexts.map((f) => (
              <div
                key={f.id}
                style={{ left: `${f.x}px`, top: `${f.y}px`, color: f.color }}
                className="absolute pointer-events-none font-black text-sm sm:text-base animate-float-up font-unbounded drop-shadow-md whitespace-nowrap z-20"
              >
                {f.text}
              </div>
            ))}
          </div>

          {/* Hypnotic TikTok Split-Screen: Soap Cutting & Subway Runner Canvas */}
          <SoapAndSubwayCanvas
            onInteract={(boost) => {
              setDopamine((d) => d + boost);
              if (Math.random() > 0.6) setIq((prev) => prev - 1);
            }}
          />
        </section>

        {/* RIGHT COLUMN: Upgrades Shop & Doomscroll Feed Tabs */}
        <section
          className={`md:col-span-5 flex flex-col gap-4 ${
            activeTab === 'game' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Sub Navigation on Desktop */}
          <div className="hidden md:flex p-1 bg-zinc-900 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveTab('upgrades')}
              className={`flex-1 py-1.5 text-xs font-black uppercase rounded-lg transition-all ${
                activeTab === 'upgrades' || activeTab === 'game'
                  ? 'bg-amber-500 text-zinc-950 shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ⚡ Апгрейды Деградации
            </button>
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex-1 py-1.5 text-xs font-black uppercase rounded-lg transition-all ${
                activeTab === 'feed'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              📱 Лента Думскролла
            </button>
          </div>

          {/* Tab 1: Upgrades View */}
          {(activeTab === 'upgrades' || activeTab === 'game') && (
            <div className="flex flex-col bg-zinc-950/80 rounded-2xl border border-zinc-800 p-3 sm:p-4 max-h-[580px] overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Магазин Атрофии Мозга
                  </h3>
                  <p className="text-[11px] text-zinc-400">Автоматизируй выработку мусора</p>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 font-bold">
                  +{dps}/сек
                </span>
              </div>

              {/* Upgrades List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scroll">
                {upgrades.map((upgrade) => {
                  const canAfford = dopamine >= upgrade.cost;

                  return (
                    <div
                      key={upgrade.id}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                        canAfford
                          ? 'bg-zinc-900/90 border-zinc-700/80 hover:border-amber-500/70 shadow-sm'
                          : 'bg-zinc-950/40 border-zinc-800/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-2xl p-1.5 rounded-lg bg-zinc-800 border border-zinc-700">
                          {upgrade.icon}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-black text-white">{upgrade.name}</h4>
                            {upgrade.count > 0 && (
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                x{upgrade.count}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400 line-clamp-1">{upgrade.desc}</p>
                          <div className="flex items-center gap-2 mt-1 text-[10px]">
                            <span className="font-bold text-emerald-400">+{upgrade.dps}/сек</span>
                            <span className="font-bold text-rose-400">-{upgrade.iqDrain} IQ</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBuyUpgrade(upgrade)}
                        disabled={!canAfford}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all shrink-0 ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 active:scale-95 shadow-md shadow-amber-500/20'
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        }`}
                      >
                        {upgrade.cost.toLocaleString()}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Endless Doomscroll Feed View */}
          {activeTab === 'feed' && (
            <div className="h-[580px]">
              <DoomScrollFeed
                onScrollDopamine={(dopamineReward, iqCost) => {
                  setDopamine((prev) => prev + dopamineReward);
                  setIq((prev) => prev - iqCost);
                }}
              />
            </div>
          )}
        </section>
      </main>

      {/* Footer disclaimer and Reset */}
      <footer className="px-4 py-3 bg-zinc-950 border-t border-zinc-800 text-center text-xs text-zinc-500 flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div>
          <span>⚠️ 100% Нигилистический геймдизайн. Без сюжета, без морали, без смысла.</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowManifesto(true)}
            className="text-red-400 hover:text-red-300 font-bold underline"
          >
            Читать манифест нигилиста
          </button>
          <button
            onClick={handleReset}
            className="text-zinc-500 hover:text-zinc-300 flex items-center gap-1 text-[11px]"
            title="Очистить прогресс"
          >
            <RefreshCw className="w-3 h-3" /> Сбросить прогресс
          </button>
        </div>
      </footer>

      {/* Modals */}
      <DopamineRouletteModal
        isOpen={showRoulette}
        onClose={() => setShowRoulette(false)}
        onWin={(rewardDopamine, iqCost) => {
          setDopamine((prev) => prev + rewardDopamine);
          setIq((prev) => prev + iqCost);
        }}
      />

      <FakeDonationStoreModal
        isOpen={showShop}
        onClose={() => setShowShop(false)}
        onDonatePurchase={(boost) => {
          setDopamine((prev) => prev + boost);
          setIq((prev) => prev - 50);
        }}
      />

      <NihilistManifestoModal
        isOpen={showManifesto}
        onClose={() => setShowManifesto(false)}
      />
    </div>
  );
}
