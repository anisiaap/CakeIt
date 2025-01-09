import React, { useEffect, useRef } from "react";

const ParticlesBackground = () => {
  const particlesRef = useRef(null);

  useEffect(() => {
    const initializeParticles = () => {
      if (typeof window !== "undefined" && window.particlesJS && particlesRef.current) {
        window.particlesJS("particles-container", {
          particles: {
            number: {
              value: 100, // Number of sprinkles
              density: { enable: true, value_area: 800 },
            },
            color: {
              value: ["#FFB3C1", "#B4E1FF", "#B3FFC1", "#FFEAB3", "#E1C1FF"], // Pastel colors
            },
            shape: {
              type: "circle", // Use polygons to simulate sprinkles
              polygon: {
                nb_sides: 4, // Define rectangle-like polygons
              },
              stroke: {
                width: 2, // Border width for particles
                color: "#ffffff", // Optional border color
              },
            },
            opacity: {
              value: 0.8,
              random: true,
            },
            size: {
              value: 10, // Length of sprinkles
              random: true,
            },
            move: {
              enable: true,
              speed: 2, // Sprinkle movement speed
              random: true,
              out_mode: "out", // Particles move out of bounds
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: { enable: false }, // Disable hover interactivity
              onclick: { enable: false }, // Disable click interactivity
              resize: true,
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
      <div
          id="particles-container"
          ref={particlesRef}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "transparent", // Transparent background
            zIndex: -1,
            pointerEvents: "none", // Allows interactions through the particles
          }}
      />
  );
};

export default ParticlesBackground;
