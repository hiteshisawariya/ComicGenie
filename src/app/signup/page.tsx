"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Mail, Lock, User, Loader2, AlertCircle, Sparkles, CheckCircle, ShieldQuestion, Eye, EyeOff } from "lucide-react";
import { registerUser, isLoggedIn, SECURITY_QUESTIONS } from "@/lib/auth";

interface PasswordRule { label: string; test: (p: string) => boolean; }
const PASSWORD_RULES: PasswordRule[] = [
  { label: "At least 6 characters long", test: p => p.length >= 6 },
  { label: "At least one uppercase letter (A-Z)", test: p => /[A-Z]/.test(p) },
  { label: "At least one lowercase letter (a-z)", test: p => /[a-z]/.test(p) },
  { label: "At least one number (0-9)", test: p => /[0-9]/.test(p) },
  { label: "At least one special character (!@#$...)", test: p => /[^A-Za-z0-9]/.test(p) }
];

function getStrength(n: number) {
  if (n <= 1) return { label: "Very Weak", color: "#e63946", bg: "#FCEBEB" };
  if (n === 2) return { label: "Weak", color: "#f4a261", bg: "#FEF3E8" };
  if (n === 3) return { label: "Fair", color: "#f4a261", bg: "#FEF3E8" };
  if (n === 4) return { label: "Strong", color: "#2a9d8f", bg: "#E8F8F5" };
  return { label: "Very Strong", color: "#2a9d8f", bg: "#E8F8F5" };
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState(SECURITY_QUESTIONS[0]);
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [showRules, setShowRules] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { if (isLoggedIn()) router.replace("/"); }, [router]);

  const passed = PASSWORD_RULES.filter(r => r.test(password)).length;
  const strength = getStrength(passed);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password || !confirm || !securityAnswer) { setError("Please fill in all fields"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = registerUser(name, email, password, securityQuestion, securityAnswer);
    if (result.success) {
      setSuccess(true);
      await new Promise(r => setTimeout(r, 1500));
      router.replace("/login");
    } else {
      setError(result.error || "Registration failed");
      setLoading(false);
    }
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
          <p className="font-comic text-gray-500 text-sm">Create your account and start learning!</p>
        </div>
        <div className="bg-white rounded-2xl p-8" style={{ border: "3px solid var(--ink)", boxShadow: "6px 6px 0 var(--ink)" }}>
          <h2 className="font-bangers text-2xl text-[var(--ink)] mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--accent)]" /> Create Account
          </h2>
          {success ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <CheckCircle className="w-14 h-14 text-green-500" />
              <p className="font-bangers text-2xl text-[var(--ink)]">Account Created!</p>
              <p className="font-comic text-sm text-gray-500">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold font-comic mb-1.5 text-[var(--ink)]">Full name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" disabled={loading}
                    className="w-full pl-10 pr-4 py-3 border-2 border-[var(--ink)] rounded-lg font-comic text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--panel-bg)] disabled:opacity-50" />
                </div>
              </div>
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
                  <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                    onFocus={() => setShowRules(true)} placeholder="Create a password" disabled={loading}
                    className="w-full pl-10 pr-10 py-3 border-2 border-[var(--ink)] rounded-lg font-comic text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--panel-bg)] disabled:opacity-50" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {showRules && (
                  <div className="mt-2 rounded-lg border-2 border-[var(--ink)] overflow-hidden" style={{ boxShadow: "3px 3px 0 var(--ink)" }}>
                    <div className="px-3 py-2 flex items-center justify-between" style={{ background: strength.bg }}>
                      <span className="font-comic text-xs font-bold" style={{ color: strength.color }}>Strength: {strength.label}</span>
                      <span className="font-comic text-xs" style={{ color: strength.color }}>{passed}/{PASSWORD_RULES.length}</span>
                    </div>
                    <div className="h-2 bg-gray-200">
                      <div className="h-2 transition-all duration-300" style={{ width: `${(passed / PASSWORD_RULES.length) * 100}%`, background: strength.color }} />
                    </div>
                    <div className="p-3 bg-white space-y-2">
                      <p className="font-comic text-xs font-bold text-[var(--ink)] mb-2">Password must have:</p>
                      {PASSWORD_RULES.map((rule, i) => {
                        const ok = rule.test(password);
                        return (
                          <div key={i} className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${ok ? "bg-green-500" : "bg-gray-200"}`}>
                              {ok && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className={`font-comic text-xs transition-all ${ok ? "text-green-600 line-through" : "text-gray-500"}`}>{rule.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold font-comic mb-1.5 text-[var(--ink)]">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showConfirm ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat your password" disabled={loading}
                    className="w-full pl-10 pr-10 py-3 border-2 border-[var(--ink)] rounded-lg font-comic text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--panel-bg)] disabled:opacity-50" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirm.length > 0 && (
                  <p className={`font-comic text-xs mt-1 ${password === confirm ? "text-green-500" : "text-[var(--accent)]"}`}>
                    {password === confirm ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
              </div>
              <div className="border-t-2 border-dashed border-gray-200 pt-4">
                <label className="block text-xs font-bold font-comic mb-1.5 text-[var(--ink)]">
                  <ShieldQuestion className="inline w-3 h-3 mr-1" />Security Question
                  <span className="text-gray-400 font-normal ml-1">(for password recovery)</span>
                </label>
                <select value={securityQuestion} onChange={e => setSecurityQuestion(e.target.value)} disabled={loading}
                  className="w-full px-3 py-3 border-2 border-[var(--ink)] rounded-lg font-comic text-sm focus:outline-none bg-[var(--panel-bg)] disabled:opacity-50 mb-3">
                  {SECURITY_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
                <input type="text" value={securityAnswer} onChange={e => setSecurityAnswer(e.target.value)} placeholder="Your answer (remember this!)" disabled={loading}
                  className="w-full px-4 py-3 border-2 border-[var(--ink)] rounded-lg font-comic text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--panel-bg)] disabled:opacity-50" />
                <p className="text-xs text-gray-400 font-comic mt-1">⚠️ Remember this answer — you will need it to recover your password</p>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-[var(--accent)] bg-red-50 border-2 border-[var(--accent)] rounded-lg px-3 py-2 font-comic text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />{error}
                </div>
              )}
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-[var(--accent)] text-white font-bangers text-xl tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                style={{ border: "3px solid var(--ink)", boxShadow: "4px 4px 0 var(--ink)" }}>
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating account...</> : <><Sparkles className="w-5 h-5" /> Sign Up</>}
              </button>
            </form>
          )}
          {!success && (
            <>
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="font-comic text-xs text-gray-400">Already have an account?</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <Link href="/login" className="w-full py-3 bg-[var(--panel-bg)] text-[var(--ink)] font-bangers text-xl tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                style={{ border: "2px solid var(--ink)", boxShadow: "3px 3px 0 var(--ink)", display: "flex" }}>
                Log In Instead
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
