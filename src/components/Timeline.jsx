import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { birthdayContent } from '../config';
import './Timeline.css';

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

// Age / 20 Section
export default function Timeline() {
  const { twentyTitle, twentySubtitle, twentyMessage, age } = birthdayContent;
  const bigNumRef = useRef();
  const bigNumInView = useInView(bigNumRef, 0.1);
  const headRef = useRef();
  const headInView = useInView(headRef, 0.2);

  return (
    <section className="tl-screen screen">
      <div className="tl-inner">
        {/* Large "20" */}
        <div className="tl-hero-wrap" ref={bigNumRef}>
          <motion.div
            className="tl-big-number"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={bigNumInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden
          >
            {age}
          </motion.div>
        </div>

        {/* Heading block */}
        <div className="tl-header" ref={headRef}>
          {/* Introductory line � the "elephant in the room" */}
          <motion.p
            className="tl-twenty-shout t-label"
            initial={{ opacity: 0, y: 20 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {twentyTitle}
          </motion.p>

          {/* Humorous headline � visually large and distinct */}
          <motion.h2
            className="tl-twenty-title t-hero"
            initial={{ opacity: 0, y: 24 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {twentySubtitle}
          </motion.h2>

          {/* Sincere paragraph underneath */}
          <motion.p
            className="tl-twenty-message t-body"
            initial={{ opacity: 0, y: 16 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {twentyMessage}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
