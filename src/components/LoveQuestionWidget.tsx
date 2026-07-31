import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Shuffle, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Character } from '../types';

interface LoveQuestionWidgetProps {
  characters: Character[];
  onSelectCharacter: (character: Character) => void;
}

export const LoveQuestionWidget: React.FC<LoveQuestionWidgetProps> = ({
  characters,
  onSelectCharacter,
}) => {
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  // Pick initial random character
  useEffect(() => {
    if (characters.length > 0 && !currentCharacter) {
      const random = characters[Math.floor(Math.random() * characters.length)];
      setCurrentCharacter(random);
    }
  }, [characters, currentCharacter]);

  const handleShuffle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (characters.length === 0) return;
    // Pick different character if possible
    let next = characters[Math.floor(Math.random() * characters.length)];
    if (characters.length > 1 && currentCharacter && next.id === currentCharacter.id) {
      const filtered = characters.filter((c) => c.id !== currentCharacter.id);
      next = filtered[Math.floor(Math.random() * filtered.length)];
    }
    setCurrentCharacter(next);
  };

  const handleLoveClick = () => {
    if (currentCharacter) {
      onSelectCharacter(currentCharacter);
    }
  };

  if (!currentCharacter) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 animate-fadeIn font-sans">
      {isMinimized ? (
        /* Minimized Floating Tab */
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#FAF0F1]/95 backdrop-blur-xl border-2 border-[#F3B8C2] text-[#5C2830] rounded-full shadow-lg hover:scale-105 transition-all cursor-pointer font-bold text-xs"
          title="Mở tab 'Em có yêu anh không?'"
        >
          <Heart className="w-4 h-4 text-[#C86D7C] fill-[#C86D7C] animate-pulse" />
          <span>Em có yêu anh không?</span>
          <ChevronUp className="w-4 h-4 text-[#C86D7C]" />
        </button>
      ) : (
        /* Floating Widget Box */
        <div className="w-72 sm:w-80 bg-[#FAF0F1]/95 backdrop-blur-2xl border-2 border-[#F3B8C2] rounded-3xl p-4 shadow-2xl text-[#5C2830] space-y-3 relative">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-[#F3B8C2]/60 pb-2">
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-[#C86D7C] fill-[#C86D7C]" />
              <h3 className="text-xs font-bold text-[#5C2830]">Em có yêu anh không?</h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleShuffle}
                className="p-1 rounded-xl bg-white/80 hover:bg-white text-[#823B47] border border-[#F3B8C2] transition-all cursor-pointer shadow-sm"
                title="Đổi nhân vật khác"
              >
                <Shuffle className="w-3.5 h-3.5 text-[#C86D7C]" />
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 rounded-xl bg-white/80 hover:bg-white text-[#823B47] border border-[#F3B8C2] transition-all cursor-pointer shadow-sm"
                title="Thu nhỏ tab"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Character Highlight Info */}
          <div className="bg-white/80 rounded-2xl p-3 border border-[#F3B8C2] space-y-2">
            <div className="flex items-center gap-3">
              <img
                src={currentCharacter.avatar}
                alt={currentCharacter.name}
                className="w-12 h-12 rounded-2xl object-cover border border-[#F3B8C2] shadow-sm shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-[#5C2830] truncate">{currentCharacter.name}</h4>
                <p className="text-[11px] text-[#823B47] font-medium truncate">{currentCharacter.title}</p>
              </div>
            </div>

            {/* Tags display */}
            <div className="flex flex-wrap gap-1 pt-1">
              {currentCharacter.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-[#FADAD9] text-[#602D35] rounded-full text-[10px] font-bold border border-[#F3B8C2]/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Button: Yêu Anh */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLoveClick}
              className="flex-1 py-2.5 bg-gradient-to-r from-[#E892A0] to-[#C86D7C] hover:brightness-105 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-pink-300/40 border border-white/40 transition-all cursor-pointer flex items-center justify-center gap-1.5 transform active:scale-95"
              id="love-button"
            >
              <Heart className="w-4 h-4 fill-white text-white animate-bounce" />
              <span>Yêu anh</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
