import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-black text-cyan-400 font-display mb-2">404</h1>
      <p className="text-slate-300 font-bold mb-6">Halaman tidak ditemukan / Page Not Found</p>
      <Link
        href="/"
        className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold uppercase tracking-wider transition-all"
      >
        Kembali ke Game
      </Link>
    </div>
  );
}
