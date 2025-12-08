
import { LiveTrainData } from '../types';

// ============================================================================
// 🔌 REAL-TIME API CONFIGURATION
// ============================================================================
// INSTRUCTIONS:
// 1. Get your API Key if required by the provider.
// 2. Set USE_REAL_API = true
// 3. Paste your API_KEY below.
// ============================================================================

const USE_REAL_API = false; // ⚠️ TOGGLE THIS TO TRUE TO ENABLE LIVE API
const API_KEY = "";         // ⚠️ PASTE YOUR KEY HERE
const API_BASE_URL = "https://railradar.in/api/v1"; 

// ============================================================================
// 🚆 SIMULATION DATABASE (Fallback)
// ============================================================================

const MOCK_TRAINS: Record<string, { name: string; start: string; end: string; route: string[] }> = {
  '12951': { name: 'Mumbai Rajdhani', start: 'Mumbai Central', end: 'New Delhi', route: ['MMCT', 'ST', 'BRC', 'RTM', 'KOTA', 'NDLS'] },
  '12009': { name: 'Shatabdi Express', start: 'Mumbai Central', end: 'Ahmedabad Jn', route: ['MMCT', 'BVI', 'VAPI', 'ST', 'BH', 'BRC', 'ADI'] },
  '22436': { name: 'Vande Bharat Exp', start: 'New Delhi', end: 'Varanasi', route: ['NDLS', 'CNB', 'PRYJ', 'BSB'] },
  '12626': { name: 'Kerala Express', start: 'New Delhi', end: 'Trivandrum', route: ['NDLS', 'AGC', 'GWL', 'BPL', 'NGP', 'BZA', 'TVC'] },
  '12055': { name: 'Jan Shatabdi', start: 'Dehradun', end: 'New Delhi', route: ['DDN', 'HW', 'RK', 'MTC', 'NDLS'] },
  '12137': { name: 'Punjab Mail', start: 'Mumbai CST', end: 'Firozpur', route: ['CSMT', 'DR', 'NK', 'BSL', 'BPL', 'NDLS', 'FZR'] }
};

const STATIONS_DB = [
  { name: 'New Delhi', code: 'NDLS' },
  { name: 'Kota Jn', code: 'KOTA' },
  { name: 'Vadodara', code: 'BRC' },
  { name: 'Surat', code: 'ST' },
  { name: 'Mumbai Central', code: 'MMCT' },
  { name: 'Agra Cantt', code: 'AGC' },
  { name: 'Mathura Jn', code: 'MTJ' },
  { name: 'Ratlam Jn', code: 'RTM' },
  { name: 'Kanpur Central', code: 'CNB' },
  { name: 'Prayagraj', code: 'PRYJ' },
  { name: 'Varanasi', code: 'BSB' },
  { name: 'Bhopal', code: 'BPL' },
  { name: 'Nagpur', code: 'NGP' }
];

const getRandomStation = (excludeCodes: string[] = []) => {
    const filtered = STATIONS_DB.filter(s => !excludeCodes.includes(s.code));
    return filtered[Math.floor(Math.random() * filtered.length)];
};

// ============================================================================
// 🚀 SERVICE METHODS
// ============================================================================

/**
 * Fetches train status. Tries Real API first (if configured), falls back to Simulation.
 */
export const fetchLiveTrainStatus = async (input: string): Promise<LiveTrainData> => {
  if (USE_REAL_API) {
      try {
          const realData = await fetchRealApiData(input);
          return realData;
      } catch (error) {
          console.warn("⚠️ Real API failed or limit reached. Falling back to Simulation.", error);
          return generateSimulationData(input);
      }
  } else {
      // Simulate network latency for realism
      await new Promise(resolve => setTimeout(resolve, 800));
      return generateSimulationData(input);
  }
};

/**
 * Implementation for calling the external API based on RailRadar OpenAPI Spec
 */
async function fetchRealApiData(input: string): Promise<LiveTrainData> {
    // The API supports Train Number (5 digits).
    // If input is PNR (10 digits), we can't use this specific API endpoint directly to resolve PNR.
    // For this prototype, if PNR is passed, we default to a specific train number to show data, 
    // or you would need a separate PNR-to-Train API.
    const trainNo = input.length === 10 ? '12951' : input;

    // Based on OpenAPI: /api/v1/trains/{trainNumber}?dataType=live
    // Appending API Key as query param if needed (common pattern), though spec didn't explicitly show security scheme.
    const url = `${API_BASE_URL}/trains/${trainNo}?dataType=live&provider=railradar${API_KEY ? `&key=${API_KEY}` : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    
    // The response is a LiveTrainStatus object (or TrainData wrapper)
    // Structure based on schemas: LiveTrainStatus has currentLocation, route (array of LiveTrainStatusStop)
    
    const liveData = json.liveData || json; // Handle if wrapped in TrainData or direct
    const route = liveData.route || [];
    const currentLoc = liveData.currentLocation;
    
    // Find index of current station in the route
    const currentIdx = route.findIndex((stop: any) => stop.station.code === currentLoc?.stationCode);
    
    // Determine Stations
    const currentStop = currentIdx !== -1 ? route[currentIdx] : { station: { name: 'Unknown', code: 'UNK' } };
    const nextStop = (currentIdx !== -1 && currentIdx < route.length - 1) ? route[currentIdx + 1] : { station: { name: 'End of Line', code: 'END' } };
    const prevStop = (currentIdx > 0) ? route[currentIdx - 1] : { station: { name: 'Start', code: 'STR' } };

    // Calculate times
    const formatTime = (ts: number) => ts ? new Date(ts).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--';

    return {
        trainName: liveData.trainName || 'Express',
        trainNo: liveData.trainNumber || trainNo,
        pnr: input.length === 10 ? input : 'N/A',
        currentStation: {
            name: currentStop.station.name,
            code: currentStop.station.code,
            departureTime: currentStop.actualDeparture ? formatTime(currentStop.actualDeparture) : formatTime(currentStop.scheduledDeparture),
            platform: currentStop.platform || currentLoc?.platform || '?'
        },
        nextStation: {
            name: nextStop.station.name,
            code: nextStop.station.code,
            arrivalTime: nextStop.actualArrival ? formatTime(nextStop.actualArrival) : formatTime(nextStop.scheduledArrival),
            distanceKm: nextStop.distanceFromOriginKm - (currentStop.distanceFromOriginKm || 0),
            weather: '32°C ☀️' // API doesn't provide weather, mocking it
        },
        previousStation: {
            name: prevStop.station.name,
            code: prevStop.station.code,
            departureTime: prevStop.actualDeparture ? formatTime(prevStop.actualDeparture) : formatTime(prevStop.scheduledDeparture)
        },
        coachPosition: 'B5', // Not in this specific API endpoint
        status: (liveData.overallDelayMinutes > 15) ? 'DELAYED' : 'ON TIME',
        delayMinutes: liveData.overallDelayMinutes || 0,
        currentSpeed: 95, // Speed often not in basic live status, mocking realistic value
        timestamp: Date.now()
    };
}

/**
 * Advanced Simulation Engine
 */
function generateSimulationData(input: string): LiveTrainData {
  const isPnr = input.length === 10;
  // If input matches a known train, use it. Else default to Rajdhani
  const trainNoKey = Object.keys(MOCK_TRAINS).find(k => input.includes(k)) || '12951';
  const trainInfo = MOCK_TRAINS[trainNoKey];
  
  const current = getRandomStation();
  let next = getRandomStation([current.code]);
  let prev = getRandomStation([current.code, next.code]);

  // Realistic Status Calculation
  const randomChance = Math.random();
  const isDelayed = randomChance > 0.6; // 40% chance of delay
  const delay = isDelayed ? Math.floor(Math.random() * 120 + 15) : 0;
  
  // Speed based on delay (trying to make up time)
  const baseSpeed = isDelayed ? 110 : 90;
  const speed = Math.floor(Math.random() * 30 + baseSpeed); 

  return {
    trainName: trainInfo.name,
    trainNo: trainNoKey,
    pnr: isPnr ? input : Math.floor(Math.random() * 9000000000 + 1000000000).toString(),
    currentStation: {
      name: current.name,
      code: current.code,
      departureTime: isDelayed ? 'Delayed' : 'On Time',
      platform: Math.floor(Math.random() * 8 + 1).toString()
    },
    nextStation: {
      name: next.name,
      code: next.code,
      arrivalTime: 'In 45 mins',
      distanceKm: Math.floor(Math.random() * 100 + 10),
      weather: `${Math.floor(Math.random() * 15 + 20)}°C ${Math.random() > 0.5 ? '☀️' : '☁️'}`
    },
    previousStation: {
      name: prev.name,
      code: prev.code,
      departureTime: 'Departed'
    },
    coachPosition: `B${Math.floor(Math.random() * 12 + 1)}`, // Random Coach
    status: isDelayed ? 'DELAYED' : 'ON TIME',
    delayMinutes: delay,
    currentSpeed: speed > 130 ? 130 : speed, // Cap at 130
    timestamp: Date.now()
  };
}
