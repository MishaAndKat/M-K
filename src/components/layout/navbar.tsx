import Link from "next/link";
import { site } from "@/lib/site-config";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="container-page">
        <div className="glass mt-4 flex items-center justify-between rounded-full px-5 py-2.5">
          <Link href="/" className="font-display text-lg italic tracking-tight">
            {site.name}
          </Link>
          <span className="rounded-full border border-thread/40 px-2.5 py-0.5 font-display text-sm text-thread">
            18+
          </span>
        </div>
      </div>
    </header>
  );
}
