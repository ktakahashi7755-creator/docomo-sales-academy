import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/** 想定外の描画エラーで白画面にせず、復帰手段を提示する */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Supabase/監視ツール接続後はここでレポートする
    console.error("Unhandled render error:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex min-h-dvh items-center justify-center bg-paper-soft px-6">
        <div className="w-full max-w-sm rounded-xl2 border border-paper-line bg-paper p-6 text-center shadow-card">
          <div className="font-num text-xs font-semibold uppercase tracking-widest text-ink-muted">Error</div>
          <h1 className="mt-1 text-lg font-bold text-ink">画面の表示に失敗しました</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            一時的な問題の可能性があります。再読み込みしても解決しない場合は、管理者にお知らせください。
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-paper shadow-card"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }
}
