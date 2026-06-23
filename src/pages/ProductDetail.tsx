import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { PRODUCTS, TALK_SCRIPTS } from "@/data/seed";
import { Card, ErrorState, TierBadge } from "@/components/ui";
import { isStale } from "@/lib/progress";
import { ArrowLeft, ExternalLink, MessageSquareText, AlertTriangle } from "lucide-react";

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="p-5">
      <h2 className="mb-2 text-sm font-bold text-ink-soft">{title}</h2>
      {children}
    </Card>
  );
}

function List({ items, tone }: { items: string[]; tone?: "pass" | "caution" }) {
  const dot = tone === "pass" ? "bg-pass" : tone === "caution" ? "bg-caution" : "bg-ink";
  return (
    <ul className="space-y-1.5">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2 text-sm text-ink">
          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const p = PRODUCTS.find((x) => x.id === id);
  const script = TALK_SCRIPTS.find((s) => s.productId === id);

  if (!p) {
    return (
      <ErrorState
        title="商材が見つかりませんでした"
        description="URL が変わったか、削除された可能性があります。一覧から選び直してください。"
        action={
          <Link
            to="/products"
            className="inline-flex items-center gap-1 rounded-lg bg-ink px-3 py-2 text-sm font-medium text-paper"
          >
            <ArrowLeft size={16} /> 商材一覧へ戻る
          </Link>
        }
      />
    );
  }

  const stale = isStale(p.officialCheckedAt);

  return (
    <div className="space-y-4">
      <Link
        to="/products"
        className="-ml-2 inline-flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-sm text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={16} /> 商材一覧
      </Link>

      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-ink">{p.name}</h1>
        <TierBadge tier={p.tier} />
      </div>
      <p className="text-ink-soft">{p.oneLiner}</p>

      <div className="grid gap-3 md:grid-cols-2">
        <Block title="誰に向いているか">
          <p className="text-sm text-ink">{p.target}</p>
        </Block>
        <Block title="提案タイミング">
          <p className="text-sm text-ink">{p.timing}</p>
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
            <div key={i} className="rounded-lg bg-paper-soft p-3">
              <div className="text-sm font-semibold text-ink">「{o.q}」</div>
              <div className="mt-1 text-sm text-ink-soft">{o.a}</div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="クロージング例">
        <p className="text-sm text-ink">{p.closing}</p>
      </Block>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href={p.officialUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-paper-line bg-paper px-4 py-2 text-sm font-medium text-ink shadow-card hover:bg-paper-soft"
        >
          公式ページを開く <ExternalLink size={14} />
        </a>
        {script && (
          <Link
            to={`/scripts/${script.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper"
          >
            <MessageSquareText size={14} /> 訴求トークを見る
          </Link>
        )}
        {stale ? (
          <span className="inline-flex items-center gap-1 text-xs text-caution-deep">
            <AlertTriangle size={12} /> 最終確認日 {p.officialCheckedAt}・v{p.version}（要確認）
          </span>
        ) : (
          <span className="text-xs text-ink-muted">
            最終確認日 {p.officialCheckedAt}・v{p.version}
          </span>
        )}
      </div>
    </div>
  );
}
