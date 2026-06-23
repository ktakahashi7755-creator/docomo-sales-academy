import { useState } from "react";
import { SCENARIOS, DIFFICULTY, EVAL_ITEMS, RECOMMENDED_SCENARIO } from "@/data/seed";
import { Card, PageTitle, SectionTitle } from "@/components/ui";
import { isBackendEnabled } from "@/lib/supabase";
import { Mic, Keyboard, Sparkles } from "lucide-react";

export function Roleplay() {
  const [scenarioId, setScenarioId] = useState(RECOMMENDED_SCENARIO.id);
  const [difficulty, setDifficulty] = useState(RECOMMENDED_SCENARIO.difficulty);
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? RECOMMENDED_SCENARIO;
  const diff = DIFFICULTY.find((d) => d.level === difficulty);

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Roleplay"
        title="ロープレ設定"
        description="顧客シナリオと難易度を選び、ヒアリングから提案・反論処理・クロージングまで練習します。"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {/* 左：シナリオ選択 */}
        <div className="md:col-span-2 space-y-4">
          <Card className="p-5">
            <SectionTitle eyebrow="Customer" title="顧客シナリオ" />
            <div className="grid gap-2 sm:grid-cols-2">
              {SCENARIOS.map((s) => {
                const selected = s.id === scenarioId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setScenarioId(s.id);
                      setDifficulty(s.difficulty);
                    }}
                    className={`rounded-xl2 border px-3 py-2.5 text-left transition-colors ${
                      selected
                        ? "border-ink bg-ink text-paper"
                        : "border-paper-line bg-paper hover:bg-paper-soft"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-num text-xs font-semibold ${selected ? "text-paper/70" : "text-ink-muted"}`}
                      >
                        #{s.no}
                      </span>
                      <span className="text-sm font-medium">{s.title}</span>
                    </div>
                    <div
                      className={`mt-0.5 text-xs ${selected ? "text-paper/70" : "text-ink-muted"}`}
                    >
                      {s.carrier}・{s.familyType}・難易度{s.difficulty}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle eyebrow="Difficulty" title={`難易度 ${difficulty}`} />
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="h-11 w-full cursor-pointer accent-ink"
              aria-label="難易度（1〜10）"
              aria-valuetext={`難易度 ${difficulty}：${diff?.desc ?? ""}`}
            />
            <div className="font-num mt-1 flex justify-between text-xs text-ink-muted">
              <span>易しい 1</span>
              <span>10 手強い</span>
            </div>
            {diff && <p className="mt-2 text-sm text-ink-soft">{diff.desc}</p>}
          </Card>
        </div>

        {/* 右：開始パネル */}
        <div className="space-y-4">
          <Card className="p-5">
            <SectionTitle eyebrow="Setup" title="この設定で開始" />
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-muted">シナリオ</dt>
                <dd className="font-medium text-ink">#{scenario.no}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">キャリア</dt>
                <dd className="text-ink">{scenario.carrier}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">光回線</dt>
                <dd className="text-ink">{scenario.internetLine}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">関心度</dt>
                <dd className="text-ink">{scenario.interest}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">警戒心</dt>
                <dd className="text-ink">{scenario.resistance}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">目的</dt>
                <dd className="text-ink">{scenario.goal}</dd>
              </div>
            </dl>

            <div className="mt-4 space-y-2">
              <button
                type="button"
                disabled={!isBackendEnabled}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper disabled:cursor-not-allowed disabled:opacity-50"
                title={isBackendEnabled ? "" : "AI API設定後に有効化されます"}
              >
                <Keyboard size={16} /> テキストロープレを開始
              </button>
              <button
                type="button"
                disabled={!isBackendEnabled}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-paper-line bg-paper px-4 py-2.5 text-sm font-medium text-ink disabled:cursor-not-allowed disabled:opacity-50"
                title={isBackendEnabled ? "" : "AI API設定後に有効化されます"}
              >
                <Mic size={16} /> 音声ロープレを開始
              </button>
            </div>
            {!isBackendEnabled && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-muted">
                <Sparkles size={12} className="shrink-0" /> テキスト・音声・AI評価は AI API
                設定後に有効化されます。
              </p>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="mb-2 text-sm font-bold text-ink-soft">評価項目（100点満点）</h3>
            <div className="flex flex-wrap gap-1.5">
              {EVAL_ITEMS.map((e) => (
                <span
                  key={e.key}
                  className="rounded bg-paper-soft px-2 py-0.5 text-xs text-ink-soft"
                >
                  {e.label}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-muted">S:90+ / A:80+ / B:70+ / C:60+ / D:60未満</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
