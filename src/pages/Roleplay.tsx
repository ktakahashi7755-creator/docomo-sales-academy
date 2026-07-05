import { useState } from "react";
import { Link } from "react-router-dom";
import { SCENARIOS, DIFFICULTY, EVAL_ITEMS, TALK_SCRIPTS } from "@/data/seed";
import { Card, DifficultyMeter, PageHeader, SectionTitle } from "@/components/ui";
import { isBackendEnabled } from "@/lib/supabase";
import type { Scenario } from "@/lib/types";
import { Mic, Keyboard, Sparkles } from "lucide-react";

/** シナリオの目的に合ったスクリプト練習台本を選ぶ */
function scriptIdForScenario(s: Scenario): string {
  if (s.goal.includes("PLATINUM")) return "ts-platinum";
  if (s.goal.includes("dカード")) return "ts-gold";
  if (s.goal.includes("クロージング")) return "ts-catch-seated";
  if (s.goal.includes("料金診断") || s.goal.includes("MNP") || s.goal.includes("光") || s.goal.includes("セット"))
    return "ts-catch-seated";
  return "ts-catch-basic";
}

export function Roleplay() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[6].id); // 既定：PLATINUM対象
  const [difficulty, setDifficulty] = useState(7);
  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;
  const diff = DIFFICULTY.find((d) => d.level === difficulty)!;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Roleplay"
        title="ロープレ設定"
        description="顧客シナリオと難易度を選び、ヒアリングから提案・反論処理・クロージングまで練習します。"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {/* 左：シナリオ選択 */}
        <div className="md:col-span-2 space-y-4">
          <Card className="p-5 animate-fade-up">
            <SectionTitle eyebrow="Customer" title="顧客シナリオ" />
            <div className="grid gap-2 sm:grid-cols-2">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setScenarioId(s.id);
                    setDifficulty(s.difficulty);
                  }}
                  className={`rounded-xl2 border px-3.5 py-3 text-left transition-all ${
                    s.id === scenarioId
                      ? "border-ink bg-ink text-paper shadow-card"
                      : "border-paper-line bg-paper hover:-translate-y-0.5 hover:shadow-card"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-num text-xs font-semibold ${
                        s.id === scenarioId ? "text-accent" : "text-ink-muted"
                      }`}
                    >
                      #{s.no}
                    </span>
                    <span className="text-sm font-medium leading-snug">{s.title}</span>
                  </div>
                  <div className={`mt-1 text-xs ${s.id === scenarioId ? "text-paper/70" : "text-ink-muted"}`}>
                    {s.carrier}・{s.familyType}・難易度{s.difficulty}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <SectionTitle eyebrow="Difficulty" title={`難易度 ${difficulty}`} />
              <DifficultyMeter value={difficulty} />
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full accent-accent"
              aria-label="難易度"
            />
            <p className="mt-2 rounded-lg bg-paper-soft px-3.5 py-2.5 text-sm leading-relaxed text-ink-soft">
              {diff.desc}
            </p>
          </Card>
        </div>

        {/* 右：開始パネル */}
        <div className="space-y-4">
          <Card className="p-5">
            <SectionTitle eyebrow="Setup" title="この設定で開始" />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-ink-muted">シナリオ</dt>
                <dd className="font-num font-semibold text-ink">#{scenario.no}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-muted">キャリア</dt>
                <dd className="text-right text-ink">{scenario.carrier}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-muted">光回線</dt>
                <dd className="text-right text-ink">{scenario.internetLine}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-muted">関心度</dt>
                <dd className="text-right text-ink">{scenario.interest}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-muted">警戒心</dt>
                <dd className="text-right text-ink">{scenario.resistance}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-muted">目的</dt>
                <dd className="text-right font-medium text-ink">{scenario.goal}</dd>
              </div>
            </dl>

            <div className="mt-5 space-y-2">
              <Link
                to={`/roleplay/practice/${scriptIdForScenario(scenario)}`}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <Keyboard size={16} /> スクリプト練習を開始
              </Link>
              <p className="text-center text-[11px] leading-relaxed text-ink-muted">
                台本：{TALK_SCRIPTS.find((t) => t.id === scriptIdForScenario(scenario))?.title}
              </p>
              <button
                disabled={!isBackendEnabled}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-paper-line bg-paper px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-paper-soft disabled:opacity-50 disabled:hover:bg-paper"
                title={isBackendEnabled ? "" : "AI API設定後に有効化されます"}
              >
                <Mic size={16} /> 音声ロープレを開始（AI）
              </button>
            </div>
            {!isBackendEnabled && (
              <p className="mt-2.5 flex items-center gap-1 text-xs text-ink-muted">
                <Sparkles size={12} /> 音声・自由会話・AI評価はAI API設定後に有効化
              </p>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="mb-2.5 text-sm font-bold text-ink-soft">評価項目（100点満点）</h3>
            <div className="flex flex-wrap gap-1.5">
              {EVAL_ITEMS.map((e) => (
                <span key={e.key} className="rounded-full bg-paper-soft px-2.5 py-1 text-xs text-ink-soft">
                  {e.label}
                </span>
              ))}
            </div>
            <p className="font-num mt-3.5 text-xs text-ink-muted">S:90+ / A:80+ / B:70+ / C:60+ / D:60未満</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
