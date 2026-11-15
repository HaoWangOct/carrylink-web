# CarryLink 展示部署

范围：公开可浏览的产品原型，不接真实账户、资金或数据库，保留现有 Next.js 架构。

## Vercel 导入

1. 登录 Vercel，在 New Project 中导入 `HaoWangOct/carrylink-web`。
2. 选择已验证分支；本次准备分支为 `chore/github-showcase`。若生产分支仍为 `main`，先核对其是否包含展示提交，避免部署旧版首页。
3. Framework Preset 使用 Next.js，Root Directory 为仓库根目录；安装命令 `npm ci`，构建命令 `npm run build`，输出目录使用框架默认值。Node.js 选择满足 `package.json` 要求的版本。
4. 不添加环境变量或数据库连接；账户模式保持默认禁用。不要上传 `.env`，不要执行迁移、seed 或 reset。
5. 部署完成后，无需登录即可检查首页、三语切换、手机布局、搜索、行程与寄件需求演示。确认 `/api/auth/demo` 返回 503；真实登录与验证码不可用。
6. 将部署实际返回的公开 URL 填入 README 与 GitHub About 的 Website；不要使用部署控制台地址。

官方依据：[Git deployments](https://vercel.com/docs/git)、[GitHub integration](https://vercel.com/docs/git/vercel-for-github)。本地框架依据：`node_modules/next/dist/docs/01-app/01-getting-started/17-deploying.md`。

## 发布范围与回退

本次不包含工作区中未提交的 PostgreSQL / Prisma 实验。发布来自明确 Git 提交，不上传整个本地目录。

回退时在托管平台选择先前成功的展示部署；不需要数据库恢复。公开代码同时公开既有提交历史。发布前检查历史中的凭据与不应公开的文件；自动扫描只能发现部分常见格式。
