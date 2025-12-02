export enum Tab {
  HOME = 'HOME',
  SERVICES = 'SERVICES',
  FOOD = 'FOOD',
  COMMUNITY = 'COMMUNITY',
  AI_HELP = 'AI_HELP'
}

export interface StationUpdate {
  id: string;
  type: 'ISSUE' | 'INFO' | 'CROWD';
  text: string;
  upvotes: number;
  timestamp: Date;
  location: string; // e.g., "Platform 4 near Escalator"
  severity?: 'LOW' | 'MEDIUM' | 'HIGH';
  user?: string;
  userRank?: string;
}

export interface ServiceBooking {
  id: string;
  type: 'COOLIE' | 'WHEELCHAIR' | 'CLOAKROOM';
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED';
  details: string;
  price: number;
}

export interface FoodItem {
  id: string;
  name: string;
  restaurant: string;
  price: number;
  prepTimeMinutes: number;
  rating: number;
  image: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  rank: string; // 'Scout', 'Guide', 'Guardian', 'Legend'
  helps: number;
  avatar: string;
}