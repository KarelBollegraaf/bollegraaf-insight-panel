import { Bale, GeneralStats } from "@/types/bale";

const recipeNames = [
  "Cardboard-Mixed",
  "Cardboard-OCC",
  "Cardboard-Premium",
  "Cardboard-Packaging",
  "Paper-Office",
  "Paper-Newspaper",
];

const getQuality = (density: number): "excellent" | "good" | "acceptable" => {
  if (density >= 450) return "excellent";
  if (density >= 420) return "good";
  return "acceptable";
};

export function generateBaleData(count: number = 1000): Bale[] {
  const bales: Bale[] = [];
  const now = Date.now();
  
  // Generate bales going back in time (most recent first)
  for (let i = 0; i < count; i++) {
    // Space bales 5-15 minutes apart on average
    const minutesAgo = i * (5 + Math.random() * 10);
    const timestamp = new Date(now - minutesAgo * 60 * 1000);
    
    const recipeName = recipeNames[Math.floor(Math.random() * recipeNames.length)];
    
    // Generate dimensions - width and height are constant, only length varies
    const length = 115 + Math.random() * 15; // 115-130 cm
    const width = 80; // Fixed width
    const height = 73; // Fixed height
    
    const volume = (length * width * height) / 1000000; // m³
    const density = 400 + Math.random() * 80; // 400-480 kg/m³
    const weight = volume * density;
    
    const numberOfStrokes = Math.floor(35 + Math.random() * 25); // 35-60 strokes
    const balingTime = 2 + Math.random() * 3; // 2-5 minutes
    const idleTime = 3 + Math.random() * 7; // 3-10 minutes
    
    const kwhBaling = 3.5 + Math.random() * 2; // 3.5-5.5 kWh
    const kwhIdle = 0.3 + Math.random() * 0.4; // 0.3-0.7 kWh
    
    const channelPressureSetting = 70 + Math.random() * 20; // 70-90%
    const setPhotocellHeight = 65 + Math.random() * 15; // 65-80 cm
    const setBaleLength = 120; // Standard set length
    const measuredBaleLength = setBaleLength + (Math.random() * 10 - 5); // ±5 cm variance
    
    const numberOfWires = Math.random() > 0.5 ? 5 : 6;
    
    bales.push({
      id: `CB-${String(2000 + i).padStart(4, '0')}`,
      timestamp,
      recipeName,
      kwhBaling,
      kwhIdle,
      balingTime,
      idleTime,
      numberOfStrokes,
      channelPressureSetting,
      setPhotocellHeight,
      setBaleLength,
      measuredBaleLength,
      numberOfWires,
      density,
      length,
      width,
      height,
      weight,
      quality: getQuality(density),
    });
  }
  
  return bales;
}

export function calculateGeneralStats(bales: Bale[]): GeneralStats {
  const totalKwh = bales.reduce((sum, bale) => sum + bale.kwhBaling + bale.kwhIdle, 0);
  const totalMinutes = bales.reduce((sum, bale) => sum + bale.balingTime + bale.idleTime, 0);
  const operatingHours = totalMinutes / 60;
  
  return {
    operatingHours: Math.round(operatingHours * 10) / 10,
    totalKwh: Math.round(totalKwh * 10) / 10,
  };
}
