# JobMate AI 职伴 - 项目文档

## 📋 项目概述

**项目名称**: JobMate AI 职伴  
**参赛赛道**: 智联招聘 AI 创新大赛 - AI+求职  
**当前状态**: ✅ 已接入真实 AI API，功能完整可用

**已完成内容**:
- ✅ React + TypeScript + Vite 项目搭建
- ✅ Ant Design 6.x UI 组件集成
- ✅ TailwindCSS 样式配置
- ✅ 6个核心页面开发（含 AI 设置页）
- ✅ **AI 服务接入** - 支持多提供商（DashScope/OpenAI/Claude/自定义）
- ✅ **真实 API 调用** - 简历优化、JD分析、面试准备
- ✅ 产品说明书和 PPT 大纲

---

## 🆕 最新更新（2026年5月10日）

### AI 功能已接入

**支持的 AI 提供商**:

| 提供商 | 类型 | 特点 |
|--------|------|------|
| 阿里云 DashScope | 官方 API | 国内访问稳定，有免费额度 |
| OpenAI | 官方 API | GPT 系列，需海外网络或代理 |
| Anthropic Claude | 官方 API | 代码和推理能力强 |
| 自定义 OpenAI 兼容 | 中转服务 | 支持 OneAPI/New API 等 |

**配置方式**:
- 前端直接配置，无需后端
- API Key 存储在浏览器 LocalStorage
- 支持自定义模型名称和 API 地址

---

## 📁 项目结构

```
JobMate-AI/                        ← 项目根目录
├── dist/                          ← 构建产物（可直接部署）
│   ├── index.html
│   ├── assets/                    ← JS/CSS 资源文件
│   └── ...
│
├── docs/                          ← 产品文档
│   ├── product-manual.md          ← 产品说明书
│   └── api-integration.md         ← AI 对接文档 ← NEW
│
├── src/                           ← 源代码
│   ├── components/                ← 组件
│   │   └── Layout/                ← 主布局组件（含导航菜单）
│   │
│   ├── pages/                     ← 页面
│   │   ├── Home/                  ← 首页
│   │   ├── ResumeOptimize/      ← 简历优化（真实 AI）← UPDATED
│   │   ├── JDAnalyze/             ← JD分析（真实 AI）← UPDATED
│   │   ├── InterviewPrep/        ← 面试准备（真实 AI）← UPDATED
│   │   ├── Dashboard/            ← 数据看板
│   │   └── Settings/             ← AI 设置 ← NEW
│   │
│   ├── services/                  ← 服务层 ← NEW
│   │   └── ai.ts                 ← AI API 调用封装
│   │
│   ├── types/                     ← TypeScript类型
│   │   ├── ai.ts                 ← AI 类型定义 ← NEW
│   │   └── index.ts
│   │
│   ├── mock/                      ← Mock数据（备用）
│   │   └── data.ts
│   │
│   ├── App.tsx                    ← 主应用组件
│   ├── index.css                  ← 全局样式
│   └── main.tsx                   ← 入口文件
│
├── package.json                   ← 依赖配置
├── tsconfig.json                  ← TypeScript配置
├── vite.config.ts                 ← Vite配置
├── tailwind.config.js             ← Tailwind配置
└── PROJECT-HANDOVER.md            ← 本文档
```

---

## 🚀 快速启动指南

### 方式一：生产环境运行（推荐）

已构建的版本，无需安装依赖：

```bash
# 1. 进入 dist 目录
cd dist

# 2. 启动静态服务器（任选其一）
# Python 方式
python -m http.server 8080 --bind 127.0.0.1

# Node.js 方式
npx serve -l 8080
```

访问: http://localhost:8080

---

### 方式二：开发模式运行

需要修改代码时使用：

```bash
# 1. 进入项目目录
cd JobMate-AI

# 2. 安装依赖（首次）
npm install

# 3. 启动开发服务器
npm run dev
```

访问: http://localhost:5173

**注意**: Vite 开发模式在 Windows 上可能有兼容性问题，如遇问题请使用方式一。

---

### 方式三：重新构建生产版本

```bash
# 1. 安装依赖
npm install

# 2. 构建
npm run build

# 3. 运行
cd dist
python -m http.server 8080 --bind 127.0.0.1
```

---

## 🔧 AI 配置指南

### 第一步：打开 AI 设置页面

1. 启动应用后，点击左侧导航栏 **"AI设置"** 菜单
2. 或直接访问 `http://localhost:8080/#/settings`

### 第二步：选择 AI 提供商

#### 方案 A：阿里云 DashScope（推荐国内用户）

1. **选择提供商**: 阿里云 DashScope
2. **获取 API Key**:
   - 访问 https://dashscope.aliyun.com/
   - 注册/登录阿里云账号
   - 进入「API-KEY 管理」创建新 Key
3. **选择模型**:
   - `qwen-turbo`（快速，性价比高）
   - `qwen-plus`（均衡）
   - `qwen-max`（最强能力）
4. **点击保存并测试**

#### 方案 B：OpenAI

1. **选择提供商**: OpenAI
2. **获取 API Key**:
   - 访问 https://platform.openai.com/
   - 注册账号并充值
   - 在 API Keys 页面创建新 Key
3. **选择模型**:
   - 预设模型：`gpt-3.5-turbo`、`gpt-4`、`gpt-4o`
   - 或点击「自定义模型」输入任意模型名
4. **API 地址**（可选）:
   - 默认：`https://api.openai.com/v1/chat/completions`
   - 如需自定义中转地址，填入 baseUrl

#### 方案 C：自定义 OpenAI 兼容接口（推荐）

适用于使用 OneAPI、New API 等中转服务：

1. **选择提供商**: 自定义 OpenAI 兼容接口
2. **API 接口地址**: 填入你的中转地址
   - 示例：`https://your-api-server.com`
   - 支持格式：自动补全 `/v1/chat/completions`
3. **API Key**: 中转平台提供的 Key
4. **模型名称**: 自定义输入，如 `gpt-4`、`claude-3-opus`

---

### 第三步：验证连接

点击「保存并测试」按钮后：
- ✅ 显示「连接成功」- 配置正确，可正常使用
- ❌ 显示错误信息 - 根据提示检查配置

---

## 📊 功能使用说明

### 功能1: 简历智能优化

**路径**: `/resume` 或点击「简历优化」菜单

**使用步骤**:
1. 在左侧面板输入简历内容（支持粘贴文本）
2. （可选）输入目标职位，如「前端开发工程师」
3. 点击「开始 AI 分析」
4. 等待 AI 返回分析结果（约 5-15 秒）
5. 查看评分、问题诊断和改进建议
6. 点击「AI 一键优化」生成优化版本

**注意**: 需要先完成 AI 配置

---

### 功能2: JD 智能分析

**路径**: `/jd` 或点击「JD分析」菜单

**使用步骤**:
1. 在左侧粘贴完整的职位描述（JD）
2. （可选）输入你的简历摘要，用于匹配分析
3. 点击「开始 AI 分析」
4. 查看匹配度评分、技能对比和建议

---

### 功能3: 面试准备工坊

**路径**: `/interview` 或点击「面试准备」菜单

**使用步骤**:
1. 输入目标公司名称
2. （可选）输入目标职位
3. 点击「生成 AI 情报报告」
4. 查看公司信息、企业文化和预测面试题目

---

### 功能4: AI 设置

**路径**: `/settings` 或点击「AI设置」菜单

**功能**:
- 配置 AI 提供商和 API Key
- 选择或自定义模型
- 测试 API 连接
- 清除配置

---

## 🔌 AI 对接技术文档

### 架构说明

```
┌─────────────────────────────────────────────────────────────┐
│                      前端 (Browser)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ ResumeOptimize│  │  JDAnalyze   │  │  InterviewPrep    │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
│         │                 │                    │            │
│         └─────────────────┼────────────────────┘            │
│                           │                                 │
│                    ┌──────┴──────┐                         │
│                    │   ai.ts     │  ← 统一封装层            │
│                    │  (services) │                         │
│                    └──────┬──────┘                         │
│                           │                                 │
│         ┌─────────────────┼─────────────────┐              │
│         │                 │                 │              │
│    ┌────┴────┐     ┌────┴────┐      ┌────┴────┐           │
│    │DashScope│     │ OpenAI  │      │ Custom  │           │
│    │阿里云   │     │         │      │ 中转   │           │
│    └────┬────┘     └────┬────┘      └────┬────┘           │
└─────────┼───────────────┼────────────────┼─────────────────┘
          │               │                │
         HTTP          HTTP            HTTP
       (CORS受限)    (CORS受限)       (推荐✓)
```

### API 调用流程

1. **配置加载**: 从 LocalStorage 读取 `{provider, apiKey, model, baseUrl}`
2. **路由分发**: 根据 provider 选择对应的调用函数
3. **请求构造**: 按各提供商格式构造请求体
4. **错误处理**: 捕获并解析 HTTP 错误、网络错误
5. **响应解析**: 提取 AI 返回的文本内容

### 配置存储格式

```typescript
// LocalStorage key: jobmate_ai_config
interface AIServiceConfig {
  provider: 'dashscope' | 'openai' | 'claude' | 'custom';
  apiKey: string;
  model?: string;
  baseUrl?: string;  // 仅自定义接口使用
}
```

### 提供商接入详情

#### 阿里云 DashScope

```typescript
POST https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation
Headers:
  Authorization: Bearer {apiKey}
  Content-Type: application/json
Body:
{
  "model": "qwen-turbo",
  "input": {
    "messages": [
      {"role": "system", "content": "你是一个专业的求职助手..."},
      {"role": "user", "content": "用户输入..."}
    ]
  }
}
```

**响应格式**:
```json
{
  "output": {
    "text": "AI 回复内容..."
  },
  "usage": {
    "prompt_tokens": 100,
    "completion_tokens": 200
  }
}
```

#### OpenAI 兼容格式

```typescript
POST {baseUrl}/v1/chat/completions
Headers:
  Authorization: Bearer {apiKey}
  Content-Type: application/json
Body:
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {"role": "system", "content": "你是一个专业的求职助手..."},
    {"role": "user", "content": "用户输入..."}
  ],
  "temperature": 0.7
}
```

---

## ⚠️ 常见问题与解决

### 问题1: API 连接失败 / CORS 错误

**症状**: 点击「保存并测试」后显示连接失败

**原因**: 
- 浏览器安全限制（CORS），直接访问海外 API 被阻止
- 网络连接问题

**解决方案**:

| 方案 | 操作步骤 |
|------|----------|
| **使用中转服务**（推荐） | 1. 部署 OneAPI/New API<br>2. 选择「自定义接口」模式<br>3. 填入中转地址和 Key |
| **使用国内服务** | 选择「阿里云 DashScope」，国内稳定访问 |
| **浏览器插件** | 安装 CORS Unblock 插件（仅本地测试） |

**中转服务推荐**:
- [OneAPI](https://github.com/songquanpeng/one-api) - 开源免费
- [New API](https://github.com/Calcium-Ion/new-api) - 支持更多渠道
- 付费中转站 - 如 API2D、CloseAI 等

---

### 问题2: API Key 无效

**症状**: 提示 API Key 错误或鉴权失败

**解决**:
1. 检查 Key 是否复制完整（包含 `sk-` 前缀）
2. 确认 Key 是否已激活（部分平台需要充值后激活）
3. 检查 Key 是否被禁用或过期

---

### 问题3: 模型不存在

**症状**: 提示 model not found

**解决**:
1. 检查选择的模型名称是否正确
2. 对于中转服务，确认该模型是否在支持列表
3. 尝试使用「自定义模型」输入完整模型名

---

### 问题4: 网络超时

**症状**: 请求长时间无响应

**解决**:
1. 检查网络连接
2. 尝试刷新页面重试
3. 更换更稳定的 API 提供商
4. 对于复杂请求，增加超时时间（默认 30s）

---

### 问题5: AI 返回格式错误

**症状**: 提示「AI 返回格式错误」

**原因**: AI 没有按要求的 JSON 格式返回

**解决**:
1. 重试请求（AI 输出有随机性）
2. 换用更强的模型（如 gpt-4、qwen-max）
3. 简化输入内容

---

## 💾 数据存储说明

### 本地存储数据

| 存储项 | 位置 | 说明 |
|--------|------|------|
| AI 配置 | LocalStorage (`jobmate_ai_config`) | API Key、模型等配置 |

**安全说明**:
- API Key 仅存储在浏览器本地
- 不会上传到任何服务器
- 清除浏览器数据会导致配置丢失

---

## 🔧 环境要求

| 工具 | 版本 | 下载地址 |
|------|------|----------|
| Node.js | ≥ 18.x | https://nodejs.org |
| npm | ≥ 9.x | 随 Node.js 安装 |
| Python | ≥ 3.x | https://python.org（用于静态服务器） |

**验证安装**:
```bash
node --version    # v18.x 或更高
npm --version     # 9.x 或更高
python --version  # 3.x
```

---

## 📞 技术支持

### AI 提供商支持

| 提供商 | 文档 | 支持 |
|--------|------|------|
| DashScope | https://dashscope.aliyun.com/ | 阿里云工单 |
| OpenAI | https://platform.openai.com/docs | 社区论坛 |
| OneAPI | https://github.com/songquanpeng/one-api | GitHub Issues |

---

## 📝 更新日志

### v2.0 (2026-05-10)
- ✨ 新增 AI 设置页面，支持多提供商配置
- ✨ 接入真实 AI API（简历优化、JD分析、面试准备）
- ✨ 支持自定义 OpenAI 兼容接口
- ✨ 支持自定义模型名称
- 🔧 添加 CORS 错误处理和提示
- 📝 完善项目文档

### v1.0 (2026-05-01)
- 🎉 初始版本发布
- ✨ 5个核心页面 UI 完成
- ✨ Mock 数据支持
- 📝 产品说明书和 PPT 大纲

---

*文档版本: v2.0*  
*最后更新: 2026年5月10日*
