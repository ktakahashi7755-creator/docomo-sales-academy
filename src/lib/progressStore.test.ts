import { describe, it, expect, vi, beforeEach } from "vitest";

// Supabase クライアントをモックして、HTTP を呼ばずに変換/エラー分岐を検証する。
const mockFrom = vi.fn();
vi.mock("@/lib/supabase", () => ({
  requireClient: () => ({ from: mockFrom }),
}));

import { fetchProgress, saveModuleScore } from "@/lib/progressStore";

beforeEach(() => {
  mockFrom.mockReset();
});

describe("fetchProgress", () => {
  it("行を ScoreMap に変換する", async () => {
    mockFrom.mockReturnValue({
      select: () => ({
        eq: () =>
          Promise.resolve({
            data: [
              { module_key: "p1m1", score: 80 },
              { module_key: "p2m1", score: 90 },
            ],
            error: null,
          }),
      }),
    });
    await expect(fetchProgress("u1")).resolves.toEqual({ p1m1: 80, p2m1: 90 });
  });

  it("data が null でも空の ScoreMap", async () => {
    mockFrom.mockReturnValue({
      select: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
    });
    await expect(fetchProgress("u1")).resolves.toEqual({});
  });

  it("error があれば throw", async () => {
    mockFrom.mockReturnValue({
      select: () => ({ eq: () => Promise.resolve({ data: null, error: new Error("boom") }) }),
    });
    await expect(fetchProgress("u1")).rejects.toThrow("boom");
  });
});

describe("saveModuleScore", () => {
  it("user_id/module_key/score を onConflict 付きで upsert する", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    mockFrom.mockReturnValue({ upsert });
    await saveModuleScore("u1", "p1m1", 80);
    expect(upsert).toHaveBeenCalledWith(
      { user_id: "u1", module_key: "p1m1", score: 80 },
      { onConflict: "user_id,module_key" },
    );
  });

  it("error があれば throw", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: new Error("denied") });
    mockFrom.mockReturnValue({ upsert });
    await expect(saveModuleScore("u1", "p1m1", 80)).rejects.toThrow("denied");
  });
});
