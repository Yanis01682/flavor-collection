import React, { useState, useEffect, useRef } from "react";
import { Plus, UtensilsCrossed, Settings, Download, Upload, AlertCircle } from "lucide-react";
import { FoodForm } from "./components/FoodForm";
import { FoodList } from "./components/FoodList";
import { FoodEntry } from "./types";
import { loadEntries, saveEntries, exportData, importData } from "./services/storageService";

const App: React.FC = () => {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load initial data
  useEffect(() => {
    const data = loadEntries();
    setEntries(data);
    setIsLoading(false);
  }, []);

  const handleSaveEntry = (newEntry: FoodEntry) => {
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    saveEntries(updatedEntries);
    setIsAdding(false);
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm("确定要删除这条美食记录吗？")) {
      const updatedEntries = entries.filter(entry => entry.id !== id);
      setEntries(updatedEntries);
      saveEntries(updatedEntries);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (window.confirm("导入备份将覆盖当前数据（建议先导出当前数据），确定要继续吗？")) {
        try {
          const importedEntries = await importData(file);
          setEntries(importedEntries);
          alert("数据导入成功！");
          setShowSettings(false);
        } catch (error) {
          alert("导入失败，文件格式可能不正确。");
        }
      }
    }
    // Clear input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-brand-50">
        <div className="text-brand-500 animate-pulse font-bold text-xl">Loading Flavor Collection...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full max-w-lg mx-auto bg-white shadow-2xl overflow-hidden relative flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 p-4 pt-12 sm:pt-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2 text-brand-600">
          <div className="bg-brand-100 p-2 rounded-xl">
             <UtensilsCrossed size={24} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
            Flavor <span className="text-brand-500">Collection</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="text-xs text-gray-400 font-medium px-2 py-1 bg-gray-50 rounded-lg">
            {entries.length} 记
            </div>
            <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-400 hover:text-brand-500 hover:bg-brand-50 rounded-full transition-colors"
            >
                <Settings size={20} />
            </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-50 border-b border-gray-200 p-4 animate-fade-in">
            <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">数据备份与恢复</h3>
            <div className="flex gap-3">
                <button 
                    onClick={exportData}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
                >
                    <Download size={16} />
                    导出备份
                </button>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
                >
                    <Upload size={16} />
                    恢复数据
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".json" 
                    onChange={handleImport}
                />
            </div>
            <div className="mt-2 flex items-start gap-2 text-xs text-gray-400">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <p>数据存储在本地。请定期导出备份，以免清理缓存导致数据丢失。</p>
            </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <FoodList entries={entries} onDelete={handleDeleteEntry} />
        
        {/* Floating Action Button */}
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="absolute bottom-6 right-6 w-14 h-14 bg-brand-500 hover:bg-brand-600 text-white rounded-full shadow-lg shadow-brand-200 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-30"
            aria-label="Add Food"
          >
            <Plus size={28} />
          </button>
        )}
      </main>

      {/* Modal Form */}
      {isAdding && (
        <FoodForm 
          onSave={handleSaveEntry} 
          onCancel={() => setIsAdding(false)} 
        />
      )}
    </div>
  );
};

export default App;