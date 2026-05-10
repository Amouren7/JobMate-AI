import { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Select,
  Input,
  Button,
  Alert,
  Space,
  Typography,
  Tag,
  Divider,
  message,
  Row,
  Col,
} from 'antd';
import {
  SettingOutlined,
  KeyOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ApiOutlined,
  LinkOutlined,
  GlobalOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import {
  PROVIDER_CONFIG,
  saveConfig,
  loadConfig,
  clearConfig,
  type AIProvider,
} from '../../types/ai';
import { testAIConnection } from '../../services/ai';

const { Title, Text, Paragraph } = Typography;

function Settings() {
  const [form] = Form.useForm();
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('dashscope');
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [savedConfig, setSavedConfig] = useState(loadConfig());
  const [useCustomModel, setUseCustomModel] = useState(false);

  // 加载已保存的配置
  useEffect(() => {
    const config = loadConfig();
    if (config) {
      setSelectedProvider(config.provider);
      setUseCustomModel(!!config.model && !PROVIDER_CONFIG[config.provider].models.includes(config.model));
      form.setFieldsValue({
        provider: config.provider,
        apiKey: config.apiKey,
        model: config.model || PROVIDER_CONFIG[config.provider].defaultModel,
        baseUrl: config.baseUrl || '',
        customModel: config.model && !PROVIDER_CONFIG[config.provider].models.includes(config.model) ? config.model : '',
      });
      setConfigured(true);
      setSavedConfig(config);
    }
  }, [form]);

  // 切换提供商
  const handleProviderChange = (value: AIProvider) => {
    setSelectedProvider(value);
    setUseCustomModel(false);
    const provider = PROVIDER_CONFIG[value];
    // 重置模型
    form.setFieldValue('model', provider.defaultModel);
    form.setFieldValue('customModel', '');
    // 如果是自定义接口，清空 baseUrl
    if (value === 'custom') {
      form.setFieldValue('baseUrl', '');
    }
  };

  // 保存配置
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const provider = values.provider as AIProvider;
      const providerConfig = PROVIDER_CONFIG[provider];

      // 确定最终使用的模型
      let finalModel = values.model;
      if (providerConfig.supportCustomModel && values.customModel) {
        finalModel = values.customModel;
      }

      const config = {
        provider: values.provider,
        apiKey: values.apiKey.trim(),
        model: finalModel,
        baseUrl: values.baseUrl?.trim() || undefined,
      };

      // 先测试连接
      setTesting(true);
      const testResult = await testAIConnection(config);
      setTesting(false);

      if (testResult.success) {
        saveConfig(config);
        setConfigured(true);
        setSavedConfig(config);
        message.success(testResult.message);
      } else {
        message.error(testResult.message);
      }
    } catch (error) {
      console.error('保存配置失败:', error);
      message.error('配置保存失败：' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  // 清除配置
  const handleClear = () => {
    clearConfig();
    form.resetFields();
    setConfigured(false);
    setSavedConfig(null);
    setUseCustomModel(false);
    setSelectedProvider('dashscope');
    message.success('配置已清除');
  };

  // 切换自定义模型
  const handleModelModeChange = (custom: boolean) => {
    setUseCustomModel(custom);
    if (!custom) {
      // 切回预设模型
      form.setFieldValue('model', PROVIDER_CONFIG[selectedProvider].defaultModel);
      form.setFieldValue('customModel', '');
    }
  };

  const provider = PROVIDER_CONFIG[selectedProvider];

  return (
    <div>
      <Title level={2}>
        <SettingOutlined style={{ marginRight: 12 }} />
        AI 服务配置
      </Title>
      <Paragraph type="secondary">
        配置 AI 服务提供商和 API Key，启用智能简历优化、JD 分析和面试准备功能
      </Paragraph>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card title="API 配置" style={{ marginBottom: 24 }}>
            {configured && (
              <Alert
                message="已配置 AI 服务"
                description={`当前使用：${PROVIDER_CONFIG[savedConfig?.provider || 'dashscope'].name}`}
                type="success"
                showIcon
                icon={<CheckCircleOutlined />}
                style={{ marginBottom: 24 }}
                action={
                  <Button size="small" danger onClick={handleClear}>
                    清除配置
                  </Button>
                }
              />
            )}

            <Form
              form={form}
              layout="vertical"
              initialValues={{
                provider: 'dashscope',
                model: PROVIDER_CONFIG.dashscope.defaultModel,
              }}
            >
              <Form.Item
                name="provider"
                label="AI 服务提供商"
                rules={[{ required: true, message: '请选择 AI 服务提供商' }]}
              >
                <Select onChange={handleProviderChange}>
                  {Object.values(PROVIDER_CONFIG).map((p) => (
                    <Select.Option key={p.id} value={p.id}>
                      <Space>
                        <ApiOutlined />
                        {p.name}
                      </Space>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Alert
                message={provider.name}
                description={provider.description}
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
                action={
                  <Button
                    size="small"
                    type="link"
                    href={provider.docsUrl}
                    target="_blank"
                    icon={<LinkOutlined />}
                  >
                    获取 API Key
                  </Button>
                }
              />

              {/* 自定义接口地址（仅自定义模式显示） */}
              {selectedProvider === 'custom' && (
                <Form.Item
                  name="baseUrl"
                  label="API 接口地址"
                  rules={[{ required: true, message: '请输入 API 接口地址' }]}
                  extra={
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      支持 OpenAI 兼容格式的 API 地址，例如：https://api.openai.com 或 https://your-api-server.com
                    </Text>
                  }
                >
                  <Input
                    prefix={<GlobalOutlined />}
                    placeholder="https://api.example.com"
                    size="large"
                  />
                </Form.Item>
              )}

              <Form.Item
                name="apiKey"
                label="API Key"
                rules={[{ required: true, message: '请输入 API Key' }]}
                extra={
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    您的 API Key 仅存储在浏览器本地，不会发送到任何第三方服务器
                  </Text>
                }
              >
                <Input.Password
                  prefix={<KeyOutlined />}
                  placeholder={provider.keyPlaceholder}
                  size="large"
                />
              </Form.Item>

              {/* 模型选择 */}
              <Form.Item label="模型选择">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {/* 预设模型 / 自定义模型 切换 */}
                  {provider.supportCustomModel && (
                    <Space>
                      <Button
                        type={!useCustomModel ? 'primary' : 'default'}
                        size="small"
                        onClick={() => handleModelModeChange(false)}
                      >
                        选择预设模型
                      </Button>
                      <Button
                        type={useCustomModel ? 'primary' : 'default'}
                        size="small"
                        onClick={() => handleModelModeChange(true)}
                      >
                        自定义模型
                      </Button>
                    </Space>
                  )}

                  {/* 预设模型下拉框 */}
                  {!useCustomModel && provider.models.length > 0 && (
                    <Form.Item
                      name="model"
                      noStyle
                      rules={[{ required: true, message: '请选择模型' }]}
                    >
                      <Select style={{ width: '100%' }}>
                        {provider.models.map((model: string) => (
                          <Select.Option key={model} value={model}>
                            {model}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}

                  {/* 自定义模型输入 */}
                  {(useCustomModel || provider.models.length === 0) && (
                    <Form.Item
                      name="customModel"
                      noStyle
                      rules={[{ required: true, message: '请输入模型名称' }]}
                    >
                      <Input
                        prefix={<RobotOutlined />}
                        placeholder="输入模型名称，例如：gpt-4、claude-3-opus-20240229"
                        size="large"
                      />
                    </Form.Item>
                  )}
                </Space>
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleSave}
                    loading={loading || testing}
                    icon={<CheckCircleOutlined />}
                  >
                    {testing ? '测试中...' : '保存并测试'}
                  </Button>
                  {configured && (
                    <Button size="large" onClick={handleClear} danger>
                      清除配置
                    </Button>
                  )}
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="配置说明" style={{ marginBottom: 24 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text strong>1. 选择提供商</Text>
                <br />
                <Text type="secondary">
                  支持阿里云 DashScope、OpenAI、Claude 或自定义接口
                </Text>
              </div>

              <Divider />

              <div>
                <Text strong>2. 自定义接口模式</Text>
                <br />
                <Text type="secondary">
                  选择「自定义 OpenAI 兼容接口」，可接入 OneAPI、New API 等中转服务
                </Text>
              </div>

              <Divider />

              <div>
                <Text strong>3. 获取 API Key</Text>
                <br />
                <Text type="secondary">
                  点击上方「获取 API Key」跳转到对应平台申请
                </Text>
              </div>

              <Divider />

              <div>
                <Text strong>4. 模型选择</Text>
                <br />
                <Text type="secondary">
                  可使用预设模型或自定义输入任意模型名称
                </Text>
              </div>

              <Divider />

              <Alert
                message="⚠️ 连接问题提示"
                description={
                  <div>
                    <Text type="secondary">
                      由于浏览器安全限制（CORS），直接访问 OpenAI/Claude 等海外 API 可能会失败。
                    </Text>
                    <br />
                    <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
                      <strong>解决方案：</strong>
                    </Text>
                    <ul style={{ margin: '8px 0', paddingLeft: 16 }}>
                      <li>
                        <Text type="secondary">使用「自定义接口」接入 OneAPI/New API 等中转服务</Text>
                      </li>
                      <li>
                        <Text type="secondary">使用阿里云 DashScope（国内稳定访问）</Text>
                      </li>
                      <li>
                        <Text type="secondary">配置浏览器 CORS 插件（仅限本地测试）</Text>
                      </li>
                    </ul>
                  </div>
                }
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Alert
                message="隐私说明"
                description="API Key 仅保存在您的浏览器本地存储中，不会上传至任何服务器"
                type="warning"
                showIcon
                icon={<ExclamationCircleOutlined />}
              />
            </Space>
          </Card>

          <Card title="支持的提供商">
            <Space direction="vertical" style={{ width: '100%' }}>
              {Object.values(PROVIDER_CONFIG).map((p) => (
                <div key={p.id}>
                  <Tag color={p.id === selectedProvider ? 'blue' : 'default'}>
                    {p.name}
                  </Tag>
                  <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                    {p.supportCustomModel ? '支持自定义模型' : `${p.models.length} 个预设模型`}
                  </Text>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Settings;
