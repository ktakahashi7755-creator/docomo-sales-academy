import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Profile, Role } from "@/lib/types";
import type { ScoreMap } from "@/lib/progress";
import { isBackendEnabled } from "@/lib/supabase";
import * as auth from "@/lib/auth";
import { fetchProgress, saveModuleScore } from "@/lib/progressStore";

type Mode = "demo" | "backend";

interface AuthState {
  /** demo: ローカル seed / backend: Supabase 認証＋永続化 */
  mode: Mode;
  /** セッション解決中（backend 初期化／ログイン直後）。 */
  loading: boolean;
  profile: Profile | null;
  /** 進捗（モジュールキー -> スコア）。backend では module_progress に永続化。 */
  progress: ScoreMap;
  /** demo 専用：役割を選んで入る。 */
  signInDemo: (role: Role) => void;
  /** backend：メールに OTP コードを送る。 */
  sendOtp: (email: string) => Promise<void>;
  /** backend：OTP コードを検証してログイン。 */
  verifyOtp: (email: string, token: string) => Promise<void>;
  signOut: () => void;
  setModuleScore: (moduleId: string, score: number) => void;
}

const AuthContext = createContext<AuthState | null>(null);

// デモ用の初期進捗（一部モジュール合格済み）。
const DEMO_PROGRESS: ScoreMap = { p1m1: 92, p1m2: 88, p1m3: 90, p1m4: 100, p2m1: 84, p2m2: 80 };

const DEMO_PROFILE: Record<Role, Profile> = {
  trainee: {
    id: "demo-trainee",
    display_name: "研修生 デモ",
    role: "trainee",
    store_name: "府中店",
    team_name: "Aチーム",
    level: 3,
    is_active: true,
  },
  helper: {
    id: "demo-helper",
    display_name: "ヘルパー デモ",
    role: "helper",
    store_name: "府中店",
    level: 5,
    is_active: true,
  },
  closer: {
    id: "demo-closer",
    display_name: "クローザー デモ",
    role: "closer",
    store_name: "府中店",
    level: 9,
    is_active: true,
  },
  sv: {
    id: "demo-sv",
    display_name: "SV デモ",
    role: "sv",
    store_name: "府中店",
    level: 10,
    is_active: true,
  },
  admin: {
    id: "demo-admin",
    display_name: "管理者 デモ",
    role: "admin",
    level: 10,
    is_active: true,
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const mode: Mode = isBackendEnabled ? "backend" : "demo";
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<ScoreMap>(mode === "demo" ? DEMO_PROGRESS : {});
  // backend は初期セッション解決まで loading。demo は即時。
  const [loading, setLoading] = useState<boolean>(mode === "backend");
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (mode !== "backend") return;
    let active = true;

    async function loadUser(userId: string) {
      userIdRef.current = userId;
      try {
        const [p, prog] = await Promise.all([auth.fetchProfile(userId), fetchProgress(userId)]);
        if (!active) return;
        setProfile(p);
        setProgress(prog);
      } catch {
        // プロフィール取得失敗時は未ログイン扱い（RLS/未作成など）。
        if (!active) return;
        setProfile(null);
        setProgress({});
      } finally {
        if (active) setLoading(false);
      }
    }

    // 初期セッション
    auth
      .getCurrentUserId()
      .then((uid) => {
        if (!active) return;
        if (uid) void loadUser(uid);
        else setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    // 認証状態の変化（ログイン／ログアウト）
    const unsubscribe = auth.onAuthChange((uid) => {
      if (!active) return;
      if (uid) {
        setLoading(true);
        void loadUser(uid);
      } else {
        userIdRef.current = null;
        setProfile(null);
        setProgress({});
        setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [mode]);

  const value = useMemo<AuthState>(
    () => ({
      mode,
      loading,
      profile,
      progress,
      signInDemo: (role) => {
        if (mode === "demo") setProfile(DEMO_PROFILE[role]);
      },
      sendOtp: (email) => auth.sendOtp(email),
      verifyOtp: (email, token) => auth.verifyOtp(email, token),
      signOut: () => {
        if (mode === "backend") {
          void auth.signOut(); // 状態のクリアは onAuthChange(null) で行う
        } else {
          setProfile(null);
        }
      },
      setModuleScore: (moduleId, score) => {
        const prevScore = progress[moduleId];
        const nextScore = Math.max(prevScore ?? 0, score);
        if (nextScore === prevScore) return; // 変化なし
        // 楽観的更新：即時反映
        setProgress((p) => ({ ...p, [moduleId]: nextScore }));
        // backend は永続化。失敗時はロールバック。
        const uid = userIdRef.current;
        if (mode === "backend" && uid) {
          saveModuleScore(uid, moduleId, nextScore).catch(() => {
            setProgress((p) => {
              const rolled = { ...p };
              if (prevScore == null) delete rolled[moduleId];
              else rolled[moduleId] = prevScore;
              return rolled;
            });
          });
        }
      },
    }),
    [mode, loading, profile, progress],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
