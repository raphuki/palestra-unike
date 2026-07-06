"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Menu,
  Minimize2,
  X
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { scenes } from "../components/scenes";

export default function Home() {
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [blackout, setBlackout] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const scene = scenes[index];
  const maxStage = scene.stages ?? 0;
  const finalLogoOnly = scene.id === 33 && stage >= 1;

  const goTo = useCallback((nextIndex) => {
    const bounded = Math.max(0, Math.min(scenes.length - 1, nextIndex));
    setIndex(bounded);
    setStage(0);
    setMenuOpen(false);
  }, []);

  const next = useCallback(() => {
    if (blackout) return;
    if (stage < maxStage) {
      setStage((value) => value + 1);
      return;
    }
    goTo(index + 1);
  }, [blackout, goTo, index, maxStage, stage]);

  const previous = useCallback(() => {
    if (blackout) return;
    if (stage > 0) {
      setStage((value) => value - 1);
      return;
    }
    goTo(index - 1);
  }, [blackout, goTo, index, stage]);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.repeat) return;

      if (event.key === "b" || event.key === "B") {
        setBlackout((value) => !value);
        return;
      }

      if (event.key === "m" || event.key === "M") {
        setMenuOpen((value) => !value);
        return;
      }

      if (event.key === "Home") {
        setBlackout(false);
        goTo(0);
        return;
      }

      if (event.key === "End") {
        setBlackout(false);
        goTo(scenes.length - 1);
        return;
      }

      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        next();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previous();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo, next, previous]);

  useEffect(() => {
    if (scene.id !== 33 || stage !== 0 || blackout) return undefined;
    const timer = window.setTimeout(() => setStage(1), 5200);
    return () => window.clearTimeout(timer);
  }, [blackout, scene.id, stage]);

  const progress = useMemo(() => {
    return ((index + 1) / scenes.length) * 100;
  }, [index]);

  const CurrentScene = scene.Component;

  return (
    <main
      className="presentation"
      onClick={(event) => {
        if (event.target.closest("[data-ui]")) return;
        if (event.clientX > window.innerWidth / 2) next();
        else previous();
      }}
    >
      <AnimatePresence mode="wait">
        <motion.section
          key={`${scene.id}-${stage}`}
          className="scene"
          initial={{ opacity: 0, filter: "blur(18px)", scale: 0.985 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          exit={{ opacity: 0, filter: "blur(18px)", scale: 1.012 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <CurrentScene stage={stage} />
        </motion.section>
      </AnimatePresence>

      {!finalLogoOnly && (
        <div className="chrome" data-ui>
          <button className="navButton previous" type="button" onClick={previous} aria-label="Cena anterior">
            <ChevronLeft size={20} strokeWidth={1.8} />
          </button>
          <button className="navButton next" type="button" onClick={next} aria-label="Próxima cena">
            <ChevronRight size={20} strokeWidth={1.8} />
          </button>

          <div className="topBar">
            <button className="iconButton" type="button" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
              <Menu size={18} strokeWidth={1.7} />
            </button>
            <button className="iconButton" type="button" onClick={toggleFullscreen} aria-label="Tela cheia">
              {isFullscreen ? <Minimize2 size={18} strokeWidth={1.7} /> : <Maximize2 size={18} strokeWidth={1.7} />}
            </button>
          </div>

          <div className="sceneCounter">Cena {scene.id}</div>
          <div className="progressTrack" aria-hidden="true">
            <motion.div
              className="progressFill"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      )}

      <AnimatePresence>
        {menuOpen && !blackout && !finalLogoOnly && (
          <motion.aside
            className="sceneMenu"
            data-ui
            initial={{ x: -360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -360, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="menuHeader">
              <span>UNIKE</span>
              <button className="iconButton" type="button" onClick={() => setMenuOpen(false)} aria-label="Fechar menu">
                <X size={18} strokeWidth={1.7} />
              </button>
            </div>
            <div className="menuList">
              {scenes.map((item, sceneIndex) => (
                <button
                  className={sceneIndex === index ? "menuItem active" : "menuItem"}
                  type="button"
                  key={item.id}
                  onClick={() => goTo(sceneIndex)}
                >
                  <span>Cena {item.id}</span>
                  <small>{item.label}</small>
                </button>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {blackout && (
          <motion.div
            className="blackout"
            data-ui
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
