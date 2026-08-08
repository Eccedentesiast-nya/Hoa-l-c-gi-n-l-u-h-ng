import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { X, FileSpreadsheet, Download, Upload, ExternalLink, CheckCircle2, AlertCircle, LogOut, Loader2 } from 'lucide-react';
import { Character } from '../types';
import {
  initAuth,
  googleSignIn,
  googleSignOut,
  getAccessToken,
  exportCharactersToSheet,
  importCharactersFromSheet
} from '../services/googleSheets';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  onImportCharacters: (newCharacters: Character[]) => void;
  showToast: (msg: string) => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  characters,
  onImportCharacters,
  showToast,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [exportedSheetUrl, setExportedSheetUrl] = useState<string | null>(null);
  const [importSheetInput, setImportSheetInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setIsLoadingAuth(true);
    const unsubscribe = initAuth(
      (u, token) => {
        setUser(u);
        setAccessToken(token);
        setIsLoadingAuth(false);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setIsLoadingAuth(false);
      }
    );
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setErrorMessage(null);
    setIsLoadingAuth(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        showToast(`Đã kết nối tài khoản Google: ${res.user.displayName || res.user.email}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Đăng nhập Google thất bại');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleSignOut = async () => {
    await googleSignOut();
    setUser(null);
    setAccessToken(null);
    setExportedSheetUrl(null);
    showToast('Đã đăng xuất tài khoản Google');
  };

  const handleExport = async () => {
    if (!accessToken) {
      setErrorMessage('Vui lòng đăng nhập Google trước khi xuất dữ liệu!');
      return;
    }

    setErrorMessage(null);
    setIsExporting(true);
    setExportedSheetUrl(null);

    try {
      const { spreadsheetUrl } = await exportCharactersToSheet(accessToken, characters);
      setExportedSheetUrl(spreadsheetUrl);
      showToast('Đã xuất thành công sang Google Sheets! ✨');
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi xuất sang Google Sheets');
    } finally {
      setIsExporting(false);
    }
  };

  const extractSpreadsheetId = (input: string): string => {
    const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      return match[1];
    }
    return input.trim();
  };

  const handleImport = async () => {
    if (!accessToken) {
      setErrorMessage('Vui lòng đăng nhập Google trước khi nhập dữ liệu!');
      return;
    }

    const sheetId = extractSpreadsheetId(importSheetInput);
    if (!sheetId) {
      setErrorMessage('Vui lòng nhập Link hoặc ID của Google Spreadsheet!');
      return;
    }

    setErrorMessage(null);
    setIsImporting(true);

    try {
      const newChars = await importCharactersFromSheet(accessToken, sheetId);
      onImportCharacters(newChars);
      showToast(`Đã nhập thành công ${newChars.length} nhân vật từ Google Sheets! 🎉`);
      setImportSheetInput('');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi đọc dữ liệu từ Google Sheets');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF7F2] dark:bg-[#1C0D0F] w-full max-w-lg rounded-2xl border-2 border-[#E892A0] dark:border-[#522930] shadow-2xl overflow-hidden text-[#5C2830] dark:text-[#F9E3E6] transition-all transition-colors duration-300">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#E892A0] to-[#C86D7C] dark:from-[#3E1B20] dark:to-[#321519] text-white flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6" />
            <h2 className="text-lg font-extrabold tracking-wide">Tích Hợp Google Sheets</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-900/50 rounded-xl text-xs text-red-800 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* User Status / Login Block */}
          <div className="bg-white dark:bg-[#251315] p-4 rounded-xl border border-[#F3B8C2] dark:border-[#522930] shadow-xs transition-colors duration-300">
            {isLoadingAuth ? (
              <div className="flex items-center justify-center py-4 gap-2 text-xs font-semibold text-[#823B47] dark:text-[#EFAEB6]">
                <Loader2 className="w-4 h-4 animate-spin text-[#C86D7C]" />
                <span>Đang kết nối tài khoản Google...</span>
              </div>
            ) : user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user.displayName || 'Google User'}
                    className="w-10 h-10 rounded-full border border-[#E892A0] object-cover"
                  />
                  <div>
                    <div className="text-sm font-bold">{user.displayName || 'Tài khoản Google'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors flex items-center gap-1 border border-red-200 dark:border-red-900/50 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-2 space-y-3">
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  Kết nối với Google Sheets để đồng bộ, xuất và nhập danh sách tem hồ sơ nhân vật trực tiếp.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={handleSignIn}
                    className="gsi-material-button inline-flex items-center gap-3 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs border border-gray-300 rounded-xl shadow-xs transition-all cursor-pointer hover:shadow-md"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    <span>Đăng nhập với Google</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Export Action */}
          <div className="bg-white dark:bg-[#251315] p-4 rounded-xl border border-[#F3B8C2] dark:border-[#522930] space-y-3 transition-colors duration-300">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-[#C86D7C]" />
              <h3 className="text-sm font-bold text-[#823B47] dark:text-[#EFAEB6]">Xuất hồ sơ sang Google Sheets</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Tạo mới một trang tính Google Sheets chứa toàn bộ {characters.length} tem hồ sơ nhân vật trong ứng dụng.
            </p>
            <button
              onClick={handleExport}
              disabled={!user || isExporting}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                user && !isExporting
                  ? 'bg-gradient-to-r from-[#E892A0] to-[#C86D7C] text-white hover:brightness-105 shadow-sm'
                  : 'bg-gray-200 dark:bg-[#321B1E] text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang khởi tạo Google Spreadsheet...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Xuất {characters.length} Nhân Vật Ra Google Sheets</span>
                </>
              )}
            </button>

            {exportedSheetUrl && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between text-xs text-green-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span className="font-medium">Đã xuất trang tính thành công!</span>
                </div>
                <a
                  href={exportedSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold flex items-center gap-1 transition-colors"
                >
                  <span>Mở Trang Tính</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Import Action */}
          <div className="bg-white dark:bg-[#251315] p-4 rounded-xl border border-[#F3B8C2] dark:border-[#522930] space-y-3 transition-colors duration-300">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#C86D7C]" />
              <h3 className="text-sm font-bold text-[#823B47] dark:text-[#EFAEB6]">Nhập hồ sơ từ Google Sheets</h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Dán URL hoặc Spreadsheet ID của một Google Sheet chứa danh sách hồ sơ nhân vật để nạp vào hệ thống.
            </p>
            <input
              type="text"
              value={importSheetInput}
              onChange={(e) => setImportSheetInput(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/1xxx..."
              className="w-full px-3 py-2 bg-[#FAF7F2] dark:bg-[#1C0D0F] border border-[#F3B8C2] dark:border-[#522930] rounded-xl text-xs text-[#5C2830] dark:text-[#F9E3E6] focus:outline-none focus:ring-2 focus:ring-[#E892A0] transition-colors duration-300"
            />
            <button
              onClick={handleImport}
              disabled={!user || isImporting || !importSheetInput.trim()}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                user && !isImporting && importSheetInput.trim()
                  ? 'bg-[#823B47] dark:bg-[#6e303b] text-white hover:bg-[#6e303b] dark:hover:bg-[#823B47] shadow-sm'
                  : 'bg-gray-200 dark:bg-[#321B1E] text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang nạp dữ liệu từ Google Sheets...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Đọc và Nhập Danh Sách Nhân Vật</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
