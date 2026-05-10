import { useState } from 'react';
import {
  Upload,
  Button,
  Card,
  Progress,
  Result,
  Row,
  Col,
  Typography,
  Divider,
  Tag,
  Space,
  Input,
  Alert,
  message,
} from 'antd';
import {
  UploadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowRightOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { optimizeResume, type ResumeOptimizeResponse } from '../../services/ai';
import { isConfigured } from '../../types/ai';
import { AILoading } from '../../components/Loading';
import PageTransition, { CardAnimation } from '../../components/PageTransition';
import './style.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

function ResumeOptimize() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [resumeContent, setResumeContent] = useState('');
  const [targetPosition, setTargetPosition] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [optimized, setOptimized] = useState(false);
  const [result, setResult] = useState<ResumeOptimizeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const configured = isConfigured();

  // 读取文件内容
  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content || '');
      };
      reader.onerror = () => {
        reject(new Error('文件读取失败'));
      };
      reader.readAsText(file);
    });
  };

  // 处理文件上传变化
  const handleFileChange = async (info: { file: UploadFile; fileList: UploadFile[] }) => {
    const newFileList = info.fileList.slice(-1); // 只保留最后一个文件
    setFileList(newFileList);

    const file = newFileList[0]?.originFileObj;
    if (file) {
      try {
        // 尝试读取文本内容（仅适用于 txt、部分 csv/json 等文本文件）
        if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
          const content = await readFileContent(file);
          setResumeContent(content);
          message.success('文件内容已读取，请确认内容是否正确');
        } else if (file.name.endsWith('.pdf') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
          message.info('PDF/Word 文件需要手动复制内容到文本框');
        }
      } catch (err) {
        console.error('读取文件失败:', err);
      }
    }
  };

  const handleUpload = async () => {
    if (!resumeContent.trim()) {
      setError('请输入简历内容');
      return;
    }

    if (!configured) {
      setError('请先完成 AI 服务配置');
      return;
    }

    setError(null);
    setAnalyzing(true);

    try {
      const response = await optimizeResume({
        resumeContent,
        targetPosition: targetPosition || undefined,
      });
      setResult(response);
      setAnalyzed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析失败，请重试');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleOptimize = async () => {
    if (!configured) {
      setError('请先完成 AI 服务配置');
      return;
    }

    setAnalyzing(true);
    // 模拟优化延迟
    setTimeout(() => {
      setAnalyzing(false);
      setOptimized(true);
    }, 1500);
  };

  const handleRemoveFile = () => {
    setFileList([]);
    setAnalyzed(false);
    setOptimized(false);
    setResult(null);
  };

  // 判断是否可以点击分析按钮
  const canAnalyze = resumeContent.trim().length > 0 && !analyzing;

  return (
    <PageTransition animation="slide-up">
      <div>
        <Title level={2}>
          <RobotOutlined style={{ marginRight: 12 }} />
          简历智能优化
        </Title>
        <Paragraph type="secondary">
          上传你的简历，AI将分析并给出优化建议，提升简历竞争力
        </Paragraph>

        {!configured && (
          <Alert
            message="AI 服务未配置"
            description="请先前往「AI设置」页面配置 API 密钥，以使用智能优化功能"
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
            <CardAnimation animation="slide-up" index={0}>
              <Card title="简历内容" style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary">目标职位（选填）</Text>
                  <Input
                    placeholder="例如：前端开发工程师"
                    value={targetPosition}
                    onChange={(e) => setTargetPosition(e.target.value)}
                    style={{ marginTop: 8 }}
                  />
                </div>
                <Divider />
                <TextArea
                  placeholder="请粘贴您的简历内容，或直接在下方输入..."
                  value={resumeContent}
                  onChange={(e) => setResumeContent(e.target.value)}
                  rows={12}
                  style={{ resize: 'none' }}
                />
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <Upload.Dragger
                    name="file"
                    multiple={false}
                    fileList={fileList}
                    onChange={handleFileChange}
                    onRemove={handleRemoveFile}
                    beforeUpload={() => false}
                    accept=".txt,.pdf,.doc,.docx,.md"
                    style={{ marginBottom: 16 }}
                  >
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                    </p>
                    <p className="ant-upload-text">点击或拖拽文件上传</p>
                    <p className="ant-upload-hint">支持 TXT 文件直接读取，PDF/Word 请复制内容到上方文本框</p>
                  </Upload.Dragger>
                </div>

                <Button
                  type="primary"
                  onClick={handleUpload}
                  disabled={!canAnalyze}
                  loading={analyzing}
                  style={{ width: '100%' }}
                  size="large"
                  className="analyze-btn"
                >
                  {analyzing ? 'AI 分析中...' : '开始 AI 分析'}
                </Button>
              </Card>
            </CardAnimation>
          </Col>

          <Col span={12}>
            {analyzing && (
              <CardAnimation animation="fade" index={1}>
                <Card>
                  <AILoading tip="AI 正在深度分析您的简历，请稍候..." />
                </Card>
              </CardAnimation>
            )}

            {analyzed && result && !analyzing && (
              <CardAnimation animation="slide-up" index={2}>
                <Card title="AI 分析结果" className="result-card">
                  {!optimized ? (
                    <>
                      <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Title level={3}>简历评分</Title>
                        <Progress
                          type="circle"
                          percent={result.originalScore}
                          status={result.originalScore < 60 ? 'exception' : 'active'}
                          strokeColor={result.originalScore < 60 ? '#ff4d4f' : '#1890ff'}
                          format={(percent) => (
                            <span className="score-text">{percent}分</span>
                          )}
                          className="score-progress"
                        />
                        <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
                          {result.originalScore < 60 ? '匹配度偏低' : '匹配度一般'}
                        </Text>
                      </div>

                      <Divider />

                      <Title level={5}>问题诊断</Title>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        {result.issues.map((issue, index) => (
                          <CardAnimation key={index} animation="slide-left" index={index}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                              <CloseCircleOutlined style={{ color: '#ff4d4f', marginTop: 4 }} />
                              <Text>{issue}</Text>
                            </div>
                          </CardAnimation>
                        ))}
                      </Space>

                      <Divider />

                      <Title level={5}>改进建议</Title>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        {result.suggestions.map((suggestion, index) => (
                          <CardAnimation key={index} animation="slide-left" index={index + result.issues.length}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                              <CheckCircleOutlined style={{ color: '#52c41a', marginTop: 4 }} />
                              <Text>{suggestion}</Text>
                            </div>
                          </CardAnimation>
                        ))}
                      </Space>

                      <Button
                        type="primary"
                        size="large"
                        icon={<ArrowRightOutlined />}
                        onClick={handleOptimize}
                        style={{ marginTop: 24, width: '100%' }}
                        className="optimize-btn"
                      >
                        AI 一键优化
                      </Button>
                    </>
                  ) : (
                    <Result
                      status="success"
                      title="优化完成！"
                      subTitle={`你的简历已从 ${result.originalScore}分 提升至 ${result.optimizedScore}分`}
                      className="optimize-success"
                    >
                      <div style={{ textAlign: 'center' }}>
                        <Row gutter={16}>
                          <Col span={12}>
                            <CardAnimation animation="scale" index={0}>
                              <Card size="small" title="优化前">
                                <Progress
                                  percent={result.originalScore}
                                  status="exception"
                                  strokeColor="#ff4d4f"
                                />
                              </Card>
                            </CardAnimation>
                          </Col>
                          <Col span={12}>
                            <CardAnimation animation="scale" index={1}>
                              <Card size="small" title="优化后">
                                <Progress
                                  percent={result.optimizedScore}
                                  status="success"
                                  strokeColor="#52c41a"
                                />
                              </Card>
                            </CardAnimation>
                          </Col>
                        </Row>
                        <Space style={{ marginTop: 24 }}>
                          <Tag color="success" className="animate-tag">亮点提炼 +3</Tag>
                          <Tag color="success" className="animate-tag">量化描述 +5</Tag>
                          <Tag color="success" className="animate-tag">关键词优化 +4</Tag>
                        </Space>
                        {result.optimizedContent && (
                          <Card
                            size="small"
                            title="优化后的简历内容"
                            style={{ marginTop: 24, textAlign: 'left' }}
                            className="optimized-content-card"
                          >
                            <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                              {result.optimizedContent}
                            </Paragraph>
                          </Card>
                        )}
                        <Button type="primary" size="large" style={{ marginTop: 24 }} className="download-btn">
                          下载优化后的简历
                        </Button>
                      </div>
                    </Result>
                  )}
                </Card>
              </CardAnimation>
            )}
          </Col>
        </Row>
      </div>
    </PageTransition>
  );
}

export default ResumeOptimize;
