import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { birthdayContent } from '../config';
import './DentistrySection.css';

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

function CareerCard({ card, index, active }) {
  return (
    <motion.div
      className="career-card"
      initial={{ opacity: 0, y: 40 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: 0.15 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
    >
      <div className="career-card-img-wrap">
        <img
          src={card.image}
          alt={card.alt}
          className="career-card-img"
          loading="lazy"
        />
        <div className="career-card-img-overlay" />
      </div>
      <div className="career-card-body">
        <h3 className="career-card-title t-serif">{card.title}</h3>
        <p className="career-card-text t-label">{card.text}</p>
      </div>
    </motion.div>
  );
}

export default function DentistrySection() {
  const { careerTitle, careerCards } = birthdayContent;
  const ref = useRef();
  const inView = useInView(ref, 0.15);

  return (
    <section className="dentistry-screen screen">
      <div className="career-inner" ref={ref}>
        {/* Section heading */}
        <motion.div
          className="career-header"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="career-title t-hero">{careerTitle}</h2>
        </motion.div>

        {/* Three cards */}
        <div className="career-cards">
          {careerCards.map((card, i) => (
            <CareerCard key={i} card={card} index={i} active={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
