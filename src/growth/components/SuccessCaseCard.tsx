import { useState } from "react";
import { Users, ChevronDown } from "lucide-react";
import { SUCCESS_CASE, SUCCESS_CASES } from "@/growth/data/curriculum";
import { Card, SectionTitle, PrimaryButton, ACCENT } from "@/growth/components/ui";

const AVATAR_TONES = [
  "from-blue-400 to-blue-600",
  "from-teal-400 to-teal-600",
  "from-orange-400 to-orange-600",
];

export function SuccessCaseCard() {
  const [open, setOpen] = useState(false);
  const s = SUCCESS_CASE;

  return (
    <Card className="flex h-full flex-col p-6" hover>
      <SectionTitle
        title="成功事例を見る"
        icon={
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Users size={16} strokeWidth={2} />
          </span>
        }
      />
      <p className="text-sm leading-relaxed text-slate-600">{s.description}</p>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex -space-x-2.5">
          {s.members.map((name, i) => (
            <span
              key={name}
              className={`font-display flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ring-2 ring-white ${
                AVATAR_TONES[i % AVATAR_TONES.length]
              }`}
            >
              {name.slice(0, 1)}
            </span>
          ))}
        </div>
        <span className="text-xs text-slate-500">先輩スタッフ {SUCCESS_CASES.length} 名の事例</span>
      </div>

      {open && (
        <div className="mt-4 space-y-3">
          {SUCCESS_CASES.map((c) => {
            const a = ACCENT[c.tone];
            return (
              <div key={c.id} className="rounded-xl border border-slate-100 p-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-display flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${a.from} ${a.to}`}
                  >
                    {c.name.slice(0, 1)}
                  </span>
                  <div className="leading-tight">
                    <div className="text-sm font-bold text-slate-800">{c.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {c.role}・{c.store}
                    </div>
                  </div>
                </div>
                <dl className="mt-3 space-y-1.5 text-xs">
                  <Row label="状況" tone="bg-slate-100 text-slate-600" text={c.situation} />
                  <Row label="対応" tone="bg-blue-50 text-blue-700" text={c.approach} />
                  <Row label="結果" tone="bg-emerald-50 text-emerald-700" text={c.result} />
                </dl>
              </div>
            );
          })}
        </div>
      )}

      {open ? (
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-5 inline-flex min-h-[44px] items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          閉じる
          <ChevronDown size={16} className="rotate-180" />
        </button>
      ) : (
        <PrimaryButton className="mt-5 w-full" onClick={() => setOpen(true)}>
          事例を見る
          <ChevronDown size={16} strokeWidth={2.5} />
        </PrimaryButton>
      )}
    </Card>
  );
}

function Row({ label, tone, text }: { label: string; tone: string; text: string }) {
  return (
    <div className="flex gap-2">
      <dt className={`h-fit shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${tone}`}>
        {label}
      </dt>
      <dd className="leading-relaxed text-slate-600">{text}</dd>
    </div>
  );
}
