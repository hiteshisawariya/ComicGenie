"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Mail, Lock, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { loginUser, isLoggedIn } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (isLoggedIn()) router.replace("/"); }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = loginUser(email, password);
    if (result.success) { router.replace("/"); }
    else { setError(result.error || "Login failed"); setLoading(false); }
  }

  return (
    <div className="min-h-screen halftone-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[var(--accent)] rounded-xl flex items-center justify-center border-2 border-[var(--ink)]" style={{ boxShadow: "4px 4px 0 var(--ink)" }}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-bangers text-4xl text-[var(--ink)] tracking-wide">ComicGenie</h1>
          </div>
          <p className="font-comic text-gray-500 text-sm">Welcome back! Log in to create comics</p>
        </div>
        <div className="bg-white rounded-2xl p-8" style={{ border: "3px solid var(--ink)", boxShadow: "6px 6px 0 var(--ink)" }}>
          <h2 className="font-bangers text-2xl text-[var(--ink)] mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--accent)]" /> Log In
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold font-comic mb-1.5 text-[var(--ink)]">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border-2 border-[var(--ink)] rounded-lg font-comic text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--panel-bg)] disabled:opacity-50" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold font-comic mb-1.5 text-[var(--ink)]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border-2 border-[var(--ink)] rounded-lg font-comic text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--panel-bg)] disabled:opacity-50" />
              </div>
              <div className="text-right mt-1.5">
                <Link href="/forgot-password" className="font-comic text-xs text-[var(--sky)] hover:underline">Forgot Password?</Link>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-[var(--accent)] bg-red-50 border-2 border-[var(--accent)] rounded-lg px-3 py-2 font-comic text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />{error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-[var(--accent)] text-white font-bangers text-xl tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ border: "3px solid var(--ink)", boxShadow: "4px 4px 0 var(--ink)" }}>
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Logging in...</> : <><Sparkles className="w-5 h-5" /> Log In</>}
            </button>
          </form>
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="font-comic text-xs text-gray-400">Don't have an account?</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <Link href="/signup" className="w-full py-3 bg-[var(--panel-bg)] text-[var(--ink)] font-bangers text-xl tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
            style={{ border: "2px solid var(--ink)", boxShadow: "3px 3px 0 var(--ink)", display: "flex" }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
