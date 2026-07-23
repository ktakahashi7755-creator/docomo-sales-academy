import { CERT_CONDITIONS, BADGES } from "@/data/seed";
import { Card } from "@/components/ui";
import { CheckCircle2, Circle, Award } from "lucide-react";

export function Certification() {
  const done = CERT_CONDITIONS.filter((c) => c.done).length;
  const rate = Math.round((done / CERT_CONDITIONS.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <div className="font-num text-xs font-semibold uppercase tracking-widest text-ink-muted">Certification</div>
        <h1 className="text-2xl font-bold text-ink">クローザー認定</h1>
        <p className="mt-1 text-sm text-ink-muted">全条件を満たし、SV承認を得ると「認定クローザー（Lv.10）」になります。</p>
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl2 bg-gold-soft text-gold-deep">
            <Award size={26} />
          </div>
          <div className="flex-1">
            <div className="text-sm text-ink-muted">達成状況</div>
            <div className="font-num text-2xl font-bold text-ink">{done}<span className="text-base text-ink-muted"> / {CERT_CONDITIONS.length}</span></div>
          </div>
          <div className="font-num text-3xl font-bold text-ink">{rate}<span className="text-base text-ink-muted">%</span></div>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 text-sm font-bold text-ink-soft">認定条件</h2>
        <ul className="space-y-2.5">
          {CERT_CONDITIONS.map((c) => (
            <li key={c.id} className="flex items-center gap-3">
              {c.done ? (
                <CheckCircle2 size={18} className="shrink-0 text-pass" />
              ) : (
                <Circle size={18} className="shrink-0 text-paper-line" />
              )}
              <span className={`text-sm ${c.done ? "text-ink" : "text-ink-soft"}`}>{c.label}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 text-sm font-bold text-ink-soft">獲得バッジ</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {BADGES.map((b) => (
            <div key={b.id} className="flex items-center gap-3 rounded-lg bg-paper-soft px-3 py-2">
              <Award size={18} className="shrink-0 text-ink-muted" />
              <div>
                <div className="text-sm font-medium text-ink">{b.name}</div>
                <div className="text-xs text-ink-muted">{b.description}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
