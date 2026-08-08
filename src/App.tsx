import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { CharacterCard } from './components/CharacterCard';
import { CharacterDetailModal } from './components/CharacterDetailModal';
import { ShareModal } from './components/ShareModal';
import { LoveQuestionWidget } from './components/LoveQuestionWidget';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { Toast } from './components/Toast';
import { INITIAL_CHARACTERS } from './data/initialCharacters';
import { Character, CategoryFilter, SortOption } from './types';
import { Star, Sparkles, Heart, Search, Filter, BookOpen, FileSpreadsheet } from 'lucide-react';
import { auth, db, signInWithGoogle, logOut } from './lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isOwner = currentUser?.email === 'thanhhanggg2605@gmail.com';

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        return true;
      }
    } catch (e) {
      console.error('Failed to parse theme', e);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Characters state
  const [characters, setCharacters] = useState<Character[]>(INITIAL_CHARACTERS);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'characters'), async (snapshot) => {
      if (!snapshot.empty) {
        const firestoreCharacters = snapshot.docs.map(doc => {
          const data = { id: doc.id, ...doc.data() } as Character;
          
          const initialChar = INITIAL_CHARACTERS.find(c => c.id === data.id);
          if (initialChar && initialChar.avatar) {
            data.avatar = initialChar.avatar;
          } else if (data.avatar && (data.avatar.includes('/src/assets/images/') || data.avatar.startsWith('src/assets/'))) {
            // Fallback for deleted local image assets (Astraia, Kiet, Rin, Elena, etc.)
            data.avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';
          }
          return data;
        });
        setCharacters(firestoreCharacters);
      } else {
        if (isOwner) {
          const seeded = localStorage.getItem('characters_seeded');
          if (!seeded) {
            for (const char of INITIAL_CHARACTERS) {
              await setDoc(doc(db, 'characters', char.id), char).catch(console.error);
            }
            localStorage.setItem('characters_seeded', 'true');
          } else {
            setCharacters([]);
          }
        } else {
          setCharacters(INITIAL_CHARACTERS);
        }
      }
    });
    return () => unsubscribe();
  }, [isOwner]);

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
  const [isGoogleSheetsOpen, setIsGoogleSheetsOpen] = useState(false);
  const [showSheetsPassword, setShowSheetsPassword] = useState(false);
  const [sheetsPasswordInput, setSheetsPasswordInput] = useState('');

  // custom avatars directory files state
  const [avatarFiles, setAvatarFiles] = useState<string[]>([]);

  const fetchAvatarFiles = async () => {
    try {
      const res = await fetch('/api/avatars');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.files)) {
          setAvatarFiles(data.files);
        }
      }
    } catch (e) {
      console.error('Failed to fetch avatar files', e);
    }
  };

  useEffect(() => {
    fetchAvatarFiles();
    // Poll every 4 seconds to pick up new files instantly as soon as they are dropped/uploaded
    const interval = setInterval(fetchAvatarFiles, 4000);
    return () => clearInterval(interval);
  }, []);

  const getCharacterAvatar = useCallback((character: Character): string => {
    if (!character) return '';

    if (avatarFiles.length > 0) {
      const charId = character.id.toLowerCase();
      const charNameNormalized = character.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd');

      for (const file of avatarFiles) {
        const fileLower = file.toLowerCase();

        // 1. Specific matches for key character IDs & filenames
        if (charId === 'thanh-ha-tuc-vu' && (fileLower.includes('tuc_vu') || fileLower.includes('tuc-vu') || fileLower.includes('tucvu') || fileLower.includes('thanh_ha') || fileLower.includes('thanh-ha'))) {
          return `/avatars/${file}`;
        }
        if (charId === 'astraia' && fileLower.includes('astraia')) {
          return `/avatars/${file}`;
        }
        if (charId === 'kiet' && fileLower.includes('kiet')) {
          return `/avatars/${file}`;
        }
        if (charId === 'rin' && fileLower.includes('rin')) {
          return `/avatars/${file}`;
        }
        if (charId === 'elena' && fileLower.includes('elena')) {
          return `/avatars/${file}`;
        }

        // 2. Substring matching of ID
        if (fileLower.includes(charId) || charId.includes(fileLower.split('.')[0])) {
          return `/avatars/${file}`;
        }

        // 3. Substring matching of Name parts
        const nameParts = charNameNormalized.split(/\s+/).filter(part => part.length > 2);
        for (const part of nameParts) {
          if (fileLower.includes(part)) {
            return `/avatars/${file}`;
          }
        }
      }
    }

    // Default fallbacks (skip local placeholder paths)
    if (character.avatar && !character.avatar.includes('/src/assets/images/') && !character.avatar.startsWith('src/assets/')) {
      return character.avatar;
    }

    return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';
  }, [avatarFiles]);

  const mappedCharacters = useMemo(() => {
    return characters.map(char => ({
      ...char,
      avatar: getCharacterAvatar(char)
    }));
  }, [characters, getCharacterAvatar]);

  // Auto-synchronize and enforce avatar fallback for selected and shared characters using mappedCharacters
  const activeSelectedCharacter = useMemo(() => {
    if (!selectedCharacter) return null;
    const found = mappedCharacters.find(c => c.id === selectedCharacter.id);
    return found || { ...selectedCharacter, avatar: getCharacterAvatar(selectedCharacter) };
  }, [selectedCharacter, mappedCharacters, getCharacterAvatar]);

  const activeShareCharacter = useMemo(() => {
    if (!shareCharacter) return null;
    const found = mappedCharacters.find(c => c.id === shareCharacter.id);
    return found || { ...shareCharacter, avatar: getCharacterAvatar(shareCharacter) };
  }, [shareCharacter, mappedCharacters, getCharacterAvatar]);

  const handleSheetsPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sheetsPasswordInput === '260507') {
      setShowSheetsPassword(false);
      setSheetsPasswordInput('');
      setIsGoogleSheetsOpen(true);
    } else {
      setSheetsPasswordInput('');
      showToast('Mật khẩu không chính xác! ❌');
    }
  };

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
        const found = mappedCharacters.find(c => c.id === charId);
        if (found) {
          setSelectedCharacter(found);
          setIsDetailOpen(true);
        }
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [mappedCharacters]);

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
  const handleCreateCharacter = async (newChar: Character) => {
    try {
      await setDoc(doc(db, 'characters', newChar.id), newChar);
      showToast(`Đã tạo hồ sơ cho "${newChar.name}" thành công! ✨`);
      setSelectedCharacter(newChar);
      setIsDetailOpen(true);
    } catch (e) {
      console.error(e);
      showToast('Lỗi khi tạo nhân vật');
    }
  };

  // Import characters from Google Sheets handler
  const handleImportFromSheets = async (newChars: Character[]) => {
    try {
      const existingIds = new Set(mappedCharacters.map(c => c.id));
      const filteredNew = newChars.filter(c => !existingIds.has(c.id));
      for (const char of filteredNew) {
        await setDoc(doc(db, 'characters', char.id), char);
      }
      showToast('Đã nhập thành công từ Google Sheets');
    } catch (e) {
      console.error(e);
      showToast('Lỗi khi nhập nhân vật');
    }
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
    if (mappedCharacters.length === 0) return;
    const randomIndex = Math.floor(Math.random() * mappedCharacters.length);
    const randomChar = mappedCharacters[randomIndex];
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
    mappedCharacters.forEach(char => {
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
  }, [mappedCharacters]);

  // Filtered and sorted character list
  const filteredCharacters = useMemo(() => {
    return mappedCharacters
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
  }, [mappedCharacters, searchQuery, selectedCategory, sortOption, showFavoritesOnly, favorites]);

  return (
    <div className="min-h-screen text-[#5C2830] dark:text-[#F9E3E6] flex flex-col font-sans relative overflow-x-hidden selection:bg-[#E892A0] selection:text-white bg-[#FADAD9] dark:bg-[#201113] transition-colors duration-300">
      {/* Background Image & Overlay with Aesthetic Pastel Pink Tint (from https://i.pinimg.com/736x/56/3c/f9/563cf9aeff7e2d2e0bc6d20d81e50b6a.jpg) */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-80 dark:opacity-30 transition-opacity duration-300"
        style={{
          backgroundImage: `url('https://i.pinimg.com/736x/56/3c/f9/563cf9aeff7e2d2e0bc6d20d81e50b6a.jpg')`
        }}
      >
        <div className="absolute inset-0 bg-[#FADAD9]/15 dark:bg-[#201113]/75 transition-colors duration-300"></div>
      </div>

      {/* Cute Floating Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-12 left-10 w-48 h-48 bg-[#F3B8C2]/40 dark:bg-[#522930]/30 rounded-full blur-3xl animate-pulse transition-colors duration-300"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#E892A0]/30 dark:bg-[#6D3640]/20 rounded-full blur-3xl animate-pulse transition-colors duration-300"></div>
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
        totalCount={mappedCharacters.length}
        availableCategories={availableCategories}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Active Filter Notice */}
        {(showFavoritesOnly || searchQuery || selectedCategory !== 'Tất cả') && (
          <div className="mb-6 flex items-center justify-between bg-white/80 dark:bg-[#3D2529]/80 backdrop-blur-2xl border border-[#F3B8C2] dark:border-[#522930] rounded-2xl px-5 py-3 text-xs sm:text-sm text-[#823B47] dark:text-[#EFAEB6] shadow-sm transition-colors duration-300">
            <div className="flex items-center gap-2 font-semibold">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>
                Đang hiển thị <strong className="text-[#5C2830] dark:text-[#F9E3E6]">{filteredCharacters.length}</strong> kết quả
                {selectedCategory !== 'Tất cả' && <> trong danh mục <span className="text-[#C86D7C] dark:text-[#FFA9B8] font-bold">{selectedCategory}</span></>}
                {showFavoritesOnly && <> (Chỉ danh sách yêu thích)</>}
                {searchQuery && <> từ khóa "<span className="text-[#C86D7C] dark:text-[#FFA9B8] font-bold">{searchQuery}</span>"</>}
              </span>
            </div>

            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Tất cả');
                setShowFavoritesOnly(false);
              }}
              className="text-[#C86D7C] dark:text-[#FFA9B8] hover:text-[#9C4B59] dark:hover:text-[#FFA9B8]/80 font-bold hover:underline cursor-pointer"
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
          <div className="py-16 text-center space-y-4 bg-white/85 dark:bg-[#3D2529]/85 backdrop-blur-2xl border border-[#F3B8C2] dark:border-[#522930] rounded-3xl p-8 max-w-md mx-auto my-8 shadow-md transition-colors duration-300">
            <div className="w-16 h-16 rounded-2xl bg-[#FADAD9] dark:bg-[#321B1E] border border-[#F3B8C2] dark:border-[#522930] text-[#C86D7C] dark:text-[#FFA9B8] flex items-center justify-center mx-auto shadow-inner">
              <BookOpen className="w-8 h-8 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#5C2830] dark:text-[#F9E3E6]">
                {mappedCharacters.length === 0 ? "Chưa có tem hồ sơ nhân vật nào" : "Không tìm thấy nhân vật phù hợp"}
              </h3>
              <p className="text-xs text-[#823B47] dark:text-[#EFAEB6]/90 max-w-xs mx-auto">
                {mappedCharacters.length === 0
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
      <footer className="relative z-10 mt-12 border-t border-[#F3B8C2]/60 dark:border-[#522930]/60 bg-[#FADAD9]/90 dark:bg-[#201113]/90 backdrop-blur-2xl py-6 text-center text-xs text-[#823B47] dark:text-[#EFAEB6] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-semibold text-[#823B47] dark:text-[#EFAEB6]">© 2026 <span className="font-calligraphy text-base text-[#C86D7C] dark:text-[#FFA9B8] font-bold">Hoa Lạc Giản Lưu Hương</span> • Cute Character Vault</p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="text-[#823B47]/80 dark:text-[#EFAEB6]/80 text-[11px] font-medium">Bảo lưu mọi quyền • Thư viện nhân vật siêu dễ thương</p>
            {/* Google Sheets Password Trigger */}
            <div className="relative flex items-center gap-2">
              {currentUser ? (
                <button
                  onClick={logOut}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#823B47] hover:bg-[#5C2830] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Đăng xuất ({currentUser.email})
                </button>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#C86D7C] hover:bg-[#823B47] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Đăng nhập
                </button>
              )}
              {showSheetsPassword ? (
                  <form 
                    onSubmit={handleSheetsPasswordSubmit} 
                    className="absolute bottom-full right-0 mb-2 p-3 bg-white dark:bg-[#3D2529] border border-[#F3B8C2] dark:border-[#522930] rounded-xl shadow-xl z-50 flex flex-col gap-2 min-w-[200px]"
                  >
                    <p className="text-[10px] text-rose-500 font-bold italic text-center">bé yêu không nhấn vào đây.</p>
                    <input 
                      type="password" 
                      value={sheetsPasswordInput}
                      onChange={(e) => setSheetsPasswordInput(e.target.value)}
                      placeholder="Nhập mật khẩu..."
                      className="px-2.5 py-1.5 text-xs bg-white dark:bg-[#2A1619] border border-[#F3B8C2] dark:border-[#522930] text-[#5C2830] dark:text-[#F9E3E6] rounded-lg focus:outline-none focus:border-[#C86D7C] dark:focus:border-[#FFA9B8]"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 py-1.5 text-xs font-bold bg-[#C86D7C] text-white rounded-lg hover:bg-[#823B47] cursor-pointer">Mở</button>
                      <button type="button" onClick={() => setShowSheetsPassword(false)} className="flex-1 py-1.5 text-xs font-bold bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 cursor-pointer">Hủy</button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowSheetsPassword(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm border border-emerald-600 cursor-pointer"
                    title="Google Sheets"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Google Sheets</span>
                  </button>
                )}
            </div>
          </div>
        </div>
      </footer>

      {/* Character Detail View Modal */}
      <CharacterDetailModal
        character={activeSelectedCharacter}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        isFavorite={activeSelectedCharacter ? favorites.includes(activeSelectedCharacter.id) : false}
        onToggleFavorite={toggleFavorite}
        onCopyLink={handleCopyLink}
        onShare={(char) => {
          setShareCharacter(char);
          setIsShareOpen(true);
        }}
      />

      {/* Share Modal */}
      <ShareModal
        character={activeShareCharacter}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        onCopyLink={handleCopyLink}
      />

      {/* Google Sheets Modal */}
      <GoogleSheetsModal
        isOpen={isGoogleSheetsOpen}
        onClose={() => setIsGoogleSheetsOpen(false)}
        characters={mappedCharacters}
        onImportCharacters={handleImportFromSheets}
        showToast={showToast}
      />

      {/* Floating Toast Notification */}
      <Toast message={toastMessage} />

      {/* Floating Tab: Em Có Yêu Anh Không? */}
      <LoveQuestionWidget
        characters={mappedCharacters}
        onSelectCharacter={handleSelectCharacter}
      />
    </div>
  );
}
