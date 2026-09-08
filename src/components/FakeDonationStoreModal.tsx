import React, { useState } from 'react';
import { FAKE_DONATE_STORE } from '../data/gameContent';
import { FakeDonationItem } from '../types';
import { sounds } from '../utils/audio';
import { ShoppingBag, X, Check, DollarSign } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDonatePurchase: (dopamineBoost: number) => void;
}

export const FakeDonationStoreModal: React.FC<Props> = ({ isOpen, onClose, onDonatePurchase }) => {
  const [items, setItems] = useState<FakeDonationItem[]>(FAKE_DONATE_STORE);
  const [receiptToast, setReceiptToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBuy = (item: FakeDonationItem) => {
    sounds.chaChing();
    sounds.fart();

    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, purchased: true } : i))
    );

    setReceiptToast(item.cynicalComment);
    onDonatePurchase(50000);

    setTimeout(() => {
      setReceiptToast(null);
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-zinc-900 border-2 border-fuchsia-600/70 p-6 shadow-2xl shadow-fuchsia-600/20 text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-fuchsia-600/20 border border-fuchsia-500 flex items-center justify-center text-2xl">
            💎
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              Магазин Безумного Доната
              <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-black">СКАМ 100%</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Слей сюда всё наследство бабушки ради абсолютно бесполезных виртуальных пикселей!
            </p>
          </div>
        </div>

        {/* Receipt Alert Toast */}
        {receiptToast && (
          <div className="mb-4 p-3 rounded-xl bg-fuchsia-950 border border-fuchsia-500 text-xs font-bold text-fuchsia-200 flex items-center gap-2 animate-bounce">
            <span>📢</span>
            <span>{receiptToast}</span>
          </div>
        )}

        {/* Shop Items List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scroll">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl p-2 rounded-lg bg-zinc-900 border border-zinc-800">{item.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-white">{item.title}</h4>
                    <span className="text-xs font-black text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                      {item.priceStr}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{item.desc}</p>
                  <p className="text-[11px] font-bold text-fuchsia-400 mt-1">Бонус: {item.perk}</p>
                </div>
              </div>

              <button
                onClick={() => handleBuy(item)}
                className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shrink-0 ${
                  item.purchased
                    ? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    : 'bg-gradient-to-r from-fuchsia-600 to-rose-600 hover:from-fuchsia-500 hover:to-rose-500 text-white shadow-lg shadow-fuchsia-600/30 active:scale-95'
                }`}
              >
                {item.purchased ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Куплено (Лох)</span>
                  </>
                ) : (
                  <>
                    <DollarSign className="w-4 h-4" />
                    <span>Купить фейк</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>* Все покупки списывают 0 реальных рублей, но 100% вашего чувства собственного достоинства.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
