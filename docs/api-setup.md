# JobMate AI - DashScope API 配置指南

## 快速配置（推荐）

现在可以直接在浏览器中配置 API，无需修改 `.env` 文件。

### 1. 获取 API Key

1. 访问阿里云百炼控制台：https://bailian.console.aliyun.com/
2. 登录阿里云账号
3. 点击「API-KEY管理」→「创建新的API-KEY」
4. 复制生成的 Key（格式如：`sk-xxxxxxxxxxxxxxxx`）

### 2. 在浏览器中配置

1. 启动项目：`npm run dev`
2. 打开网站：`http://localhost:5173/`
3. 点击左侧菜单「**设置**」
4. 粘贴 API Key 到输入框
5. 选择模型（推荐 `qwen-plus`）
6. 点击「**测试连接**」验证 API 是否正常
7. 点击「**保存配置**」
8. **刷新页面**后配置生效

### 3. 验证配置成功

- 进入「简历优化」页面
- 点击「使用示例数据体验」
- 如果看到 AI 分析结果（而非预置的 Mock 数据），则配置成功

---

## 支持的模型

| 模型 | 特点 | 价格 | 推荐度 |
|------|------|------|--------|
| qwen-turbo | 速度最快，成本低 | ¥0.5/千tokens | ⭐⭐⭐ |
| qwen-plus | 性能均衡 | ¥2/千tokens | ⭐⭐⭐⭐⭐ |
| qwen-max | 效果最好 | ¥20/千tokens | ⭐⭐⭐⭐ |

**推荐使用 qwen-plus**，性价比较高。

---

## 高级配置（可选）

### 环境变量配置

如需设置默认配置（新项目或演示时使用），可创建 `.env` 文件：

```bash
# 复制示例文件
cp .env.example .env

# 编辑 .env 填入配置
VITE_DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_DASHSCOPE_MODEL=qwen-plus
```

**优先级说明**：
- 网页配置（localStorage）> 环境变量（.env）
- 如果网页中已配置，环境变量不会生效

### 清除配置

在设置页面点击「**清除配置**」按钮，会删除浏览器中保存的 API Key 和模型设置。

---

## 常见问题

### Q: 提示"未配置 DashScope API Key"？

A: 请检查：
1. 是否已在设置页面填入 API Key
2. 填入后是否点击了「保存配置」
3. 是否刷新了页面
4. API Key 格式是否正确（以 `sk-` 开头）

### Q: 测试连接失败？

A: 可能原因：
1. API Key 无效或已过期 → 到阿里云控制台检查
2. 账户余额不足 → 阿里云百炼需要充值
3. 网络问题 → 检查网络连接
4. 模型名称错误 → 使用 qwen-turbo / qwen-plus / qwen-max

### Q: 如何更换 API Key？

A: 在设置页面：
1. 清除旧配置
2. 填入新的 API Key
3. 保存并刷新页面

### Q: 配置保存在哪里？

A: 
- **网页配置**：浏览器 localStorage（仅本浏览器可见）
- **环境变量**：`.env` 文件（代码仓库中，适合默认配置）

### Q: API Key 会泄露吗？

A: 不会：
- 配置仅保存在浏览器本地
- 不会上传到任何服务器
- 请求直接发送到阿里云 DashScope 服务

---

## 费用说明

阿里云百炼 DashScope 按 Token 计费：

| 模型 | 输入价格 | 输出价格 |
|------|----------|----------|
| qwen-turbo | ¥0.5/千tokens | ¥0.5/千tokens |
| qwen-plus | ¥2/千tokens | ¥2/千tokens |
| qwen-max | ¥20/千tokens | ¥20/千tokens |

**估算**：每次简历分析约消耗 500-1000 tokens，成本约 ¥0.5-2

---

## 获取帮助

- 阿里云百炼文档：https://help.aliyun.com/document_detail/2587504.html
- API 调试控制台：https://bailian.console.aliyun.com/
- 计费说明：https://help.aliyun.com/document_detail/2589014.html
