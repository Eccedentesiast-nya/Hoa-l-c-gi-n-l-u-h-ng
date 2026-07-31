export interface Character {
  id: string;
  name: string;
  title: string;
  category: 'Sci-Fi' | 'Cổ Trang' | 'Cyberpunk' | 'Fantasy' | 'Trí Tuệ' | 'Hiện Đại' | 'Anime' | 'Kỳ Ảo';
  avatar: string;
  backstory: string;
  openingMessage: string;
  characterLink: string;
  tags: string[];
  personality: string;
  voiceTone: string;
  likes: number;
  creator: string;
  createdAt?: string;
  isCustom?: boolean;
}

export type CategoryFilter = string;

export type SortOption = 'popular' | 'newest' | 'name';
