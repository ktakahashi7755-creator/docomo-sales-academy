import { Clock, Target, Award } from "lucide-react";
import { useProvide } from "@/growth/context/ProvideContext";
import { Card } from "@/growth/components/ui";

function rankOf(pct: number): string {
  if (pct >= 90) return "S";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  return "D";
}

export function PerformanceCards() {
  const { studyMinutes, quizAverage, overallProgress } = useProvide();
  const h = Math.floor(studyMinutes / 60);
  const m = studyMinutes % 60;
  const timeLabel = h > 0 ? `${h}時間${m}分` : `${m}分`;

  const stats = [
    {
      id: "time",
      label: "学習時間",
      value: timeLabel,
      icon: <Clock size={17} strokeWidth={2} />,
      grad: "from-blue-500 to-blue-600",
    },
    {
      id: "score",
      label: "テスト正答率",
      value: quizAverage == null ? "—" : `${quizAverage}%`,
      icon: <Target size={17} strokeWidth={2} />,
      grad: "from-teal-400 to-teal-500",
    },
    {
      id: "rank",
      label: "総合評価",
      value: rankOf(quizAverage ?? overallProgress),
      icon: <Award size={17} strokeWidth={2} />,
      grad: "from-orange-400 to-orange-500",
    },
  ];

  return (
    <div>
      <h2 className="mb-3 px-1 text-sm font-bold text-slate-700">パフォーマンス</h2>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <Card key={s.id} className="p-3.5 text-center sm:text-left" hover>
            <span
              className={`mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm sm:mx-0 ${s.grad}`}
            >
              {s.icon}
            </span>
            <div className="font-display mt-2 text-base font-bold leading-tight text-slate-800">
              {s.value}
            </div>
            <div className="mt-0.5 text-[11px] text-slate-500">{s.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
