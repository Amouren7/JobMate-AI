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
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  FileSearchOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { analyzeJD, type JDAnalyzeResponse } from '../../services/ai';
import { isConfigured } from '../../types/ai';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

function JDAnalyze() {
  const [jdContent, setJdContent] = useState('');
  const [resumeSummary, setResumeSummary] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [result, setResult] = useState<JDAnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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
              rows={10}
              style={{ resize: 'none', marginBottom: 16 }}
            />
            <Divider style={{ margin: '16px 0' }} />
            <Text type="secondary">你的简历摘要（可选，用于匹配分析）</Text>
            <TextArea
              placeholder="简述你的工作经验、技能栈等..."
              value={resumeSummary}
              onChange={(e) => setResumeSummary(e.target.value)}
              rows={4}
              style={{ resize: 'none', marginTop: 8 }}
            />
            <Button
              type="primary"
              icon={<FileSearchOutlined />}
              onClick={handleAnalyze}
              loading={analyzing}
              disabled={!jdContent.trim()}
              style={{ marginTop: 16, width: '100%' }}
              size="large"
            >
              {analyzing ? 'AI 分析中...' : '开始 AI 分析'}
            </Button>
          </Card>
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
    </div>
  );
}

export default JDAnalyze;
