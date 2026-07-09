import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { useProvide } from "@/growth/context/ProvideContext";
import provideMark from "@/growth/assets/provide-mark.png";

/**
 * 入室画面（デモの簡易エントリー）。
 * 役割選択は置かず、名前（任意）と入室ボタンだけのシンプルな導線にする。
 * Enter キーで送信でき、空欄ならデフォルト名で入室する。
 */
export function Entry() {
  const { enter } = useProvide();
  const [name, setName] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    enter(name);
  };

  return (
    <div className="font-sans flex min-h-dvh items-center justify-center bg-gradient-to-b from-[#16305a] via-[#122a4f] to-[#0a1830] px-4 py-10">
      <main className="w-full max-w-md">
        {/* ブランド */}
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-xl shadow-blue-950/40">
            <img src={provideMark} alt="" aria-hidden="true" className="h-14 w-14" />
          </span>
          <h1 className="font-display mt-5 text-2xl font-bold tracking-tight text-white">
            Provide Growth Academy
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-blue-200/90">
            未経験から認定クローザーへ。
            <br />
            プロバイド株式会社の販売育成プログラム
          </p>
        </div>

        {/* 入室カード */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-2xl shadow-blue-950/40 sm:p-8"
        >
          <label htmlFor="entry-name" className="block text-sm font-semibold text-slate-700">
            おなまえ
            <span className="ml-1.5 text-xs font-normal text-slate-500">（任意）</span>
          </label>
          <input
            id="entry-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="山田 花子"
            autoComplete="name"
            maxLength={30}
            className="mt-2 block h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[15px] text-slate-800 placeholder:text-slate-400 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/40"
          />

          <button
            type="submit"
            className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 text-[15px] font-bold text-white shadow-md shadow-blue-200/50 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            入室する
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>

          <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">
            学習の進捗はこの端末に保存されます（デモ版）
          </p>
        </form>

        <p className="mt-6 text-center text-[11px] tracking-wide text-blue-300/60">
          Provide Growth Academy — Sales Training Program
        </p>
      </main>
    </div>
  );
}
