import React, { useState } from 'react';
import { DOOM_POSTS } from '../data/gameContent';
import { DoomPost } from '../types';
import { sounds } from '../utils/audio';
import { Heart, MessageCircle, Share2, Sparkles, AlertTriangle } from 'lucide-react';

interface Props {
  onScrollDopamine: (dopamine: number, iqCost: number) => void;
}

export const DoomScrollFeed: React.FC<Props> = ({ onScrollDopamine }) => {
  const [posts, setPosts] = useState<DoomPost[]>(DOOM_POSTS);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const loadMorePosts = () => {
    sounds.metalPipe();
    const shuffled = [...DOOM_POSTS].sort(() => Math.random() - 0.5);
    const newItems = shuffled.map((p, idx) => ({
      ...p,
      id: `${p.id}-${Date.now()}-${idx}`,
      likes: `${Math.floor(Math.random() * 900 + 100)}K`,
    }));

    setPosts((prev) => [...newItems, ...prev.slice(0, 10)]);
    onScrollDopamine(250, 6);
  };

  const handleLike = (post: DoomPost) => {
    sounds.airhorn();
    setLikedPosts((prev) => ({ ...prev, [post.id]: true }));
    onScrollDopamine(post.rewardDopamine, post.iqLost);
  };

  const handleShare = () => {
    sounds.vineBoom();
    onScrollDopamine(400, 10);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950/80 rounded-2xl border border-zinc-800 p-3 sm:p-4 overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📱</span>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Бездномерная Лента Думскролла
            </h3>
            <p className="text-[11px] text-zinc-400">Листай, деградируй, теряй остатки мыслей</p>
          </div>
        </div>

        <button
          id="btn-doomscroll-more"
          onClick={loadMorePosts}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-pink-600/30 active:scale-95 transition-all flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Ещё контента!</span>
        </button>
      </div>

      {/* Feed container */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scroll">
        {posts.map((post) => {
          const isLiked = likedPosts[post.id];

          return (
            <div
              key={post.id}
              className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800/90 hover:border-zinc-700 transition-all flex flex-col gap-2.5 shadow-sm"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-lg border border-zinc-700">
                    {post.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200">{post.author}</h4>
                    <span className="text-[10px] text-zinc-500">{post.handle}</span>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800/90 text-amber-400 font-bold border border-zinc-700 flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  -{post.iqLost} IQ
                </span>
              </div>

              {/* Post Body */}
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">{post.text}</p>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs text-zinc-400">
                <button
                  onClick={() => handleLike(post)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
                    isLiked ? 'text-rose-500 font-black' : 'hover:text-rose-400 hover:bg-zinc-800'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                  <span>{post.likes}</span>
                </button>

                <div className="flex items-center gap-1.5 px-2 py-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments}</span>
                </div>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:text-cyan-400 hover:bg-zinc-800 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{post.shares}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
