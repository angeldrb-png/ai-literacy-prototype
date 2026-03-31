# 保留原学生端设计版：身份采集 + 正式教师端结果页

这份代码包是纠偏版，目标只有两个：

1. **学生端保留线上现有设计风格**，不再整页换掉
2. **教师端改成正式结果页**，不再把大量原始 JSON 直接展示出来

## 这次需要替换/新增的文件
- `app/page.tsx`
- `lib/schemas.ts`
- `prisma/schema.prisma`
- `app/api/session/start/route.ts`
- `app/api/teacher/overview/route.ts`
- `app/teacher/page.tsx`
- `app/teacher/session/[sessionId]/page.tsx`

## 这次改了什么
### 学生端
- 保留原来的任务地图与 5 个世界页面结构
- 只新增一个**身份信息弹层**
- 学生必须先填姓名、学号、班级，才会创建 session 并开始测试
- 顶部增加教师端入口
- 世界完成时会自动保存 step/submission 并跑评分

### 教师端
- 总览页显示：姓名、学号、班级、状态
- 详情页显示：学生身份、完成情况、domain 表现、最终提交内容、AI 对话
- 去掉了此前那种“把一堆原始 JSON/代码块直接铺满页面”的做法

## 数据库迁移
如果你已经做过学生身份字段迁移，再跑一次 migrate 可能会提示没有新变更。
建议仍然先执行：

```bash
npx prisma generate
npx prisma migrate dev --name preserve_design_identity_patch
npm run dev
```

## 本地测试顺序
1. 打开 `http://localhost:3000`
2. 保持原学生端设计，先会出现身份信息弹层
3. 填好后进入任务地图
4. 完成若干世界
5. 打开 `http://localhost:3000/teacher`
6. 看教师端是否显示身份信息和正式结果页

## 上线到 Vercel
本地确认没问题后执行：

```bash
git add .
git commit -m "preserve student design and add identity flow"
git push
```

然后等 Vercel 自动重新部署。
