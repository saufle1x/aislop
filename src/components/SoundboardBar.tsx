import React, { useState } from 'react';
import { sounds } from '../utils/audio';
import { Volume2, VolumeX, Music, Flame } from 'lucide-react';

export const SoundboardBar: React.FC = () => {
  const [muted, setMuted] = useState(!sounds.enabled);
  const [phonkActive, setPhonkActive] = useState(sounds.isPhonkPlaying);

  const toggleMute = () => {
    sounds.enabled = !sounds.enabled;
    setMuted(!sounds.enabled);
    if (!sounds.enabled && phonkActive) {
      sounds.togglePhonk(false);
      setPhonkActive(false);
    }
  };

  const togglePhonk = () => {
    if (muted) return;
    const active = sounds.togglePhonk();
    setPhonkActive(!!active);
  };

  return (
    <div id="soundboard-bar" className="w-full bg-zinc-900/95 border-b border-zinc-800 p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-md">
      <div className="flex items-center gap-2">
        <button
          id="btn-toggle-mute"
          onClick={toggleMute}
          title={muted ? 'Включить звук' : 'Выключить звук'}
          className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all ${
            muted
              ? 'bg-red-950/80 border-red-700 text-red-300'
              : 'bg-emerald-950/80 border-emerald-700 text-emerald-300 hover:bg-emerald-900/80'
          }`}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{muted ? 'Звук: ВЫКЛ' : 'Звук: ВКЛ'}</span>
        </button>

        <button
          id="btn-toggle-phonk"
          onClick={togglePhonk}
          disabled={muted}
          className={`px-3 py-1.5 rounded-lg border text-xs font-black flex items-center gap-1.5 transition-all ${
            phonkActive
              ? 'bg-fuchsia-600 border-fuchsia-400 text-white animate-pulse shadow-lg shadow-fuchsia-600/50'
              : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>{phonkActive ? 'ФОНК: ВРУБЛЕН 🔊' : 'ВРУБИТЬ ФОНК 🎵'}</span>
        </button>
      </div>

      {/* Instant meme sound buttons */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] font-bold text-zinc-400 hidden sm:inline flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-amber-500" /> Саундборд:
        </span>
        <button
          id="sfx-vine-boom"
          onClick={() => sounds.vineBoom()}
          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-zinc-700 text-xs font-black active:scale-95 transition-transform"
        >
          💥 Vine Boom
        </button>
        <button
          id="sfx-metal-pipe"
          onClick={() => sounds.metalPipe()}
          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-cyan-400 border border-zinc-700 text-xs font-black active:scale-95 transition-transform"
        >
          🪵 Труба
        </button>
        <button
          id="sfx-airhorn"
          onClick={() => sounds.airhorn()}
          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-rose-400 border border-zinc-700 text-xs font-black active:scale-95 transition-transform"
        >
          🎺 Airhorn
        </button>
        <button
          id="sfx-fart"
          onClick={() => sounds.fart()}
          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-lime-400 border border-zinc-700 text-xs font-black active:scale-95 transition-transform"
        >
          💨 Пук
        </button>
        <button
          id="sfx-bruh"
          onClick={() => sounds.bruh()}
          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-purple-400 border border-zinc-700 text-xs font-black active:scale-95 transition-transform"
        >
          🗿 Bruh
        </button>
      </div>
    </div>
  );
};
