import React from 'react';
import { Heart, Link as LinkIcon, MessageSquareQuote, BookOpen } from 'lucide-react';
import { Character } from '../types';

interface CharacterCardProps {
  character: Character;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectCharacter: (character: Character) => void;
  onCopyLink: (link: string, name: string, e: React.MouseEvent) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isFavorite,
  onToggleFavorite,
  onSelectCharacter,
  onCopyLink
}) => {
  return (
    <div
      onClick={() => onSelectCharacter(character)}
      className="group relative h-full [perspective:1000px] cursor-pointer transform hover:-translate-y-1.5 transition-transform duration-300"
      id={`character-card-${character.id}`}
    >
      <div className="relative h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        
        {/* FRONT FACE */}
        <div className="relative bg-[#FFF9F6] dark:bg-[#1C0D0F] rounded-2xl p-3 border-2 border-[#F3B8C2] dark:border-[#522930] shadow-md flex flex-col h-full overflow-visible [backface-visibility:hidden] transition-colors duration-300">
          {/* STAMP PERFORATION (PUNCH HOLES) ALONG EDGES */}
          {/* Top perforated holes */}
          <div className="absolute -top-1.5 left-4 right-4 flex justify-between pointer-events-none z-10">
            {[...Array(12)].map((_, i) => (
              <span key={i} className="w-2.5 h-2.5 rounded-full bg-[#FADAD9] dark:bg-[#201113] border border-[#F3B8C2]/50 dark:border-[#522930]/50 shrink-0 transition-colors duration-300"></span>
            ))}
          </div>
          {/* Bottom perforated holes */}
          <div className="absolute -bottom-1.5 left-4 right-4 flex justify-between pointer-events-none z-10">
            {[...Array(12)].map((_, i) => (
              <span key={i} className="w-2.5 h-2.5 rounded-full bg-[#FADAD9] dark:bg-[#201113] border border-[#F3B8C2]/50 dark:border-[#522930]/50 shrink-0 transition-colors duration-300"></span>
            ))}
          </div>
          {/* Left perforated holes */}
          <div className="absolute top-4 bottom-4 -left-1.5 flex flex-col justify-between pointer-events-none z-10">
            {[...Array(14)].map((_, i) => (
              <span key={i} className="w-2.5 h-2.5 rounded-full bg-[#FADAD9] dark:bg-[#201113] border border-[#F3B8C2]/50 dark:border-[#522930]/50 shrink-0 transition-colors duration-300"></span>
            ))}
          </div>
          {/* Right perforated holes */}
          <div className="absolute top-4 bottom-4 -right-1.5 flex flex-col justify-between pointer-events-none z-10">
            {[...Array(14)].map((_, i) => (
              <span key={i} className="w-2.5 h-2.5 rounded-full bg-[#FADAD9] dark:bg-[#201113] border border-[#F3B8C2]/50 dark:border-[#522930]/50 shrink-0 transition-colors duration-300"></span>
            ))}
          </div>

          {/* INNER STAMP FRAME CONTAINER */}
          <div className="relative bg-white dark:bg-[#2A1619] border border-[#F5B5C0] dark:border-[#522930] rounded-xl p-2.5 flex flex-col flex-1 space-y-3 transition-colors duration-300">
            {/* STAMP HEADER: DENOMINATION & POSTMARK */}
            <div className="flex items-center justify-between px-1">
              {/* Stamp Denomination */}
              <div className="flex items-center gap-1 bg-[#FAF0F1] dark:bg-[#321B1E] px-2 py-0.5 rounded-md border border-[#F3B8C2] dark:border-[#522930] text-[10px] font-black text-[#823B47] dark:text-[#EFAEB6] tracking-wider uppercase transition-colors duration-300">
                <span>LOVE POST</span>
                <span className="text-[#C86D7C] dark:text-[#FFA9B8]">99★</span>
              </div>

              <span className="text-[10px] font-mono text-[#823B47]/80 dark:text-[#EFAEB6]/80 font-bold uppercase">
                NO. 00{character.id}
              </span>
            </div>

            {/* STAMP IMAGE FRAME */}
            <div className="relative h-48 sm:h-52 w-full overflow-hidden rounded-lg bg-[#FADAD9] dark:bg-[#301B1E] border border-[#F3B8C2] dark:border-[#522930] transition-colors duration-300 isolate">
              <img
                src={character.avatar}
                alt={character.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';
                }}
                className="w-full h-full object-cover object-[center_15%] scale-[1.35] origin-[center_15%] transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#5C2830]/85 via-[#5C2830]/20 to-transparent"></div>

              {/* VINTAGE POSTMARK SEAL (Con Dấu Bưu Điện) OVERLAY */}
              <div className="absolute top-2 right-2 z-10 pointer-events-none opacity-85 transform rotate-12">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/90 p-1 flex items-center justify-center text-center bg-[#C86D7C]/30 backdrop-blur-xs">
                  <div className="w-full h-full rounded-full border border-white/80 flex flex-col items-center justify-center text-[7px] font-bold text-white uppercase leading-tight tracking-tighter">
                     <span>POSTAGE</span>
                     <span className="text-[9px] font-extrabold my-0.5">SEAL</span>
                     <span>AIR MAIL</span>
                  </div>
                </div>
              </div>

              {/* Category Badge */}
              <div className="absolute top-2.5 left-2.5 z-20">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-white/90 dark:bg-[#341F22]/90 text-[#823B47] dark:text-[#EFAEB6] border border-[#F3B8C2] dark:border-[#522930] shadow-sm uppercase tracking-wide transition-colors duration-300">
                  {character.category}
                </span>
              </div>

              {/* Favorite Button */}
              <button
                onClick={(e) => onToggleFavorite(character.id, e)}
                className={`absolute top-2.5 right-2.5 z-20 p-2 rounded-full backdrop-blur-xl transition-all cursor-pointer ${
                  isFavorite
                    ? 'bg-[#E892A0] text-white border border-white scale-110 shadow-md'
                    : 'bg-white/80 dark:bg-[#341F22]/85 text-[#823B47] dark:text-[#EFAEB6] hover:bg-white dark:hover:bg-[#341F22] hover:text-[#C86D7C] dark:hover:text-[#FFA9B8] border border-[#F3B8C2] dark:border-[#522930]'
                }`}
                title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white text-white' : ''}`} />
              </button>

              {/* Title overlay */}
              <div className="absolute bottom-2.5 left-3 right-3">
                <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-[#FFEBEF] transition-colors flex items-center gap-1.5 line-clamp-1">
                  {character.name}
                  {character.isCustom && (
                    <span className="text-[9px] bg-white/20 text-pink-100 border border-white/30 px-1.5 py-0.5 rounded font-bold">
                      Custom
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-pink-100/90 font-medium line-clamp-1">
                  {character.title}
                </p>
              </div>
            </div>

            {/* STAMP CONTENT BODY */}
            <div className="flex-1 flex flex-col justify-between space-y-2.5">
              {/* Quote */}
              <div className="bg-[#FAF0F1] dark:bg-[#321B1E] rounded-xl p-2.5 border border-[#F3B8C2]/60 dark:border-[#522930]/60 relative transition-colors duration-300">
                <div className="flex items-start gap-1.5">
                  <MessageSquareQuote className="w-3.5 h-3.5 text-[#C86D7C] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#5C2830] dark:text-[#F9E3E6] italic line-clamp-2 leading-relaxed font-medium">
                    "{character.openingMessage.replace(/\*.*?\*/g, '').trim()}"
                  </p>
                </div>
              </div>

              {/* Tags */}
              {(() => {
                const uniqueTags = Array.from(
                  new Map(
                    character.tags
                      .map(t => t.trim())
                      .filter(Boolean)
                      .map(t => [t.toLowerCase(), t])
                  ).values()
                );
                return (
                  <div className="flex flex-wrap gap-1">
                    {uniqueTags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FADAD9]/70 dark:bg-[#3A1F24]/70 text-[#823B47] dark:text-[#EFAEB6] border border-[#F3B8C2]/60 dark:border-[#522930]/60 transition-colors duration-300"
                      >
                        #{tag}
                      </span>
                    ))}
                    {uniqueTags.length > 3 && (
                      <span className="text-[10px] text-[#823B47] dark:text-[#EFAEB6] px-1 pt-0.5 font-bold">
                        +{uniqueTags.length - 3}
                      </span>
                    )}
                  </div>
                );
              })()}

              {/* POSTAL STAMP FOOTER ACTIONS */}
              <div className="pt-2 border-t border-dashed border-[#F3B8C2] dark:border-[#522930] flex items-center gap-2">
                <button
                  onClick={() => onSelectCharacter(character)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#E892A0] to-[#C86D7C] hover:brightness-105 text-white rounded-xl text-xs font-bold transition-all shadow-sm border border-white/40 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Xem mắt</span>
                </button>

                <button
                  onClick={(e) => onCopyLink(character.characterLink, character.name, e)}
                  className="px-2.5 py-2 bg-[#FAF0F1] dark:bg-[#321B1E] hover:bg-[#FADAD9] dark:hover:bg-[#3D2529] text-[#602D35] dark:text-[#EFAEB6] border border-[#F3B8C2] dark:border-[#522930] rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer transition-colors duration-300"
                  title="Sao chép đường dẫn"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-[#C86D7C]" />
                  <span className="hidden sm:inline">Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div className="absolute inset-0 bg-[#FFF9F6] dark:bg-[#1C0D0F] rounded-2xl p-2 border-2 border-[#F3B8C2] dark:border-[#522930] shadow-md flex flex-col items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden transition-colors duration-300">
          <div className="relative w-full h-full rounded-xl overflow-hidden border border-[#F5B5C0] dark:border-[#522930] isolate">
            <img
              src={character.avatar}
              alt={character.name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';
              }}
              className="absolute inset-0 w-full h-full object-cover object-[center_15%] scale-[1.35] origin-[center_15%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#5C2830]/90 via-[#5C2830]/60 to-[#5C2830]/30 dark:from-[#201113]/90 dark:via-[#201113]/60 dark:to-[#201113]/30 backdrop-blur-[2px] transition-colors duration-300"></div>
            
            <div className="absolute inset-0 p-4 flex flex-col items-center justify-center text-center space-y-3">
              <MessageSquareQuote className="w-8 h-8 text-pink-200" />
              <h4 className="text-sm font-extrabold text-white">Câu chuyện</h4>
              <p className="text-xs text-pink-50 italic font-medium leading-relaxed line-clamp-6 drop-shadow-md">
                "{character.backstory}"
              </p>
              <div className="mt-2 w-12 h-px bg-pink-300/50 mx-auto"></div>
              <span className="text-[10px] font-bold text-pink-200 uppercase tracking-widest drop-shadow-md">{character.name}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
