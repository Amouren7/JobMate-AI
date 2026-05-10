import { useState } from 'react';
import {
  Input,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Divider,
  Collapse,
  Avatar,
  Badge,
  Spin,
  Alert,
  Empty,
} from 'antd';
import {
  SearchOutlined,
  QuestionCircleOutlined,
  BankOutlined,
  TeamOutlined,
  StarOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { prepareInterview, type InterviewPrepResponse } from '../../services/ai';
import { isConfigured } from '../../types/ai';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

function InterviewPrep() {
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [result, setResult] = useState<InterviewPrepResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const configured = isConfigured();

  const handleGenerate = async () => {
    if (!companyName.trim()) {
      setError('请输入公司名称');
      return;
    }

    if (!configured) {
      setError('请先完成 AI 服务配置');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await prepareInterview({
        companyName: companyName.trim(),
        position: position.trim() || undefined,
      });
      setResult(response);
      setGenerated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>
        <RobotOutlined style={{ marginRight: 12 }} />
        面试准备工坊
      </Title>
      <Paragraph type="secondary">
        输入目标公司，AI将生成公司情报报告和面试题目预测，助你提前准备
      </Paragraph>

      {!configured && (
        <Alert
          message="AI 服务未配置"
          description="请先前往「AI设置」页面配置 API 密钥，以使用智能面试准备功能"
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {error && (
        <Alert
          message="错误"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 24 }}
        />
      )}

      <Row gutter={24}>
        <Col span={8}>
          <Card title="目标公司" style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">公司名称</Text>
              <Input
                placeholder="请输入公司名称，例如：字节跳动"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                prefix={<BankOutlined />}
                size="large"
                style={{ marginTop: 8 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">目标职位（选填）</Text>
              <Input
                placeholder="例如：前端开发工程师"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                size="large"
                style={{ marginTop: 8 }}
              />
            </div>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleGenerate}
              loading={loading}
              disabled={!companyName.trim()}
              style={{ width: '100%' }}
              size="large"
            >
              {loading ? 'AI 生成中...' : '生成 AI 情报报告'}
            </Button>
          </Card>

          {generated && result && (
            <Card className="fade-in">
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Avatar
                  size={80}
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  {result.companyInfo.name.charAt(0)}
                </Avatar>
                <Title level={4} style={{ marginTop: 16, marginBottom: 8 }}>
                  {result.companyInfo.name}
                </Title>
                <Tag color="blue">{result.companyInfo.industry}</Tag>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text type="secondary">公司规模</Text>
                  <br />
                  <Text strong>{result.companyInfo.size}</Text>
                </div>
                <div>
                  <Text type="secondary">发展阶段</Text>
                  <br />
                  <Text strong>{result.companyInfo.stage}</Text>
                </div>
                <div>
                  <Text type="secondary">面试难度</Text>
                  <br />
                  <Tag color={
                    result.difficulty === '困难' ? 'red' :
                    result.difficulty === '中等' ? 'orange' : 'green'
                  }>
                    {result.difficulty}
                  </Tag>
                </div>
              </Space>
            </Card>
          )}
        </Col>

        <Col span={16}>
          {generated && result ? (
            <Spin spinning={loading}>
              {/* 公司亮点 */}
              <Card title="公司亮点" style={{ marginBottom: 24 }} className="fade-in">
                <Row gutter={16}>
                  {result.companyInfo.highlights.map((highlight, index) => (
                    <Col span={6} key={index}>
                      <Card
                        size="small"
                        style={{
                          textAlign: 'center',
                          background: index % 2 === 0 ? '#f6ffed' : '#e6f7ff',
                          border: 'none',
                        }}
                      >
                        <StarOutlined
                          style={{
                            fontSize: 24,
                            color: index % 2 === 0 ? '#52c41a' : '#1890ff',
                            marginBottom: 8,
                          }}
                        />
                        <Text strong>{highlight}</Text>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>

              {/* 企业文化 */}
              <Card title="企业文化" style={{ marginBottom: 24 }}>
                <Space wrap>
                  {result.companyInfo.culture.map((item, index) => (
                    <Tag key={index} color="purple" style={{ padding: '4px 12px' }}>
                      {item}
                    </Tag>
                  ))}
                </Space>
              </Card>

              {/* 预测面试题 */}
              <Card
                title={
                  <Space>
                    <QuestionCircleOutlined />
                    <span>AI 预测面试题目</span>
                    <Badge count={result.predictedQuestions.length} style={{ backgroundColor: '#52c41a' }} />
                  </Space>
                }
              >
                <Collapse defaultActiveKey={['0']}>
                  {result.predictedQuestions.map((item, index) => (
                    <Panel
                      header={
                        <Space>
                          <Tag
                            color={
                              item.type === 'technical'
                                ? 'blue'
                                : item.type === 'behavioral'
                                ? 'green'
                                : 'orange'
                            }
                          >
                            {item.type === 'technical'
                              ? '技术题'
                              : item.type === 'behavioral'
                              ? '行为题'
                              : '情景题'}
                          </Tag>
                          <Text strong>Q{index + 1}:</Text>
                          <Text>{item.question}</Text>
                        </Space>
                      }
                      key={index}
                    >
                      <div style={{ background: '#f6ffed', padding: 16, borderRadius: 8 }}>
                        <Text strong style={{ color: '#52c41a', display: 'block', marginBottom: 8 }}>
                          参考回答思路：
                        </Text>
                        <Paragraph style={{ margin: 0 }}>{item.suggestedAnswer}</Paragraph>
                      </div>
                    </Panel>
                  ))}
                </Collapse>

                <Divider />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text type="secondary">
                    <TeamOutlined /> 基于 AI 生成的面试预测
                  </Text>
                  <Button type="primary">导出面试准备清单</Button>
                </div>
              </Card>
            </Spin>
          ) : (
            <Card>
              <Empty
                description="请输入公司名称并点击生成按钮，获取 AI 面试情报"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default InterviewPrep;
