import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { birthdayContent } from '../config';
import './GiftReveal.css';

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

// Simple programmatic drumroll using Web Audio API � no external files needed
function playDrumroll(durationMs = 2200) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const bufferSize = ctx.sampleRate * (durationMs / 1000);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate accelerating snare hits
    let t = 0;
    let interval = 0.18; // seconds between hits, will shrink
    const minInterval = 0.032;
    const sampleRate = ctx.sampleRate;

    while (t < durationMs / 1000) {
      // Each hit: a short noise burst (snare-like)
      const hitLen = Math.floor(0.025 * sampleRate);
      const startSample = Math.floor(t * sampleRate);
      for (let j = 0; j < hitLen; j++) {
        const sampleIdx = startSample + j;
        if (sampleIdx >= bufferSize) break;
        const env = Math.exp(-j / (hitLen * 0.3));
        data[sampleIdx] = (Math.random() * 2 - 1) * env * 0.55;
      }
      t += interval;
      interval = Math.max(minInterval, interval * 0.88);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Add a small amount of compression
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.setValueAtTime(-20, ctx.currentTime);
    comp.knee.setValueAtTime(10, ctx.currentTime);
    comp.ratio.setValueAtTime(4, ctx.currentTime);

    source.connect(comp);
    comp.connect(ctx.destination);
    source.start();

    // Final cymbal crash
    setTimeout(() => {
      const crashLen = Math.floor(0.35 * sampleRate);
      const crashBuf = ctx.createBuffer(1, crashLen, sampleRate);
      const crashData = crashBuf.getChannelData(0);
      for (let i = 0; i < crashLen; i++) {
        crashData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (crashLen * 0.25)) * 0.7;
      }
      const crash = ctx.createBufferSource();
      crash.buffer = crashBuf;
      // High-pass to make it cymbal-like
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(3000, ctx.currentTime);
      crash.connect(hp);
      hp.connect(ctx.destination);
      crash.start();
    }, durationMs - 350);

  } catch (e) {
    // Silently fail � audio is enhancement only
  }
}

export default function GiftReveal() {
  const {
    giftTransitionHeading,
    giftTransitionShout,
    giftIntro,
    giftDrumrollText,
    giftAmount,
    giftRevealMessage,
  } = birthdayContent;

  // -- Phase machine -----------------------------------------
  // Phase 0: transition heading visible
  // Phase 1: drumroll playing
  // Phase 2: curtains opening
  // Phase 3: amount revealed + message
  const [phase, setPhase] = useState(0);
  const ref = useRef();
  const inView = useInView(ref, 0.3);
  const curtainDone = useRef(false);

  const advancePhase = useCallback(() => {
    setPhase((p) => p + 1);
  }, []);

  // When section enters view, auto-start after a short delay
  useEffect(() => {
    if (!inView || phase > 0) return;
    const t = setTimeout(() => advancePhase(), 600);
    return () => clearTimeout(t);
  }, [inView, phase, advancePhase]);

  // Phase 1 ? play drumroll ? phase 2 after drumroll
  useEffect(() => {
    if (phase !== 1) return;
    playDrumroll(2200);
    const t = setTimeout(() => advancePhase(), 2300);
    return () => clearTimeout(t);
  }, [phase, advancePhase]);

  // Phase 2 ? after curtain animation ? phase 3
  useEffect(() => {
    if (phase !== 2) return;
    const t = setTimeout(() => advancePhase(), 1600);
    return () => clearTimeout(t);
  }, [phase, advancePhase]);

  return (
    <section className="gift-reveal-screen screen" ref={ref}>
      <div className="gift-reveal-inner">

        {/* -- Transition block -------------------------------- */}
        <motion.div
          className="gift-transition-block"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="gift-tr-heading t-subtitle">{giftTransitionHeading}</p>
          <p className="gift-tr-shout t-hero">{giftTransitionShout}</p>
        </motion.div>

        <motion.div
          className="divider gift-reveal-divider"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={inView ? { scaleY: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        />

        {/* -- Intro text -------------------------------------- */}
        <motion.p
          className="gift-reveal-preamble t-subtitle"
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          {giftIntro}
        </motion.p>

        {/* -- Drumroll text ----------------------------------- */}
        <AnimatePresence>
          {phase === 1 && (
            <motion.p
              key="drumroll"
              className="gift-drumroll-text t-label"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              {giftDrumrollText}
              <span className="gift-drumroll-dots" aria-hidden>...</span>
            </motion.p>
          )}
        </AnimatePresence>

        {/* -- Curtain reveal stage --------------------------- */}
        <div className="gift-curtain-stage">
          {/* Curtains */}
          <AnimatePresence>
            {phase >= 2 && (
              <>
                <motion.div
                  key="curtain-left"
                  className="gift-curtain gift-curtain--left"
                  initial={{ scaleX: 1 }}
                  animate={phase >= 2 ? { scaleX: 0 } : { scaleX: 1 }}
                  transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: 0.1 }}
                />
                <motion.div
                  key="curtain-right"
                  className="gift-curtain gift-curtain--right"
                  initial={{ scaleX: 1 }}
                  animate={phase >= 2 ? { scaleX: 0 } : { scaleX: 1 }}
                  transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: 0.1 }}
                />
              </>
            )}
          </AnimatePresence>

          {/* The revealed amount */}
          <motion.div
            className="gift-reveal-amount-wrap"
            initial={{ opacity: 0 }}
            animate={phase >= 3 ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="gift-reveal-amount t-display"
              initial={{ opacity: 0, scale: 0.6, filter: 'blur(30px)' }}
              animate={phase >= 3 ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {giftAmount}
            </motion.div>
          </motion.div>
        </div>

        {/* -- Message under the reveal ------------------------ */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              key="reveal-message"
              className="gift-reveal-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="gift-msg-line1 t-subtitle">{giftRevealMessage.line1}</p>
              <p className="gift-msg-line2 t-hero">{giftRevealMessage.line2}</p>
              <p className="gift-msg-line3 t-body">{giftRevealMessage.line3}</p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
