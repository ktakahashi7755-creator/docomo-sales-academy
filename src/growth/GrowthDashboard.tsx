import { Sidebar } from "@/growth/components/Sidebar";
import { Header } from "@/growth/components/Header";
import { StepNavigation } from "@/growth/components/StepNavigation";
import { CurrentCurriculumCard } from "@/growth/components/CurrentCurriculumCard";
import { LearningStepTable } from "@/growth/components/LearningStepTable";
import { GoalCard } from "@/growth/components/GoalCard";
import { PerformanceCards } from "@/growth/components/PerformanceCards";
import { ScheduleCard } from "@/growth/components/ScheduleCard";
import { SupportCards } from "@/growth/components/SupportCards";
import { RecommendedContents } from "@/growth/components/RecommendedContents";
import { SuccessCaseCard } from "@/growth/components/SuccessCaseCard";

/**
 * Provide Growth Academy — 販売育成カリキュラムのダッシュボード（1ページ完結）。
 * 既存の DOCOMO アプリとは独立した別ブランドの面として `/growth` で表示する。
 */
export function GrowthDashboard() {
  return (
    <div className="font-sans flex min-h-dvh bg-slate-50 text-slate-800">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="mx-auto w-full max-w-[1320px] space-y-6 px-4 py-6 md:px-7 md:py-8">
          <StepNavigation />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
              <CurrentCurriculumCard />
              <LearningStepTable />
            </div>
            <div className="space-y-6">
              <GoalCard />
              <PerformanceCards />
              <ScheduleCard />
            </div>
          </div>

          <SupportCards />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <RecommendedContents />
            </div>
            <SuccessCaseCard />
          </div>
        </main>
      </div>
    </div>
  );
}
