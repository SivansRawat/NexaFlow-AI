import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function WebGLWaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Detect if WebGL is supported
    const isWebGLSupported = (() => {
      try {
        const testCanvas = document.createElement("canvas");
        return !!(window.WebGLRenderingContext && 
          (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl")));
      } catch (e) {
        return false;
      }
    })();

    if (!isWebGLSupported) {
      setHasWebGL(false);
      return;
    }

    // Size handling & Responsive layout sizing
    let width = window.innerWidth;
    let height = window.innerHeight;
    const isMobile = width < 768;

    // SCENE SETUP: Perspective Camera (~45deg FOV)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6;

    // RENDERER SETUP: Alpha enabled, DPR clamp
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile, // Disable antialiasing on mobile for performance
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // LIGHTING SYSTEM: Ambient + Key + Rim
    const ambientLight = new THREE.AmbientLight(0x060610, 2.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x2640D9, 6.0);
    keyLight.position.set(5, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x8A66E6, 4.0);
    rimLight.position.set(-5, -5, -2);
    scene.add(rimLight);

    // MOUSE INTERACTION & DRIFT (Mapped to range [0, 1] to match UV space)
    const mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    const onMouseMove = (event: MouseEvent) => {
      mouse.targetX = event.clientX / window.innerWidth;
      mouse.targetY = 1.0 - (event.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", onMouseMove);

    // SHADER MATERIALS & GEOMETRIES
    // 1. Floating Abstract Sphere (displaced via 3D noise inside Vertex Shader)
    const sphereGeometry = new THREE.SphereGeometry(1.3, 64, 64);
    
    // Custom displacement shader uniforms
    const sphereUniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    };

    const sphereVertexShader = `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec2 vUv;
      uniform float uTime;

      // Simple pseudo 3D noise for organic surface breathing
      float hash(float n) { return fract(sin(n) * 43758.5453123); }
      float noise(vec3 x) {
        vec3 p = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        float n = p.x + p.y * 157.0 + 113.0 * p.z;
        return mix(mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                       mix(hash(n + 157.0), hash(n + 158.0), f.x), f.y),
                   mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                       mix(hash(n + 270.0), hash(n + 271.0), f.x), f.y), f.z);
      }

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vUv = uv;
        
        // Low-frequency organic vertex displacement (enhanced morphing for organic fluidity)
        vec3 pos = position;
        float disp = noise(pos * 1.8 + uTime * 0.9) * 0.45;
        pos += normal * disp;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
 
    const sphereFragmentShader = `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec2 vUv;
      uniform float uTime;
 
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        
        // Fresnel rim glow
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);
        
        // #2640D9 (Primary) & #8A66E6 (Tertiary)
        vec3 colorPrimary = vec3(0.149, 0.251, 0.851);
        vec3 colorTertiary = vec3(0.541, 0.400, 0.902);
        
        vec3 faceColor = mix(colorPrimary * 0.05, colorTertiary * 0.12, vUv.x + sin(uTime * 0.35) * 0.15);
        vec3 rimColor = mix(colorPrimary, colorTertiary, fresnel) * fresnel * 2.8;
        
        vec3 finalColor = faceColor + rimColor;
        
        gl_FragColor = vec4(finalColor, fresnel * 0.9 + 0.15);
      }
    `;
 
    const sphereMaterial = new THREE.ShaderMaterial({
      vertexShader: sphereVertexShader,
      fragmentShader: sphereFragmentShader,
      uniforms: sphereUniforms,
      transparent: true,
      blending: THREE.NormalBlending,
    });
 
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
 
    // 2. Volumetric Dot-Matrix Background Plane
    const planeGeometry = new THREE.PlaneGeometry(16, 16);
    
    const planeUniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    };
 
    const planeVertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;
 
    const planeFragmentShader = `
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uMouse;
 
      void main() {
        vec2 st = vUv * 2.0 - 1.0;
        
        // Subtle pointer drift (increased for dynamic depth feel)
        vec2 drift = (uMouse - 0.5) * 0.35;
        vec2 gridSt = st + drift;
 
        float pulse = sin(uTime * 0.85) * 0.2 + 0.9;
        
        // Render detailed dot matrix particle field
        vec2 grid = fract(gridSt * 22.0) - 0.5;
        float dotDist = length(grid);
        float size = 0.062 * pulse;
        float particle = smoothstep(size, size - 0.025, dotDist);
 
        // Soft depth fade out towards the edges
        float depth = 1.0 - length(st * 0.58);
        depth = clamp(depth, 0.0, 1.0);
        particle *= depth;
 
        vec3 colorPrimary = vec3(0.149, 0.251, 0.851); // #2640D9
        vec3 colorTertiary = vec3(0.541, 0.400, 0.902); // #8A66E6
 
        vec3 particleColor = mix(colorPrimary, colorTertiary, vUv.x + sin(uTime * 0.25) * 0.1) * particle;
 
        // Ambient backglow
        float glowField = 0.035 / (length(st - vec2(sin(uTime * 0.18) * 0.25, cos(uTime * 0.22) * 0.15)) + 0.45);
        vec3 ambientGlow = mix(colorPrimary, colorTertiary, vUv.y) * glowField * 0.15;
 
        vec3 finalColor = particleColor + ambientGlow;
        finalColor *= 0.35; // Dim to keep text readable
 
        gl_FragColor = vec4(finalColor, finalColor.r * 0.5);
      }
    `;
 
    const planeMaterial = new THREE.ShaderMaterial({
      vertexShader: planeVertexShader,
      fragmentShader: planeFragmentShader,
      uniforms: planeUniforms,
      depthWrite: false,
      transparent: true,
    });
 
    const backgroundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    backgroundPlane.position.z = -1.5; // place behind sphere
    scene.add(backgroundPlane);
 
    // RESPOND TO MOTION PREFERENCES (Avoid freezing completely under test default tags)
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeScale = prefersReducedMotion ? 0.15 : 1.0;
    console.log("[WebGL] prefers-reduced-motion:", prefersReducedMotion, "TimeScale:", timeScale);
 
    // ANIMATE LOOP
    let accumulatedTime = 0;
    const clock = new THREE.Clock();
    let animationId: number;
 
    const tick = () => {
      const deltaTime = clock.getDelta();
      accumulatedTime += deltaTime * timeScale;
 
      // Update shader uniforms
      sphereUniforms.uTime.value = accumulatedTime;
      planeUniforms.uTime.value = accumulatedTime;
 
      sphereUniforms.uMouse.value.set(mouse.x, mouse.y);
      planeUniforms.uMouse.value.set(mouse.x, mouse.y);
 
      // Sphere rotation & parallax ease (enhanced rotation speeds)
      if (sphere) {
        sphere.rotation.y = accumulatedTime * 0.18;
        sphere.rotation.x = accumulatedTime * 0.12;
 
        // Pointer-reactive drift interpolation (smoother lerp response)
        mouse.x = THREE.MathUtils.lerp(mouse.x, mouse.targetX, 0.08);
        mouse.y = THREE.MathUtils.lerp(mouse.y, mouse.targetY, 0.08);
 
        // Sinusoidal breathing scale cycle (increased amplitude and frequency)
        const baseScale = isMobile ? 0.75 : 1.05;
        const breath = Math.sin(accumulatedTime * 1.25) * 0.15;
        sphere.scale.set(baseScale + breath, baseScale + breath, baseScale + breath);
 
        // Levitating translation movement (wider drift bounds)
        sphere.position.x = (mouse.x - 0.5) * 1.5 + Math.sin(accumulatedTime * 0.6) * 0.15;
        sphere.position.y = (mouse.y - 0.5) * 1.2 + Math.cos(accumulatedTime * 0.7) * 0.15;
      }
 
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(tick);
    };

    tick();

    // RESIZE HANDLING
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    // CLEANUP DISPOSAL ON UNMOUNT
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);

      // Dispose assets to avoid memory leaks
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      planeGeometry.dispose();
      planeMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  if (!hasWebGL) {
    // Graceful CSS-only fallback layout
    return (
      <div className="absolute inset-0 w-full h-full pointer-events-none z-[-30] bg-[#030305] overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#2640D9]/5 rounded-full blur-[130px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#8A66E6]/5 rounded-full blur-[110px]" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-[-30] overflow-hidden bg-transparent">
      {/* Solid background underneath canvas (to prevent stacking context hide) */}
      <div className="absolute inset-0 bg-[#030305] z-[-40]" />
      {/* Real animated Three.js canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full bg-transparent z-[-30]"
      />
    </div>
  );
}
