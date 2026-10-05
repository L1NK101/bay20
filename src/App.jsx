import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Intro from './components/Intro';
import GiftBox from './components/GiftBox';
import Letter from './components/Letter';
import MemoryGallery from './components/MemoryGallery';
import Timeline from './components/Timeline';
import DentistrySection from './components/DentistrySection';
import MusicSection from './components/MusicSection';
import GiftReveal from './components/GiftReveal';
import FinalScreen from './components/FinalScreen';
import './index.css';
import './App.css';

// ── Screen IDs ──────────────────────────────────────────────
const SCREENS = {
  INTRO: 'intro',
  MAIN:  'main',
};

// ── Main scrolling experience ────────────────────────────────
function MainExperience() {
  return (
    <main className="main-experience">
      <div id="section-0">
        <GiftBox onCardOpen={() => {
          document.getElementById('section-1')?.scrollIntoView({ behavior: 'smooth' });
        }} />
      </div>
      <div id="section-1"><Letter /></div>
      <div id="section-2"><MemoryGallery /></div>
      <div id="section-3"><Timeline /></div>
      <div id="section-4"><DentistrySection /></div>
      <div id="section-5"><MusicSection /></div>
      <div id="section-6"><GiftReveal /></div>
      <div id="section-7"><FinalScreen /></div>
    </main>
  );
}

// ── Root App ────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState(SCREENS.INTRO);

  const goToMain = useCallback(() => {
    setScreen(SCREENS.MAIN);
  }, []);

  return (
    <>
      {/* Film grain — persistent */}
      <div className="grain" aria-hidden />

      {/* Screens */}
      <AnimatePresence mode="wait">
        {screen === SCREENS.INTRO ? (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            style={{ position: 'fixed', inset: 0, zIndex: 10 }}
          >
            <Intro onBegin={goToMain} />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <MainExperience />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}