# AI校园任务站｜第六批超小补丁包

这次只改两处：

1. 教师端语言切换按钮由 `zh-Hans / zh-Hant / en` 改成：
   - 简
   - 繁
   - EN

2. 学生端开始前资料页：
   - 增加语言切换按钮（简 / 繁 / EN）
   - 把引导文案改成适合初中生阅读的表达
   - 不改任务地图和五个世界页面

## 本补丁包包含
- `components/teacher/TeacherLanguageSwitch.tsx`
- `patch_notes/student-form-patch.md`

## 使用方法
### 第一步
直接用包里的 `components/teacher/TeacherLanguageSwitch.tsx` 覆盖项目同名文件。

### 第二步
打开你项目里的 `app/page.tsx`，按照 `patch_notes/student-form-patch.md` 里的说明，
只修改“学生开始前资料页”相关代码。

这次之所以没有直接提供 `app/page.tsx`，是为了避免再次覆盖你当前已经确认没问题的学生端页面。
