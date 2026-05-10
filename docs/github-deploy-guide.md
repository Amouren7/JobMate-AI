# GitHub 上传与部署指南

## 📤 上传到 GitHub

### 方式一：命令行上传

```bash
# 1. 进入项目目录
cd "E:\夸克\JobMate-AI(3)\JobMate-AI"

# 2. 初始化 Git 仓库
git init

# 3. 添加所有文件到暂存区
git add .

# 4. 提交更改
git commit -m "Initial commit: JobMate AI v2.0"

# 5. 在 GitHub 创建新仓库
# 访问 https://github.com/new
# 仓库名：JobMate-AI
# 不要勾选 Initialize with README

# 6. 关联远程仓库（替换 your-username）
git remote add origin https://github.com/your-username/JobMate-AI.git

# 7. 推送到 GitHub
git branch -M main
git push -u origin main
```

### 方式二：GitHub Desktop（推荐新手）

1. 下载安装 [GitHub Desktop](https://desktop.github.com/)
2. 登录 GitHub 账号
3. 点击 File → Add local repository
4. 选择项目文件夹 `E:\夸克\JobMate-AI(3)\JobMate-AI`
5. 点击 "Publish repository"
6. 填写仓库名称和描述
7. 勾选 "Keep this code private"（可选）
8. 点击 "Publish repository"

### 方式三：拖拽上传（最简单）

1. 访问 https://github.com/new
2. 创建新仓库 `JobMate-AI`
3. 不要勾选任何初始化选项
4. 创建后在页面找到 "uploading an existing file" 链接
5. 拖拽项目文件（不含 node_modules）到上传区域

**⚠️ 注意**：不要上传以下文件：
- node_modules/（依赖）
- .env（包含 API Key）
- dist/（构建产物，建议单独部署）

---

## 🚀 部署到 GitHub Pages

### 步骤 1：创建 gh-pages 分支

```bash
# 进入 dist 目录
cd dist

# 初始化 git
git init
git add .
git commit -m "Deploy to GitHub Pages"

# 推送到 gh-pages 分支
git push --force https://github.com/your-username/JobMate-AI.git main:gh-pages
```

### 步骤 2：启用 GitHub Pages

1. 访问仓库 Settings → Pages
2. Source 选择 "Deploy from a branch"
3. Branch 选择 "gh-pages"
4. 点击 Save
5. 等待几分钟后访问 `https://your-username.github.io/JobMate-AI`

### 步骤 3：自动部署脚本

在项目根目录创建 `deploy.sh`：

```bash
#!/bin/bash

# 构建项目
npm run build

# 进入 dist 目录
cd dist

# 创建 .nojekyll 文件（防止 GitHub Pages 忽略文件）
touch .nojekyll

# 初始化 git
git init
git add .
git commit -m "Deploy to GitHub Pages: $(date)"

# 推送到 gh-pages 分支
git push --force https://github.com/your-username/JobMate-AI.git main:gh-pages

echo "部署完成！访问: https://your-username.github.io/JobMate-AI"
```

使用：
```bash
# Windows 使用 Git Bash 或 WSL
bash deploy.sh
```

---

## 🔧 配置 GitHub Actions 自动部署

创建文件 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 🌐 部署到 Vercel（推荐）

### 方式一：Git 集成（推荐）

1. 访问 https://vercel.com
2. 点击 "Add New..." → "Project"
3. 导入 GitHub 仓库 JobMate-AI
4. 框架预设选择 "Vite"
5. 点击 "Deploy"

### 方式二：Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
cd "E:\夸克\JobMate-AI(3)\JobMate-AI"
vercel --prod
```

---

## 🔐 安全注意事项

### ✅ 确保不提交敏感信息

检查 `.gitignore` 包含：
```
.env
.env.local
.env.*.local
*.key
secrets.*
```

### ✅ 清理已提交的敏感信息

如果意外提交了 API Key：

```bash
# 1. 删除文件从 git 历史
git filter-branch --force --index-filter \
"git rm --cached --ignore-unmatch .env" \
--prune-empty --tag-name-filter cat -- --all

# 2. 强制推送
git push origin main --force

# 3. 立即更换 API Key！
```

---

## 📋 部署前检查清单

- [ ] README.md 已更新
- [ ] .gitignore 包含敏感文件
- [ ] .env 文件中的 API Key 已替换为占位符
- [ ] LICENSE 文件已添加
- [ ] dist/ 目录已构建（`npm run build`）
- [ ] node_modules/ 不在上传列表中
- [ ] 本地测试通过（`python -m http.server 8080`）

---

## 🔗 部署后验证

1. **访问仓库**：https://github.com/your-username/JobMate-AI
2. **检查文件**：确认 .env 不在仓库中
3. **查看 Pages**：Settings → Pages 确认已启用
4. **访问网站**：https://your-username.github.io/JobMate-AI
5. **测试功能**：配置 AI → 简历优化 → JD分析

---

## ❓ 常见问题

### Q1: 如何修改 GitHub 仓库地址？

```bash
git remote set-url origin https://github.com/new-username/new-repo.git
```

### Q2: 如何更新已上传的代码？

```bash
git add .
git commit -m "Update: [描述更新内容]"
git push origin main
```

### Q3: GitHub Pages 访问 404？

1. 确认仓库是 Public（Settings → General → Danger Zone）
2. 确认 Pages 已启用（Settings → Pages）
3. 等待 1-2 分钟让部署生效
4. 检查 dist 目录包含 index.html

### Q4: 如何配置自定义域名？

1. 在 `dist` 目录创建 `CNAME` 文件，内容为域名
2. 在域名服务商添加 CNAME 记录指向 `your-username.github.io`
3. 在 GitHub Pages 设置中填写自定义域名

---

## 📞 需要帮助？

- GitHub 文档：https://docs.github.com/cn
- GitHub Pages：https://pages.github.com
- Vercel 文档：https://vercel.com/docs

