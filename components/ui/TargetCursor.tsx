"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import './TargetCursor.css';

export interface TargetCursorProps {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
  cursorColor?: string;
  cursorColorOnTarget?: string;
}

export default function TargetCursor({
  targetSelector = '.cursor-target, button, a, input, select, textarea, [role="button"]',
  hoverDuration = 0.18,
  cursorColor = '#00E5FF',
  cursorColorOnTarget = '#9B7FFF'
}: TargetCursorProps) {
  const [mounted, setMounted] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<NodeListOf<HTMLDivElement> | null>(null);

  const activeTargetRef = useRef<HTMLElement | null>(null);
  const isHoveredRef = useRef(false);
  const mousePosRef = useRef({ x: -100, y: -100 });
  const isVisibleRef = useRef(true);

  // Determine if device is purely touch (mobile/tablet without desktop hover)
  const isTouchDevice = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isTouchDevice || !mounted) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    cornersRef.current = cursor.querySelectorAll<HTMLDivElement>('.target-cursor-corner');
    const corners = Array.from(cornersRef.current);

    // Start at center of screen initially until first mouse movement
    mousePosRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    gsap.set(cursor, {
      x: mousePosRef.current.x,
      y: mousePosRef.current.y,
      opacity: 1
    });

    // Default corners reticle position (idle state around center dot)
    const setIdleCorners = (duration = 0.2) => {
      const cornerSize = 12;
      const offset = 12; // distance from center

      const idlePositions = [
        { x: -offset - cornerSize / 2, y: -offset - cornerSize / 2 },
        { x: offset - cornerSize / 2, y: -offset - cornerSize / 2 },
        { x: offset - cornerSize / 2, y: offset - cornerSize / 2 },
        { x: -offset - cornerSize / 2, y: offset - cornerSize / 2 }
      ];

      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x: idlePositions[i].x,
          y: idlePositions[i].y,
          borderColor: cursorColor,
          duration,
          ease: 'power2.out'
        });
      });

      if (dotRef.current) {
        gsap.to(dotRef.current, {
          backgroundColor: cursorColor,
          scale: 1,
          duration,
          ease: 'power2.out'
        });
      }
    };

    setIdleCorners(0);

    // Mouse Move handler - updates cursor position smoothly
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        gsap.to(cursor, { opacity: 1, duration: 0.15 });
      }

      // If not currently locked onto a target button, move cursor reticle directly
      if (!isHoveredRef.current) {
        gsap.to(cursor, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.05,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }
    };

    // Window leave & enter detection
    const handleMouseLeaveWindow = () => {
      isVisibleRef.current = false;
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
    };

    const handleMouseEnterWindow = () => {
      isVisibleRef.current = true;
      gsap.to(cursor, { opacity: 1, duration: 0.2 });
    };

    // Update target lock bounds
    const updateTargetLock = () => {
      const target = activeTargetRef.current;
      if (!target || !isHoveredRef.current) return;

      const rect = target.getBoundingClientRect();
      const padding = 6;
      const left = rect.left - padding;
      const top = rect.top - padding;
      const width = rect.width + padding * 2;
      const height = rect.height + padding * 2;

      // Keep center dot with the mouse cursor
      gsap.to(cursor, {
        x: mousePosRef.current.x,
        y: mousePosRef.current.y,
        duration: 0.05,
        ease: 'none',
        overwrite: 'auto'
      });

      // Position corners at element target box relative to cursor center
      const cursorX = mousePosRef.current.x;
      const cursorY = mousePosRef.current.y;

      const cornerPositions = [
        { x: left - cursorX, y: top - cursorY },
        { x: left + width - 12 - cursorX, y: top - cursorY },
        { x: left + width - 12 - cursorX, y: top + height - 12 - cursorY },
        { x: left - cursorX, y: top + height - 12 - cursorY }
      ];

      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x: cornerPositions[i].x,
          y: cornerPositions[i].y,
          borderColor: cursorColorOnTarget,
          duration: hoverDuration,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });

      if (dotRef.current) {
        gsap.to(dotRef.current, {
          backgroundColor: cursorColorOnTarget,
          scale: 1.2,
          duration: hoverDuration,
          ease: 'power2.out'
        });
      }
    };

    // Continuous ticker update for target locking while scrolling or animating
    const tickerCallback = () => {
      if (isHoveredRef.current && activeTargetRef.current) {
        updateTargetLock();
      }
    };
    gsap.ticker.add(tickerCallback);

    // Mouse over delegation
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest<HTMLElement>(targetSelector);
      if (interactive && interactive !== activeTargetRef.current) {
        activeTargetRef.current = interactive;
        isHoveredRef.current = true;
        updateTargetLock();
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (activeTargetRef.current) {
        const related = e.relatedTarget as HTMLElement | null;
        if (!related || !activeTargetRef.current.contains(related)) {
          isHoveredRef.current = false;
          activeTargetRef.current = null;
          setIdleCorners(hoverDuration);
        }
      }
    };

    // Click effect (mousedown / mouseup)
    const handleMouseDown = () => {
      gsap.to(cursor, { scale: 0.85, duration: 0.12 });
      if (dotRef.current) {
        gsap.to(dotRef.current, { scale: 1.5, duration: 0.12 });
      }
    };

    const handleMouseUp = () => {
      gsap.to(cursor, { scale: 1, duration: 0.12 });
      if (dotRef.current) {
        gsap.to(dotRef.current, { scale: 1, duration: 0.12 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mouseout', handleMouseOut, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    return () => {
      gsap.ticker.remove(tickerCallback);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
    };
  }, [
    mounted,
    isTouchDevice,
    targetSelector,
    cursorColor,
    cursorColorOnTarget,
    hoverDuration
  ]);

  if (!mounted || isTouchDevice) return null;

  return createPortal(
    <div ref={cursorRef} className="target-cursor-wrapper" style={{ opacity: 0 }}>
      <div ref={dotRef} className="target-cursor-dot" />
      <div className="target-cursor-corner corner-tl" />
      <div className="target-cursor-corner corner-tr" />
      <div className="target-cursor-corner corner-br" />
      <div className="target-cursor-corner corner-bl" />
    </div>,
    document.body
  );
}
