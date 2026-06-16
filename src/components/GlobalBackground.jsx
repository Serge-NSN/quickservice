import { useCallback, useEffect, useState } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import styles from './GlobalBackground.module.css';

const GlobalBackground = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Observe theme changes
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    setTheme(document.documentElement.getAttribute('data-theme') || 'light');
    return () => observer.disconnect();
  }, []);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const isDark = theme === 'dark';
  const particleColor = isDark ? '#10B981' : '#059669';
  const lineColor = isDark ? '#3B82F6' : '#2563EB';

  return (
    <div className={styles.container}>
      <Particles
        id="tsparticles-global"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          fpsLimit: 60,
          interactivity: {
            detectsOn: 'window',
            events: {
              onHover: {
                enable: true,
                mode: 'grab', // Connect lines to mouse
              },
              onClick: {
                enable: true,
                mode: 'push', // Add particles on click
              },
              resize: true,
            },
            modes: {
              grab: {
                distance: 140,
                links: {
                  opacity: isDark ? 0.4 : 0.2,
                },
              },
              push: {
                quantity: 4,
              },
            },
          },
          particles: {
            color: {
              value: [particleColor, lineColor, isDark ? '#F8FAFC' : '#0F172A'],
            },
            links: {
              color: lineColor,
              distance: 150,
              enable: true,
              opacity: isDark ? 0.2 : 0.1,
              width: 1,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: {
                default: 'bounce',
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 60,
            },
            opacity: {
              value: isDark ? 0.4 : 0.2,
            },
            shape: {
              type: 'circle',
            },
            size: {
              value: { min: 1, max: 4 },
            },
          },
          detectRetina: true,
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
        }}
      />
    </div>
  );
};

export default GlobalBackground;
