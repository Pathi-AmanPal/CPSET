"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GlobeScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const w = container.clientWidth || window.innerWidth || 800;
    const h = container.clientHeight || window.innerHeight || 600;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    // 2. Dotted Globe — subtle ambient background
    const count = 2000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.1;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    const globeGeo = new THREE.BufferGeometry();
    globeGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const globeMat = new THREE.PointsMaterial({
      color: 0x0047ab,
      size: 0.025,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    });
    const globePoints = new THREE.Points(globeGeo, globeMat);
    scene.add(globePoints);

    // 3. Connection Lines — ultra subtle
    const linesGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const phi1 = Math.random() * Math.PI;
      const theta1 = Math.random() * Math.PI * 2;
      const phi2 = Math.random() * Math.PI;
      const theta2 = Math.random() * Math.PI * 2;
      const r = 2.1;

      const start = new THREE.Vector3(
        r * Math.sin(phi1) * Math.cos(theta1),
        r * Math.sin(phi1) * Math.sin(theta1),
        r * Math.cos(phi1)
      );
      const end = new THREE.Vector3(
        r * Math.sin(phi2) * Math.cos(theta2),
        r * Math.sin(phi2) * Math.sin(theta2),
        r * Math.cos(phi2)
      );
      const mid = start
        .clone()
        .add(end)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(r * 1.35);

      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      const points = curve.getPoints(40);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x8b00ff,
        transparent: true,
        opacity: 0.15,
      });
      linesGroup.add(new THREE.Line(lineGeo, lineMat));
    }
    scene.add(linesGroup);

    // 4. Shield Core Wireframe — ultra subtle
    const shieldGeo = new THREE.OctahedronGeometry(0.55, 0);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x8b00ff,
      transparent: true,
      opacity: 0.12,
      wireframe: true,
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    scene.add(shieldMesh);

    // 5. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      globePoints.rotation.y += delta * 0.1;
      globePoints.rotation.x += delta * 0.015;

      linesGroup.rotation.y += delta * 0.1;
      linesGroup.rotation.x += delta * 0.015;

      shieldMesh.rotation.z = Math.sin(elapsedTime * 0.8) * 0.15;
      const scale = 1 + Math.sin(elapsedTime * 1.5) * 0.06;
      shieldMesh.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };
    animate();

    // 6. Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newW = container.clientWidth || window.innerWidth || 800;
      const newH = container.clientHeight || window.innerHeight || 600;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}
