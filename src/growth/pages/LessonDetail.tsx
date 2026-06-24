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
  MessageCircle,
  AlertTriangle,
  Target,
  MapPin,
  ShieldAlert,
  Info,
  Compass,
} from "lucide-react";

/** STEP ごとに最も関連する現場ガイドのタブ。 */
const GUIDE_BY_STEP: Record<string, { tab: string; label: string; desc: string }> = {
  "step-1": { tab: "process", label: "販売プロセスを見る", desc: "15工程で現在地を掴む" },
  "step-2": { tab: "hearing", label: "ヒアリング項目を見る", desc: "聞き方・深掘り・NG" },
  "step-3": { tab: "scenes", label: "場面別トークを見る", desc: "実戦の会話例" },
  "step-4": { tab: "objections", label: "反論処理集を見る", desc: "17パターンの切り返し" },
  "step-5": { tab: "rubric", label: "評価ルーブリックを見る", desc: "12観点と育成段階" },
};
import { lessonById, stepOfLesson, ALL_LESSONS } from "@/growth/data/curriculum";
import { useProvide } from "@/growth/context/ProvideContext";
import { PRODUCTS } from "@/data/seed";
import { needsReview } from "@/lib/product";
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
  // デモモードではレッスンは同期取得（seed）のため loading 状態は発生しない。
  // Supabase で非同期取得に切り替える際に loading スケルトンを追加する（Phase1）。
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
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/content"
        className="inline-flex min-h-[44px] items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={16} /> 学習コンテンツ
      </Link>

      <PageHeader
        eyebrow={`STEP ${step?.no} ・ ${step?.title}${step ? `（${lesson.no}/${step.lessons.length}）` : ""}`}
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

      {/* 現場の前提（補助情報・フラット表示） */}
      {lesson.fieldContext && (
        <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500">
            <Info size={16} strokeWidth={2} />
          </span>
          <p className="text-sm leading-relaxed text-slate-600">{lesson.fieldContext}</p>
        </div>
      )}

      {/* 本文 */}
      <Card className="p-6 sm:p-8">
        <div className="space-y-4">
          {lesson.body.map((p, i) => (
            <p key={`${lesson.id}-body-${i}`} className="text-[15px] leading-loose text-slate-700">
              {p}
            </p>
          ))}
        </div>

        {lesson.keyPoints.length > 0 && (
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
        )}
      </Card>

      {/* チャネル別の違い（補助情報・フラット表示） */}
      {lesson.channelDifferences && lesson.channelDifferences.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <MapPin size={16} strokeWidth={2} />
            </span>
            <h2 className="text-sm font-bold text-slate-800">チャネル別の違い</h2>
          </div>
          <ul className="space-y-2.5">
            {lesson.channelDifferences.map((c) => (
              <li key={c.channel} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex w-16 shrink-0 justify-center whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600">
                  {c.channel}
                </span>
                <span className="text-sm leading-relaxed text-slate-700">{c.point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* コンプライアンス注意 */}
      {lesson.complianceNotes && lesson.complianceNotes.length > 0 && (
        <Card className="border-l-4 border-l-orange-400 p-5">
          <div className="flex items-center gap-2 text-orange-700">
            <ShieldAlert size={18} strokeWidth={2} />
            <h2 className="text-sm font-bold">コンプライアンス注意</h2>
          </div>
          <ul className="mt-2 space-y-1.5">
            {lesson.complianceNotes.map((n) => (
              <li key={n} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-orange-400" />
                {n}
              </li>
            ))}
          </ul>
        </Card>
      )}

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
          <Card className="border-orange-200 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600">
              <X size={14} strokeWidth={2} /> NG例
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">「{lesson.examples.ng}」</p>
          </Card>
          <Card className="border-emerald-200 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <Check size={14} strokeWidth={2} /> Good例
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              「{lesson.examples.good}」
            </p>
          </Card>
        </div>
      )}

      {/* 会話で学ぶ（トーク台本） */}
      {lesson.talkScript && lesson.talkScript.length > 0 && (
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <MessageCircle size={16} strokeWidth={2} />
            </span>
            <h2 className="text-sm font-bold text-slate-800">会話で学ぶ</h2>
          </div>
          <div className="space-y-3">
            {lesson.talkScript.map((line, i) => {
              const isStaff = line.role === "staff";
              return (
                <div
                  key={`${line.role}-${i}`}
                  className={`flex flex-col ${isStaff ? "items-end" : "items-start"}`}
                >
                  <div className="flex max-w-[88%] flex-col">
                    <span
                      className={`mb-1 text-[11px] font-semibold ${
                        isStaff ? "text-right text-blue-600" : "text-slate-500"
                      }`}
                    >
                      {isStaff ? "あなた（スタッフ）" : "お客様"}
                    </span>
                    <p
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        isStaff
                          ? "rounded-tr-sm bg-blue-600 text-white"
                          : "rounded-tl-sm bg-slate-100 text-slate-700"
                      }`}
                    >
                      {line.text}
                    </p>
                    {line.note && (
                      <span className="mt-1 flex items-start gap-1 text-xs leading-relaxed text-slate-600">
                        <Lightbulb
                          size={12}
                          strokeWidth={2}
                          className="mt-0.5 shrink-0 text-amber-600"
                        />
                        {line.note}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* よくある失敗とリカバリー */}
      {lesson.mistakes && lesson.mistakes.length > 0 && (
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <AlertTriangle size={16} strokeWidth={2} />
            </span>
            <h2 className="text-sm font-bold text-slate-800">よくある失敗とリカバリー</h2>
          </div>
          <ul className="space-y-3">
            {lesson.mistakes.map((m) => (
              <li key={m.mistake} className="rounded-xl border border-slate-100 p-4">
                <div className="flex items-start gap-2">
                  <X size={15} strokeWidth={2} className="mt-0.5 shrink-0 text-orange-600" />
                  <p className="text-sm font-semibold text-slate-700">{m.mistake}</p>
                </div>
                <div className="mt-2 flex items-start gap-2 pl-[1.45rem]">
                  <ArrowRight
                    size={14}
                    strokeWidth={2}
                    className="mt-1 shrink-0 text-emerald-600"
                  />
                  <p className="text-sm leading-relaxed text-slate-600">{m.fix}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* この回の実践課題 */}
      {lesson.practice && (
        <Card className="flex items-start gap-3 border-l-4 border-l-teal-400 p-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <Target size={18} strokeWidth={2} />
          </span>
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-teal-600">
              この回の実践課題
            </div>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">{lesson.practice}</p>
          </div>
        </Card>
      )}

      {/* 商材ナレッジ（正典値） */}
      {products.length > 0 && (
        <Card className="p-6">
          <h2 className="mb-1 text-sm font-bold text-slate-800">商材ナレッジ</h2>
          <p className="mb-4 text-xs text-slate-500">
            料金・還元・補償は公式情報と最終確認日を正とします。提案前に必ず確認してください。
          </p>
          <div className="space-y-3">
            {products.map((p) => {
              const review = needsReview(p, today);
              return (
                <div key={p.id} className="rounded-xl border border-slate-100 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{p.name}</span>
                    {p.tier && (
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-500">
                        {p.tier}
                      </span>
                    )}
                    {p.isCampaign && (
                      <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600">
                        キャンペーン
                      </span>
                    )}
                    {review && (
                      <span className="inline-flex items-center gap-1 rounded bg-orange-50 px-1.5 py-0.5 text-[10px] font-bold text-orange-600">
                        <AlertTriangle size={10} strokeWidth={2.5} /> 要確認
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
                  {p.prohibitedClaims && p.prohibitedClaims.length > 0 && (
                    <div className="mt-2 rounded-lg bg-orange-50 p-2.5">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-orange-700">
                        <AlertTriangle size={11} strokeWidth={2.5} /> 言ってはいけない表現
                      </div>
                      <ul className="mt-1 space-y-0.5">
                        {p.prohibitedClaims.map((c) => (
                          <li key={c} className="text-[11px] leading-relaxed text-orange-700/90">
                            ・{c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <a
                    href={p.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`mt-2 inline-flex items-center gap-1 text-xs font-medium hover:underline ${
                      review ? "text-orange-600" : "text-blue-600"
                    }`}
                  >
                    公式情報を見る（確認日 {p.officialCheckedAt}） <ExternalLink size={12} />
                  </a>
                </div>
              );
            })}
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

      {/* 現場ガイドで深める */}
      {step && GUIDE_BY_STEP[step.id] && (
        <Link to={`/field-guide?tab=${GUIDE_BY_STEP[step.id].tab}`}>
          <Card className="flex items-center gap-3 p-4" hover>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 text-white">
              <Compass size={18} strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-slate-800">
                現場ガイドで深める：{GUIDE_BY_STEP[step.id].label}
              </div>
              <div className="text-xs text-slate-500">{GUIDE_BY_STEP[step.id].desc}</div>
            </div>
            <ArrowRight size={18} className="shrink-0 text-slate-300" />
          </Card>
        </Link>
      )}

      {/* 完了・前後移動 */}
      <Card className="flex flex-col items-center gap-3 p-6 text-center">
        {status === "completed" ? (
          <div
            role="status"
            aria-live="polite"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600"
          >
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
              className="inline-flex min-h-[44px] items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft size={16} /> 前へ
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to={`/content/${next.id}`}
              className="inline-flex min-h-[44px] items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
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
