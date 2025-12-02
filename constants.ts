import { FoodItem, StationUpdate, LeaderboardUser } from './types';

export const MOCK_PNR = "8421039482";
export const TRAIN_NUMBER = "12951 - Rajdhani Express";
export const CURRENT_STATION = "New Delhi (NDLS)";
export const NEXT_STATION = "Kota Jn (KOTA)";

export const INITIAL_UPDATES: StationUpdate[] = [
  {
    id: '1',
    type: 'ISSUE',
    text: 'Escalator on Platform 4 is not working. Use the stairs near Coach A1.',
    upvotes: 45,
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    location: 'Platform 4',
    severity: 'HIGH',
    user: 'Amit Kumar',
    userRank: 'Guardian'
  },
  {
    id: '2',
    type: 'INFO',
    text: 'Water cooler near Waiting Room has chilled water now.',
    upvotes: 12,
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    location: 'Main Hall',
    severity: 'LOW',
    user: 'Sneha Singh',
    userRank: 'Scout'
  },
  {
    id: '3',
    type: 'CROWD',
    text: 'Huge rush at the main exit due to security check.',
    upvotes: 89,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    location: 'Exit Gate 2',
    severity: 'MEDIUM',
    user: 'Rahul V.',
    userRank: 'Guide'
  }
];

export const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { id: 'u1', name: 'Amit Kumar', points: 1250, rank: 'Guardian', helps: 342, avatar: '👨🏽' },
  { id: 'u2', name: 'Priya Sharma', points: 980, rank: 'Guide', helps: 215, avatar: '👩🏻' },
  { id: 'u3', name: 'Rajesh Koothrappali', points: 850, rank: 'Guide', helps: 180, avatar: '👨🏻' },
  { id: 'u4', name: 'Simran K.', points: 620, rank: 'Scout', helps: 95, avatar: '👩🏽' },
  { id: 'u5', name: 'Vikram Batra', points: 540, rank: 'Scout', helps: 82, avatar: '👨🏽' }
];

export const RESTAURANTS: FoodItem[] = [
  {
    id: 'f1',
    name: 'Spicy Paneer Wrap',
    restaurant: 'Station Tikka House',
    price: 180,
    prepTimeMinutes: 15,
    rating: 4.5,
    image: 'https://picsum.photos/200/200?random=1'
  },
  {
    id: 'f2',
    name: 'Veg Biryani Combo',
    restaurant: 'Royal Kitchens',
    price: 250,
    prepTimeMinutes: 25,
    rating: 4.2,
    image: 'https://picsum.photos/200/200?random=2'
  },
  {
    id: 'f3',
    name: 'Masala Dosa',
    restaurant: 'South Express',
    price: 120,
    prepTimeMinutes: 10,
    rating: 4.8,
    image: 'https://picsum.photos/200/200?random=3'
  },
  {
    id: 'f4',
    name: 'Chole Bhature',
    restaurant: 'Delhi Delights',
    price: 150,
    prepTimeMinutes: 20,
    rating: 4.6,
    image: 'https://picsum.photos/200/200?random=4'
  }
];

export const TRANSLATIONS = {
  EN: {
    nav: { home: 'Home', services: 'Services', food: 'Food', community: 'Waze', ai: 'Sahayak' },
    home: { 
      runningStatus: 'Running On Time', 
      approaching: 'Approaching', 
      departed: 'Departed',
      nextStop: 'Next Stop', 
      quickActions: 'Quick Actions',
      bookCoolie: 'Book Coolie',
      orderFood: 'Order Food',
      platformIntel: 'Platform Intel',
      askSahayak: 'Ask Sahayak',
      alarm: 'Destination Alarm'
    },
    services: {
      title: 'Station Services',
      subtitle: 'Book certified porters and assistance instantly.',
      coolie: 'Coolie',
      wheelchair: 'Wheelchair',
      cloak: 'Cloak Room'
    },
    food: {
      title: 'Hyperlocal Delivery',
      subtitle: 'Order from top rated outlets near upcoming station.',
      prep: 'Prep',
      total: 'Total',
      checkout: 'Checkout'
    },
    community: {
      liveAlerts: 'Live Alerts',
      topSahayaks: 'Top Sahayaks',
      reportIssue: 'Report Issue'
    }
  },
  HI: {
    nav: { home: 'मुख्य पृष्ठ', services: 'सेवाएं', food: 'खाना', community: 'अपडेट्स', ai: 'सहायक' },
    home: { 
      runningStatus: 'समय पर है', 
      approaching: 'पहुंच रही है', 
      departed: 'प्रस्थान किया',
      nextStop: 'अगला स्टेशन', 
      quickActions: 'सुविधाएं',
      bookCoolie: 'कुली बुक करें',
      orderFood: 'खाना आर्डर करें',
      platformIntel: 'प्लेटफ़ॉर्म जानकारी',
      askSahayak: 'सहायक से पूछें',
      alarm: 'स्टेशन अलार्म'
    },
    services: {
      title: 'स्टेशन सेवाएं',
      subtitle: 'प्रमाणित कुली और सहायता तुरंत बुक करें।',
      coolie: 'कुली',
      wheelchair: 'व्हीलचेयर',
      cloak: 'अमानती सामान घर'
    },
    food: {
      title: 'भोजन वितरण',
      subtitle: 'अगले स्टेशन के पास के रेस्तरां से आर्डर करें।',
      prep: 'तैयारी',
      total: 'कुल योग',
      checkout: 'भुगतान करें'
    },
    community: {
      liveAlerts: 'ताज़ा खबरें',
      topSahayaks: 'शीर्ष सहायक',
      reportIssue: 'रिपोर्ट करें'
    }
  }
};