import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SV_TRAINEES } from "@/data/sv";
import type { SvTrainee } from "@/lib/types";

/**
 * SV ダッシュボードの名簿と認定承認の状態。
 * デモモードはメモリ保持（承認で Lv.10＝認定）。バックエンド接続時は同インターフェースで
 * certifications / profiles を SV 権限（RLS）で読み、承認はサーバー側 RPC
 * `approve_certification`（migration 0005・SECURITY DEFINER）に置き換える（AUDIT に追跡）。
 */

function stamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

interface CertificationState {
  /** 名簿の取得中（demo は即時 false。backend では profiles/progress の取得中に true）。 */
  loading: boolean;
  trainees: SvTrainee[];
  getTrainee: (id: string) => SvTrainee | undefined;
  /** 認定を承認（Lv.10 にする）。承認者は表示名。 */
  approve: (id: string, approver: string) => void;
}

const CertificationContext = createContext<CertificationState | null>(null);

export function CertificationProvider({ children }: { children: ReactNode }) {
  const [trainees, setTrainees] = useState<SvTrainee[]>(() =>
    SV_TRAINEES.map((t) => ({ ...t, progress: { ...t.progress } })),
  );

  const approve = useCallback((id: string, approver: string) => {
    setTrainees((prev) =>
      prev.map((t) =>
        t.id === id && t.level < 10
          ? { ...t, level: 10, certifiedAt: stamp(), certifiedBy: approver }
          : t,
      ),
    );
  }, []);

  // 最新の名簿を同期参照（getTrainee の依存を安定させる）。
  const traineesRef = useRef(trainees);
  traineesRef.current = trainees;
  const getTrainee = useCallback((id: string) => traineesRef.current.find((t) => t.id === id), []);

  const value = useMemo<CertificationState>(
    // demo はメモリ即時のため loading は常に false。backend 接続時に取得状態を反映する。
    () => ({ loading: false, trainees, getTrainee, approve }),
    [trainees, getTrainee, approve],
  );

  return <CertificationContext.Provider value={value}>{children}</CertificationContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCertification() {
  const ctx = useContext(CertificationContext);
  if (!ctx) throw new Error("useCertification must be used within CertificationProvider");
  return ctx;
}
