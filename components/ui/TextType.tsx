'use client';

import { useEffect, useRef, useState, createElement, useMemo, ElementType, ReactNode } from 'react';
import { gsap } from 'gsap';
import './TextType.css';

export interface TextTypeProps {
  text: string | string[];
  as?: ElementType;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: ReactNode;
  cursorClassName?: string;
  cursorBlinkDuration?: number;
  textColors?: string[];
  variableSpeed?: { min: number; max: number };
  onSentenceComplete?: (sentence: string, index: number) => void;
  startOnVisible?: boolean;
  reverseMode?: boolean;
  [key: string]: unknown;
}

/**
 * Ref-driven typing animation that avoids React state-batching race conditions.
 * All mutable animation state lives in a single ref object; only `rendered` (the
 * displayed string) is kept in React state to trigger re-renders.
 */
const TextType: React.FC<TextTypeProps> = ({
  text,
  as: Component = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}) => {
  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  // ── Mutable animation state (not subject to React batching) ──
  const anim = useRef({
    charIdx: 0,
    textIdx: 0,
    deleting: false,
    displayed: '',
  });

  const [rendered, setRendered] = useState('');
  const [isTypingActive, setIsTypingActive] = useState(false);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Intersection Observer for startOnVisible ──
  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1 },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  // ── Cursor blink (GSAP) ──
  useEffect(() => {
    if (showCursor && cursorRef.current) {
      gsap.set(cursorRef.current, { opacity: 1 });
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
      });
    }
  }, [showCursor, cursorBlinkDuration]);

  // ── Core animation loop ──
  useEffect(() => {
    if (!isVisible) return;

    const getSpeed = () => {
      if (!variableSpeed) return typingSpeed;
      return Math.random() * (variableSpeed.max - variableSpeed.min) + variableSpeed.min;
    };

    const tick = () => {
      const s = anim.current;
      const rawText = textArray[s.textIdx];
      const target = reverseMode ? rawText.split('').reverse().join('') : rawText;

      if (s.deleting) {
        // ── Deleting phase ──
        if (s.displayed.length > 0) {
          s.displayed = s.displayed.slice(0, -1);
          setRendered(s.displayed);
          setIsTypingActive(true);
          timerRef.current = setTimeout(tick, deletingSpeed);
        } else {
          // Fully deleted → move to next sentence
          s.deleting = false;
          s.charIdx = 0;

          if (onSentenceComplete) {
            onSentenceComplete(textArray[s.textIdx], s.textIdx);
          }

          if (s.textIdx === textArray.length - 1 && !loop) {
            setIsTypingActive(false);
            return; // done
          }

          s.textIdx = (s.textIdx + 1) % textArray.length;
          setIsTypingActive(false);
          // Pause before typing the next sentence
          timerRef.current = setTimeout(tick, pauseDuration);
        }
      } else {
        // ── Typing phase ──
        if (s.charIdx < target.length) {
          s.displayed += target[s.charIdx];
          s.charIdx += 1;
          setRendered(s.displayed);
          setIsTypingActive(true);
          timerRef.current = setTimeout(tick, getSpeed());
        } else {
          // Fully typed → pause then start deleting
          setIsTypingActive(false);
          if (!loop && s.textIdx === textArray.length - 1) return;
          timerRef.current = setTimeout(() => {
            s.deleting = true;
            tick();
          }, pauseDuration);
        }
      }
    };

    // Kick off the very first tick after initialDelay
    anim.current = { charIdx: 0, textIdx: 0, deleting: false, displayed: '' };
    setRendered('');
    timerRef.current = setTimeout(tick, initialDelay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // Only re-initialise when the text array or core config changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, textArray, typingSpeed, deletingSpeed, pauseDuration, initialDelay, loop, reverseMode]);

  const currentTextIndex = anim.current.textIdx;
  const currentColor =
    textColors.length > 0 ? textColors[currentTextIndex % textColors.length] : 'inherit';

  const shouldHideCursor =
    hideCursorWhileTyping && isTypingActive;

  return createElement(
    Component,
    {
      ref: containerRef,
      className: `text-type ${className}`,
      ...props,
    },
    <span className="text-type__content" style={{ color: currentColor || 'inherit' }}>
      {rendered}
    </span>,
    showCursor && (
      <span
        ref={cursorRef}
        className={`text-type__cursor ${cursorClassName} ${shouldHideCursor ? 'text-type__cursor--hidden' : ''}`}
      >
        {cursorCharacter}
      </span>
    ),
  );
};

export default TextType;
