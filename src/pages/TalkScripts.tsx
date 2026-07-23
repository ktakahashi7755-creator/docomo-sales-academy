import { Link } from "react-router-dom";
import { TALK_SCRIPTS } from "@/data/seed";
import { Card } from "@/components/ui";
import { ChevronRight } from "lucide-react";

export function TalkScripts() {
  return (
    <div className="space-y-6">
      <div>
        <div className="font-num text-xs font-semibold uppercase tracking-widest text-ink-muted">Scripts</div>
        <h1 className="text-2xl font-bold text-ink">トークスクリプト集</h1>
        <p className="mt-1 text-sm text-ink-muted">現場のPOPと同じ流れで「型」を覚え、ロープレで再現します。</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {TALK_SCRIPTS.map((s) => (
          <Link key={s.id} to={`/scripts/${s.id}`}>
            <Card className="p-4 transition-shadow hover:shadow-lift">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-bold text-ink">{s.title}</h2>
                  <p className="mt-1 text-xs text-ink-muted">{s.category}</p>
                  <p className="mt-2 text-sm text-ink-soft">対象：{s.target}</p>
                </div>
                <ChevronRight size={18} className="mt-1 shrink-0 text-ink-muted" />
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
                <span className="font-num rounded bg-paper-soft px-2 py-0.5">難易度 {s.difficulty}</span>
                <span>{s.timing}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
