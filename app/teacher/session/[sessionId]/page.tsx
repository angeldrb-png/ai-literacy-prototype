import { redirect } from "next/navigation";
import { isTeacherAuthenticated } from "@/lib/teacher-auth";
import TeacherSessionDetailClient from "@/components/teacher/TeacherSessionDetailClient";

export default async function TeacherSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  if (!(await isTeacherAuthenticated())) {
    redirect("/teacher/login");
  }
  const { sessionId } = await params;
  return <TeacherSessionDetailClient sessionId={sessionId} />;
}
