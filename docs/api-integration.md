# JobMate AI - API 对接技术文档

## 概述

本文档详细说明 JobMate AI 如何对接各类 AI 服务提供商，包括配置方法、API 调用流程和故障排查。

---

## 支持的 AI 提供商

| 提供商 | ID | 协议 | 适用场景 |
|--------|-----|------|---------|
| 阿里云 DashScope | `dashscope` | 阿里云原生 | 国内用户首选，稳定 |
| OpenAI | `openai` | OpenAI 标准 | 海外用户，原生体验 |
| Anthropic Claude | `claude` | Claude 原生 | 代码分析场景 |
| 自定义接口 | `custom` | OpenAI 兼容 | 中转服务，推荐 |

---

## 配置参数说明

### 配置结构

```typescript
interface AIServiceConfig {
  provider: 'dashscope' | 'openai' | 'claude' | 'custom';
  apiKey: string;           // API 密钥
  model?: string;           // 模型名称（可选）
  baseUrl?: string;         // 自定义接口地址（仅 custom 使用）
}
```

### 各提供商配置示例

#### 1. 阿里云 DashScope

```json
{
  "provider": "dashscope",
  "apiKey": "sk-xxxxxxxxxxxxxxxx",
  "model": "qwen-turbo"
}
```

**可选模型**:
- `qwen-turbo` - 快速响应，性价比高
- `qwen-plus` - 均衡选择
- `qwen-max` - 最强能力

**官方文档**: https://dashscope.aliyun.com/

---

#### 2. OpenAI 官方

```json
{
  "provider": "openai",
  "apiKey": "sk-xxxxxxxxxxxxxxxx",
  "model": "gpt-3.5-turbo"
}
```

**可选模型**:
- `gpt-3.5-turbo` - 基础模型
- `gpt-4` - 高级推理
- `gpt-4-turbo` - 最新版
- `gpt-4o` - 多模态

**注意**: 国内用户需要解决网络访问问题

---

#### 3. 自定义 OpenAI 兼容接口（推荐）

```json
{
  "provider": "custom",
  "apiKey": "your-api-key",
  "model": "gpt-4",
  "baseUrl": "https://your-oneapi-server.com"
}
```

**支持的中间件**:
- [OneAPI](https://github.com/songquanpeng/one-api) - 开源免费
- [New API](https://github.com/Calcium-Ion/new-api) - 支持更多渠道
- API2D、CloseAI 等付费中转

**baseUrl 格式**:
- ✅ `https://api.example.com`
- ✅ `https://api.example.com/`（自动处理尾部斜杠）
- ✅ `https://api.example.com/v1`（自动补全路径）
- ✅ `https://api.example.com/v1/chat/completions`（完整路径）

---

## API 调用流程

### 调用时序图

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   前端页面   │     │   ai.ts      │     │   AI 提供商      │
└──────┬──────┘     └──────┬───────┘     └────────┬────────┘
       │                   │                      │
       │  optimizeResume()  │                      │
       │ ─────────────────>│                      │
       │                   │                      │
       │                   │    loadConfig()      │
       │                   │    读取本地配置      │
       │                   │ <─────────────────   │
       │                   │                      │
       │                   │   callDashScope()    │
       │                   │   或 callOpenAI()    │
       │                   │ ──────────────────>  │
       │                   │                      │
       │                   │   HTTP POST          │
       │                   │   Authorization      │
       │                   │   JSON Body          │
       │                   │                      │
       │                   │ <──────────────────  │
       │                   │   JSON Response      │
       │                   │                      │
       │                   │   parse JSON         │
       │                   │   提取 content       │
       │                   │                      │
       │  ResumeOptimizeResponse                 │
       │ <─────────────────│                      │
       │                   │                      │
```

### 请求构造

#### 统一的 Prompt 模板

```typescript
const prompt = `请分析以下简历，并提供优化建议。

目标职位：${targetPosition || '未指定'}

简历内容：
${resumeContent}

请按以下 JSON 格式返回分析结果：
{
  "originalScore": 评分(1-100),
  "optimizedScore": 优化后预估评分(1-100),
  "issues": ["问题1", "问题2", ...],
  "suggestions": ["建议1", "建议2", ...],
  "optimizedContent": "优化后的简历内容（可选）"
}

注意：仅返回 JSON 数据，不要添加任何其他说明文字。`;
```

#### DashScope 请求格式

```http
POST https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation
Authorization: Bearer {apiKey}
Content-Type: application/json

{
  "model": "qwen-turbo",
  "input": {
    "messages": [
      {
        "role": "system",
        "content": "你是一个专业的求职助手，擅长简历优化、职位分析和面试辅导。"
      },
      {
        "role": "user",
        "content": "{prompt内容}"
      }
    ]
  }
}
```

#### OpenAI 兼容请求格式

```http
POST {baseUrl}/v1/chat/completions
Authorization: Bearer {apiKey}
Content-Type: application/json

{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "system",
      "content": "你是一个专业的求职助手，擅长简历优化、职位分析和面试辅导。"
    },
    {
      "role": "user",
      "content": "{prompt内容}"
    }
  ],
  "temperature": 0.7
}
```

### 响应解析

#### DashScope 响应

```json
{
  "output": {
    "text": "AI 生成的文本内容...",
    "finish_reason": "stop"
  },
  "usage": {
    "prompt_tokens": 100,
    "completion_tokens": 200,
    "total_tokens": 300
  }
}
```

**提取字段**: `data.output.text`

---

#### OpenAI 响应

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "AI 生成的文本内容..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 100,
    "completion_tokens": 200,
    "total_tokens": 300
  }
}
```

**提取字段**: `data.choices[0].message.content`

---

## 错误处理

### 错误类型

| 错误代码 | 原因 | 解决方案 |
|----------|------|---------|
| 401 | API Key 无效 | 检查 Key 是否正确，是否包含 `sk-` 前缀 |
| 403 | 权限不足 | 确认账号已开通服务，余额充足 |
| 404 | 模型不存在 | 检查模型名称拼写 |
| 429 | 请求过于频繁 | 降低请求频率，或升级套餐 |
| CORS | 跨域限制 | 使用中转服务，或配置代理 |
| Network | 网络连接失败 | 检查网络，确认域名可访问 |

### 错误处理代码示例

```typescript
try {
  const response = await fetch(url, {
    method: 'POST',
    headers: { ... },
    body: JSON.stringify({ ... })
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `API 错误 (${response.status})`;
    
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.error?.message || errorJson.message || errorText;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
  
  return await response.json();
} catch (error) {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    throw new Error('网络请求失败，可能是 CORS 限制');
  }
  throw error;
}
```

---

## CORS 解决方案

### 问题说明

浏览器安全策略禁止前端直接访问不同域名的 API。OpenAI、Claude 等海外服务通常不允许浏览器直接访问。

### 方案对比

| 方案 | 难度 | 成本 | 稳定性 | 适用场景 |
|------|------|------|--------|---------|
| 中转服务 | 低 | 低-中 | 高 | 推荐方案 |
| 代理服务器 | 中 | 中 | 中 | 有服务器资源 |
| CORS 插件 | 极低 | 免费 | 低 | 仅本地测试 |
| 后端转发 | 高 | 高 | 高 | 生产环境 |

### 方案一：OneAPI 中转（推荐）

**部署步骤**:

1. **服务器准备**
   - 准备一台国内服务器（阿里云、腾讯云等）
   - 安装 Docker

2. **部署 OneAPI**
   ```bash
   docker run -d \
     --name one-api \
     -p 3000:3000 \
     -e TZ=Asia/Shanghai \
     -v /home/ubuntu/data/one-api:/data \
     justsong/one-api
   ```

3. **配置渠道**
   - 访问 `http://服务器IP:3000`
   - 注册管理员账号
   - 添加渠道：选择 OpenAI/Claude/DashScope
   - 填入对应 API Key

4. **创建令牌**
   - 在「令牌」页面创建新令牌
   - 复制令牌作为 JobMate AI 的 API Key

5. **JobMate 配置**
   - 选择「自定义 OpenAI 兼容接口」
   - baseUrl: `http://服务器IP:3000`
   - model: `gpt-4` 或其他
   - apiKey: OneAPI 令牌

---

### 方案二：Cloudflare Workers 中转

**Worker 代码**:

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const targetUrl = 'https://api.openai.com' + url.pathname + url.search;
    
    const modifiedRequest = new Request(targetUrl, {
      method: request.method,
      headers: {
        ...request.headers,
        'Authorization': request.headers.get('Authorization'),
      },
      body: request.body,
    });
    
    return await fetch(modifiedRequest);
  }
};
```

---

### 方案三：浏览器 CORS 插件（仅测试）

1. 安装插件
   - Chrome: CORS Unblock
   - Firefox: CORS Everywhere

2. 开启插件（注意：会降低浏览器安全性）

3. 配置 JobMate AI

---

## 性能优化

### 请求优化

1. **超时设置**
   - 简单请求：30秒
   - 复杂分析：60秒
   - 简历优化：90秒

2. **重试机制**
   - 网络错误：重试 2 次
   - 429 错误：等待 1 秒后重试
   - 5xx 错误：不重试

3. **缓存策略**
   - 相同 JD 分析结果缓存 5 分钟
   - 相同公司面试准备缓存 1 小时

### Token 优化

| 功能 | 预估 Token | 优化建议 |
|------|-----------|---------|
| 简历分析 | 2000-5000 | 限制简历长度，分段处理 |
| JD 分析 | 3000-8000 | 截取关键部分 |
| 面试准备 | 4000-10000 | 控制返回题目数量 |

---

## 调试技巧

### 1. 网络请求查看

Chrome DevTools → Network → 筛选 Fetch/XHR

查看:
- 请求 URL
- 请求 Headers（Authorization 是否正确）
- 请求 Body
- 响应状态码
- 响应内容

### 2. 控制台日志

```typescript
// 开启调试日志
console.log('AI Request:', { provider, model, promptLength: prompt.length });
console.log('AI Response:', response);
console.log('Parsed Result:', result);
```

### 3. API 测试工具

使用 curl 或 Postman 直接测试 API：

```bash
curl -X POST https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

---

## 安全注意事项

### API Key 保护

1. **前端存储**
   - 使用 LocalStorage，非 Cookie
   - 不涉及后端传输
   - 提供「清除配置」功能

2. **Key 泄露处理**
   - 立即在提供商后台禁用该 Key
   - 生成新 Key
   - 在 JobMate 中重新配置

3. **权限控制**
   - 使用只读 Key（如提供商支持）
   - 限制 IP 白名单（如提供商支持）

---

## 附录

### 完整配置示例

#### 阿里云 DashScope

```json
{
  "provider": "dashscope",
  "apiKey": "sk-1234567890abcdef",
  "model": "qwen-turbo"
}
```

#### OneAPI 中转

```json
{
  "provider": "custom",
  "apiKey": "sk-oneapi-token-here",
  "model": "gpt-4",
  "baseUrl": "https://oneapi.example.com"
}
```

#### OpenAI 代理

```json
{
  "provider": "openai",
  "apiKey": "sk-openai-key-here",
  "model": "gpt-4",
  "baseUrl": "https://proxy.example.com/v1"
}
```

---

### 相关链接

- [OpenAI API 文档](https://platform.openai.com/docs)
- [DashScope 文档](https://help.aliyun.com/document_detail/611411.html)
- [OneAPI GitHub](https://github.com/songquanpeng/one-api)
- [New API GitHub](https://github.com/Calcium-Ion/new-api)

---

*文档版本: v1.0*  
*最后更新: 2026年5月10日*
