import { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import styles from './AnimatedBackground.module.css';

const AnimatedBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className={styles.container}>
      {/* Gradient blobs */}
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />
      <div className={`${styles.blob} ${styles.blob3}`} />
      <div className={`${styles.blob} ${styles.blob4}`} />
      <div className={`${styles.blob} ${styles.blob5}`} />

      {/* Particles overlay */}
      <Particles
        className={styles.particles}
        init={particlesInit}
        options={{
          fullScreen: false,
          fpsLimit: 60,
          particles: {
            color: { value: ['#059669', '#2563EB', '#7C3AED'] },
            links: {
              color: '#059669',
              distance: 150,
              enable: true,
              opacity: 0.07,
              width: 1,
            },
            move: {
              enable: true,
              speed: 0.6,
              direction: 'none',
              random: true,
              straight: false,
              outModes: { default: 'out' },
            },
            number: {
              density: { enable: true, area: 1200 },
              value: 35,
            },
            opacity: { value: { min: 0.04, max: 0.15 } },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
