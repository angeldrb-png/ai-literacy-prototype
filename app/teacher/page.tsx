import { redirect } from "next/navigation";
import { isTeacherAuthenticated } from "@/lib/teacher-auth";
import TeacherOverviewClient from "@/components/teacher/TeacherOverviewClient";

export default async function TeacherOverviewPage() {
  if (!(await isTeacherAuthenticated())) {
    redirect("/teacher/login");
  }
  return <TeacherOverviewClient />;
}
