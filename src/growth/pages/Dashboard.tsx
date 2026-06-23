import { StepNavigation } from "@/growth/components/StepNavigation";
import { CurrentCurriculumCard } from "@/growth/components/CurrentCurriculumCard";
import { LearningStepTable } from "@/growth/components/LearningStepTable";
import { GoalCard } from "@/growth/components/GoalCard";
import { PerformanceCards } from "@/growth/components/PerformanceCards";
import { ScheduleCard } from "@/growth/components/ScheduleCard";
import { SupportCards } from "@/growth/components/SupportCards";
import { RecommendedContents } from "@/growth/components/RecommendedContents";
import { SuccessCaseCard } from "@/growth/components/SuccessCaseCard";

export function Dashboard() {
  return (
    <div className="space-y-6">
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
    </div>
  );
}
