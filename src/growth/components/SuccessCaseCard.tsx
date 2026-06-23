import { ArrowRight, Users } from "lucide-react";
import { SUCCESS_CASE } from "@/growth/data/curriculum";
import { Card, SectionTitle, PrimaryButton } from "@/growth/components/ui";

const AVATAR_TONES = [
  "from-blue-400 to-blue-600",
  "from-teal-400 to-teal-600",
  "from-orange-400 to-orange-600",
];

export function SuccessCaseCard() {
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
        <span className="text-xs text-slate-500">先輩スタッフ {s.members.length} 名の事例</span>
      </div>

      <PrimaryButton className="mt-5 w-full">
        事例を見る
        <ArrowRight size={16} strokeWidth={2.5} />
      </PrimaryButton>
    </Card>
  );
}
