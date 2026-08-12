"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';

const styles = {
  wrapper: {
    display: 'inline-block',
    whiteSpace: 'pre-wrap' as const
  },
  srOnly: {
    position: 'absolute' as const,
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    border: 0
  }
};

export interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  wordByWord?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: 'view' | 'hover' | 'inViewHover' | 'click';
  clickMode?: 'once' | 'toggle';
  [key: string]: unknown;
}

export default function DecryptedText({
  text,
  speed = 60,
  maxIterations = 6,
  sequential = true,
  wordByWord = true,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  clickMode = 'once',
  ...props
}: DecryptedTextProps) {
  const words = useMemo(() => text.split(' '), [text]);

  const availableChars = useMemo(() => {
    return useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter(char => char !== ' ')
      : characters.split('');
  }, [useOriginalCharsOnly, text, characters]);

  const getRandomScramble = useCallback(
    (wordLength: number) => {
      let res = '';
      for (let i = 0; i < wordLength; i++) {
        res += availableChars[Math.floor(Math.random() * availableChars.length)];
      }
      return res;
    },
    [availableChars]
  );

  const [revealedWordsCount, setRevealedWordsCount] = useState(words.length);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(animateOn !== 'click');

  const containerRef = useRef<HTMLSpanElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [scrambledWords, setScrambledWords] = useState<string[]>(() =>
    words.map((w) => getRandomScramble(w.length))
  );

  const triggerDecrypt = useCallback(() => {
    if (isAnimating) return;
    setRevealedWordsCount(0);
    setScrambledWords(words.map((w) => getRandomScramble(w.length)));
    setIsDecrypted(false);
    setIsAnimating(true);
  }, [isAnimating, words, getRandomScramble]);

  const resetToPlainText = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsAnimating(false);
    setRevealedWordsCount(words.length);
    setIsDecrypted(true);
  }, [words.length]);

  // Word-by-Word Decryption Animation Loop
  useEffect(() => {
    if (!isAnimating) return;

    let currentWordIdx = 0;
    let wordIteration = 0;

    intervalRef.current = setInterval(() => {
      setScrambledWords((prev) => {
        const next = [...prev];

        for (let i = currentWordIdx; i < words.length; i++) {
          next[i] = getRandomScramble(words[i].length);
        }

        wordIteration++;
        if (wordIteration >= Math.max(1, Math.floor(maxIterations / 2))) {
          wordIteration = 0;
          currentWordIdx++;
          setRevealedWordsCount(currentWordIdx);

          if (currentWordIdx >= words.length) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsAnimating(false);
            setIsDecrypted(true);
            setRevealedWordsCount(words.length);
          }
        }

        return next;
      });
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAnimating, words, speed, maxIterations, getRandomScramble]);

  const handleClick = () => {
    if (animateOn !== 'click') return;
    if (isDecrypted && clickMode === 'once') return;
    triggerDecrypt();
  };

  useEffect(() => {
    if (animateOn !== 'view' && animateOn !== 'inViewHover') return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          triggerDecrypt();
          setHasAnimated(true);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, { threshold: 0.1 });
    const currentRef = containerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [animateOn, hasAnimated, triggerDecrypt]);

  const animateProps =
    animateOn === 'hover' || animateOn === 'inViewHover'
      ? {
          onMouseEnter: triggerDecrypt,
          onMouseLeave: resetToPlainText
        }
      : animateOn === 'click'
        ? {
            onClick: handleClick
          }
        : {};

  return (
    <motion.span className={parentClassName} ref={containerRef} style={styles.wrapper} {...animateProps} {...props}>
      <span style={styles.srOnly}>{text}</span>

      <span aria-hidden="true">
        {words.map((word, wordIdx) => {
          const isRevealed = wordIdx < revealedWordsCount || (!isAnimating && isDecrypted);
          const displayWord = isRevealed ? word : scrambledWords[wordIdx] || getRandomScramble(word.length);

          return (
            <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
              <span className={isRevealed ? className : encryptedClassName}>
                {displayWord}
              </span>
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}
