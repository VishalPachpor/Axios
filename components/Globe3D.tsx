"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import WaitlistPopup from "@/components/waitlist/waitlist-popup";
import waitlistService, { WaitlistEntry } from "@/lib/waitlist-service";

// --- Profile Data Generation ---
const generateProfileData = (count: number) => {
  const colors = [
    "#DE6635",
    "#8B4513",
    "#A0522D",
    "#CD853F",
    "#D2691E",
    "#B8860B",
  ];
  const profileData = [];

  for (let i = 1; i <= count; i++) {
    profileData.push({
      id: i,
      name: "", // Empty initially
      role: "Waitlist Spot",
      color: colors[i % colors.length],
    });
  }

  return profileData;
};

const profileData = generateProfileData(150); // Generate 150 spots

// --- Tooltip State Interface ---
interface TooltipState {
  visible: boolean;
  content: string;
  x: number;
  y: number;
}

// --- Main Globe Component ---
const Globe3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });

  // Waitlist state
  const [isWaitlistPopupOpen, setWaitlistPopupOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
    null
  );
  const [waitlistError, setWaitlistError] = useState<string | null>(null);
  const [waitlistEntries, setWaitlistEntries] = useState<
    Map<number, WaitlistEntry>
  >(new Map());

  // Refs to hold mutable values
  const stateRef = useRef({
    isDragging: false,
    isMouseDown: false,
    isAutoRotating: true,
    rotationSpeed: 0.002,
    mouseX: 0,
    mouseY: 0,
    startMouseX: 0,
    startMouseY: 0,
    mouseDownTime: 0,
    targetRotationX: 0,
    targetRotationY: 0,
    currentRotationX: 0,
    currentRotationY: 0,
    particleSystem: null as THREE.Points | null,
    globeGroup: null as THREE.Group | null,
    camera: null as THREE.PerspectiveCamera | null,
    profileMeshes: [] as THREE.Mesh[],
    renderer: null as THREE.WebGLRenderer | null,
    scene: null as THREE.Scene | null,
  }).current;

  useEffect(() => {
    if (!mountRef.current) return;

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    // --- Scene, Camera, and Renderer Setup ---
    setLoadingProgress(20);
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0a, 1000, 3000);
    stateRef.scene = scene;

    setLoadingProgress(30);
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      5000
    );
    camera.position.z = 800;
    stateRef.camera = camera;

    setLoadingProgress(40);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    stateRef.renderer = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // --- Globe and Profiles Setup ---
    setLoadingProgress(50);
    const globeGroup = new THREE.Group();
    stateRef.globeGroup = globeGroup;
    const radius = 300;
    stateRef.profileMeshes = [];

    profileData.forEach((profile, i) => {
      const phi = Math.acos(1 - (2 * i) / profileData.length);
      const theta = Math.sqrt(profileData.length * Math.PI) * phi;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      // Main circle
      const geometry = new THREE.CircleGeometry(20, 32);
      const material = new THREE.MeshBasicMaterial({
        color: profile.color,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
      });
      const profileMesh = new THREE.Mesh(geometry, material);
      profileMesh.position.set(x, y, z);
      profileMesh.lookAt(0, 0, 0);
      profileMesh.userData = profile;

      globeGroup.add(profileMesh);
      stateRef.profileMeshes.push(profileMesh);
    });

    scene.add(globeGroup);
    setLoadingProgress(70);

    // --- Particle System Setup (Skybox Stars) ---
    // Uniform starfield using Fibonacci sphere distribution
    const particleCount = 550;
    const pGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Create stars on a large sphere that acts like a skybox
    // Natural sky look: clustered stars with some sparse regions
    const skyRadius = 2000;
    const numClusters = 18;
    const clusterCenters: Array<THREE.Vector3> = [];
    const randomDirection = () => {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      return new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      );
    };
    for (let c = 0; c < numClusters; c++) {
      clusterCenters.push(randomDirection());
    }

    const clusterStarsCount = Math.floor(particleCount * 0.55);
    const backgroundStarsCount = particleCount - clusterStarsCount;

    const placeStar = (
      direction: THREE.Vector3,
      i: number,
      isCluster: boolean
    ) => {
      const idx = i * 3;
      positions[idx] = direction.x * skyRadius;
      positions[idx + 1] = direction.y * skyRadius;
      positions[idx + 2] = direction.z * skyRadius;

      const color = new THREE.Color();
      const hue = 0.06 + Math.random() * 0.12;
      const saturation = 0.35 + Math.random() * 0.35;
      const lightnessBase = isCluster ? 0.65 : 0.5;
      const lightness = lightnessBase + Math.random() * 0.25;
      color.setHSL(hue, saturation, Math.min(1, lightness));

      colors[idx] = color.r;
      colors[idx + 1] = color.g;
      colors[idx + 2] = color.b;

      // Smaller sizes overall to reduce visual weight
      sizes[i] = (isCluster ? 5 : 3) + Math.random() * (isCluster ? 5 : 4);
    };

    // Clustered stars
    const clusterSpread = 0.25; // wider clusters to reduce gaps
    let i = 0;
    for (; i < clusterStarsCount; i++) {
      const center = clusterCenters[i % numClusters];
      // Random small vector to perturb direction around center
      const jitter = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      )
        .normalize()
        .multiplyScalar(clusterSpread * (0.5 + Math.random()));
      const direction = new THREE.Vector3()
        .copy(center)
        .add(jitter)
        .normalize();
      placeStar(direction, i, true);
    }

    // Background sparse stars
    for (; i < particleCount; i++) {
      const direction = randomDirection();
      placeStar(direction, i, false);
    }

    // colors and sizes are handled in placeStar()

    pGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    pGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const pMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        void main() {
          vColor = color;
          
          // Subtle drifting motion to make stars feel alive
          vec3 drift = vec3(
            sin(time * 0.05 + position.y * 0.015) * 0.03,
            sin(time * 0.04 + position.z * 0.017) * 0.03,
            sin(time * 0.06 + position.x * 0.013) * 0.03
          );
          // Normalize position to create skybox effect (direction only, not distance)
          vec3 direction = normalize(position + drift);
          vec4 mvPosition = modelViewMatrix * vec4(direction * 2000.0, 1.0);
          
          // Fixed size with subtle pulsing
          gl_PointSize = size * (0.9 + 0.3 * sin(time * 0.8 + position.x * 0.01));
          gl_Position = projectionMatrix * mvPosition;
        }`,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float distance = length(gl_PointCoord - vec2(0.5));
          float alpha = smoothstep(0.55, 0.0, distance);
          // Slightly brighter core
          gl_FragColor = vec4(vColor, alpha * 1.0);
        }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false, // Don't write to depth buffer so stars appear behind everything
    });

    const particleSystem = new THREE.Points(pGeometry, pMaterial);
    particleSystem.renderOrder = -1; // Render before other objects
    stateRef.particleSystem = particleSystem;
    scene.add(particleSystem);

    setLoadingProgress(90);

    // Final loading completion
    setTimeout(() => {
      setLoadingProgress(100);
      setTimeout(() => {
        setLoading(false);
        clearInterval(progressInterval);
      }, 500);
    }, 300);

    // --- Raycaster and Mouse Vector ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // --- Event Handlers ---
    const handleMouseDown = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      stateRef.isMouseDown = true;
      stateRef.isDragging = false;
      // Don't stop auto-rotation immediately - wait to see if it's a drag
      stateRef.mouseDownTime = Date.now();

      const clientX =
        "touches" in event ? event.touches[0].clientX : event.clientX;
      const clientY =
        "touches" in event ? event.touches[0].clientY : event.clientY;

      stateRef.mouseX = clientX;
      stateRef.mouseY = clientY;
      stateRef.startMouseX = clientX;
      stateRef.startMouseY = clientY;
    };

    const handleMouseMove = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      const clientX =
        "touches" in event ? event.touches[0].clientX : event.clientX;
      const clientY =
        "touches" in event ? event.touches[0].clientY : event.clientY;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      if (stateRef.isMouseDown && !stateRef.isDragging) {
        const deltaX = clientX - stateRef.startMouseX;
        const deltaY = clientY - stateRef.startMouseY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > 15) {
          stateRef.isDragging = true;
          stateRef.isAutoRotating = false; // Only stop auto-rotation when dragging starts
        }
      }

      if (stateRef.isDragging) {
        const deltaX = clientX - stateRef.mouseX;
        const deltaY = clientY - stateRef.mouseY;
        stateRef.targetRotationY += deltaX * 0.005;
        stateRef.targetRotationX += deltaY * 0.005;
        stateRef.mouseX = clientX;
        stateRef.mouseY = clientY;
      } else if (!stateRef.isMouseDown) {
        handleHover();
      }
    };

    const handleMouseUp = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();

      const clientX =
        "touches" in event ? event.changedTouches[0].clientX : event.clientX;
      const clientY =
        "touches" in event ? event.changedTouches[0].clientY : event.clientY;

      const timeHeld = Date.now() - stateRef.mouseDownTime;
      const deltaX = clientX - stateRef.startMouseX;
      const deltaY = clientY - stateRef.startMouseY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      const wasClick = timeHeld < 300 && distance < 15;

      if (wasClick && stateRef.isMouseDown) {
        handleMouseClick();
        // Resume auto-rotation immediately after a click (no dragging occurred)
        if (!stateRef.isDragging) {
          stateRef.isAutoRotating = true;
        }
      } else if (stateRef.isDragging) {
        // Only pause auto-rotation temporarily if there was actual dragging
        setTimeout(() => {
          stateRef.isAutoRotating = true;
        }, 2000);
      }

      stateRef.isMouseDown = false;
      stateRef.isDragging = false;
    };

    const handleMouseClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(stateRef.profileMeshes);

      if (intersects.length > 0) {
        const profile = intersects[0].object.userData;

        // Check if this profile is already claimed
        if (waitlistEntries.has(profile.id)) {
          const entryData = waitlistEntries.get(profile.id);
          setTooltip({
            visible: true,
            content: `<strong>${entryData?.name}</strong><br>Waitlist Member`,
            x: (mouse.x * window.innerWidth) / 2 + window.innerWidth / 2 + 10,
            y:
              (-mouse.y * window.innerHeight) / 2 + window.innerHeight / 2 - 10,
          });
        } else {
          setSelectedProfileId(profile.id);
          setWaitlistPopupOpen(true);
          setWaitlistError(null);
        }
      }
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? 1.1 : 0.9;
      camera.position.multiplyScalar(delta);
      camera.position.clampLength(300, 1500);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const handleHover = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(stateRef.profileMeshes);

      if (intersects.length > 0) {
        const profile = intersects[0].object.userData;
        const entryData = waitlistEntries.get(profile.id);

        let content;
        if (entryData) {
          content = `<strong>${entryData.name}</strong><br>Waitlist Member`;
        } else {
          content = `<strong>Available Spot</strong><br><span style="color: #f97316;">Click to join waitlist</span>`;
        }

        setTooltip({
          visible: true,
          content,
          x: (mouse.x * window.innerWidth) / 2 + window.innerWidth / 2 + 10,
          y: (-mouse.y * window.innerHeight) / 2 + window.innerHeight / 2 - 10,
        });
      } else {
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    };

    // Add event listeners
    renderer.domElement.addEventListener("mousedown", handleMouseDown);
    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("mouseup", handleMouseUp);
    renderer.domElement.addEventListener("wheel", handleWheel, {
      passive: false,
    });
    renderer.domElement.addEventListener("touchstart", handleMouseDown as any, {
      passive: false,
    });
    renderer.domElement.addEventListener("touchmove", handleMouseMove as any, {
      passive: false,
    });
    renderer.domElement.addEventListener("touchend", handleMouseUp, {
      passive: false,
    });
    window.addEventListener("resize", handleResize);

    // --- Animation Loop ---
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (stateRef.isAutoRotating && !stateRef.isDragging) {
        stateRef.targetRotationY += stateRef.rotationSpeed;
      }

      stateRef.currentRotationX +=
        (stateRef.targetRotationX - stateRef.currentRotationX) * 0.05;
      stateRef.currentRotationY +=
        (stateRef.targetRotationY - stateRef.currentRotationY) * 0.05;

      globeGroup.rotation.x = stateRef.currentRotationX;
      globeGroup.rotation.y = stateRef.currentRotationY;

      // Update particle system for immersive motion
      particleSystem.material.uniforms.time.value = Date.now() * 0.001;
      // Make starfield follow globe rotation for 360° background motion
      // Use a fraction (<1) for parallax feel, plus a tiny autonomous drift
      const drift = Date.now() * 0.00002;
      particleSystem.rotation.y = globeGroup.rotation.y * 0.4 + drift;
      particleSystem.rotation.x = globeGroup.rotation.x * 0.4;

      // Subtle mouse parallax on the camera for depth
      const parallaxX = mouse.x * 40.0;
      const parallaxY = -mouse.y * 30.0;
      camera.position.x += (parallaxX - camera.position.x) * 0.02;
      camera.position.y += (parallaxY - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousedown", handleMouseDown);
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("mouseup", handleMouseUp);
      renderer.domElement.removeEventListener("wheel", handleWheel);
      renderer.domElement.removeEventListener(
        "touchstart",
        handleMouseDown as any
      );
      renderer.domElement.removeEventListener(
        "touchmove",
        handleMouseMove as any
      );
      renderer.domElement.removeEventListener("touchend", handleMouseUp);
      mountRef.current?.removeChild(renderer.domElement);

      scene.traverse((object: THREE.Object3D) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material: THREE.Material) =>
              material.dispose()
            );
          } else {
            object.material.dispose();
          }
        }
      });
      pGeometry.dispose();
      pMaterial.dispose();
    };
  }, [waitlistEntries]);

  // Handle waitlist submission
  const handleWaitlistSubmit = async (entryData: {
    name: string;
    walletAddress: string;
    avatar: string;
    avatarType: "upload" | "avatar_seed";
    avatarSeed?: string;
    avatarStyle?: string;
  }) => {
    try {
      setWaitlistError(null);

      if (selectedProfileId === null) {
        throw new Error("No profile selected");
      }

      // Submit via server API for validation and writes
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...entryData,
          profileId: selectedProfileId,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Request failed (${res.status})`);
      }
      const data = await res.json();

      // Normalize API response to app entry shape
      const entry: WaitlistEntry = {
        id: data.id,
        name: data.name,
        walletAddress: data.wallet_address,
        avatar: data.avatar,
        avatarType: data.avatar_type,
        avatarSeed: data.avatar_seed,
        avatarStyle: data.avatar_style,
        profileId: data.profile_id,
        timestamp: new Date(data.created_at ?? Date.now()).getTime(),
      };

      // Update the globe visually and state
      updateGlobeWithEntry(entry, true);
      setWaitlistPopupOpen(false);
      setSelectedProfileId(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to join waitlist";
      setWaitlistError(errorMessage);
      throw error;
    }
  };

  // Clear a position visually (reset to original state)
  const clearPositionVisually = (profileId: number) => {
    const targetMesh = stateRef.profileMeshes.find(
      (mesh) => mesh.userData.id === profileId
    );

    if (targetMesh) {
      // Find the original profile data
      const originalProfile = profileData.find((p) => p.id === profileId);
      if (originalProfile) {
        // Reset to original material
        const oldMaterial = targetMesh.material as THREE.MeshBasicMaterial;
        if (oldMaterial && oldMaterial.map) {
          oldMaterial.map.dispose();
        }

        targetMesh.material = new THREE.MeshBasicMaterial({
          color: originalProfile.color,
          transparent: true,
          opacity: 0.9,
          side: THREE.DoubleSide,
        });

        // Reset user data
        targetMesh.userData = { ...originalProfile };
      }

      // Remove from state
      setWaitlistEntries((prev) => {
        const newEntries = new Map(prev);
        newEntries.delete(profileId);
        return newEntries;
      });
    }
  };

  // Helper function to create emoji texture
  const createEmojiTexture = (emoji: string, mesh: THREE.Mesh) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const size = 256;
    canvas.width = size;
    canvas.height = size;

    if (ctx) {
      // Create circular background
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = mesh.userData.color;
      ctx.fill();

      // Draw emoji
      ctx.font = `${
        size * 0.6
      }px "Noto Color Emoji", "Apple Color Emoji", serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(emoji, size / 2, size / 2);

      // Create texture from canvas with proper settings
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      // Dispose of old material to prevent memory leaks
      const oldMaterial = mesh.material as THREE.MeshBasicMaterial;
      if (oldMaterial && oldMaterial.map) {
        oldMaterial.map.dispose();
      }

      // Update the mesh material
      mesh.material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
      });
    }
  };

  // Update globe appearance after joining waitlist
  const updateGlobeWithEntry = (
    entry: WaitlistEntry,
    shouldUpdateState = true
  ) => {
    const globeGroup = stateRef.globeGroup;
    const renderer = stateRef.renderer;
    const scene = stateRef.scene;

    if (!globeGroup || !renderer || !scene) {
      return;
    }

    // Find the specific mesh that was clicked
    const targetMesh = stateRef.profileMeshes.find(
      (mesh) => mesh.userData.id === entry.profileId
    );

    if (!targetMesh) {
      return;
    }

    if (targetMesh) {
      const updateMeshVisual = () => {
        if (
          entry.avatarType === "avatar_seed" &&
          entry.avatar.startsWith("https://")
        ) {
          // Handle anime avatar from DiceBear API
          const img = new Image();
          img.crossOrigin = "anonymous"; // Enable CORS for external images
          img.onload = () => {
            // Create a canvas to make circular image
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const size = 256;
            canvas.width = size;
            canvas.height = size;

            if (ctx) {
              // Draw circular clipped image
              ctx.beginPath();
              ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
              ctx.closePath();
              ctx.clip();
              ctx.drawImage(img, 0, 0, size, size);

              // Create texture from canvas with stable settings
              const texture = new THREE.CanvasTexture(canvas);
              texture.needsUpdate = true;
              texture.generateMipmaps = false;
              texture.minFilter = THREE.LinearFilter;
              texture.magFilter = THREE.LinearFilter;

              // Dispose of old material to prevent memory leaks
              const oldMaterial =
                targetMesh.material as THREE.MeshBasicMaterial;
              if (oldMaterial && oldMaterial.map) {
                oldMaterial.map.dispose();
              }

              // Update the mesh material
              targetMesh.material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide,
              });
            }
          };
          img.onerror = () => {
            console.error("Failed to load anime avatar:", entry.avatar);
            // Fallback to emoji if avatar fails to load
            createEmojiTexture("🎭", targetMesh);
          };
          img.src = entry.avatar;
        } else if (
          entry.avatarType === "upload" &&
          entry.avatar.startsWith("data:")
        ) {
          // Handle uploaded image
          const img = new Image();
          img.onload = () => {
            // Create a canvas to make circular image
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const size = 256;
            canvas.width = size;
            canvas.height = size;

            if (ctx) {
              // Draw circular clipped image
              ctx.beginPath();
              ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
              ctx.closePath();
              ctx.clip();
              ctx.drawImage(img, 0, 0, size, size);

              // Create texture from canvas with stable settings
              const texture = new THREE.CanvasTexture(canvas);
              texture.needsUpdate = true;
              texture.generateMipmaps = false;
              texture.minFilter = THREE.LinearFilter;
              texture.magFilter = THREE.LinearFilter;

              // Dispose of old material to prevent memory leaks
              const oldMaterial =
                targetMesh.material as THREE.MeshBasicMaterial;
              if (oldMaterial && oldMaterial.map) {
                oldMaterial.map.dispose();
              }

              // Update the mesh material
              targetMesh.material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide,
              });
            }
          };
          img.src = entry.avatar;
        } else {
          // Handle emoji avatar
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const size = 256;
          canvas.width = size;
          canvas.height = size;

          if (ctx) {
            // Create circular background
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            ctx.fillStyle = targetMesh.userData.color;
            ctx.fill();

            // Draw emoji
            ctx.font = `${
              size * 0.6
            }px "Noto Color Emoji", "Apple Color Emoji", serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(entry.avatar, size / 2, size / 2);

            // Create texture from canvas with proper settings
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            texture.generateMipmaps = false;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;

            // Update the mesh material with stable settings
            targetMesh.material = new THREE.MeshBasicMaterial({
              map: texture,
              transparent: true,
              side: THREE.DoubleSide,
            });

            // Dispose of the old material to prevent memory leaks
            const oldMaterial = targetMesh.material as THREE.MeshBasicMaterial;
            if (oldMaterial && oldMaterial.map) {
              oldMaterial.map.dispose();
            }
          }
        }

        // Update user data
        targetMesh.userData = {
          ...targetMesh.userData,
          name: entry.name,
          isWaitlisted: true,
        };
      };

      updateMeshVisual();

      // Update state only if requested (to avoid circular updates during initial load)
      if (shouldUpdateState) {
        setWaitlistEntries((prev) => {
          const newEntries = new Map(prev);
          newEntries.set(entry.profileId, entry);
          return newEntries;
        });
      }
    }
  };

  // Load existing waitlist entries on component mount
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const allEntries = await waitlistService.getAllEntries();
        const entriesMap = new Map<number, WaitlistEntry>();

        allEntries.forEach((entry) => {
          entriesMap.set(entry.profileId, entry);
        });

        setWaitlistEntries(entriesMap);
      } catch (error) {
        console.error("Failed to load waitlist entries:", error);
      }
    };

    loadEntries();
  }, []);

  // Apply visual updates when entries change and globe is ready
  useEffect(() => {
    if (
      stateRef.globeGroup &&
      stateRef.profileMeshes.length > 0 &&
      waitlistEntries.size > 0
    ) {
      waitlistEntries.forEach((entry) => {
        updateGlobeWithEntry(entry, false);
      });
    }
  }, [waitlistEntries, loading]);

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans">
      <div
        ref={mountRef}
        className={`w-full h-full ${
          stateRef.isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ userSelect: "none" }}
      />

      {loading && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-[1000] px-4">
          {/* AXIOS Logo */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center space-x-2 md:space-x-3">
              <svg
                width="48"
                height="48"
                viewBox="0 0 173 173"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 md:w-12 md:h-12"
              >
                <path
                  d="M87.8752 75.3753L50.8259 38.326L39.6267 49.5252L76.4744 86.3729L39.6267 123.221L49.9753 133.569L87.8752 95.6693L125.775 133.569L136.124 123.221L99.276 86.3729L136.124 49.5252L124.924 38.326L87.8752 75.3753Z"
                  fill="#F97316"
                />
                <path
                  d="M59.096 29.3139L87.8752 0.534729L116.654 29.3139L87.8752 58.0931L59.096 29.3139Z"
                  fill="#F97316"
                />
                <path
                  d="M115.292 86.5213L144.072 57.7421L172.851 86.5213L144.072 115.3L115.292 86.5213Z"
                  fill="#F97316"
                />
                <path
                  d="M0.467819 86.5213L29.247 57.7421L58.0262 86.5213L29.247 115.3L0.467819 86.5213Z"
                  fill="#F97316"
                />
                <path
                  d="M59.096 143.506L68.6725 133.929L88.3285 152.348L97.7593 142.694L88.1019 133.15L87.8752 114.727L116.654 143.506L87.8752 172.285L59.096 143.506Z"
                  fill="#F97316"
                />
              </svg>
              <span className="text-white text-2xl md:text-3xl font-bold tracking-wide">
                AXIOS
              </span>
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full max-w-sm md:max-w-md mb-6">
            <div className="relative">
              {/* Progress Bar Background */}
              <div className="w-full h-1.5 md:h-2 bg-gray-800 rounded-full overflow-hidden">
                {/* Progress Bar Fill - Orange theme gradient */}
                <div
                  className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              {/* Progress Percentage */}
              <div className="flex justify-center mt-3 md:mt-4">
                <span className="text-white text-xs md:text-sm font-medium">
                  {Math.round(loadingProgress)}% COMPLETE
                </span>
              </div>
            </div>
          </div>

          {/* Loading Dots Animation */}
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-orange-500 rounded-full animate-pulse" />
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-orange-500 rounded-full animate-pulse delay-75" />
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-orange-500 rounded-full animate-pulse delay-150" />
          </div>
        </div>
      )}

      {/* Tooltip */}
      <div
        className="absolute bg-black/90 text-white px-3 py-2 rounded-md text-xs pointer-events-none z-[1000] border border-orange-500/50 transition-opacity duration-300"
        style={{
          left: `${tooltip.x}px`,
          top: `${tooltip.y}px`,
          opacity: tooltip.visible ? 1 : 0,
        }}
        dangerouslySetInnerHTML={{ __html: tooltip.content }}
      />

      {/* Waitlist Popup */}
      <WaitlistPopup
        isOpen={isWaitlistPopupOpen}
        onClose={() => {
          setWaitlistPopupOpen(false);
          setSelectedProfileId(null);
          setWaitlistError(null);
        }}
        onSubmit={handleWaitlistSubmit}
        profileId={selectedProfileId}
      />

      {/* Error Display */}
      {waitlistError && (
        <div className="fixed top-4 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-[10000]">
          {waitlistError}
        </div>
      )}
    </div>
  );
};

export default Globe3D;
