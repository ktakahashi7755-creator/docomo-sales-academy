import { customerOpening, customerReply, evaluateRoleplay } from "@/lib/roleplay";
import type { Evaluation, ReplyInput, RoleplayProvider, SessionInput } from "@/lib/ai/types";
import type { Scenario } from "@/lib/types";

/**
 * デモ用モックプロバイダ。API キー不要で、ローカルの決定的ロジックだけで動く。
 * 体感のため、わずかな遅延を入れて非同期 I/O を模す（テストでは 0ms 指定可）。
 */
export function createMockProvider(delayMs = 350): RoleplayProvider {
  const wait = () =>
    delayMs > 0 ? new Promise<void>((r) => setTimeout(r, delayMs)) : Promise.resolve();

  return {
    async opening(input: { scenario: Scenario; difficulty: number }): Promise<string> {
      await wait();
      return customerOpening(input.scenario, input.difficulty);
    },
    async reply(input: ReplyInput): Promise<string> {
      await wait();
      return customerReply(input);
    },
    async evaluate(input: SessionInput): Promise<Evaluation> {
      await wait();
      return evaluateRoleplay(input);
    },
  };
}
