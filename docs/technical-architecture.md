# JobMate AI 职伴 - 技术方案文档

## 一、架构设计

### 1.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                         浏览器层                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐ │
│  │ 简历优化 │ │ JD分析   │ │面试准备 │ │   投递管理      │ │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────────┬────────┘ │
│       └─────────────┴───────────┴─────────────────┘          │
│                         ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 AI服务层 (ai.ts)                    │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐          │  │
│  │  │ DashScope │ │  OpenAI  │ │  Claude  │  Custom   │  │
│  │  └──────────┘ └──────────┘ └──────────┘          │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              LocalStorage 数据层                      │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │  │
│  │  │AI Config │ │User Data │ │Applications│            │  │
│  │  └──────────┘ └──────────┘ └──────────┘            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 纯前端架构优势

| 优势 | 说明 |
|-----|------|
| **零后端成本** | 无需服务器、数据库、运维 |
| **隐私安全** | 用户数据不上传，API Key本地存储 |
| **即开即用** | 打开浏览器即可使用 |
| **易于部署** | 静态文件托管即可（GitHub Pages/Vercel） |

---

## 二、核心模块设计

### 2.1 AI服务层 (src/services/ai.ts)

**设计模式**：策略模式 + 适配器模式

```typescript
// 统一接口
interface AIService {
  callAI(prompt: string, config: AIServiceConfig): Promise<AIResponse>;
}

// 多提供商适配
- DashScopeAdapter: 阿里云API适配
- OpenAIAdapter: OpenAI API适配
- ClaudeAdapter: Anthropic API适配
- CustomAdapter: 自定义OpenAI兼容接口适配
```

**关键实现**：
- JSON响应自动提取（支持markdown代码块）
- 错误分类处理（网络/CORS/API错误）
- 超时控制

### 2.2 数据管理 (src/types/)

**投递管理数据模型**：
```typescript
interface JobApplication {
  id: string;
  companyName: string;
  position: string;
  jdContent?: string;
  matchScore?: number;
  status: 'applied' | 'viewed' | 'interview' | 'offer' | 'rejected' | 'ghosted';
  applyDate: string;
  platform?: string;
  salary?: string;
  notes?: string;
}
```

**数据操作封装**：
- `loadApplications()`: 从LocalStorage加载
- `saveApplications()`: 保存到LocalStorage
- `addApplication()`: 添加记录
- `updateApplication()`: 更新记录
- `getFollowUpApplications()`: 获取需跟进记录

### 2.3 状态管理

**LocalStorage Key设计**：
| Key | 用途 |
|-----|------|
| `jobmate_ai_config` | AI提供商配置 |
| `jobmate_user` | 当前用户信息 |
| `jobmate_auth` | 登录状态 |
| `jobmate_applications` | 投递记录列表 |
| `jobmate_mock_users` | 模拟用户数据库 |

---

## 三、关键功能实现

### 3.1 AI求职信生成

**Prompt设计**：
```
角色：专业求职顾问
任务：根据JD和简历生成个性化求职信

输入：
- 目标公司、职位
- JD内容
- 简历摘要
- 语气风格

输出要求：
{
  "coverLetter": "150-200字求职信",
  "keyPoints": ["亮点1", "亮点2", "亮点3"],
  "tips": ["使用建议1", "使用建议2"]
}
```

**调用流程**：
1. 用户点击"生成求职信"
2. 组装Prompt（公司+职位+JD+简历+风格）
3. 调用AI服务
4. 解析JSON响应
5. 展示结果

### 3.2 智能提醒系统

**提醒规则**：
```typescript
// 超过7天无更新的投递
function getFollowUpApplications(): JobApplication[] {
  return applications.filter(app => {
    const applyDate = new Date(app.applyDate);
    const isOld = applyDate < sevenDaysAgo;
    const needsFollowUp = app.status === 'applied' || app.status === 'viewed';
    return isOld && needsFollowUp;
  });
}
```

**展示位置**：首页顶部Alert组件

### 3.3 数据统计

**统计维度**：
- 总投递数
- 各状态数量（已投递/已查看/面试中/已录用/已拒绝/无回复）
- 响应率 = (有响应数 / 总投递数) × 100%
- 面试率 = (面试中+已录用 / 总投递数) × 100%
- 录用率 = (已录用 / 总投递数) × 100%

---

## 四、技术亮点

### 4.1 多AI提供商支持

**配置数据结构**：
```typescript
interface AIServiceConfig {
  provider: 'dashscope' | 'openai' | 'claude' | 'custom';
  apiKey: string;
  model?: string;
  baseUrl?: string;
}
```

**提供商配置**：
- DashScope: 国内稳定，推荐国内用户使用
- OpenAI: GPT系列，能力强但需解决CORS
- Claude: 代码分析强
- Custom: 兼容OpenAI格式的中转服务

### 4.2 错误处理机制

**CORS错误识别**：
```typescript
try {
  await fetch(url, options);
} catch (error) {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    throw new Error('网络请求失败，可能是CORS限制');
  }
}
```

**API错误解析**：
- 解析HTTP状态码
- 提取错误消息
- 分类提示用户

### 4.3 JSON响应容错

**提取逻辑**：
```typescript
// 尝试从AI响应中提取JSON
const jsonMatch = response.content.match(/\{[\s\S]*\}/);
if (jsonMatch) {
  return JSON.parse(jsonMatch[0]);
}
```

支持：
- 纯JSON响应
- Markdown代码块包裹的JSON
- 多行JSON

---

## 五、文件结构

```
src/
├── components/
│   └── Layout/
│       ├── index.tsx          # 主布局组件
│       └── style.css          # 布局样式
├── pages/
│   ├── Home/                  # 首页（含提醒）
│   ├── ResumeOptimize/        # 简历优化
│   ├── JDAnalyze/             # JD分析（含求职信）
│   ├── InterviewPrep/         # 面试准备
│   ├── Applications/          # 投递管理（新增）
│   ├── Dashboard/             # 数据看板
│   ├── Settings/              # AI设置
│   └── Login/                 # 登录
├── services/
│   └── ai.ts                  # AI服务层
├── types/
│   ├── ai.ts                  # AI类型定义
│   ├── user.ts                # 用户类型
│   └── application.ts         # 投递类型（新增）
├── mock/
│   └── data.ts                # Mock数据
├── App.tsx                    # 路由配置
└── main.tsx                   # 入口文件
```

---

## 六、扩展性设计

### 6.1 新增AI提供商

只需在 `ai.ts` 中添加：
1. 新的调用函数
2. 在 `callAI()` 中添加case分支
3. 在 `src/types/ai.ts` 中添加配置

### 6.2 新增页面

1. 在 `src/pages/` 创建页面组件
2. 在 `App.tsx` 添加路由
3. 在 `Layout/index.tsx` 添加菜单项

### 6.3 数据迁移

如需后端化：
1. 封装 `localStorage` 操作层
2. 替换为API调用
3. 添加用户认证

---

## 七、部署方案

### 7.1 静态托管

**GitHub Pages**:
```bash
npm run build
gh-pages -d dist
```

**Vercel**:
1. 导入GitHub项目
2. 自动识别Vite配置
3. 一键部署

### 7.2 注意事项

- `vite.config.ts` 中设置 `base: './'` 支持相对路径
- 确保 `dist/` 目录包含所有资源

---

## 八、性能优化

### 8.1 当前优化

- 按需加载Ant Design组件
- Vite构建优化
- LocalStorage异步读写

### 8.2 可优化方向

- 虚拟滚动（投递记录过多时）
- 数据压缩（LocalStorage有5MB限制）
- Service Worker离线缓存

---

**文档版本**：v2.0
**最后更新**：2026年5月25日
