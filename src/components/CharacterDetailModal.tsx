import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Link as LinkIcon,
  Copy,
  Check,
  QrCode,
  Share2,
  Tag,
  User,
  ExternalLink
} from 'lucide-react';
import { Character } from '../types';
import { CuteStarIcon } from './CuteStarIcon';

interface CharacterDetailModalProps {
  character: Character | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onCopyLink: (link: string, name: string) => void;
  onShare: (character: Character) => void;
}

export const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({
  character,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onCopyLink,
  onShare
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showBackstory, setShowBackstory] = useState(false);

  useEffect(() => {
    if (character) {
      setShowQr(false);
      setShowBackstory(false);
    }
  }, [character]);

  if (!isOpen || !character) return null;

  const handleCopyLinkClick = () => {
    onCopyLink(character.characterLink, character.name);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Generate QR Code URL via free API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    character.characterLink
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-[#5C2830]/40 dark:bg-black/60 backdrop-blur-md animate-fadeIn">
      {/* Modal Container */}
      <div
        className="relative w-full max-w-3xl bg-[#FAF0F1] dark:bg-[#1C0D0F] border border-[#F3B8C2] dark:border-[#522930] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto text-[#5C2830] dark:text-[#F9E3E6] transition-colors duration-300"
        id={`character-modal-${character.id}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 p-2.5 rounded-full bg-white/80 dark:bg-[#341F22]/80 hover:bg-white dark:hover:bg-[#341F22] text-[#823B47] dark:text-[#EFAEB6] hover:text-[#5C2830] dark:hover:text-[#F9E3E6] border border-[#F3B8C2] dark:border-[#522930] transition-all shadow-md cursor-pointer"
          id="close-modal-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Title */}
        <div className="p-4 sm:p-5 border-b border-[#F3B8C2] dark:border-[#522930] bg-[#FADAD9]/80 dark:bg-[#321B1E]/80 backdrop-blur-xl flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center gap-2.5">
            <CuteStarIcon size={30} />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#5C2830] dark:text-[#F9E3E6]">Hôm nay bé đã yêu anh chưa?</h3>
              <p className="text-xs text-[#823B47] dark:text-[#EFAEB6] font-medium">Chi tiết tem thư & thông tin hồ sơ nhân vật</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">

          {/* 1. TÊN NHÂN VẬT & ANH TEM THƯ (NAME, TITLE, STAMP AVATAR, CATEGORY) */}
          <div className="bg-[#FFF9F6] dark:bg-[#251315] backdrop-blur-2xl rounded-3xl p-5 border-2 border-[#F3B8C2] dark:border-[#522930] shadow-sm relative overflow-hidden transition-colors duration-300">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Postage Stamp Avatar Container */}
              <div className="relative p-2 bg-white dark:bg-[#1C0D0F] border border-[#F5B5C0] dark:border-[#522930] rounded-2xl shadow-md shrink-0 transition-colors duration-300">
                {/* Stamp Perforated Cutouts */}
                <div className="absolute -top-1 left-2 right-2 flex justify-between pointer-events-none z-10">
                  {[...Array(6)].map((_, i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#FAF0F1] dark:bg-[#251315] border border-[#F3B8C2]/40 dark:border-[#522930]/40 transition-colors duration-300"></span>
                  ))}
                </div>
                <div className="absolute -bottom-1 left-2 right-2 flex justify-between pointer-events-none z-10">
                  {[...Array(6)].map((_, i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#FAF0F1] dark:bg-[#251315] border border-[#F3B8C2]/40 dark:border-[#522930]/40 transition-colors duration-300"></span>
                  ))}
                </div>

                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-[#E892A0] dark:border-[#522930] shadow-inner bg-[#FADAD9] dark:bg-[#301B1E] transition-colors duration-300 isolate">
                  <img
                    src={character.avatar}
                    alt={character.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';
                    }}
                    className="w-full h-full object-cover object-[center_15%] scale-[1.35] origin-[center_15%]"
                  />
                  {/* Postmark Seal Overlay */}
                  <div className="absolute top-1 right-1 z-10 pointer-events-none opacity-80 transform rotate-12">
                    <div className="w-12 h-12 rounded-full border border-dashed border-white p-0.5 flex items-center justify-center text-center bg-[#C86D7C]/40">
                      <div className="w-full h-full rounded-full border border-white/70 flex flex-col items-center justify-center text-[6px] font-bold text-white uppercase leading-none">
                        <span>STAMP</span>
                        <span className="text-[8px] text-pink-200 font-extrabold">2026</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-1 text-center">
                  <span className="text-[9px] font-mono text-[#823B47] dark:text-[#EFAEB6] font-bold">POSTAGE ★ 99¢</span>
                </div>
              </div>

              {/* Name Info */}
              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#5C2830] dark:text-[#F9E3E6] tracking-tight">
                    {character.name}
                  </h2>
                  {character.isCustom && (
                    <span className="px-2.5 py-0.5 text-xs bg-[#FADAD9] dark:bg-[#321B1E] text-[#823B47] dark:text-[#EFAEB6] border border-[#F3B8C2] dark:border-[#522930] rounded-full font-bold transition-colors duration-300">
                      Custom
                    </span>
                  )}
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#E892A0] text-white">
                    {character.category}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-[#C86D7C] dark:text-[#FFA9B8] font-semibold">
                  {character.title}
                </p>

                {character.creator && (
                  <p className="text-xs text-[#823B47] dark:text-[#EFAEB6]">
                    Tác giả: <strong className="text-[#5C2830] dark:text-[#F9E3E6]">{character.creator}</strong>
                  </p>
                )}

                {/* Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <button
                    onClick={() => onToggleFavorite(character.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      isFavorite
                        ? 'bg-[#E892A0] text-white shadow-md'
                        : 'bg-[#FADAD9]/70 dark:bg-[#3A1F24]/70 hover:bg-[#FADAD9] dark:hover:bg-[#3A1F24] text-[#602D35] dark:text-[#EFAEB6] border border-[#F3B8C2] dark:border-[#522930] transition-colors duration-300'
                    }`}
                    id="modal-fav-btn"
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white text-white' : 'text-[#C86D7C]'}`} />
                    <span>{isFavorite ? 'Đã Yêu Thích' : 'Yêu Thích'}</span>
                  </button>

                  <button
                    onClick={() => onShare(character)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#3D2529] hover:bg-[#FADAD9]/50 dark:hover:bg-[#3A1F24]/50 text-[#602D35] dark:text-[#EFAEB6] border border-[#F3B8C2] dark:border-[#522930] rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-sm transition-colors duration-300"
                    id="modal-share-btn"
                  >
                    <Share2 className="w-4 h-4 text-[#C86D7C]" />
                    <span>Chia Sẻ</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. TAG (TỪ KHÓA) */}
          <div className="bg-white/90 dark:bg-[#251315]/90 backdrop-blur-2xl rounded-3xl p-5 border border-[#F3B8C2] dark:border-[#522930] space-y-3 shadow-sm transition-colors duration-300">
            <h3 className="text-xs font-extrabold text-[#C86D7C] dark:text-[#FFA9B8] uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#C86D7C]" />
              <span>Thẻ / Từ Khóa (Tags)</span>
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {Array.from(
                new Map(
                  character.tags
                    .map(t => t.trim())
                    .filter(Boolean)
                    .map(t => [t.toLowerCase(), t])
                ).values()
              ).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-bold px-3.5 py-1.5 rounded-2xl bg-[#FADAD9] dark:bg-[#321B1E] text-[#823B47] dark:text-[#EFAEB6] border border-[#F3B8C2] dark:border-[#522930] transition-colors duration-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* 3. BACKSTORY (CÂU CHUYỆN NỀN) */}
          <div className="bg-white/90 dark:bg-[#251315]/90 backdrop-blur-2xl rounded-3xl p-5 border border-[#F3B8C2] dark:border-[#522930] space-y-3 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-[#C86D7C] dark:text-[#FFA9B8] uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-[#C86D7C]" />
                <span>Câu Chuyện Nền</span>
              </h3>
              <button
                onClick={() => setShowBackstory(!showBackstory)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF0F1] dark:bg-[#321B1E] hover:bg-[#FADAD9] dark:hover:bg-[#3D2529] text-[#C86D7C] dark:text-[#FFA9B8] hover:text-[#823B47] dark:hover:text-[#FFA9B8]/80 border border-[#F3B8C2] dark:border-[#522930] rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs transition-colors duration-300"
                title="Bấm để xem/ẩn Backstory"
              >
                <LinkIcon className="w-3.5 h-3.5 text-[#C86D7C]" />
                <span className="underline decoration-[#C86D7C] underline-offset-2">Backstory</span>
                <span className="text-[10px] bg-[#E892A0] text-white px-1.5 py-0.2 rounded-md ml-1">
                  {showBackstory ? 'Ẩn' : 'Mở'}
                </span>
              </button>
            </div>

            {/* Backstory Link Box */}
            <div className="pt-1">
              {!showBackstory ? (
                <div
                  onClick={() => setShowBackstory(true)}
                  className="flex items-center justify-between p-3.5 bg-[#FAF0F1]/80 dark:bg-[#321B1E]/80 hover:bg-[#FADAD9]/60 dark:hover:bg-[#3D2529]/60 border border-dashed border-[#F3B8C2] dark:border-[#522930] cursor-pointer transition-all text-xs font-bold text-[#823B47] dark:text-[#EFAEB6] group transition-colors duration-300"
                >
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#E892A0] text-white">
                      <LinkIcon className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-sm font-bold text-[#5C2830] dark:text-[#F9E3E6] group-hover:text-[#C86D7C] dark:group-hover:text-[#FFA9B8] transition-colors">
                      🔗 Backstory
                    </span>
                  </div>
                  <span className="text-xs text-[#C86D7C] dark:text-[#FFA9B8] group-hover:underline">
                    Xem chi tiết cốt truyện &rarr;
                  </span>
                </div>
              ) : (
                <div className="text-sm text-[#5C2830] dark:text-[#F9E3E6] leading-relaxed p-4 bg-[#FADAD9]/40 dark:bg-[#321B1E]/40 rounded-2xl border border-[#F3B8C2]/60 dark:border-[#522930]/60 font-medium animate-fadeIn transition-colors duration-300">
                  <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#F3B8C2]/50 dark:border-[#522930]/50 text-xs text-[#823B47] dark:text-[#EFAEB6] font-bold">
                    <span className="flex items-center gap-1">
                      <LinkIcon className="w-3.5 h-3.5 text-[#C86D7C]" />
                      <span>Backstory</span>
                    </span>
                    <button
                      onClick={() => setShowBackstory(false)}
                      className="text-[#C86D7C] dark:text-[#FFA9B8] hover:underline cursor-pointer"
                    >
                      [Đóng]
                    </button>
                  </div>
                  <div className="max-h-52 overflow-y-auto pr-2.5 whitespace-pre-line custom-scrollbar">
                    {character.backstory}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. LINK GOOGLE AI */}
          <div className="bg-white/90 dark:bg-[#251315]/90 backdrop-blur-2xl rounded-3xl p-5 border border-[#F3B8C2] dark:border-[#522930] space-y-3 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-[#C86D7C]" />
                <h3 className="text-xs font-extrabold text-[#C86D7C] dark:text-[#FFA9B8] uppercase tracking-wider">
                  Link Google AI
                </h3>
              </div>
              <button
                onClick={() => setShowQr(!showQr)}
                className="flex items-center gap-1 text-xs text-[#C86D7C] dark:text-[#FFA9B8] hover:text-[#A85365] font-bold cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>{showQr ? 'Ẩn Mã QR' : 'Mã QR'}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 bg-[#FADAD9]/40 dark:bg-[#321B1E]/40 border border-[#F3B8C2] dark:border-[#522930] rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-[#5C2830] dark:text-[#F9E3E6] font-mono truncate select-all transition-colors duration-300">
                {character.characterLink}
              </div>

              <button
                onClick={handleCopyLinkClick}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#E892A0] to-[#C86D7C] hover:brightness-105 text-white rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-pink-200/50 border border-white/40 cursor-pointer"
                id="copy-character-link-btn"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-200" />
                    <span>Đã Sao Chép!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Sao Chép Link</span>
                  </>
                )}
              </button>

              <a
                href={character.characterLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#FADAD9]/70 dark:bg-[#3A1F24]/70 hover:bg-[#FADAD9] dark:hover:bg-[#3A1F24] text-[#5C2830] dark:text-[#F9E3E6] rounded-2xl border border-[#F3B8C2] dark:border-[#522930] flex items-center justify-center cursor-pointer transition-all transition-colors duration-300"
                title="Mở liên kết trong tab mới"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {showQr && (
              <div className="pt-3 border-t border-[#F3B8C2]/60 dark:border-[#522930]/60 flex flex-col items-center justify-center animate-fadeIn">
                <div className="bg-white dark:bg-[#341F22] p-3 rounded-2xl shadow-md border border-[#F3B8C2] dark:border-[#522930] transition-colors duration-300">
                  <img src={qrCodeUrl} alt="QR Code" className="w-36 h-36" />
                </div>
                <p className="text-xs text-[#823B47] dark:text-[#EFAEB6] mt-2 font-medium">Quét mã QR để mở link Google AI trên điện thoại</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
