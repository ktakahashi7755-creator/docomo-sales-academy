import { RANKS } from "@/data/seed";

/**
 * 署名コンポーネント：未経験(Lv.0)から認定クローザー(Lv.10)までの育成ラダー。
 * 現在地を強調し、研修生に「次の一段」を常に見せる。
 * - done: 到達済み（コネクタ線も塗る＝登った跡）
 * - here: 現在地（aria-current="step"）
 * - next: 次の一段（accent のリングと「次の一段」ラベルで誘導）
 */
export function LevelLadder({ current }: { current: number }) {
  return (
    <ol className="flex flex-col gap-0.5" aria-label={`育成ラダー：現在レベル ${current} / 10`}>
      {[...RANKS].reverse().map((r) => {
        const done = r.level < current;
        const here = r.level === current;
        const next = r.level === current + 1;
        // 下段(r-1)へ伸びるコネクタ。current >= r なら「登った跡」として塗る。
        const connectorDone = r.level <= current;
        return (
          <li
            key={r.level}
            className="flex items-center gap-3"
            aria-current={here ? "step" : undefined}
          >
            <div className="flex w-10 shrink-0 items-center justify-end">
              <span
                className={`font-num text-xs font-semibold tabular-nums ${
                  here ? "text-accent" : done ? "text-ink" : "text-ink-muted"
                }`}
              >
                Lv.{r.level}
              </span>
            </div>
            <div className="relative flex flex-col items-center">
              <span
                className={`block h-3 w-3 rounded-full border-2 ${
                  here
                    ? "border-accent bg-accent"
                    : done
                      ? "border-ink bg-ink"
                      : next
                        ? "border-accent bg-paper"
                        : "border-paper-line bg-paper"
                }`}
              />
              {r.level > 0 && (
                <span
                  className={`absolute top-3 h-[18px] w-[2px] ${
                    connectorDone ? "bg-ink" : "bg-paper-line"
                  }`}
                />
              )}
            </div>
            <div
              className={`flex flex-1 items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                here
                  ? "bg-ink font-semibold text-paper"
                  : done || next
                    ? "text-ink"
                    : "text-ink-muted"
              }`}
            >
              <span>{r.label}</span>
              {here && <span className="text-xs font-normal opacity-80">現在地</span>}
              {next && (
                <span className="font-num rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
                  次の一段
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
