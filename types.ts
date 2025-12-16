export interface FoodEntry {
  id: string;
  name: string;
  restaurant: string;
  rating: number; // 1-5
  notes: string;
  imageUri: string | null; // Base64 or URL
  timestamp: number;
}

export interface FoodAnalysisResult {
  name: string;
  notes: string;
}
