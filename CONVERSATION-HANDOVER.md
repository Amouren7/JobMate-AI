# JobMate AI 职伴 - 完整项目交接文档

> **创建时间**: 2026-04-27
> **最后更新**: 2026-04-28
> **项目状态**: ✅ 设置页面完成，可直接在浏览器配置API
> **参赛**: 智联招聘 AI 创新大赛 - AI+求职赛道

---

## 📋 项目概述

**JobMate AI 职伴** 是一款全流程 AI 求职助手，帮助求职者：
1. 智能优化简历（简历诊断 + 一键优化）
2. JD 智能分析（匹配度评分 + 优化建议）
3. 面试准备（公司情报 + AI预测面试题）

**当前状态**:
- ✅ MVP 前端原型已完成
- ✅ UI/UX 优化已完成（动画、过渡、交互）
- ✅ DashScope API 已接入
- ✅ **设置页面完成**（浏览器内直接配置API Key）
- ⏳ 待制作 PPT 演示文稿

---

## 📁 项目结构

```
D:\JobMate-AI\                    ← 项目根目录
│
├── dist\                          ← 构建产物（可直接部署）
│   ├── index.html
│   ├── start-server.bat            ← Windows快速启动脚本
│   ├── start-server.sh             ← Mac/Linux启动脚本
│   └── assets\                    ← JS/CSS 资源
│
├── docs\                          ← 文档
│   ├── product-manual.md           ← 产品说明书（完整版）
│   ├── PROJECT-HANDOVER.md         ← 项目交接文档
│   ├── api-setup.md                ← API配置指南
│   └── superpowers\                ← 设计文档
│       └── specs\
│           └── 2026-04-27-ui-optimization-design.md
│
├── ppt\                          ← 演示材料
│   └── presentation-outline.md     ← PPT大纲（15页）
│
├── src\                          ← 源代码
│   ├── components\                
│   │   └── Layout\               
│   │       └── index.tsx          ← 主布局组件
│   │
│   ├── hooks\                    
│   │   └── useCountUp.ts         ← 数字滚动动画 Hook
│   │
│   ├── pages\                    
│   │   ├── Home\                  
│   │   │   └── index.tsx          ← 首页
│   │   ├── ResumeOptimize\       
│   │   │   └── index.tsx          ← 简历优化
│   │   ├── JDAnalyze\            
│   │   │   └── index.tsx          ← JD分析
│   │   ├── InterviewPrep\       
│   │   │   └── index.tsx          ← 面试准备
│   │   ├── Dashboard\           
│   │   │   └── index.tsx          ← 数据看板
│   │   └── Settings\            
│   │       └── index.tsx          ← ⭐ 设置页面（配置API）
│   │
│   ├── services\                 
│   │   └── llm.ts                 ← DashScope API封装
│   │
│   ├── mock\                    
│   │   └── data.ts               ← Mock数据
│   │
│   ├── types\                    
│   │   └── index.ts              ← TypeScript类型定义
│   │
│   ├── App.tsx                   ← 主应用
│   ├── index.css                 ← 全局样式
│   └── main.tsx                  ← 入口文件
│
├── package.json                  ← 依赖配置
├── tsconfig.json                 ← TS配置
├── vite.config.ts                ← Vite配置
├── tailwind.config.js            ← Tailwind配置
└── postcss.config.js             ← PostCSS配置
```

---

## 🚀 快速启动

### 1. 安装依赖（新电脑首次）
```bash
cd /d/JobMate-AI
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```
访问: `http://localhost:5173/`

### 3. 配置 API（浏览器内完成）

#### 方式一：网页配置（推荐）
1. 打开网站 → 点击左侧「设置」
2. 粘贴 DashScope API Key
3. 选择模型（推荐 qwen-plus）
4. 点击「测试连接」验证
5. 点击「保存配置」
6. **刷新页面**后生效

#### 方式二：环境变量配置
如需默认配置，可创建 `.env` 文件：
```bash
# 复制配置模板
cp .env.example .env

# 编辑 .env 填入你的 API Key
VITE_DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_DASHSCOPE_MODEL=qwen-plus
```

---

## 🔧 API 配置详细说明

### 获取 API Key

1. 访问阿里云百炼控制台：https://bailian.console.aliyun.com/
2. 登录阿里云账号
3. 点击「API-KEY管理」→「创建新的API-KEY」
4. 复制 Key（格式如：`sk-3d665...890fe`）

### 支持的模型

| 模型 | 说明 | 价格 |
|------|------|------|
| qwen-turbo | 速度快，成本低 | ¥0.5/千tokens |
| qwen-plus | 性能均衡（⭐推荐） | ¥2/千tokens |
| qwen-max | 效果最好 | ¥20/千tokens |

**推荐使用 qwen-plus**，性价比较高。

### 配置存储位置

- **网页配置**：保存在浏览器 localStorage
- **环境变量**：保存在 `.env` 文件

**优先级**：网页配置 > 环境变量

---

## ✅ 功能清单

### 已完成功能

1. **简历智能优化**
   - 上传简历或使用示例数据
   - AI 分析匹配度评分
   - 一键优化简历内容
   - 前后对比展示

2. **JD 智能分析**
   - 粘贴 JD 描述
   - 提取核心技能要求
   - 匹配度评分
   - 优化建议

3. **面试准备工坊**
   - 输入公司名称
   - AI 生成公司情报
   - 预测面试题目
   - 提供参考答案和技巧

4. **数据看板**
   - 统计信息展示
   - 技能雷达图
   - 投递漏斗分析

5. **设置页面** ⭐
   - 配置 API Key
   - 选择 AI 模型
   - 测试连接状态
   - 清除配置

---

## 📝 新电脑无缝衔接指南

### 复制项目
将 `D:\JobMate-AI` 文件夹复制到新电脑

### 启动项目
```bash
cd /d/JobMate-AI
npm install
npm run dev
```

### 配置 API
打开浏览器 → 访问 `http://localhost:5173/` → 点击「设置」→ 填入 API Key

---

## ⏳ 待办事项（按优先级）

### 🔴 高优先级

1. **配置 API Key 并测试** ✅
   - 在设置页面配置即可
   - 点击「测试连接」验证

2. **制作 PPT 演示文稿**
   - 文件: `ppt/presentation-outline.md`
   - 工具: PowerPoint / Keynote / Canva
   - 时长: 8-10分钟，15页

3. **产品说明书导出 PDF**
   - 文件: `docs/product-manual.md`
   - 工具: Typora / VS Code Markdown PDF 插件

### 🟡 中优先级

4. **添加简历文件解析**
   - 支持 PDF/Word 真实解析
   - 可选库: `pdf-parse`, `mammoth`

5. **更多用户场景**
   - 补充到 3-5 个场景

---

## 🎯 比赛提交清单

- [x] 项目源码（JobMate-AI 文件夹）
- [ ] 配置 API Key 并测试通过
- [ ] 产品说明书 PDF
- [ ] PPT 演示文稿
- [ ] 产品 Demo（本地或在线）

---

## 💡 常用开发指令

```bash
# 在新对话中继续开发
cd /d/JobMate-AI
npm run dev

# 制作 PPT
"帮我把 ppt/presentation-outline.md 制作成 PPT 演示文稿"

# 导出 PDF
"把 docs/product-manual.md 导出为 PDF"

# 添加新功能
"在 JobMate AI 中添加一个『薪资谈判助手』功能"
```

---

## 📞 关键文件索引

| 需求 | 文件路径 |
|------|----------|
| 查看产品定义 | `docs/product-manual.md` |
| 查看设计规范 | `docs/superpowers/specs/2026-04-27-ui-optimization-design.md` |
| 查看 PPT 大纲 | `ppt/presentation-outline.md` |
| API 配置页面 | `src/pages/Settings/index.tsx` |
| API 服务封装 | `src/services/llm.ts` |
| 简历优化 | `src/pages/ResumeOptimize/index.tsx` |
| JD分析 | `src/pages/JDAnalyze/index.tsx` |
| 面试准备 | `src/pages/InterviewPrep/index.tsx` |

---

## 🔧 技术栈

- **框架**: React 18 + TypeScript
- **构建**: Vite
- **UI 库**: Ant Design 5.x
- **样式**: TailwindCSS + CSS 变量
- **路由**: React Router v6 (HashRouter)
- **图标**: @ant-design/icons
- **AI服务**: 阿里云 DashScope (OpenAI 兼容模式)

---

## ⚠️ 注意事项

1. **API Key 安全**：配置保存在浏览器 localStorage，不会上传到服务器
2. **端口占用**：如果 5173 被占用，Vite 会自动切换到 5174/5175
3. **直接打开 HTML**：必须用 HTTP 服务器，不能直接双击
4. **TailwindCSS**：使用 v3.4.17（v4 有兼容性问题）
5. **Node 版本**：建议 18.x 或更高

---

## 🆕 更新日志

### 2026-04-28
- ✅ 创建设置页面 (`src/pages/Settings/index.tsx`)
- ✅ 支持浏览器内配置 API Key 和模型
- ✅ API 配置优先级：localStorage > 环境变量
- ✅ 添加连接测试功能
- ✅ 更新项目文档

### 2026-04-28
- ✅ 接入 DashScope API (OpenAI 兼容模式)
- ✅ 更新类型定义
- ✅ 改造简历优化、JD分析、面试准备页面
- ✅ 添加 API 配置文档

### 2026-04-27
- ✅ 完成 MVP 前端原型
- ✅ 完成 UI 动画优化
- ✅ 创建项目文档

---

**END OF DOCUMENT**
