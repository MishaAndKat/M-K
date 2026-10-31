import { cn } from "@/lib/utils";

// Dot + short label for the partner's online state. Purely presentational:
// the values come from usePartnerPresence (one shared listener in the
// watch room), so using this in several places adds no extra reads.
export function PresenceBadge({
  online,
  lastSeen,
  className,
  tone = "default",
}: {
  online: boolean;
  lastSeen: string | null;
  className?: string;
  // "light" for text sitting on the dark video overlay.
  tone?: "default" | "light";
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        aria-hidden
        className={cn(
          "h-2 w-2 shrink-0 rounded-full",
          online ? "bg-rose-300 shadow-[0_0_8px_2px_rgba(226,168,188,0.6)]" : tone === "light" ? "bg-white/30" : "bg-mist/40"
        )}
      />
      <span>{online ? "В сети" : lastSeen ? `Не в сети · ${lastSeen}` : "Не в сети"}</span>
    </span>
  );
}
