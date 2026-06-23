import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PRODUCTS, ANNOUNCEMENTS, DEMO_USERS } from "@/data/seed";
import type {
  Product,
  Announcement,
  ProductVersion,
  AuditEntry,
  AuditAction,
  ManagedUser,
  Role,
} from "@/lib/types";
import {
  applyProductEdit,
  summarizeChange,
  upsertAnnouncement as upsertAnn,
  removeAnnouncement as removeAnn,
} from "@/lib/content";

/**
 * 管理対象コンテンツの状態（商材・版履歴・お知らせ・ユーザー・監査）。
 * デモモードではメモリ保持。学習側の画面はこの store を読むため、管理画面の編集が即時反映される。
 * Supabase 接続時は同じインターフェースで products/product_versions/announcements と
 * サーバー側の監査 RPC（migration 0004）に置き換える（AUDIT に追跡）。
 */

function stamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function genId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

interface ContentState {
  products: Product[];
  getProduct: (id: string) => Product | undefined;
  productVersions: ProductVersion[];
  versionsFor: (productId: string) => ProductVersion[];
  announcements: Announcement[];
  users: ManagedUser[];
  audit: AuditEntry[];
  /** 商材を編集。差分が無ければ changed=false（版・監査を作らない）。changed 時は新版番号と確認日を返す。 */
  editProduct: (
    id: string,
    after: Product,
    reason: string,
    actor: string,
  ) => { changed: boolean; version?: number; checkedAt?: string };
  saveAnnouncement: (item: Announcement, actor: string) => void;
  deleteAnnouncement: (id: string, actor: string) => void;
  setUserRole: (id: string, role: Role, actor: string) => void;
  setUserActive: (id: string, isActive: boolean, actor: string) => void;
}

const ContentContext = createContext<ContentState | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => PRODUCTS.map((p) => ({ ...p })));
  const [productVersions, setProductVersions] = useState<ProductVersion[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    ANNOUNCEMENTS.map((a) => ({ ...a })),
  );
  const [users, setUsers] = useState<ManagedUser[]>(() => DEMO_USERS.map((u) => ({ ...u })));
  const [audit, setAudit] = useState<AuditEntry[]>([]);

  // 最新値を同期的に参照するための ref。コールバックの依存配列を [addAudit] に固定し、
  // 連打時のクロージャ陳腐化を防ぐ。render 中の ref 代入はべき等（同値を書くだけ）で副作用は無く、
  // Concurrent でも「最新コミット値の読み取り」を保つ。値の更新は state 側（setX）が正本。
  const productsRef = useRef(products);
  productsRef.current = products;
  const announcementsRef = useRef(announcements);
  announcementsRef.current = announcements;
  const usersRef = useRef(users);
  usersRef.current = users;

  const addAudit = useCallback(
    (
      actor: string,
      action: AuditAction,
      targetType: AuditEntry["targetType"],
      targetId: string,
      summary: string,
    ) => {
      setAudit((prev) => [
        { id: genId("au"), actor, action, targetType, targetId, summary, createdAt: stamp() },
        ...prev,
      ]);
    },
    [],
  );

  const getProduct = useCallback((id: string) => products.find((p) => p.id === id), [products]);

  const versionsFor = useCallback(
    (productId: string) =>
      productVersions
        .filter((v) => v.productId === productId)
        .sort((a, b) => b.version - a.version),
    [productVersions],
  );

  const editProduct = useCallback(
    (id: string, after: Product, reason: string, actor: string) => {
      const before = productsRef.current.find((p) => p.id === id);
      if (!before) return { changed: false };
      const result = applyProductEdit(before, after, {
        changedBy: actor,
        reason,
        now: stamp(),
        versionId: genId("pv"),
      });
      if (!result) return { changed: false };
      setProducts((prev) => prev.map((p) => (p.id === id ? result.product : p)));
      setProductVersions((prev) => [result.version, ...prev]);
      addAudit(
        actor,
        "product.update",
        "product",
        id,
        `${result.product.name}：${summarizeChange(result.fields)} を更新（v${result.product.version}）`,
      );
      return {
        changed: true,
        version: result.product.version,
        checkedAt: result.product.officialCheckedAt,
      };
    },
    [addAudit],
  );

  const saveAnnouncement = useCallback(
    (item: Announcement, actor: string) => {
      const isNew = !announcementsRef.current.some((a) => a.id === item.id);
      const next: Announcement = { ...item, updatedAt: stamp().slice(0, 10) };
      setAnnouncements((prev) => upsertAnn(prev, next));
      addAudit(
        actor,
        isNew ? "announcement.create" : "announcement.update",
        "announcement",
        next.id,
        `お知らせ「${next.title}」を${isNew ? "作成" : "更新"}`,
      );
    },
    [addAudit],
  );

  const deleteAnnouncement = useCallback(
    (id: string, actor: string) => {
      const target = announcementsRef.current.find((a) => a.id === id);
      setAnnouncements((prev) => removeAnn(prev, id));
      addAudit(
        actor,
        "announcement.delete",
        "announcement",
        id,
        `お知らせ「${target?.title ?? id}」を削除`,
      );
    },
    [addAudit],
  );

  const setUserRole = useCallback(
    (id: string, role: Role, actor: string) => {
      const u = usersRef.current.find((x) => x.id === id);
      setUsers((prev) => prev.map((x) => (x.id === id ? { ...x, role } : x)));
      addAudit(actor, "user.role", "user", id, `${u?.display_name ?? id} の権限を ${role} に変更`);
    },
    [addAudit],
  );

  const setUserActive = useCallback(
    (id: string, isActive: boolean, actor: string) => {
      const u = usersRef.current.find((x) => x.id === id);
      setUsers((prev) => prev.map((x) => (x.id === id ? { ...x, is_active: isActive } : x)));
      addAudit(
        actor,
        "user.active",
        "user",
        id,
        `${u?.display_name ?? id} を${isActive ? "有効化" : "無効化"}`,
      );
    },
    [addAudit],
  );

  const value = useMemo<ContentState>(
    () => ({
      products,
      getProduct,
      productVersions,
      versionsFor,
      announcements,
      users,
      audit,
      editProduct,
      saveAnnouncement,
      deleteAnnouncement,
      setUserRole,
      setUserActive,
    }),
    [
      products,
      getProduct,
      productVersions,
      versionsFor,
      announcements,
      users,
      audit,
      editProduct,
      saveAnnouncement,
      deleteAnnouncement,
      setUserRole,
      setUserActive,
    ],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
