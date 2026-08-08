import React from 'react';
import { Search, Plus, Heart, Filter, SlidersHorizontal, Shuffle, Sun, Moon } from 'lucide-react';
import { CategoryFilter, SortOption } from '../types';
import { CuteStarIcon } from './CuteStarIcon';
import { PinkVinylPlayer } from './PinkVinylPlayer';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: CategoryFilter;
  setSelectedCategory: (c: CategoryFilter) => void;
  sortOption: SortOption;
  setSortOption: (s: SortOption) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (f: boolean) => void;
  favoriteCount: number;
  totalCount: number;
  availableCategories?: string[];
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortOption,
  setSortOption,
  showFavoritesOnly,
  setShowFavoritesOnly,
  favoriteCount,
  totalCount,
  availableCategories = ['Tất cả'],
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FADAD9]/85 dark:bg-[#201113]/85 backdrop-blur-2xl border-b border-[#F3B8C2]/60 dark:border-[#522930]/60 transition-all shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            {/* Animated Golden Star */}
            <div className="p-1 rounded-2xl bg-gradient-to-br from-[#FFF59D] via-[#FFE082] to-[#FFCA28] shadow-md shadow-amber-300/40">
              <CuteStarIcon size={34} />
            </div>
            <div>
              {/* Web Title in Antique Rose with Vietnamese Calligraphy Font */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-calligraphy text-[#C86D7C] tracking-wide drop-shadow-sm">
                Hoa Lạc Giản Lưu Hương
              </h1>
              <p className="text-xs text-[#823B47] dark:text-[#EFAEB6] font-semibold flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-2 h-2 rounded-full bg-[#E892A0] animate-pulse"></span>
                Xin lỗi vì có gu quá đẳng cấp
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap sm:flex-nowrap">
            <button
              onClick={onToggleDarkMode}
              className="p-2 bg-white/80 dark:bg-[#3D2529]/80 text-[#823B47] dark:text-[#EFAEB6] hover:bg-white dark:hover:bg-[#3D2529] hover:text-[#5C2830] dark:hover:text-[#F9E3E6] border border-[#F5B5C0] dark:border-[#522930] rounded-2xl transition-all shadow-sm cursor-pointer flex items-center justify-center"
              title={isDarkMode ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#C86D7C]" />}
            </button>

            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all backdrop-blur-xl border cursor-pointer ${
                showFavoritesOnly
                  ? 'bg-[#E892A0] text-white border-[#C86D7C] shadow-md shadow-pink-200/50 scale-105'
                  : 'bg-white/80 dark:bg-[#3D2529]/80 text-[#602D35] dark:text-[#EFAEB6] hover:bg-white dark:hover:bg-[#3D2529] border-[#F5B5C0] dark:border-[#522930] shadow-sm'
              }`}
              id="favorite-filter-btn"
            >
              <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-white text-white' : 'text-[#C86D7C]'}`} />
              <span className="hidden sm:inline">Đã thích</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${showFavoritesOnly ? 'bg-white text-[#C86D7C]' : 'bg-[#FADAD9] dark:bg-[#201113] text-[#602D35] dark:text-[#EFAEB6]'}`}>
                {favoriteCount}
              </span>
            </button>

            {/* Music Box (compact music bar) */}
            <PinkVinylPlayer />
          </div>
        </div>

        {/* Search and Filters row */}
        <div className="mt-3.5 pt-3 border-t border-[#F3B8C2]/50 dark:border-[#522930]/50 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C86D7C]" />
            <input
              type="text"
              placeholder="Tìm theo tên, từ khóa hoặc backstory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/80 dark:bg-[#2A1619]/80 backdrop-blur-xl border border-[#F3B8C2] dark:border-[#522930] rounded-2xl text-xs sm:text-sm text-[#5C2830] dark:text-[#F9E3E6] placeholder-[#B57C85] dark:placeholder-[#B57C85]/70 focus:outline-none focus:border-[#C86D7C] dark:focus:border-[#FFA9B8] focus:bg-white dark:focus:bg-[#2A1619] transition-all shadow-inner"
              id="search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#823B47] dark:text-[#EFAEB6] hover:text-[#5C2830] dark:hover:text-[#F9E3E6] bg-[#FADAD9] dark:bg-[#3D2529] hover:bg-[#F3B8C2] dark:hover:bg-[#522930] px-2 py-0.5 rounded-lg border border-[#F3B8C2] dark:border-[#522930] transition-all cursor-pointer"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <SlidersHorizontal className="w-4 h-4 text-[#C86D7C] hidden sm:block" />
            <span className="text-xs text-[#823B47] dark:text-[#EFAEB6] hidden sm:inline font-bold">Sắp xếp:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-white/90 dark:bg-[#2A1619]/90 backdrop-blur-xl border border-[#F3B8C2] dark:border-[#522930] text-xs sm:text-sm text-[#5C2830] dark:text-[#F9E3E6] font-semibold rounded-2xl px-3.5 py-2 focus:outline-none focus:border-[#C86D7C] dark:focus:border-[#FFA9B8] cursor-pointer shadow-sm"
              id="sort-select"
            >
              <option value="popular">Được yêu thích nhất</option>
              <option value="newest">Mới cập nhật</option>
              <option value="name">Tên (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
          <Filter className="w-3.5 h-3.5 text-[#C86D7C] mr-1 flex-shrink-0" />
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#C86D7C] text-[#ffffff] border-[#A85365] shadow-md shadow-pink-300/40 scale-105'
                  : 'bg-white/70 dark:bg-[#2A1619]/70 text-[#823B47] dark:text-[#EFAEB6] hover:bg-white dark:hover:bg-[#3D2529] hover:text-[#5C2830] dark:hover:text-[#F9E3E6] border-[#F3B8C2] dark:border-[#522930]'
              }`}
              id={`category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

