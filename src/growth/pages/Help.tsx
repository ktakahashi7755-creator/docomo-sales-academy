import { useState } from "react";
import { ChevronDown, Bot, BookOpen } from "lucide-react";
import { FAQ, GLOSSARY } from "@/growth/data/curriculum";
import { useProvide } from "@/growth/context/ProvideContext";
import { Card, PageHeader } from "@/growth/components/ui";

export function Help() {
  const { openBot } = useProvide();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Help & FAQ"
        title="ヘルプ・FAQ"
        description="使い方やよくある質問をまとめました。解決しないときは、AIサポートBotにいつでも相談できます。"
      />

      <Card className="overflow-hidden">
        <ul className="divide-y divide-slate-100">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-slate-50"
                >
                  <span className="font-display flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-600">
                    Q
                  </span>
                  <span className="flex-1 text-sm font-semibold text-slate-800">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-slate-400 transition ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pl-[3.75rem] text-sm leading-relaxed text-slate-600">
                    {item.a}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Card>

      {/* 用語集 */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
            <BookOpen size={16} strokeWidth={2} />
          </span>
          <h2 className="text-base font-bold text-slate-800">用語集</h2>
        </div>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          {GLOSSARY.map((g) => (
            <div key={g.term}>
              <dt className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-slate-800">{g.term}</span>
                {g.reading && <span className="text-[11px] text-slate-400">{g.reading}</span>}
              </dt>
              <dd className="mt-0.5 text-xs leading-relaxed text-slate-600">{g.definition}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card className="flex flex-col items-center gap-3 bg-gradient-to-br from-blue-600 to-blue-500 p-7 text-center text-white">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
          <Bot size={24} />
        </span>
        <h2 className="text-base font-bold">解決しませんでしたか？</h2>
        <p className="max-w-md text-sm text-blue-100">
          AIサポートBotが、学習やお客様対応の困りごとにいつでもお答えします。
        </p>
        <button
          type="button"
          onClick={openBot}
          className="mt-1 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          <Bot size={16} /> AIサポートBotに相談する
        </button>
      </Card>
    </div>
  );
}
