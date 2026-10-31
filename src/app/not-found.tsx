import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="eyebrow">404</p>
      <h1 className="font-display text-3xl font-light italic">Здесь ничего нет.</h1>
      <Link href="/" className="text-sm text-thread underline underline-offset-4">
        Вернуться в зал
      </Link>
    </div>
  );
}
