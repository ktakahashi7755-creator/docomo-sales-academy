import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Profile, Role } from "@/lib/types";

interface AuthState {
  profile: Profile | null;
  signInDemo: (role: Role) => void;
  signOut: () => void;
  /** 進捗（モジュールID -> スコア）。デモはlocalStorage保持、Supabase接続後はprogressテーブルへ。 */
  progress: Record<string, number>;
  setModuleScore: (moduleId: string, score: number) => void;
}

const AuthContext = createContext<AuthState | null>(null);

const DEMO_PROFILE: Record<Role, Profile> = {
  trainee: { id: "demo-trainee", display_name: "研修生 デモ", role: "trainee", store_name: "府中店", team_name: "Aチーム", level: 3, is_active: true },
  helper: { id: "demo-helper", display_name: "ヘルパー デモ", role: "helper", store_name: "府中店", level: 5, is_active: true },
  closer: { id: "demo-closer", display_name: "クローザー デモ", role: "closer", store_name: "府中店", level: 9, is_active: true },
  sv: { id: "demo-sv", display_name: "SV デモ", role: "sv", store_name: "府中店", level: 10, is_active: true },
  admin: { id: "demo-admin", display_name: "管理者 デモ", role: "admin", level: 10, is_active: true },
};

const PROFILE_KEY = "dsa.demo.profile";
const PROGRESS_KEY = "dsa.demo.progress";

const DEFAULT_PROGRESS: Record<string, number> = {
  // デモ用の初期進捗（一部モジュール合格済み）
  p1m1: 92, p1m2: 88, p1m3: 90, p1m4: 100, p2m1: 84, p2m2: 80,
};

/** localStorageが使えない環境（プライベートブラウズ等）でも落ちないよう防御的に読む */
function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 保存できなくてもアプリは継続（メモリ保持のまま動作）
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(() => loadJson<Profile | null>(PROFILE_KEY, null));
  const [progress, setProgress] = useState<Record<string, number>>(() =>
    loadJson<Record<string, number>>(PROGRESS_KEY, DEFAULT_PROGRESS),
  );

  useEffect(() => {
    if (profile) saveJson(PROFILE_KEY, profile);
  }, [profile]);

  useEffect(() => {
    saveJson(PROGRESS_KEY, progress);
  }, [progress]);

  const value = useMemo<AuthState>(
    () => ({
      profile,
      signInDemo: (role) => setProfile(DEMO_PROFILE[role]),
      signOut: () => {
        setProfile(null);
        try {
          localStorage.removeItem(PROFILE_KEY);
        } catch {
          // no-op
        }
      },
      progress,
      setModuleScore: (moduleId, score) =>
        setProgress((p) => ({ ...p, [moduleId]: Math.max(p[moduleId] ?? 0, score) })),
    }),
    [profile, progress],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
