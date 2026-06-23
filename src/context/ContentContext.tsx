import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, ANNOUNCEMENTS } from "@/data/seed";
import type {
  Product,
  Announcement,
  ProductVersion,
  AuditEntry,
  AuditAction,
  Role,
} from "@/lib/types";
import {
  applyProductEdit,
  summarizeChange,
  diffProduct,
  upsertAnnouncement as upsertAnn,
  removeAnnouncement as removeAnn,
} from "@/lib/content";

/**
 * 管理対象コンテンツの状態（商材・版履歴・お知らせ・ユーザー・監査）。
 * デモモードではメモリ保持。学習側の画面はこの store を読むため、管理画面の編集が即時反映される。
 * Supabase 接続時は同じインターフェースで products/product_versions/announcements と
 * サーバー側の監査 RPC（migration 0004）に置き換える（AUDIT に追跡）。
 */

export interface ManagedUser {
  id: string;
  display_name: string;
  role: Role;
  store_name?: string;
  is_active: boolean;
}

const INITIAL_USERS: ManagedUser[] = [
  { id: "u-1", display_name: "田中 太郎", role: "trainee", store_name: "府中店", is_active: true },
  { id: "u-2", display_name: "鈴木 花子", role: "helper", store_name: "新宿店", is_active: true },
  { id: "u-3", display_name: "佐藤 健", role: "closer", store_name: "渋谷店", is_active: true },
  { id: "u-4", display_name: "渡辺 美咲", role: "sv", store_name: "本部", is_active: true },
  { id: "u-5", display_name: "中村 一郎", role: "admin", store_name: "本部", is_active: true },
];

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
  /** 商材を編集。差分が無ければ changed=false（版・監査を作らない）。 */
  editProduct: (id: string, after: Product, reason: string, actor: string) => { changed: boolean };
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
  const [users, setUsers] = useState<ManagedUser[]>(() => INITIAL_USERS.map((u) => ({ ...u })));
  const [audit, setAudit] = useState<AuditEntry[]>([]);

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
      const before = products.find((p) => p.id === id);
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
      const fields = diffProduct(before, after).fields;
      addAudit(
        actor,
        "product.update",
        "product",
        id,
        `${result.product.name}：${summarizeChange(fields)} を更新（v${result.product.version}）`,
      );
      return { changed: true };
    },
    [products, addAudit],
  );

  const saveAnnouncement = useCallback(
    (item: Announcement, actor: string) => {
      const isNew = !announcements.some((a) => a.id === item.id);
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
    [announcements, addAudit],
  );

  const deleteAnnouncement = useCallback(
    (id: string, actor: string) => {
      const target = announcements.find((a) => a.id === id);
      setAnnouncements((prev) => removeAnn(prev, id));
      addAudit(
        actor,
        "announcement.delete",
        "announcement",
        id,
        `お知らせ「${target?.title ?? id}」を削除`,
      );
    },
    [announcements, addAudit],
  );

  const setUserRole = useCallback(
    (id: string, role: Role, actor: string) => {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
      const u = users.find((x) => x.id === id);
      addAudit(actor, "user.role", "user", id, `${u?.display_name ?? id} の権限を ${role} に変更`);
    },
    [users, addAudit],
  );

  const setUserActive = useCallback(
    (id: string, isActive: boolean, actor: string) => {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, is_active: isActive } : u)));
      const u = users.find((x) => x.id === id);
      addAudit(
        actor,
        "user.active",
        "user",
        id,
        `${u?.display_name ?? id} を${isActive ? "有効化" : "無効化"}`,
      );
    },
    [users, addAudit],
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
