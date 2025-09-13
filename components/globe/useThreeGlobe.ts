"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { WaitlistEntry } from "@/lib/waitlist-service";

export type TooltipState = {
  visible: boolean;
  content: string;
  x: number;
  y: number;
};

type UseThreeGlobeOptions = {
  onEmptySpotClick: (profileId: number) => void;
  getEntryByProfileId: (profileId: number) => WaitlistEntry | undefined;
};

const generateProfileData = (count: number) => {
  const colors = [
    "#DE6635",
    "#8B4513",
    "#A0522D",
    "#CD853F",
    "#D2691E",
    "#B8860B",
  ];
  const profileData = [] as Array<{
    id: number;
    name: string;
    role: string;
    color: string;
  }>;
  for (let i = 1; i <= count; i++) {
    profileData.push({
      id: i,
      name: "",
      role: "Waitlist Spot",
      color: colors[i % colors.length],
    });
  }
  return profileData;
};

export function useThreeGlobe(
  waitlistEntries: Map<number, WaitlistEntry>,
  { onEmptySpotClick, getEntryByProfileId }: UseThreeGlobeOptions
) {
  const mountRef = useRef<HTMLDivElement>(null);
  // Store latest callbacks in refs to avoid re-initializing scene/effects
  const onEmptySpotClickRef = useRef(onEmptySpotClick);
  const getEntryByProfileIdRef = useRef(getEntryByProfileId);
  useEffect(() => {
    onEmptySpotClickRef.current = onEmptySpotClick;
    getEntryByProfileIdRef.current = getEntryByProfileId;
  }, [onEmptySpotClick, getEntryByProfileId]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });

  const profileData = useMemo(() => generateProfileData(150), []);

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

  // Helper: create circular emoji texture on a mesh
  const createEmojiTexture = useCallback((emoji: string, mesh: THREE.Mesh) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const size = 256;
    canvas.width = size;
    canvas.height = size;

    if (ctx) {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = mesh.userData.color;
      ctx.fill();
      ctx.font = `${
        size * 0.6
      }px "Noto Color Emoji", "Apple Color Emoji", serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(emoji, size / 2, size / 2);
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      const oldMaterial = mesh.material as THREE.MeshBasicMaterial;
      if (oldMaterial && oldMaterial.map) oldMaterial.map.dispose();
      mesh.material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
      });
    }
  }, []);

  const clearPositionVisually = useCallback(
    (profileId: number) => {
      const targetMesh = stateRef.profileMeshes.find(
        (mesh) => mesh.userData.id === profileId
      );
      if (!targetMesh) return;
      const originalProfile = profileData.find((p) => p.id === profileId);
      if (!originalProfile) return;
      const oldMaterial = targetMesh.material as THREE.MeshBasicMaterial;
      if (oldMaterial && oldMaterial.map) oldMaterial.map.dispose();
      targetMesh.material = new THREE.MeshBasicMaterial({
        color: originalProfile.color,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
      });
      targetMesh.userData = { ...originalProfile };
    },
    [profileData]
  );

  const applyEntryToGlobe = useCallback(
    (entry: WaitlistEntry) => {
      const targetMesh = stateRef.profileMeshes.find(
        (mesh) => mesh.userData.id === entry.profileId
      );
      if (!targetMesh) return;

      const setTextureFromImage = (img: HTMLImageElement) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        if (ctx) {
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, 0, 0, size, size);
          const texture = new THREE.CanvasTexture(canvas);
          texture.needsUpdate = true;
          texture.generateMipmaps = false;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          const oldMaterial = targetMesh.material as THREE.MeshBasicMaterial;
          if (oldMaterial && oldMaterial.map) oldMaterial.map.dispose();
          targetMesh.material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
          });
        }
      };

      if (
        entry.avatarType === "avatar_seed" &&
        entry.avatar.startsWith("https://")
      ) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => setTextureFromImage(img);
        img.onerror = () => createEmojiTexture("🎭", targetMesh);
        img.src = entry.avatar;
      } else if (
        entry.avatarType === "upload" &&
        entry.avatar.startsWith("data:")
      ) {
        const img = new Image();
        img.onload = () => setTextureFromImage(img);
        img.src = entry.avatar;
      } else {
        createEmojiTexture(entry.avatar || "😀", targetMesh);
      }

      targetMesh.userData = {
        ...targetMesh.userData,
        name: entry.name,
        isWaitlisted: true,
      };
    },
    [createEmojiTexture]
  );

  useEffect(() => {
    if (!mountRef.current) return;

    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

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
    // Starfield
    const particleCount = 550;
    const pGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
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
    for (let c = 0; c < numClusters; c++)
      clusterCenters.push(randomDirection());
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
      sizes[i] = (isCluster ? 5 : 3) + Math.random() * (isCluster ? 5 : 4);
    };
    for (let i = 0; i < clusterStarsCount; i++) {
      const center = clusterCenters[i % numClusters];
      const jitter = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      )
        .normalize()
        .multiplyScalar(0.25 * (0.5 + Math.random()));
      const direction = new THREE.Vector3()
        .copy(center)
        .add(jitter)
        .normalize();
      placeStar(direction, i, true);
    }
    for (let i = clusterStarsCount; i < particleCount; i++)
      placeStar(randomDirection(), i, false);
    pGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    pGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    const pMaterial = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0.0 } },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        void main() {
          vColor = color;
          vec3 drift = vec3(
            sin(time * 0.05 + position.y * 0.015) * 0.03,
            sin(time * 0.04 + position.z * 0.017) * 0.03,
            sin(time * 0.06 + position.x * 0.013) * 0.03
          );
          vec3 direction = normalize(position + drift);
          vec4 mvPosition = modelViewMatrix * vec4(direction * 2000.0, 1.0);
          gl_PointSize = size * (0.9 + 0.3 * sin(time * 0.8 + position.x * 0.01));
          gl_Position = projectionMatrix * mvPosition;
        }`,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float distance = length(gl_PointCoord - vec2(0.5));
          float alpha = smoothstep(0.55, 0.0, distance);
          gl_FragColor = vec4(vColor, alpha * 1.0);
        }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particleSystem = new THREE.Points(pGeometry, pMaterial);
    particleSystem.renderOrder = -1;
    stateRef.particleSystem = particleSystem;
    scene.add(particleSystem);

    setLoadingProgress(90);
    setTimeout(() => {
      setLoadingProgress(100);
      setTimeout(() => {
        setLoading(false);
        clearInterval(progressInterval);
      }, 500);
    }, 300);

    // Interactions
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseDown = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      stateRef.isMouseDown = true;
      stateRef.isDragging = false;
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
          stateRef.isAutoRotating = false;
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
        "changedTouches" in event
          ? event.changedTouches[0].clientX
          : (event as MouseEvent).clientX;
      const clientY =
        "changedTouches" in event
          ? event.changedTouches[0].clientY
          : (event as MouseEvent).clientY;
      const timeHeld = Date.now() - stateRef.mouseDownTime;
      const deltaX = clientX - stateRef.startMouseX;
      const deltaY = clientY - stateRef.startMouseY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const wasClick = timeHeld < 300 && distance < 15;
      if (wasClick && stateRef.isMouseDown) {
        handleMouseClick();
        if (!stateRef.isDragging) stateRef.isAutoRotating = true;
      } else if (stateRef.isDragging) {
        setTimeout(() => {
          stateRef.isAutoRotating = true;
        }, 2000);
      }
      stateRef.isMouseDown = false;
      stateRef.isDragging = false;
    };

    const handleMouseClick = () => {
      if (!stateRef.camera) return;
      raycaster.setFromCamera(mouse, stateRef.camera);
      const intersects = raycaster.intersectObjects(stateRef.profileMeshes);
      if (intersects.length > 0) {
        const profile = intersects[0].object.userData as { id: number };
        const entryData = getEntryByProfileIdRef.current(profile.id);
        if (entryData) {
          setTooltip({
            visible: true,
            content: `<strong>${entryData.name}</strong><br>Waitlist Member`,
            x: (mouse.x * window.innerWidth) / 2 + window.innerWidth / 2 + 10,
            y:
              (-mouse.y * window.innerHeight) / 2 + window.innerHeight / 2 - 10,
          });
        } else {
          onEmptySpotClickRef.current(profile.id);
        }
      }
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (!stateRef.camera) return;
      const delta = event.deltaY > 0 ? 1.1 : 0.9;
      stateRef.camera.position.multiplyScalar(delta);
      stateRef.camera.position.clampLength(300, 1500);
    };

    const handleResize = () => {
      if (!stateRef.camera || !stateRef.renderer) return;
      stateRef.camera.aspect = window.innerWidth / window.innerHeight;
      stateRef.camera.updateProjectionMatrix();
      stateRef.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const handleHover = () => {
      if (!stateRef.camera) return;
      raycaster.setFromCamera(mouse, stateRef.camera);
      const intersects = raycaster.intersectObjects(stateRef.profileMeshes);
      if (intersects.length > 0) {
        const profile = intersects[0].object.userData as {
          id: number;
          color: string;
        };
        const entryData = getEntryByProfileIdRef.current(profile.id);
        const content = entryData
          ? `<strong>${entryData.name}</strong><br>Waitlist Member`
          : `<strong>Available Spot</strong><br><span style="color: #f97316;">Click to join waitlist</span>`;
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

    // Listeners
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
    renderer.domElement.addEventListener("touchend", handleMouseUp as any, {
      passive: false,
    });
    window.addEventListener("resize", handleResize);

    // Animation
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (stateRef.isAutoRotating && !stateRef.isDragging) {
        stateRef.targetRotationY += stateRef.rotationSpeed;
      }
      if (stateRef.globeGroup) {
        stateRef.currentRotationX +=
          (stateRef.targetRotationX - stateRef.currentRotationX) * 0.05;
        stateRef.currentRotationY +=
          (stateRef.targetRotationY - stateRef.currentRotationY) * 0.05;
        stateRef.globeGroup.rotation.x = stateRef.currentRotationX;
        stateRef.globeGroup.rotation.y = stateRef.currentRotationY;
      }
      if (stateRef.particleSystem && stateRef.globeGroup && stateRef.camera) {
        // @ts-expect-error uniforms typed loosely
        stateRef.particleSystem.material.uniforms.time.value =
          Date.now() * 0.001;
        const drift = Date.now() * 0.00002;
        stateRef.particleSystem.rotation.y =
          stateRef.globeGroup.rotation.y * 0.4 + drift;
        stateRef.particleSystem.rotation.x =
          stateRef.globeGroup.rotation.x * 0.4;
        const parallaxX = mouse.x * 40.0;
        const parallaxY = -mouse.y * 30.0;
        stateRef.camera.position.x +=
          (parallaxX - stateRef.camera.position.x) * 0.02;
        stateRef.camera.position.y +=
          (parallaxY - stateRef.camera.position.y) * 0.02;
        stateRef.camera.lookAt(0, 0, 0);
      }
      if (stateRef.renderer && stateRef.scene && stateRef.camera) {
        stateRef.renderer.render(stateRef.scene, stateRef.camera);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousedown", handleMouseDown);
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("mouseup", handleMouseUp);
      renderer.domElement.removeEventListener("wheel", handleWheel as any);
      renderer.domElement.removeEventListener(
        "touchstart",
        handleMouseDown as any
      );
      renderer.domElement.removeEventListener(
        "touchmove",
        handleMouseMove as any
      );
      renderer.domElement.removeEventListener("touchend", handleMouseUp as any);
      mountRef.current?.removeChild(renderer.domElement);
      if (stateRef.scene) {
        stateRef.scene.traverse((object: THREE.Object3D) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach((material: THREE.Material) =>
                material.dispose()
              );
            } else {
              (object.material as THREE.Material).dispose();
            }
          }
        });
      }
      pGeometry.dispose();
      pMaterial.dispose();
    };
  }, [profileData]);

  return {
    mountRef,
    loading,
    loadingProgress,
    tooltip,
    clearPositionVisually,
    applyEntryToGlobe,
  };
}
