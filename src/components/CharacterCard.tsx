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
      className="group relative bg-[#FFF9F6] rounded-2xl p-3 border-2 border-[#F3B8C2] shadow-md hover:shadow-xl hover:shadow-pink-300/40 transition-all duration-300 flex flex-col overflow-visible cursor-pointer transform hover:-translate-y-1.5"
      id={`character-card-${character.id}`}
    >
      {/* STAMP PERFORATION (PUNCH HOLES) ALONG EDGES */}
      {/* Top perforated holes */}
      <div className="absolute -top-1.5 left-4 right-4 flex justify-between pointer-events-none z-10">
        {[...Array(12)].map((_, i) => (
          <span key={i} className="w-2.5 h-2.5 rounded-full bg-[#FADAD9] border border-[#F3B8C2]/50 shrink-0"></span>
        ))}
      </div>
      {/* Bottom perforated holes */}
      <div className="absolute -bottom-1.5 left-4 right-4 flex justify-between pointer-events-none z-10">
        {[...Array(12)].map((_, i) => (
          <span key={i} className="w-2.5 h-2.5 rounded-full bg-[#FADAD9] border border-[#F3B8C2]/50 shrink-0"></span>
        ))}
      </div>
      {/* Left perforated holes */}
      <div className="absolute top-4 bottom-4 -left-1.5 flex flex-col justify-between pointer-events-none z-10">
        {[...Array(14)].map((_, i) => (
          <span key={i} className="w-2.5 h-2.5 rounded-full bg-[#FADAD9] border border-[#F3B8C2]/50 shrink-0"></span>
        ))}
      </div>
      {/* Right perforated holes */}
      <div className="absolute top-4 bottom-4 -right-1.5 flex flex-col justify-between pointer-events-none z-10">
        {[...Array(14)].map((_, i) => (
          <span key={i} className="w-2.5 h-2.5 rounded-full bg-[#FADAD9] border border-[#F3B8C2]/50 shrink-0"></span>
        ))}
      </div>

      {/* INNER STAMP FRAME CONTAINER */}
      <div className="relative bg-white border border-[#F5B5C0] rounded-xl p-2.5 flex flex-col flex-1 space-y-3">
        {/* STAMP HEADER: DENOMINATION & POSTMARK */}
        <div className="flex items-center justify-between px-1">
          {/* Stamp Denomination */}
          <div className="flex items-center gap-1 bg-[#FAF0F1] px-2 py-0.5 rounded-md border border-[#F3B8C2] text-[10px] font-black text-[#823B47] tracking-wider uppercase">
            <span>LOVE POST</span>
            <span className="text-[#C86D7C]">99★</span>
          </div>

          <span className="text-[10px] font-mono text-[#823B47]/80 font-bold uppercase">
            NO. 00{character.id}
          </span>
        </div>

        {/* STAMP IMAGE FRAME */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden rounded-lg bg-[#FADAD9] border border-[#F3B8C2]">
          <img
            src={character.avatar}
            alt={character.name}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';
            }}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
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
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-white/90 text-[#823B47] border border-[#F3B8C2] shadow-sm uppercase tracking-wide">
              {character.category}
            </span>
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => onToggleFavorite(character.id, e)}
            className={`absolute top-2.5 right-2.5 z-20 p-2 rounded-full backdrop-blur-xl transition-all cursor-pointer ${
              isFavorite
                ? 'bg-[#E892A0] text-white border border-white scale-110 shadow-md'
                : 'bg-white/80 text-[#823B47] hover:bg-white hover:text-[#C86D7C] border border-[#F3B8C2]'
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
          <div className="bg-[#FAF0F1] rounded-xl p-2.5 border border-[#F3B8C2]/60 relative">
            <div className="flex items-start gap-1.5">
              <MessageSquareQuote className="w-3.5 h-3.5 text-[#C86D7C] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#5C2830] italic line-clamp-2 leading-relaxed font-medium">
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
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FADAD9]/70 text-[#823B47] border border-[#F3B8C2]/60"
                  >
                    #{tag}
                  </span>
                ))}
                {uniqueTags.length > 3 && (
                  <span className="text-[10px] text-[#823B47] px-1 pt-0.5 font-bold">
                    +{uniqueTags.length - 3}
                  </span>
                )}
              </div>
            );
          })()}

          {/* POSTAL STAMP FOOTER ACTIONS */}
          <div className="pt-2 border-t border-dashed border-[#F3B8C2] flex items-center gap-2">
            <button
              onClick={() => onSelectCharacter(character)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#E892A0] to-[#C86D7C] hover:brightness-105 text-white rounded-xl text-xs font-bold transition-all shadow-sm border border-white/40 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Xem mắt</span>
            </button>

            <button
              onClick={(e) => onCopyLink(character.characterLink, character.name, e)}
              className="px-2.5 py-2 bg-[#FAF0F1] hover:bg-[#FADAD9] text-[#602D35] border border-[#F3B8C2] rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="Sao chép đường dẫn"
            >
              <LinkIcon className="w-3.5 h-3.5 text-[#C86D7C]" />
              <span className="hidden sm:inline">Link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
