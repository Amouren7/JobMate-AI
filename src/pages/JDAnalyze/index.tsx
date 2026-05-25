import { useState } from 'react';
import {
  Input,
  Button,
  Card,
  Progress,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Divider,
  List,
  Spin,
  Alert,
  Modal,
  Radio,
  message,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  FileSearchOutlined,
  RobotOutlined,
  SendOutlined,
  PlusOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { analyzeJD, generateCoverLetter, type JDAnalyzeResponse, type CoverLetterResponse } from '../../services/ai';
import { isConfigured } from '../../types/ai';
import { addApplication } from '../../types/application';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

function JDAnalyze() {
  const [jdContent, setJdContent] = useState('');
  const [resumeSummary, setResumeSummary] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [result, setResult] = useState<JDAnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 求职信状态
  const [coverLetterModalOpen, setCoverLetterModalOpen] = useState(false);
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [coverLetterResult, setCoverLetterResult] = useState<CoverLetterResponse | null>(null);
  const [letterTone, setLetterTone] = useState<'formal' | 'casual' | 'enthusiastic'>('formal');

  // 添加到投递状态
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const configured = isConfigured();

  const handleAnalyze = async () => {
    if (!jdContent.trim()) {
      setError('请输入职位描述内容');
      return;
    }

    if (!configured) {
      setError('请先完成 AI 服务配置');
      return;
    }

    setError(null);
    setAnalyzing(true);

    try {
      const response = await analyzeJD({
        jdContent,
        resumeSummary: resumeSummary || undefined,
      });
      setResult(response);
      setAnalyzed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析失败，请重试');
    } finally {
      setAnalyzing(false);
    }
  };

  // 生成求职信
  const handleGenerateCoverLetter = async () => {
    if (!companyName.trim() || !position.trim()) {
      message.warning('请先填写公司名称和职位');
      return;
    }
    if (!configured) {
      message.warning('请先配置 AI 服务');
      return;
    }

    setGeneratingLetter(true);
    setCoverLetterResult(null);
    try {
      const response = await generateCoverLetter({
        companyName,
        position,
        jdContent,
        resumeSummary,
        tone: letterTone,
      });
      setCoverLetterResult(response);
      message.success('求职信生成成功');
    } catch (err) {
      message.error(err instanceof Error ? err.message : '生成失败');
    } finally {
      setGeneratingLetter(false);
    }
  };

  // 添加到投递记录
  const handleAddToApplications = () => {
    addApplication({
      companyName,
      position,
      jdContent,
      matchScore: result?.matchScore,
      status: 'applied',
      applyDate: new Date().toISOString().split('T')[0],
    });
    message.success('已添加到投递记录');
    setAddModalOpen(false);
  };

  return (
    <div>
      <Title level={2}>
        <RobotOutlined style={{ marginRight: 12 }} />
        JD 智能分析
      </Title>
      <Paragraph type="secondary">
        粘贴职位描述(JD)，AI将分析你与岗位的匹配度，并给出技能提升建议
      </Paragraph>

      {!configured && (
        <Alert
          message="AI 服务未配置"
          description="请先前往「AI设置」页面配置 API 密钥，以使用智能分析功能"
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
        <Col span={12}>
          <Card title="职位描述输入" style={{ marginBottom: 24 }}>
            <TextArea
              placeholder="请粘贴完整的职位描述内容..."
              value={jdContent}
              onChange={(e) => setJdContent(e.target.value)}
              rows={6}
              style={{ resize: 'none', marginBottom: 16 }}
            />
            <Divider style={{ margin: '16px 0' }} />
            <Text type="secondary">你的简历摘要（可选，用于匹配分析）</Text>
            <TextArea
              placeholder="简述你的工作经验、技能栈等..."
              value={resumeSummary}
              onChange={(e) => setResumeSummary(e.target.value)}
              rows={3}
              style={{ resize: 'none', marginTop: 8 }}
            />
            <Divider style={{ margin: '16px 0' }} />
            <Row gutter={8}>
              <Col span={8}>
                <Input
                  placeholder="公司名称"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </Col>
              <Col span={8}>
                <Input
                  placeholder="职位名称"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />
              </Col>
              <Col span={8}>
                <Button
                  type="primary"
                  icon={<FileSearchOutlined />}
                  onClick={handleAnalyze}
                  loading={analyzing}
                  disabled={!jdContent.trim()}
                  style={{ width: '100%' }}
                >
                  {analyzing ? '分析中...' : '开始 AI 分析'}
                </Button>
              </Col>
            </Row>
          </Card>

          {/* AI智能工具卡片 */}
          {analyzed && result && (
            <Card title="AI智能工具" className="fade-in" style={{ marginTop: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="default"
                  icon={<MailOutlined />}
                  onClick={() => {
                    if (!companyName.trim() || !position.trim()) {
                      message.warning('请先填写公司名称和职位');
                      return;
                    }
                    setCoverLetterResult(null);
                    setCoverLetterModalOpen(true);
                  }}
                  block
                >
                  AI生成求职信
                </Button>
                <Button
                  type="default"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    if (!companyName.trim()) {
                      message.warning('请先填写公司名称');
                      return;
                    }
                    setAddModalOpen(true);
                  }}
                  block
                >
                  添加到投递记录
                </Button>
              </Space>
            </Card>
          )}
        </Col>

        <Col span={12}>
          {analyzed && result && (
            <Card title="AI 匹配分析结果" className="fade-in">
              <Spin spinning={analyzing}>
                {/* 匹配度评分 */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <Title level={4}>岗位匹配度</Title>
                  <Progress
                    type="circle"
                    percent={result.matchScore}
                    strokeColor={
                      result.matchScore >= 80
                        ? '#52c41a'
                        : result.matchScore >= 60
                        ? '#faad14'
                        : '#ff4d4f'
                    }
                    format={(percent) => (
                      <span style={{ fontSize: 28, fontWeight: 'bold' }}>{percent}%</span>
                    )}
                    width={140}
                  />
                  <Text
                    style={{
                      display: 'block',
                      marginTop: 16,
                      color:
                        result.matchScore >= 80
                          ? '#52c41a'
                          : result.matchScore >= 60
                          ? '#faad14'
                          : '#ff4d4f',
                      fontSize: 16,
                    }}
                  >
                    {result.matchScore >= 80
                      ? '匹配度优秀，建议投递'
                      : result.matchScore >= 60
                      ? '匹配度良好，可以尝试'
                      : '匹配度较低，建议提升技能'}
                  </Text>
                </div>

                <Divider />

                {/* 技能匹配 */}
                <Row gutter={24}>
                  <Col span={12}>
                    <Title level={5}>
                      <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                      已具备技能 ({result.matchingSkills.length})
                    </Title>
                    <Space direction="vertical" style={{ width: '100%', marginTop: 12 }}>
                      {result.matchingSkills.map((skill) => (
                        <Tag key={skill} color="success" style={{ margin: 0 }}>
                          {skill}
                        </Tag>
                      ))}
                    </Space>
                  </Col>

                  <Col span={12}>
                    <Title level={5}>
                      <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                      待提升技能 ({result.missingSkills.length})
                    </Title>
                    <Space direction="vertical" style={{ width: '100%', marginTop: 12 }}>
                      {result.missingSkills.map((skill) => (
                        <Tag key={skill} color="error" style={{ margin: 0 }}>
                          {skill}
                        </Tag>
                      ))}
                    </Space>
                  </Col>
                </Row>

                <Divider />

                {/* 建议 */}
                <Title level={5}>
                  <WarningOutlined style={{ color: '#faad14', marginRight: 8 }} />
                  投递建议
                </Title>
                <List
                  dataSource={result.suggestions}
                  renderItem={(item) => (
                    <List.Item>
                      <Text>{item}</Text>
                    </List.Item>
                  )}
                />

                {result.salaryRange && (
                  <>
                    <Divider />
                    <Row>
                      <Col span={24}>
                        <Title level={5}>薪资范围</Title>
                        <Space>
                          <Text>岗位薪资：</Text>
                          <Tag color="blue">{result.salaryRange}</Tag>
                        </Space>
                      </Col>
                    </Row>
                  </>
                )}
              </Spin>
            </Card>
          )}
        </Col>
      </Row>

      {/* 求职信弹窗 */}
      <Modal
        title="AI 求职信生成"
        open={coverLetterModalOpen}
        onCancel={() => setCoverLetterModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setCoverLetterModalOpen(false)}>
            关闭
          </Button>,
          <Button
            key="generate"
            type="primary"
            icon={<MailOutlined />}
            onClick={handleGenerateCoverLetter}
            loading={generatingLetter}
          >
            {generatingLetter ? '生成中...' : '生成求职信'}
          </Button>,
        ]}
        width={700}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>语气风格：</Text>
          <Radio.Group value={letterTone} onChange={(e) => setLetterTone(e.target.value)}>
            <Radio value="formal">正式专业</Radio>
            <Radio value="casual">轻松自然</Radio>
            <Radio value="enthusiastic">热情积极</Radio>
          </Radio.Group>
        </div>

        {coverLetterResult && (
          <div>
            <Divider>求职信内容</Divider>
            <div
              style={{
                background: '#fafafa',
                padding: 24,
                borderRadius: 8,
                whiteSpace: 'pre-wrap',
                maxHeight: 400,
                overflow: 'auto',
                lineHeight: 1.8,
              }}
            >
              {coverLetterResult.coverLetter}
            </div>
            <Divider>重点提示</Divider>
            <Space direction="vertical" style={{ width: '100%' }}>
              {coverLetterResult.keyPoints.map((point, i) => (
                <Tag key={i} color="blue" style={{ margin: 0 }}>{point}</Tag>
              ))}
            </Space>
            <Divider>投递建议</Divider>
            <Space direction="vertical" style={{ width: '100%' }}>
              {coverLetterResult.tips.map((tip, i) => (
                <Tag key={i} color="green" style={{ margin: 0 }}>{tip}</Tag>
              ))}
            </Space>
          </div>
        )}
      </Modal>

      {/* 添加到投递记录弹窗 */}
      <Modal
        title="添加到投递记录"
        open={addModalOpen}
        onOk={handleAddToApplications}
        onCancel={() => setAddModalOpen(false)}
      >
        <div style={{ marginTop: 16 }}>
          <Text>确认将以下投递添加到投递记录？</Text>
          <div style={{ marginTop: 12 }}>
            <Text strong>公司：</Text><Text>{companyName || '-'}</Text>
          </div>
          <div>
            <Text strong>职位：</Text><Text>{position || '-'}</Text>
          </div>
          {result && (
            <div>
              <Text strong>匹配度：</Text><Text>{result.matchScore}%</Text>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default JDAnalyze;
