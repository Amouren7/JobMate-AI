// AI 服务提供商类型
export type AIProvider = 'dashscope' | 'openai' | 'claude' | 'custom';

// AI 服务配置
export interface AIServiceConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
  baseUrl?: string;
  customProviderName?: string; // 自定义服务商名称
}

// 提供商信息
export interface ProviderInfo {
  id: AIProvider;
  name: string;
  description: string;
  models: string[];
  defaultModel: string;
  docsUrl: string;
  keyPlaceholder: string;
  baseUrl: string;
  supportCustomModel: boolean; // 是否支持自定义模型输入
}

// 提供商配置
export const PROVIDER_CONFIG: Record<AIProvider, ProviderInfo> = {
  dashscope: {
    id: 'dashscope',
    name: '阿里云 DashScope',
    description: '通义千问系列，国内访问稳定，有免费额度',
    models: ['qwen-turbo', 'qwen-plus', 'qwen-max'],
    defaultModel: 'qwen-turbo',
    docsUrl: 'https://dashscope.aliyun.com/',
    keyPlaceholder: 'sk-xxxxxxxxxxxxxxxx',
    baseUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    supportCustomModel: false,
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT 系列，国际领先，需要海外网络',
    models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o'],
    defaultModel: 'gpt-3.5-turbo',
    docsUrl: 'https://platform.openai.com/',
    keyPlaceholder: 'sk-xxxxxxxxxxxxxxxx',
    baseUrl: 'https://api.openai.com/v1/chat/completions',
    supportCustomModel: true,
  },
  claude: {
    id: 'claude',
    name: 'Anthropic Claude',
    description: 'Claude 系列，代码和推理能力强',
    models: ['claude-3-haiku', 'claude-3-sonnet', 'claude-3-opus'],
    defaultModel: 'claude-3-haiku',
    docsUrl: 'https://console.anthropic.com/',
    keyPlaceholder: 'sk-ant-xxxxx',
    baseUrl: 'https://api.anthropic.com/v1/messages',
    supportCustomModel: false,
  },
  custom: {
    id: 'custom',
    name: '自定义 OpenAI 兼容接口',
    description: '支持任何兼容 OpenAI 接口格式的服务商，如 OneAPI、New API 等',
    models: [], // 自定义，不预填
    defaultModel: '',
    docsUrl: 'https://github.com/songquanpeng/one-api',
    keyPlaceholder: 'sk-xxxxxxxxxxxxxxxx',
    baseUrl: '', // 用户自行填写
    supportCustomModel: true,
  },
};

// LocalStorage 键名
export const STORAGE_KEY = 'jobmate_ai_config';

// 保存配置到 LocalStorage
export function saveConfig(config: AIServiceConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

// 从 LocalStorage 读取配置
export function loadConfig(): AIServiceConfig | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

// 清除配置
export function clearConfig(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// 检查是否已配置
export function isConfigured(): boolean {
  const config = loadConfig();
  return config !== null && config.apiKey.length > 0;
}
