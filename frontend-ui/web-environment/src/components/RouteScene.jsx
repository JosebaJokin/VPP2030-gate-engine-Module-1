import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./RouteScene.css";

const GATE_KEYS = ["gate1_identity", "gate2_weight", "gate3_compliance"];

const NODE_COLOR = {
  PENDING: 0x8fa1a9,
  PASS: 0x3ecf8e,
  FAIL: 0xe5533d,
};

const PIN_TIP_HEIGHT = 0.55;
const PIN_TIP_RADIUS = 0.22;
const PIN_HEAD_RADIUS = 0.3;
const PIN_HEAD_Y = PIN_TIP_HEIGHT + PIN_HEAD_RADIUS * 0.55;

// Bent route: pins sit at indices 0, 2, 4; the odd indices are turn waypoints,
// so the road renders as four angled segments instead of one straight strip.
const ROUTE_POINTS = [
  { x: -3, z: 1.1 },
  { x: -1.4, z: -0.7 },
  { x: 0, z: 0.5 },
  { x: 1.5, z: -0.9 },
  { x: 3, z: 0.6 },
];
const PIN_INDICES = [0, 2, 4];

function nodeState(gates, status, key) {
  if (status === "CONNECTING") return "PENDING";
  const state = gates?.[key] ?? "PENDING";
  return state === "PASS" || state === "PENDING" ? state : "FAIL";
}

// Rotation about Y that points local +X at world direction (dx, dz).
function headingTo(dx, dz) {
  return Math.atan2(-dz, dx);
}

function buildPin(color) {
  const disposables = [];
  const group = new THREE.Group();

  const tipGeometry = new THREE.ConeGeometry(PIN_TIP_RADIUS, PIN_TIP_HEIGHT, 24);
  const tipMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.1 });
  const tip = new THREE.Mesh(tipGeometry, tipMaterial);
  tip.rotation.x = Math.PI;
  tip.position.y = PIN_TIP_HEIGHT / 2;
  group.add(tip);
  disposables.push(tipGeometry, tipMaterial);

  const headGeometry = new THREE.SphereGeometry(PIN_HEAD_RADIUS, 32, 32);
  const headMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.15 });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = PIN_HEAD_Y;
  group.add(head);
  disposables.push(headGeometry, headMaterial);

  return { group, disposables };
}

function buildRoadSegment(a, b, material) {
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const length = Math.hypot(dx, dz);
  const geometry = new THREE.BoxGeometry(length, 0.02, 0.14);
  const segment = new THREE.Mesh(geometry, material);
  segment.position.set((a.x + b.x) / 2, 0.011, (a.z + b.z) / 2);
  segment.rotation.y = headingTo(dx, dz);
  return { segment, geometry };
}

function buildTrain(color) {
  const disposables = [];
  const group = new THREE.Group();

  const bodyGeometry = new THREE.BoxGeometry(0.62, 0.26, 0.3);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.2 });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  group.add(body);
  disposables.push(bodyGeometry, bodyMaterial);

  const cabGeometry = new THREE.BoxGeometry(0.24, 0.2, 0.3);
  const cab = new THREE.Mesh(cabGeometry, bodyMaterial);
  cab.position.set(0.19, 0.23, 0);
  group.add(cab);
  disposables.push(cabGeometry);

  const stackGeometry = new THREE.CylinderGeometry(0.045, 0.055, 0.16, 12);
  const stack = new THREE.Mesh(stackGeometry, bodyMaterial);
  stack.position.set(-0.16, 0.21, 0);
  group.add(stack);
  disposables.push(stackGeometry);

  const wheelGeometry = new THREE.CylinderGeometry(0.09, 0.09, 0.32, 16);
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x141b20, roughness: 0.5 });
  [-0.19, 0.19].forEach((wx) => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(wx, -0.17, 0);
    group.add(wheel);
  });
  disposables.push(wheelGeometry, wheelMaterial);

  return { group, disposables };
}

export default function RouteScene({ gates, status }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 4.1, 5.4);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const disposables = [];

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 5),
      new THREE.MeshStandardMaterial({ color: 0x141b20, roughness: 1, metalness: 0 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    scene.add(ground);
    disposables.push(ground.geometry, ground.material);

    const grid = new THREE.GridHelper(9, 18, 0x2c3941, 0x212c33);
    scene.add(grid);
    disposables.push(grid.geometry, grid.material);

    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x5fa8d3, roughness: 0.6 });
    disposables.push(roadMaterial);
    for (let i = 0; i < ROUTE_POINTS.length - 1; i++) {
      const { segment, geometry } = buildRoadSegment(ROUTE_POINTS[i], ROUTE_POINTS[i + 1], roadMaterial);
      scene.add(segment);
      disposables.push(geometry);
    }

    const pins = PIN_INDICES.map((pointIndex, i) => {
      const point = ROUTE_POINTS[pointIndex];
      const color = NODE_COLOR[nodeState(gates, status, GATE_KEYS[i])];
      const { group, disposables: pinDisposables } = buildPin(color);
      group.position.set(point.x, 0, point.z);
      scene.add(group);
      disposables.push(...pinDisposables);
      return group;
    });

    const midPoint = ROUTE_POINTS[PIN_INDICES[1]];
    const heading = headingTo(
      ROUTE_POINTS[PIN_INDICES[2]].x - ROUTE_POINTS[PIN_INDICES[0]].x,
      ROUTE_POINTS[PIN_INDICES[2]].z - ROUTE_POINTS[PIN_INDICES[0]].z
    );
    const { group: train, disposables: trainDisposables } = buildTrain(0xe8a33d);
    const trainBaseY = PIN_HEAD_Y + PIN_HEAD_RADIUS + 0.45;
    train.position.set(midPoint.x, trainBaseY, midPoint.z);
    train.rotation.y = heading;
    scene.add(train);
    disposables.push(...trainDisposables);

    const clock = new THREE.Clock();
    let frameId;
    const animate = () => {
      const t = clock.getElapsedTime();
      train.position.y = trainBaseY + Math.sin(t * 2) * 0.06;
      train.rotation.z = Math.sin(t * 3) * 0.03;
      pins.forEach((pin, i) => {
        pin.position.y = i === 1 ? Math.sin(t * 2.4) * 0.03 : 0;
      });
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [gates, status]);

  return <div className="route-scene" ref={mountRef} />;
}
