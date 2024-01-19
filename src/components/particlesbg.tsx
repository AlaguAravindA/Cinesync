import React, { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadFull } from 'tsparticles';

export default function Particle() {
  const [ init, setInit ] = useState(false);

  // this should be run only once per application lifetime
  useEffect(() => {
      initParticlesEngine(async (engine) => {
        
          await loadFull(engine);
          //await loadBasic(engine);
      }).then(() => {
          setInit(true);
      });
  }, []);
const loadparticlesInit=(container)=>{
  console.log(container);
}
  return (
  
     <Particles
    id="tsparticles"
    particlesLoaded={loadparticlesInit}
    options={{
        particles: {
            number: {
              value: 50, // Adjust this value
            },
          },
        background: {
            color: {
                value: "#000000",
            },
        },
        fullScreen:{
          enable:true,
          zIndex:-1

        },
        fpsLimit: 120,
        interactivity: {
            events: {
                onClick: {
                    enable: true,
                    mode: "push",
                },
                onHover: {
                    enable: true,
                    mode: "grab",
                },
                resize: true,
            },
            modes: {
                push: {
                    quantity: 4,
                },
                repulse: {
                    distance: 200,
                    duration: 0.4,
                },
            },
        },
        particles: {
          number :{
            value:800

          },

            color: {
                value: "#ffffff",
            }
            ,
            links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
            },
            move: {
              enable: true,
              speed: 5,
              direction: 'left', // Set the direction to 'left'
              random: false,
              straight: false,
              out_mode: 'out',
              bounce: false,
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200,
              }},
            number: {
                density: {
                    enable: true,
                    area: 800,
                },
                value: 80,
            },
            opacity: {
                value: 0.5,
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 1, max: 5 },
            },
        },
        detectRetina: true,
          }}
      init={loadparticlesInit}
    />
        
  );
}
