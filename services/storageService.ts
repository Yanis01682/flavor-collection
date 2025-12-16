import { FoodEntry } from "../types";

const STORAGE_KEY = "gourmet_log_entries";

export const saveEntries = (entries: FoodEntry[]) => {
  try {
    const serialized = JSON.stringify(entries);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error("Failed to save to localStorage", error);
    // 捕获 QuotaExceededError 或其他写入错误
    alert("⚠️ 严重警告：数据保存失败！\n\n原因可能是：\n1. 手机存储空间已满\n2. 浏览器处于无痕/隐私模式\n3. 浏览器禁止了本地存储\n\n请尝试清理空间或关闭无痕模式后重试，否则数据将在退出后丢失！");
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

export const exportData = (): boolean => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data || data === "[]") {
      alert("没有发现任何记录，无法导出。");
      return false;
    }
    
    // 创建 Blob 对象
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    // 创建临时链接并触发点击
    const a = document.createElement("a");
    const fileName = `FlavorCollection_Backup_${new Date().toISOString().slice(0,10)}.json`;
    
    a.href = url;
    a.download = fileName;
    a.style.display = 'none';
    document.body.appendChild(a);
    
    a.click();
    
    // 清理
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);

    return true;
  } catch (e) {
    console.error("Export failed", e);
    alert(`导出失败: ${(e as Error).message}`);
    return false;
  }
};

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
          reject(new Error("文件格式错误：不是有效的备份文件"));
        }
      } catch (err) {
        reject(new Error("文件解析失败"));
      }
    };
    reader.onerror = () => reject(new Error("读取文件失败"));
    reader.readAsText(file);
  });
};