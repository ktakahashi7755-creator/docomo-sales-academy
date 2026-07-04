import { RANKS } from "@/data/seed";

/**
 * 署名コンポーネント：未経験(Lv.0)から認定クローザー(Lv.10)までの育成ラダー。
 * 現在地を強調し、研修生に「次の一段」を見せる。
 */
export function LevelLadder({ current }: { current: number }) {
  return (
    <div className="flex flex-col gap-0.5" aria-label={`現在レベル ${current} / 10`}>
      {[...RANKS].reverse().map((r) => {
        const done = r.level < current;
        const here = r.level === current;
        return (
          <div key={r.level} className="flex items-center gap-3">
            <div className="flex w-10 shrink-0 items-center justify-end">
              <span className={`font-num text-xs font-semibold tabular-nums ${here ? "text-accent" : done ? "text-ink" : "text-ink-muted"}`}>
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
                      : "border-paper-line bg-paper"
                }`}
              />
              {r.level > 0 && <span className="absolute top-3 h-[18px] w-[2px] bg-paper-line" />}
            </div>
            <div
              className={`flex-1 rounded-lg px-3 py-1.5 text-sm ${
                here
                  ? "bg-ink text-paper font-semibold"
                  : done
                    ? "text-ink"
                    : "text-ink-muted"
              }`}
            >
              {r.label}
              {here && <span className="ml-2 text-xs font-normal opacity-80">現在地</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
