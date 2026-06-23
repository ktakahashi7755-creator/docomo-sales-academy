import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCertification } from "@/context/CertificationContext";
import { useAuth } from "@/context/AuthContext";
import { CERT_CONDITIONS, PHASES } from "@/data/seed";
import {
  Card,
  PageTitle,
  ProgressBar,
  ErrorState,
  SectionTitle,
  PageLoading,
} from "@/components/ui";
import { LevelLadder } from "@/components/LevelLadder";
import { flattenModules, summarizeProgress } from "@/lib/progress";
import { certificationReadiness, canApprove, isPendingEvaluation } from "@/lib/certification";
import { ArrowLeft, CheckCircle2, Circle, Award, ShieldCheck } from "lucide-react";

const ALL_MODULES = flattenModules(PHASES);

export function SvTraineeDetail() {
  const { traineeId } = useParams();
  const { loading, getTrainee, approve } = useCertification();
  const { profile } = useAuth();
  const [confirming, setConfirming] = useState(false);
  const [announce, setAnnounce] = useState("");
  const confirmRef = useRef<HTMLButtonElement>(null);

  // 確認パネルが出たら主ボタンへフォーカスを移し、キーボード利用者が見失わないようにする。
  useEffect(() => {
    if (confirming) confirmRef.current?.focus();
  }, [confirming]);

  if (loading) return <PageLoading />;

  const trainee = traineeId ? getTrainee(traineeId) : undefined;
  if (!trainee) {
    return (
      <div className="space-y-6">
        <PageTitle eyebrow="Supervisor" title="メンバーが見つかりません" />
        <ErrorState
          title="メンバーが見つかりません"
          description="一覧から選び直してください。"
          action={
            <Link
              to="/sv"
              className="inline-flex min-h-[44px] items-center rounded-lg bg-ink px-4 text-sm font-medium text-paper"
            >
              SVダッシュボードへ
            </Link>
          }
        />
      </div>
    );
  }

  const ctx = { modules: ALL_MODULES, progress: trainee.progress, level: trainee.level };
  const readiness = certificationReadiness(CERT_CONDITIONS, ctx);
  const { completionRate, passedCount, total } = summarizeProgress(ALL_MODULES, trainee.progress);
  const approvable = canApprove(readiness);
  const approverName = profile?.display_name ?? "SV";

  function onApprove() {
    approve(trainee!.id, approverName);
    setConfirming(false);
    setAnnounce(`${trainee!.display_name}さんをクローザーとして承認しました。`);
  }

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Supervisor"
        title={trainee.display_name}
        description={`${trainee.store_name}${trainee.team_name ? `・${trainee.team_name}` : ""}・Lv.${trainee.level}`}
        action={
          <Link
            to="/sv"
            className="flex min-h-[44px] items-center gap-2 rounded-lg border border-paper-line bg-paper px-4 text-sm font-medium text-ink hover:bg-paper-soft"
          >
            <ArrowLeft size={16} strokeWidth={1.75} /> 一覧へ
          </Link>
        }
      />

      {/* 承認結果を支援技術へ通知（視覚的には承認パネルの差し替えで表現）。 */}
      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm text-ink-muted">研修の進捗</div>
              <div className="font-num text-2xl font-bold text-ink">
                {passedCount}
                <span className="text-base text-ink-muted"> / {total} 合格</span>
              </div>
            </div>
            <div className="font-num text-3xl font-bold text-ink tabular-nums">
              {completionRate}%
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar value={completionRate} tone={completionRate >= 100 ? "pass" : "ink"} />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-3 text-sm font-bold text-ink-soft">育成ラダー</h2>
          <LevelLadder current={trainee.level} />
        </Card>
      </div>

      {/* 認定承認パネル（状態で出し分け：認定済み / 承認可能 / 必須条件未達） */}
      {readiness.approved ? (
        <Card className="border-gold-soft bg-gold-soft/40 p-5">
          <div className="flex items-start gap-3">
            <Award size={22} strokeWidth={1.75} className="mt-0.5 shrink-0 text-gold-deep" />
            <div>
              <div className="font-semibold text-gold-deep">認定クローザー（Lv.10）</div>
              <p className="mt-1 text-sm text-ink-soft">
                {trainee.certifiedAt ? (
                  <span className="font-num">{trainee.certifiedAt}</span>
                ) : null}
                {trainee.certifiedAt ? " に" : ""}
                {trainee.certifiedBy ? `${trainee.certifiedBy} が承認しました。` : "承認済みです。"}
              </p>
            </div>
          </div>
        </Card>
      ) : approvable ? (
        <Card className="p-5">
          <SectionTitle eyebrow="Approval" title="クローザー認定の承認" />
          <p className="text-sm text-ink-soft">
            必須条件を満たしています。最終確認のうえ、クローザー（Lv.10）として承認できます。
          </p>
          {!confirming ? (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="mt-4 flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-ink px-5 text-sm font-medium text-paper"
            >
              <ShieldCheck size={16} strokeWidth={1.75} /> クローザーとして承認
            </button>
          ) : (
            <div className="mt-4 rounded-xl2 border border-paper-line bg-paper-soft p-4">
              <p className="text-sm font-medium text-ink">
                {trainee.display_name} さんをクローザー（Lv.10）として承認しますか。
              </p>
              <p className="mt-1 text-xs text-ink-muted">承認者：{approverName}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  ref={confirmRef}
                  onClick={onApprove}
                  className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-medium text-paper"
                >
                  <ShieldCheck size={16} strokeWidth={1.75} /> 承認する
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="min-h-[44px] rounded-lg border border-paper-line bg-paper px-4 text-sm font-medium text-ink hover:bg-paper-soft"
                >
                  やめる
                </button>
              </div>
            </div>
          )}
        </Card>
      ) : (
        <Card className="border-caution-soft bg-caution-soft/40 p-5">
          <div className="text-sm font-semibold text-caution-deep">
            承認には必須条件の達成が必要です
          </div>
          <p className="mt-1 text-sm text-ink-soft">
            全必須モジュールの合格とコンプライアンステスト100点を満たすと、承認できるようになります。
          </p>
        </Card>
      )}

      <Card className="p-5">
        <h2 className="mb-1 text-sm font-bold text-ink-soft">
          認定条件
          <span className="font-num ml-2 text-ink-muted">
            自動判定 {readiness.autoDone} / {readiness.autoTotal}
          </span>
        </h2>
        <p className="mb-3 text-xs text-ink-muted">
          進捗から自動判定できる条件と、ロープレ評価の蓄積後に判定する条件（現状はSV判断）に分かれます。
        </p>
        <ul className="space-y-2.5">
          {readiness.conditions.map((c) => (
            <li key={c.id} className="flex items-start gap-3">
              {c.done ? (
                <CheckCircle2
                  size={18}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-pass-deep"
                />
              ) : (
                <Circle
                  size={18}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-paper-line"
                />
              )}
              <div className="flex-1">
                <span className={`text-sm ${c.done ? "text-ink" : "text-ink-soft"}`}>
                  {c.label}
                </span>
                {isPendingEvaluation(c.id) && (
                  <span className="ml-2 rounded bg-paper-soft px-1.5 py-0.5 text-[11px] text-ink-muted">
                    評価蓄積待ち・SV判断
                  </span>
                )}
                {c.id === "c10" && (
                  <span className="ml-2 rounded bg-paper-soft px-1.5 py-0.5 text-[11px] text-ink-muted">
                    SV承認で確定
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
