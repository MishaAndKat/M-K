"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AGE_GATE_KEY } from "@/lib/room-config";

// Экран подтверждения возраста. Пока не проверено, подтверждал ли человек
// возраст раньше (localStorage), страница закрыта сплошным слоем — чтобы
// контент не мигнул перед экраном.
export function AgeGate() {
  const [state, setState] = useState<"checking" | "locked" | "ok">("checking");

  useEffect(() => {
    let ok = false;
    try {
      ok = window.localStorage.getItem(AGE_GATE_KEY) === "1";
    } catch {
      // localStorage недоступен (приватный режим) — просто спросим ещё раз.
    }
    setState(ok ? "ok" : "locked");
  }, []);

  useEffect(() => {
    if (state === "ok") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [state]);

  function confirm() {
    try {
      window.localStorage.setItem(AGE_GATE_KEY, "1");
    } catch {
      // не страшно
    }
    setState("ok");
  }

  function leave() {
    window.location.href = "https://www.google.com";
  }

  return (
    <AnimatePresence>
      {state !== "ok" && (
        <motion.div
          key="age-gate"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-void p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Подтверждение возраста"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 45% at 50% 30%, rgba(150,66,108,0.35), transparent 70%), radial-gradient(ellipse 70% 50% at 50% 100%, rgba(226,168,188,0.14), transparent 70%)",
            }}
          />
          {state === "locked" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="card-surface glow-rose relative w-full max-w-md px-8 py-12 text-center"
            >
              <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-thread/50 bg-thread/[0.06]">
                <span className="font-display text-4xl font-medium text-thread">18+</span>
              </div>
              <h1 className="mt-8 font-display text-3xl font-light italic">Night play</h1>
              <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-mist">
                Здесь смотрят фильмы для взрослых. Продолжая, вы подтверждаете, что вам уже исполнилось 18 лет.
              </p>
              <div className="mt-9 flex flex-col gap-3">
                <button
                  onClick={confirm}
                  className="rounded-full bg-thread px-6 py-3 text-sm font-medium text-void transition-opacity hover:opacity-90"
                >
                  Мне есть 18 — войти
                </button>
                <button
                  onClick={leave}
                  className="rounded-full border border-line-dark px-6 py-3 text-sm text-mist transition-colors hover:border-thread/50 hover:text-ink"
                >
                  Мне нет 18 — выйти
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
