# AI校园任务站｜第五批补丁代码
## 教师端登录保护 + 教师端/登录页三语 + 正式结果页

这批补丁只修教师端与登录页，不改学生端现有设计与功能。

## 新增/替换文件
- `lib/teacher-auth.ts`
- `lib/teacher-i18n.ts`
- `app/api/teacher/login/route.ts`
- `app/api/teacher/logout/route.ts`
- `app/api/teacher/overview/route.ts`
- `app/api/teacher/session/[sessionId]/route.ts`
- `app/teacher/login/page.tsx`
- `app/teacher/page.tsx`
- `app/teacher/session/[sessionId]/page.tsx`
- `components/teacher/TeacherLanguageSwitch.tsx`
- `components/teacher/useTeacherLocale.ts`
- `components/teacher/TeacherLoginClient.tsx`
- `components/teacher/TeacherOverviewClient.tsx`
- `components/teacher/TeacherSessionDetailClient.tsx`

## 环境变量
请在本地 `.env` 和 Vercel 中新增：

- `TEACHER_LOGIN_USERNAME`
- `TEACHER_LOGIN_PASSWORD`

例如：
```env
TEACHER_LOGIN_USERNAME=teacher
TEACHER_LOGIN_PASSWORD=ChangeThisPassword123
```

## 本地运行
```bash
npm run dev
```

## 登录路径
- 教师登录：`/teacher/login`
- 教师总览：`/teacher`
- 单个学生详情：`/teacher/session/[sessionId]`

## 说明
- 未登录访问 `/teacher` 会自动跳转到 `/teacher/login`
- 教师 API 也会做 cookie 校验
- 学生端 `app/page.tsx` 不在这批补丁中，不会被覆盖
