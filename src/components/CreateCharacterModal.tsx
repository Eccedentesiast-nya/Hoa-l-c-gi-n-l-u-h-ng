import React, { useState } from 'react';
import { X, Plus, Sparkles, Image as ImageIcon, Link as LinkIcon, MessageSquare, BookOpen, Tag } from 'lucide-react';
import { Character, CategoryFilter } from '../types';

interface CreateCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCharacter: (newChar: Character) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80'
];

export const CreateCharacterModal: React.FC<CreateCharacterModalProps> = ({
  isOpen,
  onClose,
  onCreateCharacter
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('Sci-Fi');
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0]);
  const [backstory, setBackstory] = useState('');
  const [openingMessage, setOpeningMessage] = useState('');
  const [characterLink, setCharacterLink] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [personality, setPersonality] = useState('');
  const [voiceTone, setVoiceTone] = useState('');
  const [creator, setCreator] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !backstory.trim() || !openingMessage.trim()) return;

    const id = `custom-${Date.now()}`;
    const generatedLink =
      characterLink.trim() ||
      `https://${window.location.host}/#character-${id}`;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    if (tags.length === 0) {
      tags.push(category, 'Custom');
    }

    const newChar: Character = {
      id,
      name: name.trim(),
      title: title.trim() || 'Nhân Vật Tự Tạo',
      category: category === 'Tất cả' ? 'Sci-Fi' : (category as any),
      avatar: avatar.trim() || PRESET_AVATARS[0],
      backstory: backstory.trim(),
      openingMessage: openingMessage.trim(),
      characterLink: generatedLink,
      tags,
      personality: personality.trim() || 'Ấn tượng, độc đáo',
      voiceTone: voiceTone.trim() || 'Tự nhiên, lôi cuốn',
      likes: 0,
      creator: creator.trim() || 'Người dùng sáng tạo',
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    onCreateCharacter(newChar);
    onClose();

    // Reset form
    setName('');
    setTitle('');
    setBackstory('');
    setOpeningMessage('');
    setCharacterLink('');
    setTagsInput('');
    setPersonality('');
    setVoiceTone('');
    setCreator('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-[#5C2830]/40 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FAF0F1] border border-[#F3B8C2] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-[#5C2830]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#F3B8C2] flex items-center justify-between bg-[#FADAD9]/80 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#E892A0] to-[#C86D7C] text-white shadow-md">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#5C2830]">Tạo Hồ Sơ Nhân Vật Mới</h3>
              <p className="text-xs text-[#823B47] font-medium">Thêm nhân vật mới vào kho lưu trữ cá nhân</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/80 hover:bg-white text-[#823B47] border border-[#F3B8C2] transition-all cursor-pointer shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Row 1: Name & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5C2830] mb-1.5">
                Tên Nhân Vật <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Lyra Nightshade"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-white border border-[#F3B8C2] rounded-2xl px-4 py-2.5 text-sm text-[#5C2830] placeholder-[#B57C87] focus:outline-none focus:border-[#C86D7C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C2830] mb-1.5">
                Danh Xưng / Biệt Danh
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Nữ Vương Bóng Đêm"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-white border border-[#F3B8C2] rounded-2xl px-4 py-2.5 text-sm text-[#5C2830] placeholder-[#B57C87] focus:outline-none focus:border-[#C86D7C]"
              />
            </div>
          </div>

          {/* Row 2: Category & Creator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5C2830] mb-1.5">Thể Loại</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CategoryFilter)}
                className="w-full bg-white border border-[#F3B8C2] rounded-2xl px-4 py-2.5 text-sm text-[#5C2830] focus:outline-none focus:border-[#C86D7C] cursor-pointer"
              >
                <option value="Sci-Fi" className="bg-white text-[#5C2830]">Sci-Fi</option>
                <option value="Cổ Trang" className="bg-white text-[#5C2830]">Cổ Trang</option>
                <option value="Cyberpunk" className="bg-white text-[#5C2830]">Cyberpunk</option>
                <option value="Fantasy" className="bg-white text-[#5C2830]">Fantasy</option>
                <option value="Trí Tuệ" className="bg-white text-[#5C2830]">Trí Tuệ</option>
                <option value="Hiện Đại" className="bg-white text-[#5C2830]">Hiện Đại</option>
                <option value="Anime" className="bg-white text-[#5C2830]">Anime</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C2830] mb-1.5">
                Tác Giả / Nguồn Tạo
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Tên bạn / Studio"
                value={creator}
                onChange={e => setCreator(e.target.value)}
                className="w-full bg-white border border-[#F3B8C2] rounded-2xl px-4 py-2.5 text-sm text-[#5C2830] placeholder-[#B57C87] focus:outline-none focus:border-[#C86D7C]"
              />
            </div>
          </div>

          {/* Avatar Selector / URL */}
          <div>
            <label className="block text-xs font-bold text-[#5C2830] mb-1.5">
              Hình Ảnh Đại Diện (Avatar URL hoặc Chọn Preset)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                placeholder="Dán URL hình ảnh đại diện (https://...)"
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
                className="flex-1 bg-white border border-[#F3B8C2] rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-[#5C2830] placeholder-[#B57C87] focus:outline-none focus:border-[#C86D7C]"
              />
            </div>
            {/* Presets */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[11px] text-[#823B47] font-semibold flex-shrink-0">Mẫu sẵn:</span>
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setAvatar(url)}
                  className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    avatar === url ? 'border-[#C86D7C] scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Opening Message */}
          <div>
            <label className="block text-xs font-bold text-[#5C2830] mb-1.5">
              Tin Nhắn Mở Đầu (Lời Chào Đầu Tiên) <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              placeholder='Ví dụ: *mỉm cười bí hiểm* "Chào bạn! Tôi đã đợi câu chuyện này từ lâu..."'
              value={openingMessage}
              onChange={e => setOpeningMessage(e.target.value)}
              className="w-full bg-white border border-[#F3B8C2] rounded-2xl p-3.5 text-sm text-[#5C2830] placeholder-[#B57C87] focus:outline-none focus:border-[#C86D7C]"
            ></textarea>
          </div>

          {/* Backstory */}
          <div>
            <label className="block text-xs font-bold text-[#5C2830] mb-1.5">
              Backstory (Câu Chuyện Nền / Tiền Sử) <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Viết về xuất thân, mục tiêu, động lực hoặc bối cảnh lịch sử của nhân vật..."
              value={backstory}
              onChange={e => setBackstory(e.target.value)}
              className="w-full bg-white border border-[#F3B8C2] rounded-2xl p-3.5 text-sm text-[#5C2830] placeholder-[#B57C87] focus:outline-none focus:border-[#C86D7C]"
            ></textarea>
          </div>

          {/* Character Link */}
          <div>
            <label className="block text-xs font-bold text-[#5C2830] mb-1.5">
              Link Nhân Vật (Đường Dẫn Trực Tiếp Chia Sẻ)
            </label>
            <input
              type="url"
              placeholder="Tùy chọn: Nhập link riêng hoặc hệ thống tự tạo link độc quyền"
              value={characterLink}
              onChange={e => setCharacterLink(e.target.value)}
              className="w-full bg-white border border-[#F3B8C2] rounded-2xl px-4 py-2.5 text-sm text-[#5C2830] placeholder-[#B57C87] focus:outline-none focus:border-[#C86D7C]"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-[#5C2830] mb-1.5">
              Từ Khóa / Tags (Cách nhau bởi dấu phẩy)
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Thùy mị, Ma thuật, Bí ẩn"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              className="w-full bg-white border border-[#F3B8C2] rounded-2xl px-4 py-2.5 text-sm text-[#5C2830] placeholder-[#B57C87] focus:outline-none focus:border-[#C86D7C]"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-[#F3B8C2] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white hover:bg-[#FADAD9] text-[#602D35] rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border border-[#F3B8C2]"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[#E892A0] to-[#C86D7C] hover:brightness-105 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-pink-200/50 border border-white/40 transition-all cursor-pointer"
            >
              Lưu Nhân Vật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
