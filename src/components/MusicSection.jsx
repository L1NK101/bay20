import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { birthdayContent } from '../config';
import './MusicSection.css';

function useInView(ref, threshold = 0.2) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return inView;
}

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function MusicSection() {
  const { musicTitle, musicItems } = birthdayContent;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [showLyrics, setShowLyrics] = useState(true);

  const audioRef = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, 0.15);
  const activeTrack = musicItems[activeIndex] || musicItems[0];

  // Load and play when activeIndex changes (user initiated)
  const selectTrack = useCallback((index) => {
    setActiveIndex(index);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = activeTrack.audioSrc;
    audioRef.current.load();
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy fallback: wait for user interaction
          setIsPlaying(false);
        });
      }
    }
  }, [activeIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % musicItems.length;
    selectTrack(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + musicItems.length) % musicItems.length;
    selectTrack(prevIdx);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="music-screen screen" ref={sectionRef}>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      <div className="music-inner">
        {/* Header - EXACT USER WRITING */}
        <div className="music-header">
          <motion.h2
            className="music-title-main t-hero"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {musicTitle}
          </motion.h2>
        </div>

        {/* ── Turntable & Interactive Player Experience ─────── */}
        <div className="music-player-layout">
          {/* Left: Turntable / Rotating Disc */}
          <div className="turntable-panel">
            <div className="turntable-deck">
              {/* Turntable Platter */}
              <div className="turntable-platter">
                {/* Rotating Vinyl Record */}
                <div
                  className={`vinyl-record ${isPlaying ? 'is-spinning' : 'is-paused'}`}
                  style={{ '--accent-clr': activeTrack.accentColor || '#c9a84c' }}
                >
                  {/* Vinyl Grooves Texture */}
                  <div className="vinyl-groove-rings" />
                  <div className="vinyl-sheen" />

                  {/* Center Label */}
                  <div className="vinyl-label">
                    <div className="vinyl-label-inner">
                      <span className="vinyl-label-title">{activeTrack.title}</span>
                      <span className="vinyl-label-artist">{activeTrack.artist || 'Honorable Mention'}</span>
                      <div className="vinyl-spindle" />
                    </div>
                  </div>
                </div>

                {/* Tonearm */}
                <div className={`turntable-tonearm ${isPlaying ? 'on-record' : 'off-record'}`}>
                  <div className="tonearm-base" />
                  <div className="tonearm-rod" />
                  <div className="tonearm-head" />
                </div>
              </div>

              {/* Status info bar below turntable */}
              <div className="player-track-info">
                <div className="player-track-meta">
                  <h3 className="player-track-title">{activeTrack.title}</h3>
                  <p className="player-track-artist">
                    {activeTrack.artist || (activeTrack.isHonorableMention ? activeTrack.honorableLabel : '')}
                  </p>
                  {activeTrack.note && (
                    <span className="player-track-note">{activeTrack.note}</span>
                  )}
                </div>

                {/* Waveform visualizer bars when playing */}
                <div className={`audio-visualizer-bars ${isPlaying ? 'active' : ''}`}>
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              {/* Player Controls */}
              <div className="player-controls-wrap">
                {/* Scrubber / Progress */}
                <div className="player-progress-row">
                  <span className="player-time">{formatTime(currentTime)}</span>
                  <div className="player-slider-container">
                    <input
                      type="range"
                      min="0"
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      className="player-slider"
                      style={{
                        background: `linear-gradient(to right, var(--clr-gold, #c9a84c) ${progressPercent}%, rgba(255,255,255,0.15) ${progressPercent}%)`
                      }}
                      aria-label="Audio scrubber"
                    />
                  </div>
                  <span className="player-time">{formatTime(duration)}</span>
                </div>

                {/* Buttons Row */}
                <div className="player-buttons-row">
                  <button
                    className="player-btn player-btn-secondary"
                    onClick={handlePrev}
                    aria-label="Previous track"
                    title="Previous track"
                  >
                    ⏮
                  </button>

                  <button
                    className={`player-btn player-btn-play ${isPlaying ? 'is-playing' : ''}`}
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>

                  <button
                    className="player-btn player-btn-secondary"
                    onClick={handleNext}
                    aria-label="Next track"
                    title="Next track"
                  >
                    ⏭
                  </button>

                  {/* Volume Control */}
                  <div className="player-volume-wrap">
                    <button
                      className="player-btn-icon"
                      onClick={toggleMute}
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted || volume === 0 ? '🔇' : '🔊'}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.02"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="player-volume-slider"
                      aria-label="Volume slider"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Lyrics & Track Selector Panel */}
          <div className="music-details-panel">
            {/* View Switcher: Lyrics vs Playlist */}
            <div className="music-panel-tabs">
              <button
                className={`panel-tab-btn ${showLyrics ? 'active' : ''}`}
                onClick={() => setShowLyrics(true)}
              >
                Lyrics
              </button>
              <button
                className={`panel-tab-btn ${!showLyrics ? 'active' : ''}`}
                onClick={() => setShowLyrics(false)}
              >
                All Tracks ({musicItems.length})
              </button>
            </div>

            {/* Panel Content */}
            <div className="panel-tab-content">
              {showLyrics ? (
                <div className="lyrics-container">
                  <div className="lyrics-header">
                    <span className="lyrics-badge">Official Lyrics</span>
                    <h4 className="lyrics-song-title">{activeTrack.title}</h4>
                    {activeTrack.artist && (
                      <p className="lyrics-song-artist">{activeTrack.artist}</p>
                    )}
                  </div>
                  <div className="lyrics-body">
                    {activeTrack.lyrics && activeTrack.lyrics.length > 0 ? (
                      activeTrack.lyrics.map((line, lIdx) => (
                        <p
                          key={lIdx}
                          className={`lyric-line ${line === '' ? 'lyric-empty' : ''}`}
                        >
                          {line || '\u00A0'}
                        </p>
                      ))
                    ) : (
                      <p className="lyrics-placeholder">Lyrics loading...</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="playlist-container">
                  {musicItems.map((track, i) => {
                    const isSelected = i === activeIndex;
                    return (
                      <div
                        key={i}
                        className={`playlist-item ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => selectTrack(i)}
                      >
                        <div className="playlist-item-left">
                          <span className="playlist-item-num">
                            {isSelected && isPlaying ? (
                              <span className="mini-equalizer">
                                <i /><i /><i />
                              </span>
                            ) : (
                              String(i + 1).padStart(2, '0')
                            )}
                          </span>
                          <div className="playlist-item-text">
                            <span className="playlist-item-title">{track.title}</span>
                            {track.artist && (
                              <span className="playlist-item-artist">{track.artist}</span>
                            )}
                            {track.isHonorableMention && (
                              <span className="playlist-item-badge">{track.honorableLabel}</span>
                            )}
                            {track.note && (
                              <span className="playlist-item-note">{track.note}</span>
                            )}
                          </div>
                        </div>

                        <div className="playlist-item-right">
                          <button
                            className="playlist-play-icon"
                            aria-label={`Play ${track.title}`}
                          >
                            {isSelected && isPlaying ? '⏸' : '▶'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Track Selector Cards Bottom Row ──────────────── */}
        <div className="music-cards-grid">
          {musicItems.map((track, i) => {
            const isSelected = i === activeIndex;
            return (
              <motion.div
                key={i}
                className={`music-card ${isSelected ? 'music-card--active' : ''} ${track.isHonorableMention ? 'music-card--honorable' : ''}`}
                style={{
                  '--card-accent': track.accentColor || '#c9a84c',
                }}
                whileHover={{ y: -4 }}
                onClick={() => selectTrack(i)}
              >
                <div className="music-card-head">
                  <div className={`music-dot ${isSelected ? 'pulse' : ''}`} />
                  {track.isHonorableMention && (
                    <span className="music-genre t-label">{track.honorableLabel}</span>
                  )}
                  <span className="music-index t-label">{String(i + 1).padStart(2, '0')}</span>
                </div>

                <div className="music-card-body">
                  <h3 className="music-title t-serif">{track.title}</h3>
                  {track.artist && (
                    <p className="music-artist t-label">{track.artist}</p>
                  )}
                  {track.note && (
                    <p className="music-note t-label">{track.note}</p>
                  )}
                </div>

                <div className="music-card-status">
                  {isSelected ? (
                    <span className="music-card-playing-tag">
                      {isPlaying ? 'Now Playing ♫' : 'Selected (Click ▶)'}
                    </span>
                  ) : (
                    <span className="music-card-select-tag">Click to Play</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}