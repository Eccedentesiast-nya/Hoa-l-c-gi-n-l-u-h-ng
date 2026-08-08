import React, { useState } from 'react';
import { X, Copy, Check, Share2, Facebook, MessageCircle, QrCode } from 'lucide-react';
import { Character } from '../types';

interface ShareModalProps {
  character: Character | null;
  isOpen: boolean;
  onClose: () => void;
  onCopyLink: (link: string, name: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  character,
  isOpen,
  onClose,
  onCopyLink
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !character) return null;

  const handleCopy = () => {
    onCopyLink(character.characterLink, character.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTitle = `Hồ Sơ Nhân Vật: ${character.name} (${character.title})`;
  const shareText = `Khám phá backstory và tin nhắn mở đầu của ${character.name}!`;

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(character.characterLink)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5C2830]/40 dark:bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#FAF0F1] dark:bg-[#1C0D0F] border border-[#F3B8C2] dark:border-[#522930] rounded-3xl shadow-2xl p-5 space-y-4 text-[#5C2830] dark:text-[#F9E3E6] transition-colors duration-300">
        <div className="flex items-center justify-between border-b border-[#F3B8C2] dark:border-[#522930] pb-3 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#C86D7C]" />
            <h3 className="text-base font-bold text-[#5C2830] dark:text-[#F9E3E6]">Hôm nay bé đã yêu anh chưa?</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/80 dark:bg-[#341F22]/80 hover:bg-white dark:hover:bg-[#341F22] text-[#823B47] dark:text-[#EFAEB6] border border-[#F3B8C2] dark:border-[#522930] cursor-pointer transition-all shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
 
        {/* Character Card Preview */}
        <div className="flex items-center gap-3 p-3 bg-white/90 dark:bg-[#251315]/90 backdrop-blur-md rounded-2xl border border-[#F3B8C2] dark:border-[#522930] shadow-sm transition-colors duration-300">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#E892A0] dark:border-[#522930] bg-[#FAF0F1] shrink-0 isolate">
            <img
              src={character.avatar}
              alt={character.name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';
              }}
              className="w-full h-full object-cover object-[center_15%] scale-[1.35] origin-[center_15%]"
            />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-[#5C2830] dark:text-[#F9E3E6] truncate">{character.name}</h4>
            <p className="text-xs text-[#C86D7C] dark:text-[#FFA9B8] truncate">{character.title}</p>
          </div>
        </div>
 
        {/* Direct Link Input */}
        <div>
          <label className="block text-xs text-[#823B47] dark:text-[#EFAEB6] font-semibold mb-1.5">Link Nhân Vật</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={character.characterLink}
              className="flex-1 bg-white dark:bg-[#251315] border border-[#F3B8C2] dark:border-[#522930] rounded-2xl px-3.5 py-2.5 text-xs text-[#5C2830] dark:text-[#F9E3E6] select-all focus:outline-none transition-colors duration-300"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-gradient-to-r from-[#E892A0] to-[#C86D7C] hover:brightness-105 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all border border-white/40 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>
        </div>
 
        {/* Social Share Buttons */}
        <div className="pt-3 border-t border-[#F3B8C2] dark:border-[#522930] transition-colors duration-300">
          <span className="block text-xs text-[#823B47] dark:text-[#EFAEB6] font-semibold mb-2.5">Chia sẻ qua mạng xã hội:</span>
          <div className="grid grid-cols-1 gap-2.5">
            <button
              onClick={shareOnFacebook}
              className="flex items-center justify-center gap-2 p-2.5 bg-blue-500/15 dark:bg-blue-500/10 hover:bg-blue-500/25 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50 rounded-2xl text-xs font-bold cursor-pointer transition-all"
            >
              <Facebook className="w-4 h-4 fill-blue-600 text-blue-600" />
              <span>Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
