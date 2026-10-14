"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Mail, Lock, ShieldQuestion, Loader2, AlertCircle, Sparkles, CheckCircle, ArrowLeft } from "lucide-react";
import { getSecurityQuestion, resetPassword, checkIfSameAsOldPassword } from "@/lib/auth";

type Step = "email" | "question" | "newpassword" | "success";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const stepIndex = ["email", "question", "newpassword"].indexOf(step);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email"); return; }
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = getSecurityQuestion(email);
    setLoading(false);
    if (!result.found) { setError("No account found with this email address"); return; }
    if (!result.hasSecurityQuestion) { setError("This account was created before security questions were added. Please create a new account."); return; }
    setQuestion(result.question!);
    setStep("question");
  }

  async function handleAnswerSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim()) { setError("Please enter your answer"); return; }
    setError("");
    setStep("newpassword");
  }

  async function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault();
    if (!newPassword || !confirmPassword) { setError("Please fill in both fields"); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    if (checkIfSameAsOldPassword(email, newPassword)) {
      setError("New password cannot be the same as your old password. Please choose a different one.");
      return;
    }
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = resetPassword(email, answer, newPassword);
    setLoading(false);
    if (!result.success) {
      setError(result.error || "Reset failed. Check your answer.");
      setStep("question"); setAnswer(""); return;
    }
    setStep("success");
    await new Promise(r => setTimeout(r, 2000));
    router.replace("/login");
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
          <p className="font-comic text-gray-500 text-sm">Reset your password</p>
        </div>
        <div className="bg-white rounded-2xl p-8" style={{ border: "3px solid var(--ink)", boxShadow: "6px 6px 0 var(--ink)" }}>
          {step !== "success" && (
            <div className="flex items-center justify-center gap-2 mb-6">
              {["Email", "Question", "Password"].map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bangers text-sm border-2 border-[var(--ink)] transition-all ${stepIndex === i ? "bg-[var(--accent)] text-white" : stepIndex > i ? "bg-[var(--ink)] text-white" : "bg-gray-100 text-gray-400"}`}>{i + 1}</div>
                    <span className="font-comic text-xs text-gray-400">{label}</span>
                  </div>
                  {i < 2 && <div className={`w-8 h-0.5 mb-4 ${stepIndex > i ? "bg-[var(--ink)]" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
          )}

          {step === "email" && (
            <>
              <h2 className="font-bangers text-2xl text-[var(--ink)] mb-2 flex items-center gap-2"><Mail className="w-5 h-5 text-[var(--accent)]" /> Find Your Account</h2>
              <p className="font-comic text-sm text-gray-500 mb-5">Enter the email you used to sign up</p>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold font-comic mb-1.5 text-[var(--ink)]">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" disabled={loading}
                      className="w-full pl-10 pr-4 py-3 border-2 border-[var(--ink)] rounded-lg font-comic text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--panel-bg)] disabled:opacity-50" />
                  </div>
                </div>
                {error && <div className="flex items-center gap-2 text-[var(--accent)] bg-red-50 border-2 border-[var(--accent)] rounded-lg px-3 py-2 font-comic text-sm"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
                <button type="submit" disabled={loading} className="w-full py-3 bg-[var(--accent)] text-white font-bangers text-xl tracking-widest rounded-xl flex items-center justify-center gap-2 disabled:opacity-50" style={{ border: "3px solid var(--ink)", boxShadow: "4px 4px 0 var(--ink)" }}>
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Searching...</> : "Find Account"}
                </button>
              </form>
            </>
          )}

          {step === "question" && (
            <>
              <h2 className="font-bangers text-2xl text-[var(--ink)] mb-2 flex items-center gap-2"><ShieldQuestion className="w-5 h-5 text-[var(--accent)]" /> Security Question</h2>
              <p className="font-comic text-sm text-gray-500 mb-5">Answer your security question to continue</p>
              <form onSubmit={handleAnswerSubmit} className="space-y-4">
                <div className="bg-[var(--gold)] border-2 border-[var(--ink)] rounded-lg p-4" style={{ boxShadow: "3px 3px 0 var(--ink)" }}>
                  <p className="font-comic text-xs text-[var(--ink)] font-bold mb-1 uppercase tracking-wide">Your security question:</p>
                  <p className="font-bangers text-lg text-[var(--ink)] leading-snug">{question}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold font-comic mb-1.5 text-[var(--ink)]">Your answer</label>
                  <input type="text" value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Type your answer here" disabled={loading} autoFocus
                    className="w-full px-4 py-3 border-2 border-[var(--ink)] rounded-lg font-comic text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--panel-bg)] disabled:opacity-50" />
                  <p className="text-xs text-gray-400 font-comic mt-1">Answer is not case-sensitive</p>
                </div>
                {error && <div className="flex items-center gap-2 text-[var(--accent)] bg-red-50 border-2 border-[var(--accent)] rounded-lg px-3 py-2 font-comic text-sm"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
                <button type="submit" disabled={loading} className="w-full py-3 bg-[var(--accent)] text-white font-bangers text-xl tracking-widest rounded-xl flex items-center justify-center gap-2 disabled:opacity-50" style={{ border: "3px solid var(--ink)", boxShadow: "4px 4px 0 var(--ink)" }}>
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</> : "Verify Answer"}
                </button>
              </form>
            </>
          )}

          {step === "newpassword" && (
            <>
              <h2 className="font-bangers text-2xl text-[var(--ink)] mb-2 flex items-center gap-2"><Lock className="w-5 h-5 text-[var(--accent)]" /> Set New Password</h2>
              <p className="font-comic text-sm text-gray-500 mb-5">Choose a strong new password</p>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold font-comic mb-1.5 text-[var(--ink)]">New password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 6 characters" disabled={loading}
                      className="w-full pl-10 pr-4 py-3 border-2 border-[var(--ink)] rounded-lg font-comic text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--panel-bg)] disabled:opacity-50" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold font-comic mb-1.5 text-[var(--ink)]">Confirm new password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat new password" disabled={loading}
                      className="w-full pl-10 pr-4 py-3 border-2 border-[var(--ink)] rounded-lg font-comic text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--panel-bg)] disabled:opacity-50" />
                  </div>
                </div>
                {error && <div className="flex items-center gap-2 text-[var(--accent)] bg-red-50 border-2 border-[var(--accent)] rounded-lg px-3 py-2 font-comic text-sm"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
                <button type="submit" disabled={loading} className="w-full py-3 bg-[var(--accent)] text-white font-bangers text-xl tracking-widest rounded-xl flex items-center justify-center gap-2 disabled:opacity-50" style={{ border: "3px solid var(--ink)", boxShadow: "4px 4px 0 var(--ink)" }}>
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Resetting...</> : <><Sparkles className="w-5 h-5" /> Reset Password</>}
                </button>
              </form>
            </>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center gap-3 py-6">
              <CheckCircle className="w-14 h-14 text-green-500" />
              <p className="font-bangers text-2xl text-[var(--ink)]">Password Reset!</p>
              <p className="font-comic text-sm text-gray-500 text-center">Your password has been updated. Redirecting to login...</p>
            </div>
          )}

          {step !== "success" && (
            <div className="mt-5 text-center">
              <Link href="/login" className="font-comic text-sm text-[var(--sky)] hover:underline flex items-center justify-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
