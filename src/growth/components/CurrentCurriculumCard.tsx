import { ArrowRight, Clock, GraduationCap, ClipboardCheck } from "lucide-react";
import { CURRENT_CURRICULUM } from "@/growth/data/curriculum";
import { Card, ProgressRing, SectionTitle, PrimaryButton, GIcon } from "@/growth/components/ui";

export function CurrentCurriculumCard() {
  const c = CURRENT_CURRICULUM;
  const tiles = [
    { icon: <Clock size={15} strokeWidth={2} />, label: "期間の目安", value: c.duration },
    {
      icon: <GraduationCap size={15} strokeWidth={2} />,
      label: "学習コンテンツ",
      value: `${c.contentCount}項目`,
    },
    {
      icon: <ClipboardCheck size={15} strokeWidth={2} />,
      label: "テスト",
      value: `${c.testCount}回`,
    },
  ];

  return (
    <Card className="p-6" hover>
      <SectionTitle
        title="現在のカリキュラム"
        icon={
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <GIcon name="book" size={16} />
          </span>
        }
      />

      <div className="flex items-start gap-5">
        <div className="min-w-0 flex-1">
          <span className="font-display inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1 text-xs font-bold tracking-wider text-white shadow-sm">
            STEP {String(c.stepNo).padStart(2, "0")}
          </span>
          <h3 className="mt-3 text-xl font-bold text-slate-800">{c.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{c.description}</p>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">進捗</span>
              <span className="font-display text-sm font-bold text-blue-600 tabular-nums">
                {c.progress}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-400 transition-[width] duration-500"
                style={{ width: `${c.progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="hidden shrink-0 sm:block">
          <ProgressRing
            value={c.progress}
            size={104}
            stroke={9}
            label={<span className="text-base">{c.progress}%</span>}
            color="text-blue-600"
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl bg-slate-50 p-3.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              {t.icon}
              {t.label}
            </div>
            <div className="font-display mt-1 text-base font-bold text-slate-800">{t.value}</div>
          </div>
        ))}
      </div>

      <PrimaryButton className="mt-5 w-full sm:w-auto">
        続きから学習する
        <ArrowRight size={16} strokeWidth={2.5} />
      </PrimaryButton>
    </Card>
  );
}
