"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logoutUser } from "@/lib/auth";
import type { User } from "@/lib/auth";

interface Props { children: React.ReactNode; }

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) { router.replace("/login"); }
    else { setUser(currentUser); setChecking(false); }
  }, [router]);

  function handleLogout() {
    logoutUser();
    router.replace("/login");
  }

  if (checking) {
    return (
      <div className="min-h-screen halftone-bg flex items-center justify-center">
        <div className="font-bangers text-2xl text-[var(--ink)] animate-pulse">Loading ComicGenie...</div>
      </div>
    );
  }

  return (
    <div>
      {children}
      <div style={{ position: "fixed", top: "16px", right: "16px", zIndex: 999, display: "flex", gap: "8px", alignItems: "center" }}>
        <div className="bg-white px-3 py-1.5 rounded-lg font-comic text-xs font-bold text-[var(--ink)] flex items-center gap-2"
             style={{ border: "2px solid var(--ink)", boxShadow: "2px 2px 0 var(--ink)" }}>
          <div className="w-5 h-5 bg-[var(--accent)] rounded-full flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          {user?.name}
        </div>
        <button onClick={handleLogout}
          className="bg-[var(--ink)] text-white px-3 py-1.5 rounded-lg font-comic text-xs font-bold hover:bg-gray-800 transition-colors"
          style={{ border: "2px solid var(--ink)", boxShadow: "2px 2px 0 rgba(0,0,0,0.3)" }}>
          Logout
        </button>
      </div>
    </div>
  );
}
