import React, { useState, useMemo } from "react";
import { Search, MapPin, Filter, X, Trash2 } from "lucide-react";
import { FoodEntry } from "../types";
import { StarRating } from "./StarRating";

interface FoodListProps {
  entries: FoodEntry[];
  onDelete: (id: string) => void;
}

export const FoodList: React.FC<FoodListProps> = ({ entries, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch = 
        entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.restaurant.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRating = filterRating !== null ? entry.rating === filterRating : true;

      return matchesSearch && matchesRating;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [entries, searchTerm, filterRating]);

  return (
    <div className="h-full flex flex-col">
      {/* Search & Filter Bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="搜索美食或餐厅..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg border ${showFilters ? 'bg-brand-50 border-brand-200 text-brand-600' : 'bg-white border-gray-200 text-gray-600'}`}
          >
            <Filter size={20} />
          </button>
        </div>

        {showFilters && (
          <div className="animate-fade-in pb-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase">按评分筛选</span>
              {filterRating !== null && (
                <button onClick={() => setFilterRating(null)} className="text-xs text-brand-600 flex items-center">
                  <X size={12} className="mr-1" /> 清除
                </button>
              )}
            </div>
            
            <div className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg border border-gray-100">
               <StarRating 
                  rating={filterRating || 0} 
                  setRating={(r) => setFilterRating(r === filterRating ? null : r)} 
                  size={32} 
               />
               <div className="mt-2 text-sm text-gray-500 font-medium">
                  {filterRating !== null ? `${filterRating} 分` : "点击星星筛选"}
               </div>
            </div>
          </div>
        )}
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-24">
        {filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search size={24} />
            </div>
            <p>没有找到相关记录</p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row relative group">
              
              {/* 删除按钮：固定在卡片右上角 */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(entry.id);
                }}
                className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur text-gray-400 hover:text-red-500 rounded-full shadow-sm border border-gray-100 z-20"
                title="删除记录"
              >
                <Trash2 size={18} />
              </button>

              {/* Image Section */}
              <div className="h-48 sm:h-auto sm:w-48 bg-gray-100 shrink-0 relative">
                {entry.imageUri ? (
                  <img src={entry.imageUri} alt={entry.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <span className="text-xs">无照片</span>
                  </div>
                )}
                
                {/* 评分展示：固定在图片左下角，加深色背景防遮挡 */}
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full flex items-center z-10">
                   <StarRating rating={entry.rating} readOnly size={12} />
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4 flex-1 flex flex-col justify-between relative">
                <div className="pr-10"> {/* 右侧留白防止文字遮挡删除按钮 */}
                  <div className="flex flex-col mb-1">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{entry.name}</h3>
                    <span className="text-xs text-gray-400 mt-0.5">
                        {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin size={14} className="mr-1 shrink-0" />
                    <span className="line-clamp-1">{entry.restaurant}</span>
                  </div>

                  {entry.notes && (
                    <p className="text-gray-600 text-sm line-clamp-3 bg-orange-50/50 p-2 rounded-lg border border-orange-100/50">
                      {entry.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};