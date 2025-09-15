"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { WaitlistEntry } from "@/lib/waitlist-service";

// Configurable number of render spots on the globe (clamped 200..300)
const CONFIGURED_SPOTS = Number(
  process.env.NEXT_PUBLIC_WAITLIST_MAX_SPOTS || 250
);
const MAX_SPOTS = Math.max(
  200,
  Math.min(300, isFinite(CONFIGURED_SPOTS) ? CONFIGURED_SPOTS : 250)
);

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

  const profileData = useMemo(() => generateProfileData(MAX_SPOTS), []);

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
    // Touch/pinch gesture state
    touches: [] as Touch[],
    lastPinchDistance: 0,
    isPinching: false,
    // Mobile tooltip management
    tooltipTimeoutId: null as NodeJS.Timeout | null,
    lastTooltipTime: 0,
    // Click debounce for mobile
    lastClickTime: 0,
    lodFrame: 0,
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
        opacity: 1.0,
        alphaTest: 0.5,
        depthWrite: true,
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
      // Remove existing ring if present
      const existingRing = targetMesh.getObjectByName(
        "pfp-ring"
      ) as THREE.Mesh | null;
      if (existingRing) {
        targetMesh.remove(existingRing);
        existingRing.geometry.dispose();
        (existingRing.material as THREE.Material).dispose();
      }
      const originalProfile = profileData.find((p) => p.id === profileId);
      if (!originalProfile) return;
      const oldMaterial = targetMesh.material as THREE.MeshBasicMaterial;
      if (oldMaterial && oldMaterial.map) oldMaterial.map.dispose();
      targetMesh.material = new THREE.MeshBasicMaterial({
        color: originalProfile.color,
        transparent: true,
        opacity: 1.0,
        depthWrite: true,
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
            opacity: 1.0,
            alphaTest: 0.5,
            depthWrite: true,
            side: THREE.DoubleSide,
          });

          // Remove any existing ring and do not add new rings
          const existingRing = targetMesh.getObjectByName(
            "pfp-ring"
          ) as THREE.Mesh | null;
          if (existingRing) {
            targetMesh.remove(existingRing);
            existingRing.geometry.dispose();
            (existingRing.material as THREE.Material).dispose();
          }
        }
      };

      const isHttpImage =
        typeof entry.avatar === "string" &&
        (entry.avatar.startsWith("https://") ||
          entry.avatar.startsWith("http://"));
      const isDataImage =
        typeof entry.avatar === "string" && entry.avatar.startsWith("data:");

      if (isHttpImage) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => setTextureFromImage(img);
        img.onerror = () => createEmojiTexture("🎭", targetMesh);
        img.src = entry.avatar;
      } else if (isDataImage) {
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

    setLoadingProgress(10);
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0a, 1000, 3000);
    stateRef.scene = scene;

    setLoadingProgress(20);
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      5000
    );
    // Adjust camera distance based on screen size for better mobile visibility
    const isMobile = window.innerWidth < 768;
    camera.position.z = isMobile ? 1200 : 800;
    stateRef.camera = camera;

    setLoadingProgress(40);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    stateRef.renderer = renderer;
    mountRef.current.appendChild(renderer.domElement);

    setLoadingProgress(60);
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
      // Increase base avatar size and smoothness
      const geometry = new THREE.CircleGeometry(16, 24);
      const material = new THREE.MeshBasicMaterial({
        color: profile.color,
        transparent: true,
        opacity: 1.0,
        depthWrite: true,
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

    setLoadingProgress(80);
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

    const getTouchDistance = (touch1: Touch, touch2: Touch) => {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    // Helper function to show tooltip with auto-hide for mobile
    const showTooltipWithAutoHide = (
      content: string,
      x: number,
      y: number,
      duration = 3000
    ) => {
      // Clear any existing timeout
      if (stateRef.tooltipTimeoutId) {
        clearTimeout(stateRef.tooltipTimeoutId);
      }

      // Show tooltip immediately
      setTooltip({
        visible: true,
        content,
        x,
        y,
      });

      // Auto-hide after duration on mobile
      if (window.innerWidth <= 768) {
        // Mobile breakpoint
        stateRef.tooltipTimeoutId = setTimeout(() => {
          setTooltip((prev) => ({ ...prev, visible: false }));
          stateRef.tooltipTimeoutId = null;
        }, duration);
      }
    };

    // Helper function to hide tooltip
    const hideTooltip = () => {
      if (stateRef.tooltipTimeoutId) {
        clearTimeout(stateRef.tooltipTimeoutId);
        stateRef.tooltipTimeoutId = null;
      }
      setTooltip((prev) => ({ ...prev, visible: false }));
    };

    const handleMouseDown = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();

      // Hide tooltip when user starts interacting
      hideTooltip();

      if ("touches" in event && event.touches.length > 1) {
        // Multi-touch (pinch gesture)
        stateRef.isPinching = true;
        stateRef.touches = Array.from(event.touches);
        stateRef.lastPinchDistance = getTouchDistance(
          event.touches[0],
          event.touches[1]
        );
        stateRef.isAutoRotating = false;
        return;
      }

      stateRef.isMouseDown = true;
      stateRef.isDragging = false;
      stateRef.isPinching = false;
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

      if (
        "touches" in event &&
        event.touches.length > 1 &&
        stateRef.isPinching
      ) {
        // Handle pinch-to-zoom
        const currentDistance = getTouchDistance(
          event.touches[0],
          event.touches[1]
        );
        const distanceChange = currentDistance - stateRef.lastPinchDistance;

        if (Math.abs(distanceChange) > 2) {
          // Threshold to prevent jitter
          const zoomFactor = distanceChange > 0 ? 0.98 : 1.02;
          if (stateRef.camera) {
            stateRef.camera.position.multiplyScalar(zoomFactor);
            // Mobile-friendly zoom limits
            const minDistance = window.innerWidth < 768 ? 800 : 200;
            const maxDistance = window.innerWidth < 768 ? 2500 : 2000;
            stateRef.camera.position.clampLength(minDistance, maxDistance);
          }
          stateRef.lastPinchDistance = currentDistance;
        }
        return;
      }

      const clientX =
        "touches" in event ? event.touches[0].clientX : event.clientX;
      const clientY =
        "touches" in event ? event.touches[0].clientY : event.clientY;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      if (
        stateRef.isMouseDown &&
        !stateRef.isDragging &&
        !stateRef.isPinching
      ) {
        const deltaX = clientX - stateRef.startMouseX;
        const deltaY = clientY - stateRef.startMouseY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        // More forgiving drag threshold for mobile
        const dragThreshold = "touches" in event ? 25 : 15;
        if (distance > dragThreshold) {
          stateRef.isDragging = true;
          stateRef.isAutoRotating = false;
        }
      }

      if (stateRef.isDragging && !stateRef.isPinching) {
        const deltaX = clientX - stateRef.mouseX;
        const deltaY = clientY - stateRef.mouseY;
        // Increased sensitivity for mobile
        const sensitivity = "touches" in event ? 0.008 : 0.005;
        stateRef.targetRotationY += deltaX * sensitivity;
        stateRef.targetRotationX += deltaY * sensitivity;
        stateRef.mouseX = clientX;
        stateRef.mouseY = clientY;
      } else if (!stateRef.isMouseDown && !stateRef.isPinching) {
        handleHover();
      }
    };

    const handleMouseUp = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();

      if ("touches" in event && stateRef.isPinching) {
        // End pinch gesture
        if (event.touches.length < 2) {
          stateRef.isPinching = false;
          stateRef.touches = [];
          setTimeout(() => {
            stateRef.isAutoRotating = true;
          }, 1000);
        }
        return;
      }

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
      const wasClick = timeHeld < 500 && distance < 30;

      if (wasClick && stateRef.isMouseDown && !stateRef.isPinching) {
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

      // Debounce rapid clicks (especially important for mobile)
      const now = Date.now();
      if (now - stateRef.lastClickTime < 500) {
        return; // Ignore clicks within 500ms of each other
      }
      stateRef.lastClickTime = now;

      raycaster.setFromCamera(mouse, stateRef.camera);
      const intersects = raycaster.intersectObjects(stateRef.profileMeshes);
      if (intersects.length > 0) {
        const profile = intersects[0].object.userData as { id: number };
        const entryData = getEntryByProfileIdRef.current(profile.id);
        if (entryData) {
          const display = entryData.name?.startsWith("@")
            ? entryData.name
            : entryData.name;
          showTooltipWithAutoHide(
            `<strong>${display}</strong><br>Waitlist Member`,
            (mouse.x * window.innerWidth) / 2 + window.innerWidth / 2 + 10,
            (-mouse.y * window.innerHeight) / 2 + window.innerHeight / 2 - 10,
            3000
          );
        } else {
          onEmptySpotClickRef.current(profile.id);
        }
      }
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (!stateRef.camera) return;

      // Adjust zoom sensitivity based on device pixel ratio (mobile vs desktop)
      const sensitivity = window.devicePixelRatio > 1 ? 1.05 : 1.1;
      const delta = event.deltaY > 0 ? sensitivity : 1 / sensitivity;

      stateRef.camera.position.multiplyScalar(delta);
      // Mobile-friendly zoom limits
      const minDistance = window.innerWidth < 768 ? 800 : 200;
      const maxDistance = window.innerWidth < 768 ? 2500 : 2000;
      stateRef.camera.position.clampLength(minDistance, maxDistance);
    };

    const handleResize = () => {
      if (!stateRef.camera || !stateRef.renderer) return;
      stateRef.camera.aspect = window.innerWidth / window.innerHeight;
      stateRef.camera.updateProjectionMatrix();
      stateRef.renderer.setSize(window.innerWidth, window.innerHeight);

      // Adjust camera distance for mobile after resize
      const isMobile = window.innerWidth < 768;
      const currentDistance = stateRef.camera.position.length();
      const targetDistance = isMobile ? 1200 : 900;

      // Only adjust if we're significantly off from target
      if (Math.abs(currentDistance - targetDistance) > 100) {
        stateRef.camera.position.normalize().multiplyScalar(targetDistance);
      }
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
          ? `<strong>${
              entryData.name?.startsWith("@") ? entryData.name : entryData.name
            }</strong><br>Waitlist Member`
          : `<strong>Available Spot</strong><br><span style="color: #f97316;">Click to join waitlist</span>`;

        // Only show hover tooltips on desktop (larger screens)
        if (window.innerWidth > 768) {
          setTooltip({
            visible: true,
            content,
            x: (mouse.x * window.innerWidth) / 2 + window.innerWidth / 2 + 10,
            y:
              (-mouse.y * window.innerHeight) / 2 + window.innerHeight / 2 - 10,
          });
        }
      } else {
        hideTooltip();
      }
    };

    // Global touch handler to hide tooltips when touching outside
    const handleGlobalTouch = (event: TouchEvent) => {
      // If touch is outside the renderer canvas, hide tooltip
      const rect = renderer.domElement.getBoundingClientRect();
      const touch = event.touches[0] || event.changedTouches[0];
      if (touch) {
        const isOutside =
          touch.clientX < rect.left ||
          touch.clientX > rect.right ||
          touch.clientY < rect.top ||
          touch.clientY > rect.bottom;

        if (isOutside) {
          hideTooltip();
        }
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
    window.addEventListener("touchstart", handleGlobalTouch, { passive: true });

    // Keep full sphere visible and use a constant scale for all circles
    const CONSTANT_SCALE = 1.2;
    const CULL_DOT_THRESHOLD = -1.0; // include entire sphere [-1..1]
    const updateLOD = () => {
      if (!stateRef.camera || !stateRef.globeGroup) return;
      // Only update every few frames to reduce CPU
      stateRef.lodFrame = (stateRef.lodFrame + 1) % 4;
      if (stateRef.lodFrame !== 0) return;
      const cameraDir = stateRef.camera.position.clone().normalize();
      for (let i = 0; i < stateRef.profileMeshes.length; i++) {
        const mesh = stateRef.profileMeshes[i];
        const normal = mesh.position.clone().normalize();
        const dot = normal.dot(cameraDir); // [-1,1]
        mesh.visible = true;
        // Fixed size for every circle
        mesh.scale.setScalar(CONSTANT_SCALE);
        const mat = mesh.material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = 1.0; // full opacity
          mat.transparent = true;
        }
        // Ensure no ring remains
        const ring = mesh.getObjectByName("pfp-ring") as THREE.Mesh | null;
        if (ring) {
          mesh.remove(ring);
          ring.geometry.dispose();
          (ring.material as THREE.Material).dispose();
        }
      }
    };

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
      updateLOD();
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
      window.removeEventListener("touchstart", handleGlobalTouch);
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

      // Clean up tooltip timeout
      if (stateRef.tooltipTimeoutId) {
        clearTimeout(stateRef.tooltipTimeoutId);
      }

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
