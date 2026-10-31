"use client";

import { CHAT_COLLECTION, WHOAMI_KEY, LAST_READ_KEY_PREFIX } from "@/lib/room-config";

// Те же значения, что раньше жили здесь, — теперь они берутся из room-config,
// чтобы у нового сайта были собственные коллекции и ключи.
export const WATCH_WHOAMI_KEY = WHOAMI_KEY;
export { CHAT_COLLECTION };

export function getWatchWhoAmI(): "a" | "b" | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(WATCH_WHOAMI_KEY);
  return v === "a" || v === "b" ? v : null;
}

// Экспортируется, чтобы WatchChat считал непрочитанные сам, по уже
// загруженным сообщениям, без второго слушателя Firestore.
export function getLastRead(who: "a" | "b"): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(LAST_READ_KEY_PREFIX + who);
  return raw ? Number(raw) || 0 : 0;
}

// Вызывается, когда человек реально смотрит в чат: сбрасывает отметку
// «прочитано до» на текущий момент.
export function markWatchChatRead(who: "a" | "b") {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LAST_READ_KEY_PREFIX + who, String(Date.now()));
}
