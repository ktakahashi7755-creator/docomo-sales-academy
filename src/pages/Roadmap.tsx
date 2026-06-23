import { useAuth } from "@/context/AuthContext";
import { PHASES } from "@/data/seed";
import { Card, PageTitle, ScoreChip } from "@/components/ui";
import { isPassed, phaseProgress } from "@/lib/progress";
import { CheckCircle2, Circle } from "lucide-react";

export function Roadmap() {
  const { progress } = useAuth();

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Roadmap"
        title="研修ロードマップ"
        description="現場基礎からクローザー認定まで、10フェーズで段階的に育成します。"
      />

      <div className="space-y-4">
        {PHASES.map((phase) => {
          const { passed, complete } = phaseProgress(phase, progress);
          return (
            <Card key={phase.id} className="overflow-hidden">
              <div className="flex items-start gap-4 border-b border-paper-line px-5 py-4">
                <div
                  className={`font-num flex h-11 w-11 shrink-0 items-center justify-center rounded-xl2 text-sm font-bold ${
                    complete ? "bg-pass text-paper" : "bg-paper-soft text-ink"
                  }`}
                >
                  {phase.no.toString().padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-ink">{phase.title}</h2>
                  <p className="mt-0.5 text-sm text-ink-muted">{phase.summary}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-num text-sm font-semibold text-ink">
                    {passed}/{phase.modules.length}
                  </div>
                  <div className="text-xs text-ink-muted">合格</div>
                </div>
              </div>
              <ul className="divide-y divide-paper-line">
                {phase.modules.map((m) => {
                  const ok = isPassed(progress[m.id], m.passing_score);
                  return (
                    <li key={m.id} className="flex items-center gap-3 px-5 py-3">
                      {ok ? (
                        <CheckCircle2 size={18} className="shrink-0 text-pass" />
                      ) : (
                        <Circle size={18} className="shrink-0 text-paper-line" />
                      )}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-ink">{m.title}</div>
                        <div className="text-xs text-ink-muted">
                          目安 {m.estimated_minutes} 分・合格 {m.passing_score} 点
                          {m.passing_score === 100 && (
                            <span className="ml-1 text-accent">必須100点</span>
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
