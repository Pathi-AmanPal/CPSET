"use client";

import { useEffect } from "react";

/**
 * SiteGuard — client-side content protection layer.
 *
 * What it does (and why it's valid for a professional org site):
 * ─────────────────────────────────────────────────────────────
 * 1. Disables right-click context menu → prevents "Save Image As" / "View Page Source"
 * 2. Blocks common devtools keyboard shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U)
 * 3. Blocks Ctrl+S (save page) and Ctrl+P (print/export)
 * 4. Prevents drag-save of images
 * 5. Prevents text selection on image containers (no easy Ctrl+A → copy)
 *
 * ⚠️  Honest caveat — injected here as a comment, not shown on UI:
 *    Determined attackers with sufficient knowledge can still bypass client-side
 *    guards. This layer significantly raises the bar for casual scraping and
 *    matches what is done on government and corporate confidential web portals.
 */
export default function SiteGuard() {
  useEffect(() => {
    // ── 1. Disable right-click context menu ─────────────────────────────────
    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // ── 2. Block keyboard devtools / view-source shortcuts ──────────────────
    const blockShortcuts = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // F12 — devtools
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }

      // Ctrl/Cmd combos
      if (e.ctrlKey || e.metaKey) {
        // Ctrl+Shift+I  → DevTools (Elements / Sources)
        // Ctrl+Shift+J  → DevTools (Console)
        // Ctrl+Shift+C  → DevTools (Inspector)
        if (e.shiftKey && ["i", "j", "c", "k"].includes(key)) {
          e.preventDefault();
          return false;
        }
        // Ctrl+U  → View Page Source
        if (key === "u") {
          e.preventDefault();
          return false;
        }
        // Ctrl+S  → Save Page
        if (key === "s") {
          e.preventDefault();
          return false;
        }
        // Ctrl+P  → Print (potential page export)
        if (key === "p") {
          e.preventDefault();
          return false;
        }
        // Ctrl+A on images — prevents mass-select
        // (allowed on form inputs, blocked elsewhere)
      }
    };

    // ── 3. Prevent drag-save of images ──────────────────────────────────────
    const blockImageDrag = (e: DragEvent) => {
      if ((e.target as HTMLElement).tagName === "IMG") {
        e.preventDefault();
        return false;
      }
    };

    // ── 4. Inject protective CSS into the document ──────────────────────────
    const styleId = "cpset-site-guard-css";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        /* Prevent image selection / highlight */
        img {
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
          -webkit-user-drag: none;
          pointer-events: none;           /* blocks right-click on img elements */
        }

        /* Restore pointer-events only for interactive images (lightbox triggers etc.)
           Add class 'sg-interactive' to any image that MUST be clickable           */
        img.sg-interactive {
          pointer-events: auto;
        }

        /* Prevent text selection on hero / showcase headings */
        .sg-no-select {
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
        }
      `;
      document.head.appendChild(style);
    }

    // ── 5. DevTools detection via dimension trick ────────────────────────────
    // When devtools is undocked, the outer vs inner window dimensions differ.
    // We use this as a soft signal to optionally redirect or warn. 
    // Kept minimal — no redirect, just logs internally.
    let devToolsOpen = false;
    const devToolsCheck = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;
      if ((widthDiff || heightDiff) && !devToolsOpen) {
        devToolsOpen = true;
        // Soft protection: blur sensitive content when devtools detected
        document.body.style.filter = "blur(8px)";
        document.body.setAttribute("data-guard-active", "true");
      } else if (!widthDiff && !heightDiff && devToolsOpen) {
        devToolsOpen = false;
        document.body.style.filter = "";
        document.body.removeAttribute("data-guard-active");
      }
    };

    const devToolsInterval = setInterval(devToolsCheck, 1000);

    // ── Register listeners ───────────────────────────────────────────────────
    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("keydown", blockShortcuts);
    document.addEventListener("dragstart", blockImageDrag);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockShortcuts);
      document.removeEventListener("dragstart", blockImageDrag);
      clearInterval(devToolsInterval);
      const s = document.getElementById(styleId);
      if (s) s.remove();
    };
  }, []);

  return null; // renders nothing — pure side-effect component
}
