// src/components/ParticlesBackground.jsx

import React, { useEffect, useRef } from 'react';

const ParticlesBackground = () => {
  const particlesRef = useRef(null);

  useEffect(() => {
    const initializeParticles = () => {
      if (typeof window !== 'undefined' && window.particlesJS && particlesRef.current) {
        window.particlesJS('particles-container', {
          particles: {
            number: {
              value: 150, // Number of particles
              density: { enable: true, value_area: 800 },
            },
            color: { value: '#000000' }, // White particles
            shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
            opacity: { value: 0.7, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 120, color: '#ffffff', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 3, direction: 'none', random: true, out_mode: 'out' },
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: { enable: true, mode: 'grab' },
              onclick: { enable: true, mode: 'push' },
              resize: true,
            },
            modes: {
              grab: { distance: 180, line_linked: { opacity: 0.7 } },
              repulse: { distance: 200, duration: 0.4 },
            },
          },
          retina_detect: true,
        });
      } else {
        setTimeout(initializeParticles, 100);
      }
    };

    initializeParticles();
  }, []);

  return (
    <View
      id="particles-container"
      ref={particlesRef}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'white', // Full-screen black background
        zIndex: -1,
        pointerEvents: 'none', // Allows interactions through the particles
      }}
    />
  );
};

export default ParticlesBackground;
