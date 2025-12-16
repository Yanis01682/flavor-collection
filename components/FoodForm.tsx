import React, { useState, useRef } from "react";
import { Camera, Save, X, Sparkles, Loader2, Image as ImageIcon } from "lucide-react";
import { FoodEntry } from "../types";
import { StarRating } from "./StarRating";
import { analyzeFoodImage, fileToGenerativePart } from "../services/geminiService";

interface FoodFormProps {
  onSave: (entry: FoodEntry) => void;
  onCancel: () => void;
}

export const FoodForm: React.FC<FoodFormProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Use a ref for the raw base64 data to send to AI without re-reading user input
  const rawImageRef = useRef<{ base64: string; mimeType: string } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await fileToGenerativePart(file);
        const mimeType = file.type;
        const dataUri = `data:${mimeType};base64,${base64}`;
        
        setImageUri(dataUri);
        rawImageRef.current = { base64, mimeType };
      } catch (err) {
        console.error("Error reading file", err);
      }
    }
  };

  const handleAIAnalyze = async () => {
    if (!rawImageRef.current) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeFoodImage(
        rawImageRef.current.base64,
        rawImageRef.current.mimeType
      );
      
      // Auto-fill form
      setName(result.name);
      // Append generated notes to existing ones if any
      setNotes((prev) => (prev ? `${prev}\n${result.notes}` : result.notes));
      
    } catch (error) {
      alert("AI 分析失败，请重试或手动输入。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("请输入美食名称");
      return;
    }
    
    const newEntry: FoodEntry = {
      id: crypto.randomUUID(),
      name,
      restaurant: restaurant || "未知餐厅",
      rating: rating || 0,
      notes,
      imageUri,
      timestamp: Date.now(),
    };
    
    onSave(newEntry);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white w-full h-[95%] sm:h-auto sm:max-w-md sm:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">记录美食</h2>
          <button onClick={onCancel} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Image Upload Area */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">美食照片</label>
            <div className="relative w-full aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden group hover:border-brand-300 transition-colors">
              {imageUri ? (
                <>
                  <img src={imageUri} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-medium">点击更换</p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <Camera size={32} className="mb-2" />
                  <span className="text-sm">点击上传照片</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            
            {/* AI Analyze Button */}
            {imageUri && (
              <button
                type="button"
                onClick={handleAIAnalyze}
                disabled={isAnalyzing}
                className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-sm">AI 正在品鉴中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span className="text-sm">AI 智能识别 & 点评</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Text Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">美食名称</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-gray-50 border-transparent focus:border-brand-500 focus:bg-white border rounded-xl outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">餐厅名称</label>
              <input
                type="text"
                value={restaurant}
                onChange={(e) => setRestaurant(e.target.value)}
                className="w-full p-3 bg-gray-50 border-transparent focus:border-brand-500 focus:bg-white border rounded-xl outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">评分</label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <StarRating rating={rating} setRating={setRating} size={32} />
                <span className="ml-auto text-sm font-medium text-brand-600">{rating > 0 ? `${rating} 分` : '未评分'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">备注 & 心得</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="记录下这道菜的味道、口感..."
                rows={3}
                className="w-full p-3 bg-gray-50 border-transparent focus:border-brand-500 focus:bg-white border rounded-xl outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-brand-500 text-white font-bold rounded-xl shadow-brand-200 shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Save size={20} />
            保存记录
          </button>
        </div>
      </div>
    </div>
  );
};