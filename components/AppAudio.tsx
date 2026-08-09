"use client";

import { useEffect, useRef } from "react";
import type { AppSettings } from "@/domain/models";

export type AppSound = "tap" | "nav" | "start" | "correct" | "wrong" | "reward" | "notice";

export function playAppSound(sound: AppSound) {
  window.dispatchEvent(new CustomEvent("cosmo:sound", { detail: sound }));
}

const tones: Record<AppSound, Array<[number, number, number]>> = {
  tap: [[440, .035, .035]], nav: [[520, .04, .04]], start: [[392, .05, .05], [659, .12, .055]],
  correct: [[523, .06, .05], [659, .13, .05], [784, .21, .065]], wrong: [[210, .08, .05], [165, .18, .04]],
  reward: [[523, .05, .05], [659, .12, .05], [880, .2, .07]], notice: [[740, .04, .035], [988, .12, .04]],
};

export function AppAudio({ settings }: { settings: Pick<AppSettings, "bgm" | "se"> }) {
  const music = useRef<HTMLAudioElement>(null);
  const context = useRef<AudioContext | null>(null);
  const unlocked = useRef(false);
  const current = useRef(settings);

  useEffect(() => { current.current = settings; }, [settings]);

  useEffect(() => {
    const ensureMusic = () => {
      unlocked.current = true;
      if (current.current.bgm) music.current?.play().catch(() => undefined);
    };
    const sound = (name: AppSound) => {
      if (!current.current.se) return;
      const AudioContextClass = window.AudioContext;
      const ctx = context.current ?? new AudioContextClass();
      context.current = ctx;
      if (ctx.state === "suspended") void ctx.resume();
      const now = ctx.currentTime;
      tones[name].forEach(([frequency, offset, duration]) => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = name === "wrong" ? "triangle" : "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(.0001, now + offset);
        gain.gain.exponentialRampToValueAtTime(.055, now + offset + .008);
        gain.gain.exponentialRampToValueAtTime(.0001, now + offset + duration + .08);
        oscillator.connect(gain).connect(ctx.destination);
        oscillator.start(now + offset);
        oscillator.stop(now + offset + duration + .09);
      });
    };
    const firstGesture = () => ensureMusic();
    const onClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement).closest<HTMLElement>("button,[data-sound]");
      if (!button) return;
      sound((button.dataset.sound as AppSound | undefined) ?? (button.closest(".bottom-nav") ? "nav" : "tap"));
    };
    const onSound = (event: Event) => sound((event as CustomEvent<AppSound>).detail);
    addEventListener("pointerdown", firstGesture, { once: true });
    addEventListener("keydown", firstGesture, { once: true });
    document.addEventListener("click", onClick);
    addEventListener("cosmo:sound", onSound);
    return () => { document.removeEventListener("click", onClick); removeEventListener("cosmo:sound", onSound); };
  }, []);

  useEffect(() => {
    const audio = music.current;
    if (!audio) return;
    audio.volume = .16;
    if (!settings.bgm) audio.pause();
    else if (unlocked.current) audio.play().catch(() => undefined);
  }, [settings.bgm]);

  // This music-only track has no spoken content that requires captions.
  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <audio ref={music} src="/audio/main.mp3" loop preload="metadata" aria-hidden="true" />;
}
