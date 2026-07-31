import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { CharacterCard } from './components/CharacterCard';
import { CharacterDetailModal } from './components/CharacterDetailModal';
import { ShareModal } from './components/ShareModal';
import { LoveQuestionWidget } from './components/LoveQuestionWidget';
import { Toast } from './components/Toast';
import { INITIAL_CHARACTERS } from './data/initialCharacters';
import { Character, CategoryFilter, SortOption } from './types';
import { Star, Sparkles, Heart, Search, Filter, BookOpen } from 'lucide-react';

export default function App() {
  // Characters state
  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const savedCustom = localStorage.getItem('custom_characters');
      const customList: Character[] = savedCustom ? JSON.parse(savedCustom) : [];
      // Filter out initial character IDs from customList so initial character assets stay updated
      const initialIds = new Set(INITIAL_CHARACTERS.map(c => c.id));
      const trueCustom = customList.filter(c => c.isCustom && !initialIds.has(c.id));
      return [...INITIAL_CHARACTERS, ...trueCustom];
    } catch (e) {
      console.error('Failed to parse custom characters', e);
      return INITIAL_CHARACTERS;
    }
  });

  // Favorites state stored in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const savedFavs = localStorage.getItem('character_favorites');
      if (savedFavs) return JSON.parse(savedFavs);
    } catch (e) {
      console.error('Failed to parse favorites', e);
    }
    return [];
  });

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Tất cả');
  const [sortOption, setSortOption] = useState<SortOption>('popular');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Modals state
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [shareCharacter, setShareCharacter] = useState<Character | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Toast message state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // URL Hash Deep-linking check (e.g., #character-astraia-space-queen)
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#character-')) {
        const charId = hash.replace('#character-', '');
        const found = characters.find(c => c.id === charId);
        if (found) {
          setSelectedCharacter(found);
          setIsDetailOpen(true);
        }
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [characters]);

  // Sync favorites to localStorage
  useEffect(() => {
    localStorage.setItem('character_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Handle favorite toggle
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      const isFav = prev.includes(id);
      if (isFav) {
        showToast('Đã bỏ khỏi danh sách yêu thích');
        return prev.filter(fId => fId !== id);
      } else {
        showToast('Đã thêm vào danh sách yêu thích ❤️');
        return [...prev, id];
      }
    });
  };

  // Create character handler
  const handleCreateCharacter = (newChar: Character) => {
    const updated = [newChar, ...characters];
    setCharacters(updated);

    // Persist custom characters
    const customOnly = updated.filter(c => c.isCustom);
    localStorage.setItem('custom_characters', JSON.stringify(customOnly));

    showToast(`Đã tạo hồ sơ cho "${newChar.name}" thành công! ✨`);
    setSelectedCharacter(newChar);
    setIsDetailOpen(true);
  };

  // Copy character link handler
  const handleCopyLink = (link: string, name: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(link);
    showToast(`Đã sao chép link của "${name}" vào khay nhớ tạm! 📋`);
  };

  // Open character detail
  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setIsDetailOpen(true);
    window.history.replaceState(null, '', `#character-${character.id}`);
  };

  // Open random character detail
  const handleSelectRandomCharacter = () => {
    if (characters.length === 0) return;
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomChar = characters[randomIndex];
    setSelectedCharacter(randomChar);
    setIsDetailOpen(true);
    window.history.replaceState(null, '', `#character-${randomChar.id}`);
    showToast(`🎲 Đã chọn ngẫu nhiên: "${randomChar.name}"! ✨`);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedCharacter(null);
    window.history.replaceState(null, '', ' ');
  };

  // Dynamically compute existing categories/tags across characters
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    characters.forEach(char => {
      if (char.category && char.category.trim()) {
        set.add(char.category.trim());
      }
      if (char.tags && Array.isArray(char.tags)) {
        char.tags.forEach(t => {
          if (t && t.trim()) set.add(t.trim());
        });
      }
    });
    return ['Tất cả', ...Array.from(set)];
  }, [characters]);

  // Filtered and sorted character list
  const filteredCharacters = useMemo(() => {
    return characters
      .filter(char => {
        // Search query filter
        const matchSearch =
          !searchQuery.trim() ||
          char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          char.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          char.backstory.toLowerCase().includes(searchQuery.toLowerCase()) ||
          char.openingMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
          char.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        // Category / Tag filter
        const matchCategory =
          selectedCategory === 'Tất cả' ||
          char.category.toLowerCase() === selectedCategory.toLowerCase() ||
          char.tags.some(t => t.toLowerCase() === selectedCategory.toLowerCase());

        // Favorites filter
        const matchFavorite = !showFavoritesOnly || favorites.includes(char.id);

        return matchSearch && matchCategory && matchFavorite;
      })
      .sort((a, b) => {
        if (sortOption === 'popular') {
          return (b.likes + (favorites.includes(b.id) ? 1 : 0)) - (a.likes + (favorites.includes(a.id) ? 1 : 0));
        } else if (sortOption === 'newest') {
          return a.isCustom ? -1 : 1;
        } else {
          return a.name.localeCompare(b.name, 'vi');
        }
      });
  }, [characters, searchQuery, selectedCategory, sortOption, showFavoritesOnly, favorites]);

  return (
    <div className="min-h-screen text-[#5C2830] flex flex-col font-sans relative overflow-x-hidden selection:bg-[#E892A0] selection:text-white bg-[#FADAD9]">
      {/* Background Image & Overlay with Aesthetic Pastel Pink Tint (from https://i.pinimg.com/736x/56/3c/f9/563cf9aeff7e2d2e0bc6d20d81e50b6a.jpg) */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-80"
        style={{
          backgroundImage: `url('https://i.pinimg.com/736x/56/3c/f9/563cf9aeff7e2d2e0bc6d20d81e50b6a.jpg')`
        }}
      >
        <div className="absolute inset-0 bg-[#FADAD9]/15"></div>
      </div>

      {/* Cute Floating Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-12 left-10 w-48 h-48 bg-[#F3B8C2]/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#E892A0]/30 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortOption={sortOption}
        setSortOption={setSortOption}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        favoriteCount={favorites.length}
        totalCount={characters.length}
        availableCategories={availableCategories}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Active Filter Notice */}
        {(showFavoritesOnly || searchQuery || selectedCategory !== 'Tất cả') && (
          <div className="mb-6 flex items-center justify-between bg-white/80 backdrop-blur-2xl border border-[#F3B8C2] rounded-2xl px-5 py-3 text-xs sm:text-sm text-[#823B47] shadow-sm">
            <div className="flex items-center gap-2 font-semibold">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>
                Đang hiển thị <strong className="text-[#5C2830]">{filteredCharacters.length}</strong> kết quả
                {selectedCategory !== 'Tất cả' && <> trong danh mục <span className="text-[#C86D7C] font-bold">{selectedCategory}</span></>}
                {showFavoritesOnly && <> (Chỉ danh sách yêu thích)</>}
                {searchQuery && <> từ khóa "<span className="text-[#C86D7C] font-bold">{searchQuery}</span>"</>}
              </span>
            </div>

            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Tất cả');
                setShowFavoritesOnly(false);
              }}
              className="text-[#C86D7C] hover:text-[#9C4B59] font-bold hover:underline cursor-pointer"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}

        {/* Character Cards Grid */}
        {filteredCharacters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredCharacters.map(character => (
              <CharacterCard
                key={character.id}
                character={character}
                isFavorite={favorites.includes(character.id)}
                onToggleFavorite={toggleFavorite}
                onSelectCharacter={handleSelectCharacter}
                onCopyLink={handleCopyLink}
              />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="py-16 text-center space-y-4 bg-white/85 backdrop-blur-2xl border border-[#F3B8C2] rounded-3xl p-8 max-w-md mx-auto my-8 shadow-md">
            <div className="w-16 h-16 rounded-2xl bg-[#FADAD9] border border-[#F3B8C2] text-[#C86D7C] flex items-center justify-center mx-auto shadow-inner">
              <BookOpen className="w-8 h-8 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#5C2830]">
                {characters.length === 0 ? "Chưa có tem hồ sơ nhân vật nào" : "Không tìm thấy nhân vật phù hợp"}
              </h3>
              <p className="text-xs text-[#823B47] max-w-xs mx-auto">
                {characters.length === 0
                  ? "Danh sách hồ sơ hiện đang trống. Hãy tạo hoặc nhập hồ sơ nhân vật mới!"
                  : "Thử tìm với từ khóa khác hoặc xóa bộ lọc để hiển thị tất cả nhân vật."}
              </p>
            </div>
            {(searchQuery || selectedCategory !== 'Tất cả' || showFavoritesOnly) && (
              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Tất cả');
                    setShowFavoritesOnly(false);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#E892A0] to-[#C86D7C] hover:brightness-105 text-white text-xs font-bold rounded-2xl border border-white/40 shadow-md transition-all cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-12 border-t border-[#F3B8C2]/60 bg-[#FADAD9]/90 backdrop-blur-2xl py-6 text-center text-xs text-[#823B47]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-semibold">© 2026 <span className="font-calligraphy text-base text-[#C86D7C] font-bold">Hoa Lạc Giản Lưu Hương</span> • Cute Character Vault</p>
          <p className="text-[#823B47]/80 text-[11px] font-medium">Bảo lưu mọi quyền • Thư viện nhân vật siêu dễ thương</p>
        </div>
      </footer>

      {/* Character Detail View Modal */}
      <CharacterDetailModal
        character={selectedCharacter}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        isFavorite={selectedCharacter ? favorites.includes(selectedCharacter.id) : false}
        onToggleFavorite={toggleFavorite}
        onCopyLink={handleCopyLink}
        onShare={(char) => {
          setShareCharacter(char);
          setIsShareOpen(true);
        }}
      />

      {/* Share Modal */}
      <ShareModal
        character={shareCharacter}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        onCopyLink={handleCopyLink}
      />

      {/* Floating Toast Notification */}
      <Toast message={toastMessage} />

      {/* Floating Tab: Em Có Yêu Anh Không? */}
      <LoveQuestionWidget
        characters={characters}
        onSelectCharacter={handleSelectCharacter}
      />
    </div>
  );
}
