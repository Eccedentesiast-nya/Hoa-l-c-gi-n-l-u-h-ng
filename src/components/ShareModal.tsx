import React, { useState } from 'react';
import { X, Copy, Check, Share2, Facebook, MessageCircle, Send, QrCode } from 'lucide-react';
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

  const shareOnTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(character.characterLink)}&text=${encodeURIComponent(shareTitle)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5C2830]/40 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#FAF0F1] border border-[#F3B8C2] rounded-3xl shadow-2xl p-5 space-y-4 text-[#5C2830]">
        <div className="flex items-center justify-between border-b border-[#F3B8C2] pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#C86D7C]" />
            <h3 className="text-base font-bold text-[#5C2830]">Chia Sẻ Hồ Sơ Nhân Vật</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/80 hover:bg-white text-[#823B47] border border-[#F3B8C2] cursor-pointer transition-all shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Character Card Preview */}
        <div className="flex items-center gap-3 p-3 bg-white/90 backdrop-blur-md rounded-2xl border border-[#F3B8C2] shadow-sm">
          <img src={character.avatar} alt={character.name} className="w-12 h-12 rounded-xl object-cover border border-[#E892A0]" />
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-[#5C2830] truncate">{character.name}</h4>
            <p className="text-xs text-[#C86D7C] truncate">{character.title}</p>
          </div>
        </div>

        {/* Direct Link Input */}
        <div>
          <label className="block text-xs text-[#823B47] font-semibold mb-1.5">Link Nhân Vật</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={character.characterLink}
              className="flex-1 bg-white border border-[#F3B8C2] rounded-2xl px-3.5 py-2.5 text-xs text-[#5C2830] select-all focus:outline-none"
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
        <div className="pt-3 border-t border-[#F3B8C2]">
          <span className="block text-xs text-[#823B47] font-semibold mb-2.5">Chia sẻ qua mạng xã hội:</span>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={shareOnFacebook}
              className="flex items-center justify-center gap-2 p-2.5 bg-blue-500/15 hover:bg-blue-500/25 text-blue-700 border border-blue-200 rounded-2xl text-xs font-bold cursor-pointer transition-all"
            >
              <Facebook className="w-4 h-4 fill-blue-600 text-blue-600" />
              <span>Facebook</span>
            </button>

            <button
              onClick={shareOnTelegram}
              className="flex items-center justify-center gap-2 p-2.5 bg-sky-500/15 hover:bg-sky-500/25 text-sky-700 border border-sky-200 rounded-2xl text-xs font-bold cursor-pointer transition-all"
            >
              <Send className="w-4 h-4 text-sky-600" />
              <span>Telegram</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
