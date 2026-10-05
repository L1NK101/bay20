import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { birthdayContent } from '../config';
import './Letter.css';

function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return inView;
}

function Paragraph({ text, delay = 0 }) {
  const ref = useRef();
  const inView = useInView(ref, 0.1);
  return (
    <motion.p
      ref={ref}
      className="letter-para t-serif"
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {text}
    </motion.p>
  );
}

export default function Letter() {
  const { letter, giftTransition } = birthdayContent;
  const containerRef = useRef();
  const leadRef = useRef();
  const leadInView = useInView(leadRef, 0.2);

  return (
    <div className="letter-screen screen" ref={containerRef}>
      <div className="letter-paper-bg" />

      <div className="letter-inner">
        {/* Transition into the letter: Okay, jokes aside */}
        <div ref={leadRef} className="letter-lead-wrap">
          <motion.p
            className="letter-lead-transition t-subtitle"
            initial={{ opacity: 0, y: 16 }}
            animate={leadInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {giftTransition}
          </motion.p>
          <motion.div
            className="divider letter-lead-divider"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={leadInView ? { scaleY: 1, opacity: 0.35 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>

        {/* Paper card */}
        <motion.div
          className="letter-card"
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Salutation */}
          <h2 className="letter-salutation">{letter.salutation}</h2>

          {/* Body paragraphs */}
          <div className="letter-body">
            {letter.paragraphs.map((para, i) => (
              <Paragraph key={i} text={para} delay={0.04} />
            ))}
          </div>

          {/* Closing */}
          <div className="letter-closing-block">
            <div className="letter-rule letter-rule--short" />
            <p className="letter-closing-prefix t-serif">{letter.closingPrefix}</p>
            <p className="letter-signature t-serif">{letter.closingName}</p>
            {letter.ps && (
              <p className="letter-ps t-serif">{letter.ps}</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
