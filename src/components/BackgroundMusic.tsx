"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Song {
  title: string;
  url: string;
}

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const [showVolume, setShowVolume] = useState(false);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setMounted(true);
    const savedVolume = localStorage.getItem("bg-music-volume");
    if (savedVolume) setVolume(parseInt(savedVolume));

    // Autoplay on first click
    const handleFirstClick = () => {
      setIsPlaying(true);
      window.removeEventListener("click", handleFirstClick);
    };
    window.addEventListener("click", handleFirstClick);

    fetch("/api/music")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPlaylist(data);
          const randomIndex = Math.floor(Math.random() * data.length);
          setCurrentIndex(randomIndex);
        }
      })
      .catch(() => {});

    return () => window.removeEventListener("click", handleFirstClick);
  }, []);

  useEffect(() => {
    localStorage.setItem("bg-music-volume", volume.toString());
    if (audioRef.current) audioRef.current.volume = volume / 100;
    updateYoutubeVolume(volume);
  }, [volume]);

  const currentSong = playlist[currentIndex] || null;
  const musicUrl = currentSong?.url || "";
  const isYouTube =
    musicUrl.includes("youtube.com") || musicUrl.includes("youtu.be");

  const getYoutubeId = (url: string) => {
    if (!url) return "";
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : "";
  };

  const videoId = isYouTube ? getYoutubeId(musicUrl) : "";

  const updateYoutubeVolume = (val: number) => {
    const iframe = document.getElementById(
      "bg-music-iframe"
    ) as HTMLIFrameElement;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: "setVolume",
          args: [val],
        }),
        "*"
      );
    }
  };

  const togglePlay = () => {
    if (isYouTube) {
      const iframe = document.getElementById(
        "bg-music-iframe"
      ) as HTMLIFrameElement;
      if (iframe?.contentWindow) {
        const command = isPlaying ? "pauseVideo" : "playVideo";
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: command, args: "" }),
          "*"
        );
        if (!isPlaying) setTimeout(() => updateYoutubeVolume(volume), 500);
      }
    } else if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (data.event === "onStateChange" && data.info === 0) nextSong();
      } catch {}
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist]);

  if (!mounted || playlist.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      <AnimatePresence>
        {showVolume && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 10, scale: 0.9, x: 20 }}
            className="bg-[#1a1a1a]/90 backdrop-blur-2xl border border-white/10 p-4 rounded-3xl shadow-2xl flex flex-col items-center gap-3 w-12"
          >
            <div className="relative h-32 w-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-amber-500"
                style={{ height: `${volume}%` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer [writing-mode:bt-lr]"
                style={
                  {
                    appearance: "slider-vertical",
                    WebkitAppearance: "slider-vertical",
                  } as any
                }
              />
            </div>
            <span className="text-[10px] text-white font-bold tabular-nums">
              {volume}%
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center gap-3 bg-[#0C4A6E]/90 backdrop-blur-2xl border border-amber-500/30 p-1.5 pr-4 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:bg-[#0C4A6E]/95 transition-all group cursor-pointer"
        onClick={togglePlay}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all shadow-lg ${
            isPlaying
              ? "bg-amber-500 text-slate-900 scale-110"
              : "bg-white/10 text-white hover:scale-105"
          }`}
        >
          {isPlaying ? (
            <div className="flex gap-0.5 items-end h-3">
              <motion.div
                animate={{ height: [4, 12, 6, 12, 4] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-1 bg-slate-900 rounded-full"
              />
              <motion.div
                animate={{ height: [8, 4, 12, 4, 8] }}
                transition={{ repeat: Infinity, duration: 1.0 }}
                className="w-1 bg-slate-900 rounded-full"
              />
              <motion.div
                animate={{ height: [12, 6, 8, 12, 6] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="w-1 bg-slate-900 rounded-full"
              />
            </div>
          ) : (
            "🎵"
          )}
        </div>

        <div
          className="text-[10px] text-white font-medium select-none flex-1 overflow-hidden"
          onClick={(e) => {
            e.stopPropagation();
            setShowVolume(!showVolume);
          }}
        >
          <p className="leading-none opacity-90 truncate max-w-[120px] font-bold">
            {currentSong?.title || "Music"}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse"></span>
            <p className="opacity-50 text-[8px] uppercase tracking-tighter">
              VOL {volume}% • VIMSOLAR
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSong();
          }}
          className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          title="Chuyển bài"
        >
          <span className="text-[10px]">⏭️</span>
        </button>
      </motion.div>

      {isYouTube ? (
        <iframe
          id="bg-music-iframe"
          width="0"
          height="0"
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=${
            isPlaying ? 1 : 0
          }&origin=${
            typeof window !== "undefined" ? window.location.origin : ""
          }`}
          frameBorder="0"
          allow="autoplay"
          className="hidden"
        ></iframe>
      ) : (
        <audio
          ref={audioRef}
          key={musicUrl}
          autoPlay={isPlaying}
          src={musicUrl}
          onEnded={nextSong}
          className="hidden"
        />
      )}
    </div>
  );
}
