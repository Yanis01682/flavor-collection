import { FoodEntry } from "../types";

const STORAGE_KEY = "gourmet_log_entries";

export const saveEntries = (entries: FoodEntry[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error("Failed to save to localStorage", error);
  }
};

export const loadEntries = (): FoodEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load from localStorage", error);
    return [];
  }
};

// 导出数据为 JSON 文件
export const exportData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return;
  
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `yummy_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 导入数据
export const importData = (file: File): Promise<FoodEntry[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const entries = JSON.parse(json) as FoodEntry[];
        if (Array.isArray(entries)) {
          saveEntries(entries);
          resolve(entries);
        } else {
          reject(new Error("Invalid data format"));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
};
