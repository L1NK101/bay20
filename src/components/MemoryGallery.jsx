import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { birthdayContent, config } from '../config';
import './MemoryGallery.css';

// Placeholder gradient colors for missing photos
const PLACEHOLDER_COLORS = [
  ['#1a1612', '#2a2018'],
  ['#121518', '#1a2025'],
  ['#161318', '#221820'],
  ['#141a12', '#1e2818'],
  ['#18120e', '#241810'],
  ['#101418', '#182030'],
];

// Subtle random rotations so cards look physical
const ROTATIONS = [-1.5, 0.8, -0.5, 1.2, -1.0, 0.6, -0.9, 1.4];

function PhotoCard({ photo, index, onClick }) {
  const ref = useRef();
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const colors = PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className="photo-card"
      style={{ '--rotation': `${rotation}deg` }}
      initial={{ opacity: 0, y: 40, rotate: rotation }}
      animate={inView ? { opacity: 1, y: 0, rotate: rotation } : {}}
      transition={{ duration: 0.9, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.03, rotate: 0, zIndex: 10 }}
      onClick={() => onClick(index)}
    >
      <div className="photo-card-inner">
        {/* Photo or placeholder */}
        {!error ? (
          <img
            src={photo.src}
            alt={photo.caption || `Memory ${index + 1}`}
            className={`photo-img ${loaded ? 'loaded' : ''}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        ) : null}

        {/* Placeholder for missing/errored photos */}
        {(error || !loaded) && (
          <div
            className="photo-placeholder"
            style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
          >
            {error && (
              <span className="photo-placeholder-text t-label">
                Drop photo here
              </span>
            )}
          </div>
        )}

        {/* Film grain overlay */}
        <div className="photo-grain" />

        {/* Caption strip */}
        <div className="photo-caption-strip">
          {photo.year && <span className="photo-year t-label">{photo.year}</span>}
          {photo.caption && <span className="photo-caption">{photo.caption}</span>}
        </div>
      </div>
    </motion.div>
  );
}

function Lightbox({ photos, index, onClose, onPrev, onNext }) {
  const photo = photos[index];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext]);

  // Touch swipe
  const touchStart = useRef(null);
  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(delta) > 50) {
      delta < 0 ? onNext() : onPrev();
    }
    touchStart.current = null;
  };

  return (
    <motion.div
      className="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        className="lightbox-inner"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={photo.src} alt={photo.caption || ''} className="lightbox-img" />
        <div className="lightbox-info">
          {photo.year && <span className="t-label lightbox-year">{photo.year}</span>}
          {photo.caption && <p className="lightbox-caption t-serif">{photo.caption}</p>}
        </div>
      </motion.div>

      <button className="lightbox-btn lightbox-btn--prev" onClick={(e) => { e.stopPropagation(); onPrev(); }} aria-label="Previous">←</button>
      <button className="lightbox-btn lightbox-btn--next" onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="Next">→</button>
      <button className="lightbox-btn lightbox-btn--close" onClick={onClose} aria-label="Close">✕</button>

      <div className="lightbox-counter t-label">{index + 1} / {photos.length}</div>
    </motion.div>
  );
}

export default function MemoryGallery() {
  const photos = birthdayContent.photos || config.photos || [];
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const headRef = useRef();
  const [headInView, setHeadInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHeadInView(true); },
      { threshold: 0.3 }
    );
    if (headRef.current) observer.observe(headRef.current);
    return () => observer.disconnect();
  }, []);

  const handlePrev = useCallback(() => {
    setLightboxIndex((i) => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const handleNext = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % photos.length);
  }, [photos.length]);

  return (
    <section className="gallery-screen screen">
      <div className="gallery-inner">
        {/* Section header */}
        <div className="gallery-header" ref={headRef}>
          <motion.h2
            className="gallery-title t-hero"
            initial={{ opacity: 0, y: 24 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {birthdayContent.childhoodTitle}
          </motion.h2>
          {/* Introductory text area intentionally empty per user instructions */}
        </div>

        {/* Photo grid */}
        <div className="photo-grid">
          {photos.map((photo, i) => (
            <PhotoCard key={i} photo={photo} index={i} onClick={setLightboxIndex} />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={photos}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
    </section>
  );
}