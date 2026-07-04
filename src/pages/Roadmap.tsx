import { useAuth } from "@/context/AuthContext";
import { PHASES } from "@/data/seed";
import { Card, PageHeader, ProgressBar, ScoreChip } from "@/components/ui";
import { CheckCircle2, Circle } from "lucide-react";

export function Roadmap() {
  const { progress } = useAuth();

  const allModules = PHASES.flatMap((p) => p.modules);
  const passedTotal = allModules.filter((m) => (progress[m.id] ?? 0) >= m.passing_score).length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Roadmap"
        title="研修ロードマップ"
        description="現場基礎からクローザー認定まで、10フェーズで段階的に育成します。"
        actions={
          <div className="rounded-xl2 border border-paper-line bg-paper px-4 py-2.5 text-right shadow-card">
            <div className="font-num text-lg font-bold leading-none text-ink">
              {passedTotal}
              <span className="text-sm text-ink-muted">/{allModules.length}</span>
            </div>
            <div className="mt-1 text-[11px] text-ink-muted">合格モジュール</div>
          </div>
        }
      />

      <div className="stagger space-y-4">
        {PHASES.map((phase) => {
          const passed = phase.modules.filter((m) => (progress[m.id] ?? 0) >= m.passing_score).length;
          const complete = passed === phase.modules.length;
          const rate = Math.round((passed / phase.modules.length) * 100);
          return (
            <Card key={phase.id} className="overflow-hidden">
              <div className="flex items-start gap-4 border-b border-paper-line px-5 py-4">
                <div
                  className={`font-num flex h-11 w-11 shrink-0 items-center justify-center rounded-xl2 text-sm font-bold ${
                    complete ? "bg-pass text-paper" : "bg-paper-soft text-ink"
                  }`}
                >
                  {complete ? <CheckCircle2 size={20} /> : phase.no.toString().padStart(2, "0")}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-ink">{phase.title}</h2>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">{phase.summary}</p>
                  <div className="mt-2.5 flex items-center gap-3">
                    <div className="w-full max-w-[200px]">
                      <ProgressBar value={rate} tone={complete ? "pass" : "ink"} />
                    </div>
                    <span className="font-num shrink-0 text-xs font-semibold text-ink-soft">
                      {passed}/{phase.modules.length} 合格
                    </span>
                  </div>
                </div>
              </div>
              <ul className="divide-y divide-paper-line">
                {phase.modules.map((m) => {
                  const ok = (progress[m.id] ?? 0) >= m.passing_score;
                  return (
                    <li key={m.id} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-paper-soft/50">
                      {ok ? (
                        <CheckCircle2 size={18} className="shrink-0 text-pass" />
                      ) : (
                        <Circle size={18} className="shrink-0 text-paper-line" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-ink">{m.title}</div>
                        <div className="text-xs text-ink-muted">
                          目安 {m.estimated_minutes} 分・合格 {m.passing_score} 点
                          {m.passing_score === 100 && (
                            <span className="ml-1.5 rounded bg-accent-soft px-1.5 py-0.5 font-semibold text-accent-deep">
                              必須100点
                            </span>
                          )}
                        </div>
                      </div>
                      <ScoreChip score={progress[m.id]} passing={m.passing_score} />
                    </li>
                  );
                })}
              </ul>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
