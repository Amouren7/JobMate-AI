import type { AIServiceConfig } from '../types/ai';
import { loadConfig } from '../types/ai';

// 简历优化请求
export interface ResumeOptimizeRequest {
  resumeContent: string;
  targetPosition?: string;
}

// 简历优化响应
export interface ResumeOptimizeResponse {
  originalScore: number;
  optimizedScore: number;
  issues: string[];
  suggestions: string[];
  optimizedContent?: string;
}

// JD 分析请求
export interface JDAnalyzeRequest {
  jdContent: string;
  resumeSummary?: string;
}

// JD 分析响应
export interface JDAnalyzeResponse {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  salaryRange?: string;
}

// 面试准备请求
export interface InterviewPrepRequest {
  companyName: string;
  position?: string;
}

// 面试准备响应
export interface InterviewPrepResponse {
  companyInfo: {
    name: string;
    industry: string;
    stage: string;
    size: string;
    culture: string[];
    highlights: string[];
  };
  difficulty: string;
  predictedQuestions: {
    type: 'technical' | 'behavioral' | 'situational';
    question: string;
    suggestedAnswer?: string;
  }[];
}

// AI 响应结构
interface AIResponse {
  content: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

// 基础 AI 调用函数
async function callAI(prompt: string, config: AIServiceConfig): Promise<AIResponse> {
  const { provider, apiKey, model, baseUrl } = config;

  switch (provider) {
    case 'dashscope':
      return callDashScope(prompt, apiKey, model);
    case 'openai':
      return callOpenAI(prompt, apiKey, model, baseUrl);
    case 'claude':
      return callClaude(prompt, apiKey, model);
    case 'custom':
      return callCustomOpenAI(prompt, apiKey, model, baseUrl);
    default:
      throw new Error(`未知的 AI 提供商: ${provider}`);
  }
}

// 阿里云 DashScope 调用
async function callDashScope(prompt: string, apiKey: string, model?: string): Promise<AIResponse> {
  try {
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'qwen-turbo',
        input: {
          messages: [
            { role: 'system', content: '你是一个专业的求职助手，擅长简历优化、职位分析和面试辅导。' },
            { role: 'user', content: prompt },
          ],
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `DashScope API 错误 (${response.status})`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error?.message || errorText;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return {
      content: data.output?.text || data.output?.choices?.[0]?.message?.content || '',
      usage: data.usage,
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('网络请求失败，可能是 CORS 限制。请使用中转服务或代理。');
    }
    throw error;
  }
}

// OpenAI 调用
async function callOpenAI(prompt: string, apiKey: string, model?: string, customBaseUrl?: string): Promise<AIResponse> {
  const url = customBaseUrl?.trim() || 'https://api.openai.com/v1/chat/completions';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: '你是一个专业的求职助手，擅长简历优化、职位分析和面试辅导。' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `OpenAI API 错误 (${response.status})`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorJson.message || errorText;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return {
      content: data.choices?.[0]?.message?.content || '',
      usage: data.usage,
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('网络请求失败，可能是 CORS 限制。请使用中转服务或代理。');
    }
    throw error;
  }
}

// 自定义 OpenAI 兼容接口调用
async function callCustomOpenAI(prompt: string, apiKey: string, model?: string, baseUrl?: string): Promise<AIResponse> {
  if (!baseUrl?.trim()) {
    throw new Error('自定义接口需要配置 API 地址');
  }

  // 处理 URL，支持用户输入多种格式
  let url = baseUrl.trim();
  // 如果用户没有输入 http:// 或 https://，默认添加 https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  // 确保 URL 以 /v1/chat/completions 结尾
  if (!url.endsWith('/v1/chat/completions')) {
    url = url.endsWith('/') ? `${url}v1/chat/completions` : `${url}/v1/chat/completions`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: '你是一个专业的求职助手，擅长简历优化、职位分析和面试辅导。' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
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

    const data = await response.json();
    return {
      content: data.choices?.[0]?.message?.content || '',
      usage: data.usage,
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('网络请求失败，请检查 API 地址是否正确，以及是否支持跨域访问。');
    }
    throw error;
  }
}

// Claude 调用
async function callClaude(prompt: string, apiKey: string, model?: string): Promise<AIResponse> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model || 'claude-3-haiku-20240307',
        max_tokens: 4096,
        messages: [
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Claude API 错误 (${response.status})`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorJson.message || errorText;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return {
      content: data.content?.[0]?.text || '',
      usage: data.usage,
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('网络请求失败，可能是 CORS 限制。请使用中转服务或代理。');
    }
    throw error;
  }
}

// 简历优化服务
export async function optimizeResume(request: ResumeOptimizeRequest): Promise<ResumeOptimizeResponse> {
  const config = loadConfig();
  if (!config) {
    throw new Error('请先配置 AI API');
  }

  const prompt = `请分析以下简历，并提供优化建议。

目标职位：${request.targetPosition || '未指定'}

简历内容：
${request.resumeContent}

请按以下 JSON 格式返回分析结果：
{
  "originalScore": 评分(1-100),
  "optimizedScore": 优化后预估评分(1-100),
  "issues": ["问题1", "问题2", ...],
  "suggestions": ["建议1", "建议2", ...],
  "optimizedContent": "优化后的简历内容（可选）"
}

注意：仅返回 JSON 数据，不要添加任何其他说明文字。`;

  const response = await callAI(prompt, config);

  try {
    // 尝试解析 JSON 响应
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as ResumeOptimizeResponse;
    }
    throw new Error('返回格式不正确');
  } catch (error) {
    console.error('解析 AI 响应失败:', error);
    throw new Error('AI 返回格式错误，请重试');
  }
}

// JD 分析服务
export async function analyzeJD(request: JDAnalyzeRequest): Promise<JDAnalyzeResponse> {
  const config = loadConfig();
  if (!config) {
    throw new Error('请先配置 AI API');
  }

  const prompt = `请分析以下职位描述(JD)，并与候选人简历进行匹配分析。

职位描述：
${request.jdContent}

候选人简历摘要：
${request.resumeSummary || '未提供'}

请按以下 JSON 格式返回分析结果：
{
  "matchScore": 匹配度分数(0-100),
  "matchingSkills": ["已具备技能1", "已具备技能2", ...],
  "missingSkills": ["缺失技能1", "缺失技能2", ...],
  "suggestions": ["投递建议1", "投递建议2", ...],
  "salaryRange": "薪资范围（如有）"
}

注意：仅返回 JSON 数据，不要添加任何其他说明文字。`;

  const response = await callAI(prompt, config);

  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as JDAnalyzeResponse;
    }
    throw new Error('返回格式不正确');
  } catch (error) {
    console.error('解析 AI 响应失败:', error);
    throw new Error('AI 返回格式错误，请重试');
  }
}

// 面试准备服务
export async function prepareInterview(request: InterviewPrepRequest): Promise<InterviewPrepResponse> {
  const config = loadConfig();
  if (!config) {
    throw new Error('请先配置 AI API');
  }

  const prompt = `请为以下公司生成面试准备资料。

公司名称：${request.companyName}
目标职位：${request.position || '技术岗位'}

请按以下 JSON 格式返回分析结果：
{
  "companyInfo": {
    "name": "公司名",
    "industry": "行业",
    "stage": "发展阶段",
    "size": "公司规模",
    "culture": ["文化特点1", "文化特点2", ...],
    "highlights": ["亮点1", "亮点2", ...]
  },
  "difficulty": "面试难度（简单/中等/困难）",
  "predictedQuestions": [
    {
      "type": "technical|behavioral|situational",
      "question": "问题内容",
      "suggestedAnswer": "参考回答思路"
    },
    ...
  ]
}

请生成 5-6 道预测面试题，涵盖技术题、行为题和情景题。
注意：仅返回 JSON 数据，不要添加任何其他说明文字。`;

  const response = await callAI(prompt, config);

  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as InterviewPrepResponse;
    }
    throw new Error('返回格式不正确');
  } catch (error) {
    console.error('解析 AI 响应失败:', error);
    throw new Error('AI 返回格式错误，请重试');
  }
}

// 测试 API 连接
export async function testAIConnection(config: AIServiceConfig): Promise<{ success: boolean; message: string }> {
  try {
    const prompt = '你好，请回复"连接成功"';
    const response = await callAI(prompt, config);
    const content = response.content.trim();
    if (content.includes('成功') || content.length > 0) {
      return { success: true, message: '连接成功！AI 服务可用。' };
    }
    return { success: false, message: '连接异常：未收到有效响应' };
  } catch (error) {
    console.error('API 连接测试失败:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return { success: false, message: `连接失败：${errorMessage}` };
  }
}
