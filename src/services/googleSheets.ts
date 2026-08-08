import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Character } from '../types';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/drive.file');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Không lấy được token từ Google Auth');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const googleSignOut = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Export Characters to a new Google Spreadsheet
export const exportCharactersToSheet = async (
  accessToken: string,
  characters: Character[]
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  // 1. Create a spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: `Hồ Sơ Nhân Vật - ${new Date().toLocaleDateString('vi-VN')}`,
      },
    }),
  });

  if (!createRes.ok) {
    const errData = await createRes.json();
    throw new Error(errData.error?.message || 'Tạo trang tính thất bại');
  }

  const createData = await createRes.json();
  const spreadsheetId = createData.spreadsheetId;
  const spreadsheetUrl = createData.spreadsheetUrl;

  // 2. Prepare headers and rows
  const headers = [
    'ID',
    'Tên Nhân Vật',
    'Danh Mục/Thể Loại',
    'Danh Hiệu / Tiêu Đề',
    'Cốt Truyện',
    'Lời Chào Đầu',
    'Link Nhân Vật',
    'Nhãn/Tags',
    'Tính Cách',
    'Giọng Nói',
    'Lượt Yêu Thích',
    'Người Tạo',
    'Ngày Tạo',
    'Ảnh Avatar (URL)'
  ];

  const rows = characters.map(c => [
    c.id,
    c.name,
    c.category,
    c.title || '',
    c.backstory || '',
    c.openingMessage || '',
    c.characterLink || '',
    c.tags.join(', '),
    c.personality,
    c.voiceTone,
    c.likes,
    c.creator,
    c.createdAt || '',
    c.avatar
  ]);

  const values = [headers, ...rows];

  // 3. Append values
  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:Z100:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values,
      }),
    }
  );

  if (!appendRes.ok) {
    const errData = await appendRes.json();
    throw new Error(errData.error?.message || 'Ghi dữ liệu vào trang tính thất bại');
  }

  return { spreadsheetId, spreadsheetUrl };
};

// Import Characters from an existing Google Spreadsheet ID
export const importCharactersFromSheet = async (
  accessToken: string,
  spreadsheetId: string
): Promise<Character[]> => {
  const range = 'A1:Z500';
  const getRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!getRes.ok) {
    const errData = await getRes.json();
    throw new Error(errData.error?.message || 'Không thể đọc trang tính này. Hãy kiểm tra ID và quyền truy cập!');
  }

  const data = await getRes.json();
  const rows: string[][] = data.values || [];

  if (rows.length < 2) {
    throw new Error('Trang tính chưa có dòng dữ liệu nhân vật nào!');
  }

  // Row 0 is header. Remaining rows are characters.
  const importedCharacters: Character[] = [];

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r[1]) continue; // Skip if no name

    const character: Character = {
      id: r[0] || `sheet_${Date.now()}_${i}`,
      name: r[1],
      category: (r[2] as any) || 'Hiện Đại',
      title: r[3] || '',
      backstory: r[4] || '',
      openingMessage: r[5] || '',
      characterLink: r[6] || '',
      tags: r[7] ? r[7].split(',').map(t => t.trim()).filter(Boolean) : ['Google Sheets'],
      personality: r[8] || 'Ấn tượng',
      voiceTone: r[9] || 'Nhẹ nhàng',
      likes: parseInt(r[10], 10) || 0,
      creator: r[11] || 'Google Sheets',
      createdAt: r[12] || new Date().toISOString().split('T')[0],
      avatar: r[13] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      isCustom: true
    };

    importedCharacters.push(character);
  }

  return importedCharacters;
};
