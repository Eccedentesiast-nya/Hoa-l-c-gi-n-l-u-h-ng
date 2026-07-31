import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, Disc, Volume2, VolumeX, X, Sparkles, Trash2, ListMusic } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist?: string;
  url: string;
}

const DEFAULT_PLAYLIST: Song[] = [
  {
    id: 'song-1',
    title: "Hoa Lạc Giản Lưu Hương - Piano Chill",
    artist: "Aesthetic Instrumental",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3"
  },
  {
    id: 'song-2',
    title: "Gentle Pink Romance",
    artist: "Pastel Dreams",
    url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=sweet-love-11108.mp3"
  },
  {
    id: 'song-3',
    title: "Cute Soft Afternoon Cafe",
    artist: "Lofi Beats",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a737df.mp3?filename=soft-rain-ambient-111154.mp3"
  }
];

export const PinkVinylPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Playlist State stored in localStorage
  const [playlist, setPlaylist] = useState<Song[]>(() => {
    try {
      const saved = localStorage.getItem('music_box_playlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse music box playlist', e);
    }
    return DEFAULT_PLAYLIST;
  });

  // Active Song ID
  const [activeSongId, setActiveSongId] = useState<string>(() => {
    return playlist[0]?.id || DEFAULT_PLAYLIST[0].id;
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeSong = playlist.find(s => s.id === activeSongId) || playlist[0] || DEFAULT_PLAYLIST[0];

  // Save playlist to localStorage
  useEffect(() => {
    localStorage.setItem('music_box_playlist', JSON.stringify(playlist));
  }, [playlist]);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Click outside to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Play / Pause Toggle
  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Playback error:', err);
      });
    }
  };

  // Next Track
  const handleNextTrack = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (playlist.length === 0) return;
    const currentIndex = playlist.findIndex(s => s.id === activeSongId);
    const nextIndex = (currentIndex + 1) % playlist.length;
    playSong(playlist[nextIndex]);
  };

  // Play specific song
  const playSong = (song: Song) => {
    setActiveSongId(song.id);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 150);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Delete Song
  const handleDeleteSong = (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = playlist.filter(s => s.id !== songId);
    if (updated.length === 0) return;
    setPlaylist(updated);
    if (activeSongId === songId) {
      playSong(updated[0]);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={activeSong?.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNextTrack}
      />

      {/* COMPACT MINI MUSIC BAR */}
      <div className="flex items-center gap-1.5 bg-white/80 hover:bg-white backdrop-blur-xl border border-[#F5B5C0] rounded-2xl px-2.5 py-1.5 shadow-sm text-xs transition-all">
        {/* Spinning Vinyl Disc / Toggle List */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 cursor-pointer"
          title="Xem danh sách nhạc"
        >
          <div className={`relative w-5 h-5 rounded-full bg-[#C86D7C] border border-white flex items-center justify-center shadow-sm shrink-0 ${isPlaying ? 'animate-spin-slow' : ''}`}>
            <Disc className="w-3.5 h-3.5 text-white" />
            <div className="absolute w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>

          <span className="font-bold text-[#5C2830] max-w-[100px] sm:max-w-[130px] truncate text-left">
            {activeSong?.title || "Music Box"}
          </span>
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`p-1.5 rounded-xl transition-all cursor-pointer ${
            isPlaying 
              ? 'bg-[#C86D7C] text-white' 
              : 'bg-[#FADAD9] text-[#823B47] hover:bg-[#E892A0] hover:text-white'
          }`}
          title={isPlaying ? 'Tạm dừng' : 'Phát nhạc'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
        </button>

        {/* Next Track Button */}
        <button
          onClick={handleNextTrack}
          className="p-1.5 rounded-xl bg-[#FADAD9] text-[#823B47] hover:bg-[#E892A0] hover:text-white transition-all cursor-pointer"
          title="Chuyển bài tiếp theo"
        >
          <SkipForward className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>

      {/* PLAYLIST POPOVER MENU */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 w-80 bg-[#FAF0F1] border-2 border-[#F3B8C2] rounded-3xl p-4 shadow-2xl backdrop-blur-2xl text-[#5C2830] flex flex-col space-y-3 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#F3B8C2] pb-2">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full bg-[#E892A0] border border-white flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
                <Disc className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#5C2830] leading-none">Music Box</h4>
                <p className="text-[10px] text-[#823B47] font-semibold">Danh Sách Phát</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-xl bg-white/80 hover:bg-white text-[#823B47] border border-[#F3B8C2] transition-all cursor-pointer shadow-sm"
              title="Đóng danh sách"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress Slider */}
          <div className="space-y-1 bg-white/60 p-2 rounded-xl border border-[#F3B8C2]/60">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full accent-[#C86D7C] h-1.5 bg-[#FADAD9] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-bold text-[#823B47]">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* PLAYLIST SECTION */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#823B47] flex items-center gap-1">
                <ListMusic className="w-3.5 h-3.5 text-[#C86D7C]" />
                <span>Danh Sách Bài Hát ({playlist.length})</span>
              </span>
            </div>

            {/* SONG LIST CONTAINER */}
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {playlist.map((song, idx) => {
                const isActive = song.id === activeSongId;
                return (
                  <div
                    key={song.id}
                    onClick={() => playSong(song)}
                    className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-[#E892A0] text-white border-[#C86D7C] shadow-sm'
                        : 'bg-white/80 hover:bg-white text-[#602D35] border-[#F3B8C2]/70'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className={`text-[10px] font-bold w-4 text-center ${isActive ? 'text-white' : 'text-[#823B47]'}`}>
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-xs">{song.title}</p>
                        {song.artist && (
                          <p className={`text-[10px] truncate ${isActive ? 'text-pink-100' : 'text-[#823B47]'}`}>
                            {song.artist}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isActive && isPlaying ? (
                        <span className="flex items-end gap-0.5 h-3">
                          <span className="w-0.5 bg-white rounded-full animate-bounce h-2"></span>
                          <span className="w-0.5 bg-white rounded-full animate-bounce h-3 delay-75"></span>
                          <span className="w-0.5 bg-white rounded-full animate-bounce h-1.5 delay-150"></span>
                        </span>
                      ) : (
                        <Play className={`w-3.5 h-3.5 ${isActive ? 'text-white fill-current' : 'text-[#C86D7C]'}`} />
                      )}

                      {/* Delete Icon */}
                      {playlist.length > 1 && (
                        <button
                          onClick={(e) => handleDeleteSong(song.id, e)}
                          className={`p-1 rounded-lg hover:bg-rose-500 hover:text-white transition-colors ${
                            isActive ? 'text-pink-200' : 'text-slate-400'
                          }`}
                          title="Xóa bài hát"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center justify-between pt-1 border-t border-[#F3B8C2]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-[#823B47] hover:text-[#C86D7C] cursor-pointer"
                title={isMuted ? 'Mở âm thanh' : 'Tắt âm thanh'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-16 accent-[#C86D7C] h-1 bg-[#FADAD9] rounded cursor-pointer"
              />
            </div>

            <p className="text-[10px] text-[#823B47] font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C86D7C]" />
              <span>Hoa Lạc Giản Lưu Hương</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
