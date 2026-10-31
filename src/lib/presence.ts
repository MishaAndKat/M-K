"use client";

import { useEffect, useRef, useState } from "react";
import { doc, onSnapshot, setDoc, serverTimestamp, type Timestamp } from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import { PRESENCE_COLLECTION } from "@/lib/room-config";

// Online status for the watch room, built to keep Firestore traffic tiny:
//
// - A write happens only when the state actually changes (tab shown ->
//   online, tab hidden / page left -> offline). Rapid duplicate events
//   (visibilitychange and pagehide both firing on close, for example)
//   collapse into one write because the last written value is remembered.
// - While the tab stays visible, one "still here" write goes out every
//   HEARTBEAT_MS. It exists only as a safety net for a crashed browser or
//   a dropped connection, where the final "offline" write never leaves the
//   device; the other side then stops trusting the flag after
//   ONLINE_STALE_MS.
// - Reading is a single listener on the partner's one document. Turning
//   timestamps into «5 мин. назад» happens locally and costs nothing.

const HEARTBEAT_MS = 3 * 60_000;
// Longer than one heartbeat plus slack, so a single late beat never flips
// someone to offline.
const ONLINE_STALE_MS = 5 * 60_000;
// Local-only re-evaluation of "is that flag still fresh / how long ago".
const RECOMPUTE_MS = 15_000;

type PresenceDoc = {
  online: boolean;
  lastSeen: Timestamp | null;
};

function otherOf(who: "a" | "b"): "a" | "b" {
  return who === "a" ? "b" : "a";
}

function millisOf(ts: Timestamp | null | undefined): number {
  if (!ts) return 0;
  const withToMillis = ts as unknown as { toMillis?: () => number };
  if (typeof withToMillis.toMillis === "function") return withToMillis.toMillis();
  const parsed = new Date(ts as unknown as string).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

// Keeps this browser's presence doc up to date while whoAmI is known.
// Nothing to render; call it once near the top of the room. Because the
// room only exists on the watch page, leaving the page unmounts it and
// the cleanup below marks the person offline.
export function usePresenceHeartbeat(whoAmI: "a" | "b" | null) {
  // Last value actually sent, so repeated events for the same state
  // don't each turn into a write.
  const lastWrittenRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!whoAmI || !isFirebaseConfigured) return;
    const db = getDb();
    if (!db) return;
    const ref = doc(db, PRESENCE_COLLECTION, whoAmI);
    lastWrittenRef.current = null;

    function write(online: boolean) {
      lastWrittenRef.current = online;
      setDoc(ref, { online, lastSeen: serverTimestamp() }, { merge: true }).catch(() => {});
    }

    // Only writes when the state differs from what was last sent.
    function setState(online: boolean) {
      if (lastWrittenRef.current === online) return;
      write(online);
    }

    setState(document.visibilityState === "visible");

    // Safety-net beat, only while the tab is visible - a hidden tab is
    // already marked offline, so there's nothing to refresh.
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") write(true);
    }, HEARTBEAT_MS);

    function onVisibility() {
      setState(document.visibilityState === "visible");
    }
    function onGone() {
      setState(false);
    }
    function onShow() {
      // Page restored from the back/forward cache.
      if (document.visibilityState === "visible") setState(true);
    }

    document.addEventListener("visibilitychange", onVisibility);
    // pagehide covers mobile Safari/backgrounding cases beforeunload misses.
    window.addEventListener("pagehide", onGone);
    window.addEventListener("beforeunload", onGone);
    window.addEventListener("pageshow", onShow);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onGone);
      window.removeEventListener("beforeunload", onGone);
      window.removeEventListener("pageshow", onShow);
      setState(false);
    };
  }, [whoAmI]);
}

function formatLastSeen(lastSeenMs: number, nowMs: number): string | null {
  if (!lastSeenMs) return null;
  const minutes = Math.floor((nowMs - lastSeenMs) / 60_000);
  if (minutes < 1) return "только что";
  if (minutes < 60) return `${minutes} мин. назад`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч. назад`;
  return `${Math.floor(hours / 24)} дн. назад`;
}

// Live read of the *other* person's presence. `online` is false once the
// flag is older than ONLINE_STALE_MS even if it still says true (their
// tab died without sending a final "offline"). `lastSeen` is a short
// human label like «5 мин. назад», or null if they've never been seen.
export function usePartnerPresence(whoAmI: "a" | "b" | null): { online: boolean; lastSeen: string | null } {
  const [online, setOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<string | null>(null);

  useEffect(() => {
    if (!whoAmI || !isFirebaseConfigured) {
      setOnline(false);
      setLastSeen(null);
      return;
    }
    const db = getDb();
    if (!db) return;
    const ref = doc(db, PRESENCE_COLLECTION, otherOf(whoAmI));
    let latest: Partial<PresenceDoc> = {};

    function recompute() {
      const now = Date.now();
      const seenMs = millisOf(latest.lastSeen);
      setOnline(Boolean(latest.online) && now - seenMs < ONLINE_STALE_MS);
      setLastSeen(formatLastSeen(seenMs, now));
    }

    const unsub = onSnapshot(ref, (snap) => {
      latest = (snap.data({ serverTimestamps: "estimate" }) as Partial<PresenceDoc>) ?? {};
      recompute();
    });
    // Snapshots only arrive on writes - this local timer lets a stale
    // "online" flag expire, and keeps the "N min ago" label moving, with
    // no database traffic at all.
    const interval = setInterval(recompute, RECOMPUTE_MS);
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [whoAmI]);

  return { online, lastSeen };
}
