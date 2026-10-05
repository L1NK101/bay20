import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { birthdayContent } from '../config';
import './FinalScreen.css';

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

// Minimal starfield
function Stars({ count = 80 }) {
  const stars = useRef(
    Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      delay: Math.random() * 4,
    }))
  );

  return (
    <div className="stars" aria-hidden>
      {stars.current.map((s, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function FinalScreen() {
  const { finalMessage } = birthdayContent;
  const ref = useRef();
  const inView = useInView(ref, 0.2);

  return (
    <section className="final-screen screen" ref={ref}>
      <Stars />
      <div className="final-vignette" />

      <div className="final-inner">
        {/* Line 1: boom, thats all */}
        <motion.p
          className="final-message t-hero"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {finalMessage.line1}
        </motion.p>

        <motion.div
          className="divider"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={inView ? { scaleY: 1, opacity: 0.4 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
        />

        {/* Line 2: love u old woman */}
        <motion.p
          className="final-love t-serif"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {finalMessage.line2}
        </motion.p>

        <motion.div
          className="final-heart"
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 2, ease: [0.34, 1.56, 0.64, 1] }}
          aria-label="with love"
        >
          <span style={{ color: 'var(--clr-gold, #c9a84c)' }}>♥</span>
        </motion.div>
      </div>

      {/* Watermark */}
      <motion.p
        className="final-watermark t-label"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 2.5 }}
      >
        Made with care
      </motion.p>
    </section>
  );
}