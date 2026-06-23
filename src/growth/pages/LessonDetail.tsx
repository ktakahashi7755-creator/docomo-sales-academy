import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  MessagesSquare,
  ExternalLink,
  Sparkles,
  Lightbulb,
  X,
  Check,
} from "lucide-react";
import { lessonById, stepOfLesson, ALL_LESSONS } from "@/growth/data/curriculum";
import { useProvide } from "@/growth/context/ProvideContext";
import { PRODUCTS } from "@/data/seed";
import {
  Card,
  PageHeader,
  StatusBadge,
  PrimaryButton,
  GhostButton,
  ACCENT,
} from "@/growth/components/ui";

export function LessonDetail() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { lessonStatus, startLesson, completeLesson } = useProvide();
  const lesson = lessonId ? lessonById(lessonId) : undefined;

  useEffect(() => {
    if (lesson) startLesson(lesson.id);
  }, [lesson, startLesson]);

  if (!lesson) {
    return (
      <div className="space-y-6">
        <PageHeader title="レッスンが見つかりません" />
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-500">URLが変わったか、削除された可能性があります。</p>
          <Link to="/content" className="mt-4 inline-block">
            <GhostButton>学習コンテンツへ</GhostButton>
          </Link>
        </Card>
      </div>
    );
  }

  const step = stepOfLesson(lesson.id);
  const a = step ? ACCENT[step.accent] : ACCENT.blue;
  const status = lessonStatus(lesson.id);
  const idx = ALL_LESSONS.findIndex((l) => l.id === lesson.id);
  const prev = idx > 0 ? ALL_LESSONS[idx - 1] : null;
  const next = idx < ALL_LESSONS.length - 1 ? ALL_LESSONS[idx + 1] : null;
  const products = (lesson.productIds ?? [])
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is (typeof PRODUCTS)[number] => Boolean(p));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/content"
        className="inline-flex min-h-[44px] items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={16} /> 学習コンテンツ
      </Link>

      <PageHeader
        eyebrow={`STEP ${step?.no} ・ ${step?.title}`}
        title={lesson.title}
        description={lesson.summary}
        action={
          <StatusBadge
            tone={status === "completed" ? "done" : status === "in-progress" ? "active" : "todo"}
          >
            {status === "completed" ? "完了" : status === "in-progress" ? "学習中" : "未開始"}
          </StatusBadge>
        }
      />

      {/* 本文 */}
      <Card className="p-6 sm:p-8">
        <div className="space-y-4">
          {lesson.body.map((p, i) => (
            <p key={i} className="text-[15px] leading-loose text-slate-700">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 p-5">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">この回のポイント</h2>
          </div>
          <ul className="mt-3 space-y-2">
            {lesson.keyPoints.map((k) => (
              <li key={k} className="flex items-start gap-2.5">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-500"
                  strokeWidth={2}
                />
                <span className="text-sm text-slate-700">{k}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* 現場のひとこと */}
      {lesson.tip && (
        <Card className="flex items-start gap-3 border-l-4 border-l-blue-400 p-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Lightbulb size={18} strokeWidth={2} />
          </span>
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-blue-600">
              現場のひとこと
            </div>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">{lesson.tip}</p>
          </div>
        </Card>
      )}

      {/* NG / Good トーク例 */}
      {lesson.examples && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Card className="border-orange-100 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600">
              <X size={14} strokeWidth={2.5} /> NG例
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">「{lesson.examples.ng}」</p>
          </Card>
          <Card className="border-emerald-100 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <Check size={14} strokeWidth={2.5} /> Good例
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              「{lesson.examples.good}」
            </p>
          </Card>
        </div>
      )}

      {/* 商材ナレッジ（正典値） */}
      {products.length > 0 && (
        <Card className="p-6">
          <h2 className="mb-1 text-sm font-bold text-slate-800">商材ナレッジ</h2>
          <p className="mb-4 text-xs text-slate-500">
            料金・還元・補償は公式情報と最終確認日を正とします。提案前に必ず確認してください。
          </p>
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="rounded-xl border border-slate-100 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">{p.name}</span>
                  {p.tier && (
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-500">
                      {p.tier}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-500">{p.oneLiner}</p>
                <ul className="mt-2 space-y-1">
                  {p.benefits.slice(0, 2).map((b, i) => (
                    <li key={i} className="flex gap-1.5 text-xs text-slate-600">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-500" />
                      {b}
                    </li>
                  ))}
                </ul>
                <a
                  href={p.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                >
                  公式情報を見る（確認日 {p.officialCheckedAt}） <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 実践への導線 */}
      {(lesson.quizModuleId || lesson.scenarioId) && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {lesson.quizModuleId && (
            <Link to={`/quiz/${lesson.quizModuleId}`}>
              <Card className="flex items-center gap-3 p-4" hover>
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-white bg-gradient-to-br ${a.from} ${a.to}`}
                >
                  <ClipboardCheck size={18} strokeWidth={2} />
                </span>
                <div>
                  <div className="text-sm font-bold text-slate-800">確認テストを受ける</div>
                  <div className="text-xs text-slate-500">理解度をチェック</div>
                </div>
              </Card>
            </Link>
          )}
          {lesson.scenarioId && (
            <Link to={`/roleplay/${lesson.scenarioId}`}>
              <Card className="flex items-center gap-3 p-4" hover>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-teal-500 text-white">
                  <MessagesSquare size={18} strokeWidth={2} />
                </span>
                <div>
                  <div className="text-sm font-bold text-slate-800">ロープレで実践する</div>
                  <div className="text-xs text-slate-500">AI評価で振り返り</div>
                </div>
              </Card>
            </Link>
          )}
        </div>
      )}

      {/* 完了・前後移動 */}
      <Card className="flex flex-col items-center gap-3 p-6 text-center">
        {status === "completed" ? (
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <CheckCircle2 size={18} /> このレッスンは完了しています
          </div>
        ) : (
          <PrimaryButton onClick={() => completeLesson(lesson.id)} className="w-full sm:w-auto">
            <CheckCircle2 size={16} /> 完了にする
          </PrimaryButton>
        )}
        <div className="mt-2 flex w-full items-center justify-between gap-2">
          {prev ? (
            <Link
              to={`/content/${prev.id}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft size={16} /> 前へ
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to={`/content/${next.id}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              次へ <ArrowRight size={16} />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </Card>
    </div>
  );
}
