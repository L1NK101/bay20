import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { birthdayContent } from '../config';
import './Intro.css';

const CHARS_JANNA = (birthdayContent.openingTitle || 'Janna').split('');

export default function Intro({ onBegin }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const x = (clientX / width - 0.5) * 20;
      const y = (clientY / height - 0.5) * 20;
      containerRef.current.style.setProperty('--mx', `${x}px`);
      containerRef.current.style.setProperty('--my', `${y}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  };

  const letter = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div className="intro-screen screen" ref={containerRef}>
      {/* Ambient glows */}
      <div className="intro-glow intro-glow--left" />
      <div className="intro-glow intro-glow--right" />

      {/* Horizontal lines */}
      <div className="intro-line intro-line--top" />
      <div className="intro-line intro-line--bottom" />

      <div className="intro-content">
        {/* Big name: Janna */}
        <motion.div
          className="intro-name"
          variants={container}
          initial="hidden"
          animate="show"
          aria-label={birthdayContent.openingTitle}
        >
          {CHARS_JANNA.map((char, i) => (
            <motion.span key={i} className="intro-char" variants={letter}>
              {char}
            </motion.span>
          ))}
        </motion.div>

        {/* Age: 20 */}
        <motion.div
          className="intro-age"
          initial={{ opacity: 0, scaleX: 0.8 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1.1, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="intro-age-line" />
          <span className="intro-age-number">{birthdayContent.openingAge}</span>
          <span className="intro-age-line" />
        </motion.div>

        {/* Subtitle & two smaller centered lines underneath */}
        <div className="intro-text-group">
          {/* Main Subtitle: Made from your favorite brother */}
          <motion.p
            className="intro-subtitle"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {birthdayContent.openingSubtitle}
          </motion.p>

          {/* Smaller centered text underneath: ps; no i didn't make this cause i'm too broke for a gift */}
          <motion.p
            className="intro-ps"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {birthdayContent.openingPS}
          </motion.p>

          {/* Even smaller centered text underneath that: well yes i am broke but thats not the point */}
          <motion.p
            className="intro-ps-sub"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {birthdayContent.openingPSFollowup}
          </motion.p>
        </div>

        {/* Button: Enter */}
        <motion.button
          className="intro-begin btn-ghost"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          onClick={onBegin}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {birthdayContent.enterButton}
        </motion.button>
      </div>
    </div>
  );
}
