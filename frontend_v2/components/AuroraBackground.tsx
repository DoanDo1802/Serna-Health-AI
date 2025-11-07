'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const AuroraBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;

        float rand(vec2 n) {
          return fract(sin(dot(n, vec2(12.9898, 78.233))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 u = fract(p);
          u = u * u * (3.0 - 2.0 * u);

          float n00 = rand(ip);
          float n10 = rand(ip + vec2(1.0, 0.0));
          float n01 = rand(ip + vec2(0.0, 1.0));
          float n11 = rand(ip + vec2(1.0, 1.0));

          float nx0 = mix(n00, n10, u.x);
          float nx1 = mix(n01, n11, u.x);
          return mix(nx0, nx1, u.y);
        }

        // Shooting star effect
        vec3 shootingStar(vec2 uv, float time) {
          vec3 col = vec3(0.0);

          // Create multiple shooting stars
          for (float i = 0.0; i < 8.0; i++) {
            float seed = i * 12.9898;
            float startTime = mod(time * 0.3 + seed, 6.0);
            float progress = mod(startTime, 1.0);

            // Star trajectory
            float angle = sin(seed) * 3.14159 * 0.5 + 0.3;
            vec2 direction = vec2(cos(angle), sin(angle));

            // Star position
            vec2 starPos = vec2(sin(seed * 2.0), cos(seed * 3.0)) * 2.0;
            starPos += direction * progress * 4.0;

            // Distance from star
            float dist = length(uv - starPos);

            // Star trail (thin line)
            float trail = exp(-dist * 15.0) * (1.0 - progress * 0.3);

            // Star glow
            float glow = exp(-dist * 8.0) * 0.5;

            // Color based on position
            vec3 starColor = mix(
              vec3(0.3, 0.6, 1.0),  // Blue
              vec3(0.6, 0.8, 1.0),  // Light blue
              sin(seed) * 0.5 + 0.5
            );

            col += starColor * (trail + glow) * (1.0 - progress);
          }

          return col;
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / iResolution.xy;
          uv = uv * 2.0 - 1.0;
          uv.x *= iResolution.x / iResolution.y;

          vec3 col = vec3(0.0);

          // Add shooting stars
          col += shootingStar(uv, iTime);

          // Add subtle background glow
          float bgGlow = 0.05 * sin(iTime * 0.2) * (0.5 + 0.5 * sin(uv.y * 2.0));
          col += vec3(0.05, 0.1, 0.2) * bgGlow;

          // Fade edges
          float vignette = 1.0 - length(uv) * 0.3;
          col *= vignette;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
      transparent: true
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let frameId: number;
    const animate = () => {
      material.uniforms.iTime.value += 0.016;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default AuroraBackground;

