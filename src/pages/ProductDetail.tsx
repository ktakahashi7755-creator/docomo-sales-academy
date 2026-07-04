import { Link, useParams } from "react-router-dom";
import { PRODUCTS, TALK_SCRIPTS } from "@/data/seed";
import { Card, TierBadge } from "@/components/ui";
import { ArrowLeft, ExternalLink, MessageSquareText } from "lucide-react";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="p-5">
      <h2 className="mb-2.5 flex items-center gap-2 text-sm font-bold text-ink-soft">
        <span className="inline-block h-3.5 w-1 rounded-full bg-accent" aria-hidden />
        {title}
      </h2>
      {children}
    </Card>
  );
}

function List({ items, tone }: { items: string[]; tone?: "pass" | "caution" }) {
  const dot = tone === "pass" ? "bg-pass" : tone === "caution" ? "bg-caution" : "bg-ink";
  return (
    <ul className="space-y-2">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink">
          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function ProductDetail() {
  const { id } = useParams();
  const p = PRODUCTS.find((x) => x.id === id);
  const script = TALK_SCRIPTS.find((s) => s.productId === id);

  if (!p) {
    return (
      <div className="py-12 text-center">
        <p className="text-ink-muted">商材が見つかりませんでした。</p>
        <Link to="/products" className="mt-3 inline-block text-sm font-medium text-ink underline">
          商材一覧へ戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-ink">
        <ArrowLeft size={16} /> 商材一覧
      </Link>

      <Card className="p-5 animate-fade-up md:p-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-ink">{p.name}</h1>
          <TierBadge tier={p.tier} />
        </div>
        <p className="mt-1.5 leading-relaxed text-ink-soft">{p.oneLiner}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a
            href={p.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-paper-line bg-paper px-4 py-2 text-sm font-medium text-ink shadow-card transition-colors hover:bg-paper-soft"
          >
            公式ページを開く <ExternalLink size={14} />
          </a>
          {script && (
            <Link
              to={`/scripts/${script.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-paper shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <MessageSquareText size={14} /> 訴求トークを見る
            </Link>
          )}
          <span className="text-xs text-ink-muted">
            最終確認日 {p.officialCheckedAt}・v{p.version}
          </span>
        </div>
      </Card>

      <div className="stagger grid gap-3 md:grid-cols-2">
        <Block title="誰に向いているか">
          <p className="text-sm leading-relaxed text-ink">{p.target}</p>
        </Block>
        <Block title="提案タイミング">
          <p className="text-sm leading-relaxed text-ink">{p.timing}</p>
        </Block>
        <Block title="主なメリット">
          <List items={p.benefits} tone="pass" />
        </Block>
        <Block title="注意点">
          <List items={p.warnings} tone="caution" />
        </Block>
        <Block title="ヒアリング質問">
          <List items={p.hearing} />
        </Block>
        <Block title="訴求ポイント">
          <List items={p.pitch} />
        </Block>
      </div>

      <Block title="反論処理">
        <div className="space-y-3">
          {p.objections.map((o, i) => (
            <div key={i} className="rounded-lg bg-paper-soft p-3.5">
              <div className="text-sm font-semibold text-ink">「{o.q}」</div>
              <div className="mt-1 text-sm leading-relaxed text-ink-soft">{o.a}</div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="クロージング例">
        <p className="text-sm leading-relaxed text-ink">{p.closing}</p>
      </Block>
    </div>
  );
}
