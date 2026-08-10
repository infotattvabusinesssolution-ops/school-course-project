import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipForward,
  SkipBack,
  Settings,
  Loader,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(secs) {
  if (isNaN(secs) || secs < 0) return "0:00";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

// ─── Custom Video Player ──────────────────────────────────────────────────────

export default function CustomVideoPlayer({ src, title, autoPlay = true, onProgress, startTime = 0 }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  // Player state
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [scrubTime, setScrubTime] = useState(null);

  // Hide-controls timer
  const hideTimerRef = useRef(null);
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (!seeking && !showSpeedMenu && !showVolumeSlider) {
        setShowControls(false);
      }
    }, 3000);
  }, [seeking, showSpeedMenu, showVolumeSlider]);

  useEffect(() => {
    resetHideTimer();
    return () => clearTimeout(hideTimerRef.current);
  }, []);

  // ── Video event handlers ──

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    if (v.buffered.length > 0) {
      setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
    }
    onProgress?.(v.currentTime, v.duration);
  };

  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    
    setDuration(v.duration);
    
    if (startTime > 0 && startTime < v.duration) {
      v.currentTime = startTime;
      setCurrentTime(startTime);
    }
    
    setLoading(false);
    if (autoPlay) {
      v.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const handleWaiting = () => setLoading(true);
  const handleCanPlay = () => setLoading(false);
  const handleEnded = () => setPlaying(false);

  // ── Controls ──

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setPlaying(false);
    }
    resetHideTimer();
  }, [resetHideTimer]);

  const seek = useCallback((secs) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(secs, duration));
    setCurrentTime(v.currentTime);
  }, [duration]);

  const skip = useCallback((delta) => {
    seek(currentTime + delta);
    resetHideTimer();
  }, [currentTime, seek, resetHideTimer]);

  const handleSeekInput = (e) => {
    const ratio = parseFloat(e.target.value) / 1000;
    setScrubTime(ratio * duration);
  };
  const handleSeekDown = () => setSeeking(true);
  const handleSeekUp = (e) => {
    const ratio = parseFloat(e.target.value) / 1000;
    seek(ratio * duration);
    setSeeking(false);
    setScrubTime(null);
    resetHideTimer();
  };

  const changeVolume = (v) => {
    const newVol = parseFloat(v);
    setVolume(newVol);
    setMuted(newVol === 0);
    if (videoRef.current) videoRef.current.volume = newVol;
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    setMuted(next);
    v.muted = next;
  };

  const changeSpeed = (s) => {
    setSpeed(s);
    if (videoRef.current) videoRef.current.playbackRate = s;
    setShowSpeedMenu(false);
    resetHideTimer();
  };

  const toggleFullscreen = async () => {
    const el = containerRef.current;
    if (!document.fullscreenElement) {
      await el?.requestFullscreen();
      setFullscreen(true);
    } else {
      await document.exitFullscreen();
      setFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handler = (e) => {
      // Only intercept if not typing in an input
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      switch (e.code) {
        case "Space":
        case "KeyK":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          e.preventDefault();
          skip(10);
          break;
        case "ArrowLeft":
          e.preventDefault();
          skip(-10);
          break;
        case "ArrowUp":
          e.preventDefault();
          changeVolume(Math.min(1, volume + 0.1));
          break;
        case "ArrowDown":
          e.preventDefault();
          changeVolume(Math.max(0, volume - 0.1));
          break;
        case "KeyM":
          toggleMute();
          break;
        case "KeyF":
          toggleFullscreen();
          break;
        default:
          break;
      }
    };
    const el = containerRef.current;
    el?.addEventListener("keydown", handler);
    return () => el?.removeEventListener("keydown", handler);
  }, [togglePlay, skip, volume]);

  const displayTime = scrubTime !== null ? scrubTime : currentTime;
  const progressRatio = duration > 0 ? (displayTime / duration) * 1000 : 0;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => {
        if (!seeking) setShowControls(false);
      }}
      onClick={(e) => {
        if (e.target === containerRef.current || e.target === videoRef.current) togglePlay();
      }}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden outline-none group select-none"
      style={{ cursor: showControls ? "default" : "none" }}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        className="absolute inset-0 w-full h-full object-contain"
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        onEnded={handleEnded}
        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
      />

      {/* Buffering spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-sm">
            <Loader className="w-6 h-6 text-white animate-spin" />
          </div>
        </div>
      )}

      {/* Big play/pause indicator on click */}
      {!loading && !playing && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <Play className="w-9 h-9 text-white ml-1.5" />
          </div>
        </div>
      )}

      {/* Top gradient (title bar) */}
      <div
        className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/70 to-transparent z-20 flex items-start px-4 pt-3 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {title && (
          <p className="text-white text-sm font-semibold drop-shadow line-clamp-1">{title}</p>
        )}
      </div>

      {/* Bottom gradient + controls */}
      <div
        className={`absolute inset-x-0 bottom-0 z-20 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

        <div className="relative px-4 pb-3 pt-8">
          {/* ── Progress bar ── */}
          <div className="relative mb-3 flex items-center h-4 group/seek cursor-pointer">
            {/* Track background */}
            <div className="absolute inset-y-0 flex items-center w-full">
              <div className="w-full h-1 rounded-full bg-white/20 relative">
                {/* Buffered */}
                <div
                  className="absolute left-0 top-0 h-full bg-white/30 rounded-full"
                  style={{ width: `${buffered}%` }}
                />
                {/* Played */}
                <div
                  className="absolute left-0 top-0 h-full bg-blue-500 rounded-full"
                  style={{ width: `${(displayTime / duration) * 100 || 0}%` }}
                />
              </div>
            </div>

            {/* Invisible seek input on top */}
            <input
              type="range"
              min={0}
              max={1000}
              step={1}
              value={Math.round(progressRatio)}
              onChange={handleSeekInput}
              onMouseDown={handleSeekDown}
              onMouseUp={handleSeekUp}
              onTouchStart={handleSeekDown}
              onTouchEnd={handleSeekUp}
              className="absolute w-full h-4 opacity-0 cursor-pointer z-10"
            />

            {/* Thumb */}
            <div
              className="absolute h-3 w-3 rounded-full bg-white shadow-md transition-all duration-150 group-hover/seek:scale-125"
              style={{
                left: `calc(${(displayTime / duration) * 100 || 0}% - 6px)`,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          </div>

          {/* ── Controls row ── */}
          <div className="flex items-center gap-1">
            {/* Left controls */}
            <div className="flex items-center gap-1 flex-1">
              {/* Skip back */}
              <button
                onClick={(e) => { e.stopPropagation(); skip(-10); }}
                className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                title="Back 10s (←)"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* Play / Pause */}
              <button
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                title="Play/Pause (Space)"
              >
                {playing ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>

              {/* Skip forward */}
              <button
                onClick={(e) => { e.stopPropagation(); skip(10); }}
                className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                title="Forward 10s (→)"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Volume */}
              <div
                className="relative flex items-center"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                  title="Mute (M)"
                >
                  {muted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    showVolumeSlider ? "w-20 opacity-100" : "w-0 opacity-0"
                  }`}
                >
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={muted ? 0 : volume}
                    onChange={(e) => changeVolume(e.target.value)}
                    className="w-full h-1.5 accent-blue-500 cursor-pointer"
                    style={{ display: "block" }}
                  />
                </div>
              </div>

              {/* Time */}
              <span className="text-white text-xs font-mono ml-1 select-none">
                {formatTime(displayTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-1">
              {/* Speed */}
              <div
                className="relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-white hover:bg-white/10 transition-colors text-xs font-bold"
                  title="Playback speed"
                >
                  <Settings className="w-3.5 h-3.5" />
                  {speed}x
                </button>

                {showSpeedMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-slate-900/95 backdrop-blur rounded-xl overflow-hidden shadow-2xl border border-white/10 min-w-[90px]">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-2.5 pb-1">Speed</p>
                    {SPEEDS.map((s) => (
                      <button
                        key={s}
                        onClick={() => changeSpeed(s)}
                        className={`w-full text-left px-3 py-1.5 text-xs font-semibold transition-colors ${
                          speed === s
                            ? "bg-blue-500 text-white"
                            : "text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {s === 1 ? "Normal" : `${s}×`}
                      </button>
                    ))}
                    <div className="pb-1" />
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                title="Fullscreen (F)"
              >
                {fullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard shortcut hint on focus */}
      <div className="absolute bottom-2 right-3 z-30 pointer-events-none opacity-0 group-focus:opacity-100 transition-opacity">
        <p className="text-[10px] text-white/50 font-mono">Space · ← → · M · F</p>
      </div>
    </div>
  );
}
