import Link from "next/link";
import { site } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-[var(--season-divider)]">
      <div className="container-page flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
        <div>
          <p className="font-display text-lg italic">{site.name}</p>
          <p className="mt-1 text-sm text-mist">{site.footerTagline}</p>
        </div>
        <Link href="/admin/login" className="font-mono text-xs uppercase tracking-widest text-mist hover:text-thread">
          Админ
        </Link>
      </div>
    </footer>
  );
}
