import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { birthdayContent } from '../config';
import './GiftBox.css';

// ── Particles ───────────────────────────────────────────────
function Particles({ count = 80, active }) {
  const mesh = useRef();
  const positions = useRef();
  const velocities = useRef();

  useEffect(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3]     = (Math.random() - 0.5) * 6;
      pos[i3 + 1] = (Math.random() - 0.5) * 6;
      pos[i3 + 2] = (Math.random() - 0.5) * 4;
      vel[i3]     = (Math.random() - 0.5) * 0.005;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.005 + 0.003;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    positions.current = pos;
    velocities.current = vel;
    if (mesh.current) {
      mesh.current.geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    }
  }, [count]);

  useFrame(() => {
    if (!mesh.current || !positions.current) return;
    const pos = positions.current;
    const vel = velocities.current;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3]     += vel[i3];
      pos[i3 + 1] += vel[i3 + 1];
      pos[i3 + 2] += vel[i3 + 2];
      if (Math.abs(pos[i3]) > 4 || Math.abs(pos[i3 + 1]) > 4 || Math.abs(pos[i3 + 2]) > 3) {
        pos[i3]     = (Math.random() - 0.5) * 2;
        pos[i3 + 1] = -3;
        pos[i3 + 2] = (Math.random() - 0.5) * 2;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry />
      <pointsMaterial
        size={0.024}
        color="#e5c158"
        transparent
        opacity={active ? 0.8 : 0.45}
        sizeAttenuation
      />
    </points>
  );
}

// ── Gift Lid ────────────────────────────────────────────────
function GiftLid({ open, onRest }) {
  const meshRef = useRef();
  const pivotRef = useRef();
  const target = useRef(0);

  useEffect(() => {
    target.current = open ? 1 : 0;
  }, [open]);

  useFrame(() => {
    if (!pivotRef.current) return;
    const t = target.current;
    const cur = pivotRef.current.rotation.x;
    const next = THREE.MathUtils.lerp(cur, t * -Math.PI * 0.85, 0.06);
    pivotRef.current.rotation.x = next;

    const liftCur = pivotRef.current.position.y;
    const liftTarget = t * 0.25;
    pivotRef.current.position.y = THREE.MathUtils.lerp(liftCur, liftTarget, 0.06);

    if (t === 1 && Math.abs(next - target.current * -Math.PI * 0.85) < 0.01) {
      onRest && onRest();
    }
  });

  return (
    <group ref={pivotRef} position={[0, 0.51, 0]}>
      {/* pivot point at back edge */}
      <group position={[0, 0, -0.5]}>
        <mesh ref={meshRef} position={[0, 0.06, 0.5]} castShadow>
          <boxGeometry args={[1.04, 0.12, 1.04]} />
          <meshStandardMaterial
            color="#221e1a"
            metalness={0.4}
            roughness={0.5}
          />
        </mesh>
        {/* Ribbon cross on lid */}
        <mesh position={[0, 0.125, 0.5]}>
          <boxGeometry args={[0.08, 0.012, 1.04]} />
          <meshStandardMaterial color="#e5c158" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.125, 0.5]}>
          <boxGeometry args={[1.04, 0.012, 0.08]} />
          <meshStandardMaterial color="#e5c158" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Bow knot */}
        <mesh position={[0, 0.15, 0.5]}>
          <sphereGeometry args={[0.09, 16, 12]} />
          <meshStandardMaterial color="#ffd466" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Bow wings */}
        <mesh position={[-0.14, 0.15, 0.5]} rotation={[0, 0, 0.4]}>
          <torusGeometry args={[0.08, 0.028, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#ffd466" metalness={0.85} roughness={0.15} />
        </mesh>
        <mesh position={[0.14, 0.15, 0.5]} rotation={[0, 0, -0.4]}>
          <torusGeometry args={[0.08, 0.028, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#ffd466" metalness={0.85} roughness={0.15} />
        </mesh>
      </group>
    </group>
  );
}

// ── Gift Box Body ───────────────────────────────────────────
function GiftBoxBody() {
  return (
    <group>
      {/* Main box */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#1a1714"
          metalness={0.35}
          roughness={0.6}
        />
      </mesh>
      {/* Gold edge trim */}
      {[-0.5, 0.5].map((z, i) => (
        <mesh key={`h${i}`} position={[0, 0, z]} castShadow>
          <boxGeometry args={[1.02, 1.02, 0.008]} />
          <meshStandardMaterial color="#e5c158" metalness={0.9} roughness={0.15} opacity={0.6} transparent />
        </mesh>
      ))}
      {/* Ribbon vertical */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.08, 1.01, 1.01]} />
        <meshStandardMaterial color="#e5c158" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.01, 1.01, 0.08]} />
        <meshStandardMaterial color="#e5c158" metalness={0.85} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ── Birthday Card (inside) ───────────────────────────────────
function BirthdayCard({ visible, onOpen }) {
  const cardRef = useRef();
  const targetX = useRef(0);

  useEffect(() => {
    targetX.current = visible ? 1 : 0;
  }, [visible]);

  useFrame(() => {
    if (!cardRef.current) return;
    const t = targetX.current;
    cardRef.current.rotation.x = THREE.MathUtils.lerp(cardRef.current.rotation.x, t * -0.4, 0.05);
    cardRef.current.position.y = THREE.MathUtils.lerp(cardRef.current.position.y, visible ? 0.45 : -0.3, 0.05);
    cardRef.current.scale.setScalar(THREE.MathUtils.lerp(cardRef.current.scale.x, visible ? 1 : 0.1, 0.05));
  });

  return (
    <group ref={cardRef} position={[0, -0.3, 0]} scale={0.1}>
      {/* Card base */}
      <mesh onClick={onOpen} castShadow>
        <boxGeometry args={[0.9, 0.015, 0.65]} />
        <meshStandardMaterial color="#f8f4ee" metalness={0.05} roughness={0.8} />
      </mesh>
      {/* Card front face design */}
      <mesh position={[0, 0.009, 0]}>
        <planeGeometry args={[0.88, 0.63]} />
        <meshStandardMaterial color="#f0eae0" metalness={0} roughness={0.9} />
      </mesh>
      {/* Gold accent line on card */}
      <mesh position={[0, 0.01, -0.24]}>
        <planeGeometry args={[0.72, 0.008]} />
        <meshStandardMaterial color="#e5c158" metalness={0.95} roughness={0.1} />
      </mesh>
    </group>
  );
}

// ── Main 3D Scene ───────────────────────────────────────────
function Scene({ opened, onOpen, cardVisible, onCardClick }) {
  const { camera } = useThree();
  const groupRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    camera.position.set(0, 1.1, 3.2);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useEffect(() => {
    const handleMove = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      mouse.current.x = (x / window.innerWidth - 0.5) * 2;
      mouse.current.y = (y / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouse.current.x * 0.3,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -mouse.current.y * 0.15,
      0.04
    );
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 4]} intensity={1.8} color="#fffcf5" castShadow />
      <directionalLight position={[-4, 3, -2]} intensity={1.0} color="#e5c158" />
      <pointLight position={[0, 2, 2.5]} intensity={0.9} color="#fff9ee" distance={8} />
      <pointLight position={[0, -2, -1]} intensity={0.4} color="#a08040" distance={6} />

      <Particles active={opened} />

      <Float
        speed={1.4}
        rotationIntensity={0}
        floatIntensity={0.15}
        floatingRange={[-0.04, 0.04]}
      >
        <group ref={groupRef} position={[0, -0.2, 0]}>
          <GiftBoxBody />
          <GiftLid open={opened} />
          <BirthdayCard visible={cardVisible} onOpen={onCardClick} />
        </group>
      </Float>
    </>
  );
}

// ── GiftBox Screen ───────────────────────────────────────────
export default function GiftBox({ onCardOpen }) {
  const [opened, setOpened] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [lidRested, setLidRested] = useState(false);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    setTimeout(() => setCardVisible(true), 900);
  };

  const handleLidRest = () => {
    setLidRested(true);
  };

  const handleCardClick = () => {
    if (cardVisible) {
      onCardOpen();
    }
  };

  return (
    <div className="gift-screen screen">
      {/* First screen after entering: Introductory copy */}
      <div className="gift-top-header">
        <motion.p
          className="gift-intro-heading"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {birthdayContent.introMessage}
        </motion.p>
      </div>

      <div className="gift-canvas-wrap">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <Scene
              opened={opened}
              onOpen={handleOpen}
              cardVisible={cardVisible}
              onCardClick={handleCardClick}
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="gift-overlay">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="pre-open"
              className="gift-cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8 }}
            >
              {/* Associated tiny piece of text: not a bomb */}
              <p className="gift-tiny-tag">{birthdayContent.giftMessage}</p>
              <button className="btn-ghost" onClick={handleOpen}>
                {birthdayContent.giftBoxOpenPrompt}
              </button>
            </motion.div>
          ) : !cardVisible ? (
            <motion.p
              key="opening"
              className="t-label gift-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              …
            </motion.p>
          ) : (
            <motion.div
              key="card-prompt"
              className="gift-cta"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {/* Transition into the letter: Okay, jokes aside */}
              <p className="gift-transition-text">{birthdayContent.giftTransition}</p>
              <button className="btn-ghost" onClick={handleCardClick}>
                {birthdayContent.giftCardReadPrompt}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}