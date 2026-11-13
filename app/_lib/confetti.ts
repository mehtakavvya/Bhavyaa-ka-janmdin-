"use client";
import confetti from "canvas-confetti";
import { useCallback, useEffect, useRef } from "react";
import { CONFETTI_COLORS } from "./design";

/** One-off burst on the full-screen canvas (sits above everything). */
export function burst(opts: confetti.Options) {
  void confetti({ colors: CONFETTI_COLORS, disableForReducedMotion: true, zIndex: 60, ...opts });
}

/** A confetti canvas you place yourself, so it can sit *behind* other elements (e.g. the sticker). */
export function useLayerConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instance = useRef<confetti.CreateTypes | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const inst = confetti.create(canvas, { resize: true, useWorker: false });
    instance.current = inst;
    return () => {
      inst.reset();
      instance.current = null;
    };
  }, []);

  const fire = useCallback((opts: confetti.Options) => {
    void instance.current?.({ colors: CONFETTI_COLORS, disableForReducedMotion: true, ...opts });
  }, []);

  return { canvasRef, fire };
}
