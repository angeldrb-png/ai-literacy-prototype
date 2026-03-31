import { redirect } from "next/navigation";
import { isTeacherAuthenticated } from "@/lib/teacher-auth";
import TeacherLoginClient from "@/components/teacher/TeacherLoginClient";

export default async function TeacherLoginPage() {
  if (await isTeacherAuthenticated()) {
    redirect("/teacher");
  }
  return <TeacherLoginClient />;
}
