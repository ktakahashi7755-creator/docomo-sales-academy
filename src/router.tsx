import { Navigate, Route, Routes } from "react-router-dom";
import { GrowthLayout } from "@/growth/components/GrowthLayout";
import { Dashboard } from "@/growth/pages/Dashboard";
import { Curriculum } from "@/growth/pages/Curriculum";
import { Content } from "@/growth/pages/Content";
import { LessonDetail } from "@/growth/pages/LessonDetail";
import { Quiz } from "@/growth/pages/Quiz";
import { QuizTake } from "@/growth/pages/QuizTake";
import { Roleplay } from "@/growth/pages/Roleplay";
import { RoleplaySession } from "@/growth/pages/RoleplaySession";
import { Reports } from "@/growth/pages/Reports";
import { Announcements } from "@/growth/pages/Announcements";
import { Help } from "@/growth/pages/Help";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GrowthLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="curriculum" element={<Curriculum />} />
        <Route path="content" element={<Content />} />
        <Route path="content/:lessonId" element={<LessonDetail />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="quiz/:moduleId" element={<QuizTake />} />
        <Route path="roleplay" element={<Roleplay />} />
        <Route path="roleplay/:scenarioId" element={<RoleplaySession />} />
        <Route path="reports" element={<Reports />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="help" element={<Help />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
