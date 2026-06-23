import { useEffect, useRef, useState } from "react";
import { Bot, X, Send } from "lucide-react";
import { useProvide } from "@/growth/context/ProvideContext";
import { botReply, BOT_WELCOME, BOT_SUGGESTIONS } from "@/growth/lib/bot";

interface Msg {
  role: "bot" | "user";
  text: string;
}

export function AIBot() {
  const { botOpen, closeBot } = useProvide();
  const [messages, setMessages] = useState<Msg[]>([{ role: "bot", text: BOT_WELCOME }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (botOpen && typeof endRef.current?.scrollIntoView === "function") {
      endRef.current.scrollIntoView({ block: "end" });
    }
  }, [messages, botOpen]);

  function ask(text: string) {
    const q = text.trim();
    if (!q || thinking) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setThinking(true);
    const reply = botReply(q);
    window.setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: reply }]);
      setThinking(false);
    }, 450);
  }

  if (!botOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="AIサポートBot">
      <button
        type="button"
        aria-label="閉じる"
        onClick={closeBot}
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
      />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl">
        {/* ヘッダー */}
        <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <Bot size={18} />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-bold">AIサポートBot</div>
              <div className="text-[11px] text-blue-100">いつでも質問できます</div>
            </div>
          </div>
          <button
            type="button"
            onClick={closeBot}
            aria-label="閉じる"
            className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-white/15"
          >
            <X size={18} />
          </button>
        </div>

        {/* 会話 */}
        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "border border-slate-100 bg-white text-slate-700 shadow-sm"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-slate-100 bg-white px-3.5 py-2.5 text-sm text-slate-400 shadow-sm">
                入力中…
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* サジェスト */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-white px-4 pt-3">
            {BOT_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => ask(s)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* 入力 */}
        <form
          className="flex items-end gap-2 border-t border-slate-100 bg-white p-3"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="質問を入力…"
            aria-label="AIサポートBotへの質問"
            className="min-h-[44px] flex-1 rounded-xl border border-slate-200 px-3.5 text-sm text-slate-800 focus:border-blue-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={thinking || input.trim().length === 0}
            aria-label="送信"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
