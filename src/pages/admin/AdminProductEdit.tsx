import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useContent } from "@/context/ContentContext";
import { Card, ErrorState, PageTitle } from "@/components/ui";
import { FIELD_LABELS, type EditableProductField } from "@/lib/content";
import { ArrowLeft, Check, History, ExternalLink } from "lucide-react";
import type { Product } from "@/lib/types";

const linesToText = (xs: string[]) => xs.join("\n");
const textToLines = (s: string) =>
  s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

const inputClass =
  "w-full rounded-lg border border-paper-line bg-paper px-3 py-2 text-sm text-ink shadow-card placeholder:text-ink-muted";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

export function AdminProductEdit() {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const { getProduct, editProduct, versionsFor } = useContent();
  const product = id ? getProduct(id) : undefined;
  const [draft, setDraft] = useState<Product | null>(product ? { ...product } : null);
  const [reason, setReason] = useState("");
  const [saved, setSaved] = useState<null | "changed" | "nochange">(null);

  if (!product || !draft) {
    return (
      <ErrorState
        title="商材が見つかりませんでした"
        description="一覧から選び直してください。"
        action={
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1 rounded-lg bg-ink px-3 py-2 text-sm font-medium text-paper"
          >
            <ArrowLeft size={16} /> 商材一覧へ
          </Link>
        }
      />
    );
  }

  const actor = profile?.display_name ?? "管理者";
  const versions = versionsFor(product.id);

  function update<K extends keyof Product>(key: K, value: Product[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
    setSaved(null);
  }

  function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    const res = editProduct(product!.id, draft, reason.trim() || "内容を更新", actor);
    setSaved(res.changed ? "changed" : "nochange");
    if (res.changed) setReason("");
  }

  return (
    <div className="space-y-6">
      <Link
        to="/admin/products"
        className="-ml-2 inline-flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-sm text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={16} /> 商材一覧
      </Link>

      <PageTitle
        title={product.name}
        description={`現在 v${product.version}・最終確認日 ${product.officialCheckedAt}`}
      />

      {saved === "changed" && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg border border-pass/30 bg-pass-soft px-3 py-2 text-sm text-pass-deep"
        >
          <Check size={16} /> 保存しました（v{product.version}・確認日 {product.officialCheckedAt}
          ）。学習画面に反映されます。
        </div>
      )}
      {saved === "nochange" && (
        <div
          role="status"
          className="rounded-lg border border-paper-line bg-paper-soft px-3 py-2 text-sm text-ink-soft"
        >
          変更はありません。
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSave}>
        <Card className="space-y-4 p-5">
          <Field label={FIELD_LABELS.name}>
            <input
              className={inputClass}
              value={draft.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </Field>
          <Field label={FIELD_LABELS.oneLiner}>
            <input
              className={inputClass}
              value={draft.oneLiner}
              onChange={(e) => update("oneLiner", e.target.value)}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={FIELD_LABELS.target}>
              <input
                className={inputClass}
                value={draft.target}
                onChange={(e) => update("target", e.target.value)}
              />
            </Field>
            <Field label={FIELD_LABELS.timing}>
              <input
                className={inputClass}
                value={draft.timing}
                onChange={(e) => update("timing", e.target.value)}
              />
            </Field>
          </div>
          <Field label={FIELD_LABELS.officialUrl}>
            <input
              className={inputClass}
              type="url"
              value={draft.officialUrl}
              onChange={(e) => update("officialUrl", e.target.value)}
            />
          </Field>
        </Card>

        <Card className="grid gap-4 p-5 sm:grid-cols-2">
          {(["benefits", "warnings", "hearing", "pitch"] as EditableProductField[]).map((f) => (
            <Field key={f} label={`${FIELD_LABELS[f]}（1行に1つ）`}>
              <textarea
                rows={4}
                className={`${inputClass} resize-y`}
                value={linesToText((draft[f] as string[]) ?? [])}
                onChange={(e) => update(f as keyof Product, textToLines(e.target.value) as never)}
              />
            </Field>
          ))}
        </Card>

        <Card className="space-y-4 p-5">
          <Field label={FIELD_LABELS.closing}>
            <textarea
              rows={2}
              className={`${inputClass} resize-y`}
              value={draft.closing}
              onChange={(e) => update("closing", e.target.value)}
            />
          </Field>
          <Field label="変更理由（履歴に残ります）">
            <input
              className={inputClass}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="例：公式の料金改定を反映"
            />
          </Field>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-ink px-4 text-sm font-medium text-paper"
            >
              <Check size={16} /> 保存する
            </button>
            <a
              href={draft.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[44px] items-center gap-1 text-sm text-ink-soft hover:text-ink"
            >
              公式ページを確認 <ExternalLink size={14} />
            </a>
          </div>
          <p className="text-xs text-ink-muted">
            保存すると版番号が上がり、確認日が本日に更新されます。事実は公式ページを正としてください。
          </p>
        </Card>
      </form>

      <Card className="p-5">
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-ink-soft">
          <History size={16} /> 変更履歴
        </h2>
        {versions.length === 0 ? (
          <p className="text-sm text-ink-muted">まだ変更履歴はありません。</p>
        ) : (
          <ul className="space-y-3">
            {versions.map((v) => (
              <li key={v.id} className="border-l-2 border-paper-line pl-3">
                <div className="flex flex-wrap items-center gap-x-2 text-sm">
                  <span className="font-num font-semibold text-ink">v{v.version}</span>
                  <span className="text-ink-muted">{v.createdAt}</span>
                  <span className="text-ink-muted">・{v.changedBy}</span>
                </div>
                <div className="text-sm text-ink-soft">{v.reason}</div>
                <div className="mt-0.5 text-xs text-ink-muted">
                  変更:{" "}
                  {Object.keys(v.after)
                    .map((k) => FIELD_LABELS[k as EditableProductField] ?? k)
                    .join("・")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
