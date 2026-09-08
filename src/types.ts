export interface Upgrade {
  id: string;
  name: string;
  desc: string;
  baseCost: number;
  cost: number;
  dps: number; // dopamine per second
  iqDrain: number; // IQ lost per purchase
  count: number;
  icon: string;
  quote: string;
}

export interface DoomPost {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  text: string;
  mediaType: 'text' | 'rage' | 'crypto' | 'conspiracy' | 'altushka' | 'sigma' | 'skuf';
  likes: string;
  comments: string;
  shares: string;
  rewardDopamine: number;
  iqLost: number;
}

export interface FakeDonationItem {
  id: string;
  title: string;
  priceStr: string;
  desc: string;
  perk: string;
  icon: string;
  purchased: boolean;
  cynicalComment: string;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
}
