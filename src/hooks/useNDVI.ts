import { useMemo } from "react";

interface NDVICell {
  value: number;
  color: string;
}

interface NDVIReading {
  date: Date;
  healthScore: number;
  ndviValue: number;
  grid: NDVICell[][];
}

// Generate realistic NDVI data based on month and health trend
const generateNDVIGrid = (month: number, baseHealth: number): NDVICell[][] => {
  const grid: NDVICell[][] = [];
  
  // Seasonal multiplier (higher NDVI in monsoon/post-monsoon months)
  const seasonalMultiplier = 
    month >= 6 && month <= 10 ? 1.2 : // Monsoon/Kharif
    month >= 11 || month <= 2 ? 0.9 : // Rabi
    0.7; // Summer (fallow)

  for (let row = 0; row < 8; row++) {
    const gridRow: NDVICell[] = [];
    for (let col = 0; col < 8; col++) {
      // Base NDVI with some spatial variation
      const spatialNoise = (Math.sin(row * 0.5) * Math.cos(col * 0.5) + 1) * 0.1;
      const randomNoise = (Math.random() - 0.5) * 0.15;
      
      // Calculate NDVI value (-1 to 1, but healthy vegetation is 0.2-0.9)
      let ndviValue = (baseHealth / 100) * 0.7 * seasonalMultiplier + 0.1 + spatialNoise + randomNoise;
      ndviValue = Math.max(0, Math.min(0.95, ndviValue));
      
      // Color based on NDVI value
      let color: string;
      if (ndviValue >= 0.6) {
        // Healthy - dark green
        const greenIntensity = 120 + Math.floor((ndviValue - 0.6) * 200);
        color = `rgb(30, ${greenIntensity}, 40)`;
      } else if (ndviValue >= 0.4) {
        // Moderate - light green
        const greenIntensity = 80 + Math.floor((ndviValue - 0.4) * 200);
        color = `rgb(60, ${greenIntensity}, 50)`;
      } else if (ndviValue >= 0.2) {
        // Stressed - yellow/brown
        color = `rgb(${150 + Math.floor(ndviValue * 100)}, ${100 + Math.floor(ndviValue * 100)}, 50)`;
      } else {
        // Bare soil/water
        color = `rgb(${120 + Math.floor(ndviValue * 100)}, ${80 + Math.floor(ndviValue * 50)}, 60)`;
      }
      
      gridRow.push({ value: ndviValue, color });
    }
    grid.push(gridRow);
  }
  
  return grid;
};

const calculateHealthScore = (grid: NDVICell[][]): number => {
  let totalNDVI = 0;
  let count = 0;
  
  grid.forEach(row => {
    row.forEach(cell => {
      totalNDVI += cell.value;
      count++;
    });
  });
  
  const avgNDVI = totalNDVI / count;
  // Convert NDVI to health score (0-100)
  return Math.round(Math.min(100, Math.max(0, avgNDVI * 120)));
};

export const useNDVI = (farmId?: string, year?: number) => {
  const currentYear = year ?? new Date().getFullYear();
  
  const monthlyReadings = useMemo(() => {
    const readings: NDVIReading[] = [];
    
    // Generate 12 months of data with realistic seasonal patterns
    for (let month = 0; month < 12; month++) {
      // Base health varies by season
      let baseHealth: number;
      if (month >= 6 && month <= 10) {
        // Monsoon - high health
        baseHealth = 70 + Math.random() * 25;
      } else if (month >= 11 || month <= 2) {
        // Rabi season - moderate to high
        baseHealth = 60 + Math.random() * 25;
      } else {
        // Summer fallow - lower health
        baseHealth = 30 + Math.random() * 30;
      }
      
      const grid = generateNDVIGrid(month, baseHealth);
      const healthScore = calculateHealthScore(grid);
      const avgNDVI = grid.flat().reduce((sum, cell) => sum + cell.value, 0) / 64;
      
      readings.push({
        date: new Date(currentYear, month, 15),
        healthScore,
        ndviValue: avgNDVI,
        grid,
      });
    }
    
    return readings;
  }, [farmId, currentYear]);

  // Generate comparison data for previous year
  const previousYearReadings = useMemo(() => {
    const readings: NDVIReading[] = [];
    
    for (let month = 0; month < 12; month++) {
      // Previous year has slightly lower health (improvement story)
      let baseHealth: number;
      if (month >= 6 && month <= 10) {
        baseHealth = 55 + Math.random() * 25;
      } else if (month >= 11 || month <= 2) {
        baseHealth = 45 + Math.random() * 25;
      } else {
        baseHealth = 25 + Math.random() * 25;
      }
      
      const grid = generateNDVIGrid(month, baseHealth);
      const healthScore = calculateHealthScore(grid);
      const avgNDVI = grid.flat().reduce((sum, cell) => sum + cell.value, 0) / 64;
      
      readings.push({
        date: new Date(currentYear - 1, month, 15),
        healthScore,
        ndviValue: avgNDVI,
        grid,
      });
    }
    
    return readings;
  }, [farmId, currentYear]);

  const currentMonthReading = monthlyReadings[new Date().getMonth()];
  const previousYearSameMonth = previousYearReadings[new Date().getMonth()];
  
  const yearOverYearChange = currentMonthReading && previousYearSameMonth
    ? ((currentMonthReading.healthScore - previousYearSameMonth.healthScore) / previousYearSameMonth.healthScore) * 100
    : 0;

  return {
    monthlyReadings,
    previousYearReadings,
    currentMonthReading,
    yearOverYearChange: Math.round(yearOverYearChange),
  };
};
