import { useState, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useContent } from "@/context/ContentContext";
import { Card, EmptyState, PageTitle } from "@/components/ui";
import type { Announcement, AnnouncementSeverity } from "@/lib/types";
import { Megaphone, Plus, Pencil, Trash2, Check, X } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-paper-line bg-paper px-3 py-2 text-sm text-ink shadow-card placeholder:text-ink-muted";

function emptyDraft(): Announcement {
  return {
    id: `an-${Date.now().toString(36)}`,
    title: "",
    body: "",
    severity: "info",
    isActive: true,
    updatedAt: "",
  };
}

export function AdminAnnouncements() {
  const { profile } = useAuth();
  const { announcements, saveAnnouncement, deleteAnnouncement } = useContent();
  const actor = profile?.display_name ?? "管理者";
  const [draft, setDraft] = useState<Announcement | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  function startNew() {
    setDraft(emptyDraft());
    setStatus(null);
  }

  function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!draft || draft.title.trim() === "") return;
    saveAnnouncement(draft, actor);
    setStatus(`お知らせ「${draft.title}」を保存しました。`);
    setDraft(null);
  }

  function handleDelete(id: string, title: string) {
    deleteAnnouncement(id, actor);
    setConfirmId(null);
    setStatus(`お知らせ「${title}」を削除しました。`);
  }

  return (
    <div className="space-y-6">
      <PageTitle
        title="お知らせの管理"
        description="公開中のお知らせは学習者のダッシュボードに表示されます。"
        action={
          !draft ? (
            <button
              onClick={startNew}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-ink px-4 text-sm font-medium text-paper"
            >
              <Plus size={16} /> 新規作成
            </button>
          ) : undefined
        }
      />

      {status && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-lg border border-pass/30 bg-pass-soft px-3 py-2 text-sm text-pass-deep"
        >
          {status}
        </div>
      )}

      {draft && (
        <Card className="space-y-4 p-5">
          <form className="space-y-4" onSubmit={handleSave}>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-ink-soft">タイトル</span>
              <input
                className={inputClass}
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="例：dカード GOLD の還元条件を更新しました"
                autoFocus
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-ink-soft">本文</span>
              <textarea
                rows={3}
                className={`${inputClass} resize-y`}
                value={draft.body}
                onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              />
            </label>
            <div className="flex flex-wrap items-end gap-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-ink-soft">種別</span>
                <select
                  className={inputClass}
                  value={draft.severity}
                  onChange={(e) =>
                    setDraft({ ...draft, severity: e.target.value as AnnouncementSeverity })
                  }
                >
                  <option value="info">お知らせ</option>
                  <option value="caution">注意</option>
                </select>
              </label>
              <label className="inline-flex min-h-[44px] items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-ink"
                  checked={draft.isActive}
                  onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })}
                />
                公開する
              </label>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={draft.title.trim() === ""}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-ink px-4 text-sm font-medium text-paper disabled:opacity-50"
              >
                <Check size={16} /> 保存する
              </button>
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="inline-flex min-h-[44px] items-center gap-1 px-3 text-sm text-ink-soft hover:text-ink"
              >
                <X size={16} /> キャンセル
              </button>
            </div>
          </form>
        </Card>
      )}

      {announcements.length === 0 ? (
        <EmptyState
          icon={<Megaphone size={28} strokeWidth={1.5} />}
          title="お知らせはまだありません"
          description="「新規作成」から、学習者へのお知らせを追加できます。"
        />
      ) : (
        <Card>
          <ul className="divide-y divide-paper-line">
            {announcements.map((a) => (
              <li key={a.id} className="flex items-start gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-ink">{a.title}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${
                        a.severity === "caution"
                          ? "bg-caution-soft text-caution-deep"
                          : "bg-paper-soft text-ink-soft"
                      }`}
                    >
                      {a.severity === "caution" ? "注意" : "お知らせ"}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${
                        a.isActive ? "bg-pass-soft text-pass-deep" : "bg-paper-soft text-ink-muted"
                      }`}
                    >
                      {a.isActive ? "公開中" : "非公開"}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-ink-soft">{a.body}</p>
                  <p className="text-xs text-ink-muted">更新 {a.updatedAt}</p>
                </div>
                {confirmId === a.id ? (
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm text-ink-soft">削除しますか？</span>
                    <button
                      onClick={() => handleDelete(a.id, a.title)}
                      className="inline-flex min-h-[44px] items-center gap-1 rounded-lg bg-fail px-3 text-sm font-medium text-paper"
                    >
                      <Trash2 size={14} /> 削除する
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="inline-flex min-h-[44px] items-center px-2 text-sm text-ink-soft hover:text-ink"
                    >
                      やめる
                    </button>
                  </div>
                ) : (
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => {
                        setDraft({ ...a });
                        setStatus(null);
                      }}
                      aria-label={`${a.title} を編集`}
                      className="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-paper-line px-3 text-sm text-ink hover:bg-paper-soft"
                    >
                      <Pencil size={14} /> 編集
                    </button>
                    <button
                      onClick={() => setConfirmId(a.id)}
                      aria-label={`${a.title} を削除`}
                      className="inline-flex min-h-[44px] items-center gap-1 rounded-lg px-3 text-sm text-fail-deep hover:bg-fail-soft"
                    >
                      <Trash2 size={14} /> 削除
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
