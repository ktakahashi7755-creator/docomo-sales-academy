import { Lightbulb } from "lucide-react";
import type { DialogueTurn } from "@/lib/types";

/** トーク詳細・スクリプト練習で共用する掛け合い吹き出し */
export function DialogueBubble({ turn, animate = false }: { turn: DialogueTurn; animate?: boolean }) {
  const isStaff = turn.speaker === "staff";
  return (
    <div className={`flex gap-2.5 ${isStaff ? "" : "flex-row-reverse"} ${animate ? "animate-fade-up" : ""}`}>
      <span
        className={`mt-0.5 flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full text-[11px] font-bold ${
          isStaff ? "bg-ink text-paper" : "border border-paper-line bg-paper-soft text-ink-soft"
        }`}
        aria-hidden
      >
        {isStaff ? "自分" : "客"}
      </span>
      <div className={`flex max-w-[calc(100%-6rem)] flex-col md:max-w-[75%] ${isStaff ? "items-start" : "items-end"}`}>
        <span className="mb-0.5 px-1 text-[10px] font-semibold tracking-wide text-ink-muted">
          {isStaff ? "あなた（ヘルパー）" : "お客様"}
        </span>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-card ${
            isStaff
              ? "rounded-tl-md bg-ink text-paper"
              : "rounded-tr-md border border-paper-line bg-paper text-ink"
          }`}
        >
          {turn.text}
        </div>
        {turn.note && (
          <div className="mt-1.5 flex items-start gap-1.5 rounded-lg bg-gold-soft px-3 py-1.5 text-xs leading-relaxed text-gold-deep">
            <Lightbulb size={13} className="mt-0.5 shrink-0" />
            <span>{turn.note}</span>
          </div>
        )}
      </div>
    </div>
  );
}
