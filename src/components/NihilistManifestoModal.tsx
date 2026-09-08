import React from 'react';
import { NIHILIST_DESIGN_DOC } from '../data/gameContent';
import { X, FileText, Skull, Zap } from 'lucide-react';
import { sounds } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NihilistManifestoModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-zinc-950 border-2 border-red-600/80 shadow-2xl shadow-red-900/40 text-left overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-red-950/80 to-zinc-900 border-b border-red-900/60 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 border-2 border-red-500 flex items-center justify-center text-2xl shrink-0">
              <Skull className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded bg-red-600 text-white">
                  TOP SECRET / СТРОГО 18+
                </span>
                <span className="text-[10px] uppercase font-mono text-zinc-400">
                  Документ для совета директоров
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wide mt-1">
                {NIHILIST_DESIGN_DOC.title}
              </h2>
              <p className="text-xs text-red-400 font-semibold">{NIHILIST_DESIGN_DOC.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scroll text-zinc-300 font-sans leading-relaxed">
          <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/50 text-xs sm:text-sm text-red-200 flex items-center gap-3">
            <Zap className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <span className="font-bold">Автор: </span>
              {NIHILIST_DESIGN_DOC.author}.
              <br />
              <span className="text-zinc-400 text-xs">
                «Мы не делаем искусство. Мы превращаем время живых людей в дофаминовый шлак и рекламную выручку».
              </span>
            </div>
          </div>

          {NIHILIST_DESIGN_DOC.sections.map((sec, idx) => (
            <div
              key={sec.id}
              className="p-4 sm:p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <h3 className="text-sm sm:text-base font-black text-amber-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-zinc-800 text-amber-400 flex items-center justify-center text-xs font-mono">
                  {idx + 1}
                </span>
                {sec.heading}
              </h3>
              <div className="text-xs sm:text-sm whitespace-pre-line text-zinc-300">
                {sec.content}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between gap-4">
          <button
            onClick={() => {
              sounds.vineBoom();
            }}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 flex items-center gap-1.5"
          >
            💥 Звук одобрения нигилиста
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all active:scale-95"
          >
            Вернуться к деградации
          </button>
        </div>
      </div>
    </div>
  );
};
