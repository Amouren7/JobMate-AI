# JobMate AI 职伴

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5.0-purple?logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Ant%20Design-6.x-blue?logo=antdesign" alt="Ant Design">
</p>

<p align="center">
  <strong>全流程 AI 求职助手</strong>
</p>

<p align="center">
  <a href="#功能特性">功能特性</a> •
  <a href="#技术栈">技术栈</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#部署指南">部署指南</a> •
  <a href="#截图预览">截图预览</a>
</p>

---

## 📖 项目简介

JobMate AI 职伴是一个**纯前端实现**的 AI 求职助手，旨在帮助求职者解决三大痛点：

1. **简历不会写** — AI 深度解析并给出优化建议
2. **投递没反馈** — 智能分析 JD 匹配度
3. **面试准备难** — 生成公司情报和预测面试题

**参赛信息**：智联招聘 AI 创新大赛 - AI+求职赛道

---

## ✨ 功能特性

### 📝 简历智能优化
- AI 深度解析简历结构
- 生成匹配度评分（0-100分）
- 识别问题并给出改进建议
- AI 一键生成优化后的简历内容

### 🔍 JD 智能分析
- 粘贴岗位 JD，AI 自动解析
- 提取核心技能要求
- 分析简历与 JD 匹配度
- 生成针对性投递建议

### 🎯 面试准备工坊
- 输入公司名称，AI 生成情报报告
- 公司背景、业务、技术栈分析
- AI 预测面试题（技术题、行为题、情景题）
- 提供参考回答思路

### ⚙️ 多 AI 提供商支持
- 阿里云 DashScope（国内首选）
- OpenAI / Anthropic Claude
- 自定义 OpenAI 兼容接口
- 用户自主配置，灵活切换

### 🔐 隐私优先
- API Key 仅存储在浏览器本地
- 不上传任何服务器
- 纯前端实现，无需后端

---

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI 组件库**: Ant Design 6.x
- **样式方案**: TailwindCSS
- **路由**: React Router v6
- **AI 调用**: Fetch API（支持多提供商）

---

## 🚀 快速开始

### 方式一：直接运行（推荐）

```bash
# 克隆项目
git clone https://github.com/your-username/JobMate-AI.git
cd JobMate-AI

# 进入构建目录
cd dist

# 启动静态服务器
python -m http.server 8080 --bind 127.0.0.1
# 或使用 Node.js
npx serve -l 8080
```

访问 http://localhost:8080

### 方式二：开发模式

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173

---

## 🔧 AI 配置

1. 点击左侧「AI设置」菜单
2. 选择 AI 提供商（推荐阿里云 DashScope）
3. 输入 API Key
4. 点击「保存并测试」

**支持的提供商**：
- [阿里云 DashScope](https://dashscope.aliyun.com/) - 国内稳定，有免费额度
- [OpenAI](https://platform.openai.com/) - GPT 系列
- [Anthropic Claude](https://www.anthropic.com/) - 代码分析强
- 自定义接口 - 支持 OneAPI、New API 等中转服务

---

## 📦 部署指南

### Vercel（推荐）

1. Fork 本项目到个人 GitHub
2. 在 Vercel 导入项目
3. 自动识别 Vite 配置
4. 部署完成获得域名

### GitHub Pages

```bash
# 安装 gh-pages
npm install -g gh-pages

# 部署到 GitHub Pages
npm run build
gh-pages -d dist
```

### Netlify

1. 拖拽 `dist` 文件夹到部署区域
2. 自动完成部署

---

## 📸 截图预览

### 登录页面
![登录](docs/screenshots/login.png)

### 简历优化
![简历优化](docs/screenshots/resume.png)

### JD 分析
![JD分析](docs/screenshots/jd.png)

### AI 设置
![AI设置](docs/screenshots/settings.png)

---

## 📁 项目结构

```
JobMate-AI/
├── dist/                    # 构建产物（可直接部署）
├── docs/
│   ├── product-manual.md    # 产品说明书
│   ├── api-integration.md   # API 对接文档
│   └── screenshot-guide.md  # 截图指南
├── src/
│   ├── components/          # 组件
│   │   ├── Layout/          # 主布局
│   │   ├── Loading/         # 加载动画
│   │   └── PageTransition/  # 页面过渡
│   ├── pages/               # 页面
│   │   ├── Home/            # 首页
│   │   ├── Login/           # 登录/注册
│   │   ├── ResumeOptimize/  # 简历优化
│   │   ├── JDAnalyze/       # JD分析
│   │   ├── InterviewPrep/   # 面试准备
│   │   ├── Dashboard/       # 数据看板
│   │   └── Settings/        # AI设置
│   ├── services/            # 服务层
│   │   └── ai.ts           # AI API 调用
│   ├── types/               # 类型定义
│   │   ├── ai.ts           # AI 类型
│   │   └── user.ts         # 用户类型
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🎯 使用流程

```
1. 配置 AI → 2. 简历优化 → 3. JD分析 → 4. 面试准备
     ↓              ↓              ↓              ↓
  选择提供商    粘贴简历      粘贴JD       输入公司名
  输入API Key   AI分析评分    匹配度分析    生成情报报告
  测试连接      一键优化      投递建议      预测面试题
```

---

## 🔒 隐私说明

- API Key 仅存储在浏览器 LocalStorage
- 不会上传到任何服务器
- 用户完全掌控自己的数据
- 支持随时清除配置

---

## 📊 竞品对比

| 功能 | 超级简历 | 牛客网 | 脉脉 | **JobMate AI** |
|------|---------|--------|------|----------------|
| 简历优化 | ✅ | ❌ | ❌ | ✅ **真实AI** |
| JD匹配 | ❌ | ❌ | ✅ | ✅ **深度分析** |
| 面试准备 | ❌ | ✅ | ❌ | ✅ **AI预测题** |
| 多AI提供商 | ❌ | ❌ | ❌ | ✅ **自主配置** |
| 隐私安全 | ⚠️ | ⚠️ | ⚠️ | ✅ **本地存储** |

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m 'Add some feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request

---

## 📄 开源协议

[MIT](LICENSE)

---

## 📮 联系我们

- 项目主页：https://github.com/your-username/JobMate-AI
- 问题反馈：https://github.com/your-username/JobMate-AI/issues
- 演示地址：https://your-username.github.io/JobMate-AI

---

<p align="center">
  Made with ❤️ for Job Seekers
</p>
