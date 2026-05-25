import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Button, Alert, Badge } from 'antd';
import {
  FileTextOutlined,
  SearchOutlined,
  MessageOutlined,
  TrophyOutlined,
  ArrowRightOutlined,
  SendOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockStats } from '../../mock/data';
import { getApplicationStats } from '../../types/application';

function Home() {
  const navigate = useNavigate();
  const [appStats, setAppStats] = useState<{ followUpCount: number } | null>(null);

  useEffect(() => {
    setAppStats(getApplicationStats());
  }, []);

  const features = [
    {
      title: '简历智能优化',
      desc: 'AI分析简历，一键优化提升竞争力',
      icon: <FileTextOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
      path: '/resume',
      color: '#e6f7ff',
    },
    {
      title: 'JD智能分析',
      desc: '解析职位描述，匹配技能与岗位',
      icon: <SearchOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
      path: '/jd',
      color: '#f6ffed',
    },
    {
      title: '面试准备工坊',
      desc: '公司情报+面试题预测，提前准备',
      icon: <MessageOutlined style={{ fontSize: 48, color: '#722ed1' }} />,
      path: '/interview',
      color: '#f9f0ff',
    },
    {
      title: '投递管理',
      desc: '记录投递，AI提醒跟进，生成求职信',
      icon: <SendOutlined style={{ fontSize: 48, color: '#eb2f96' }} />,
      path: '/applications',
      color: '#fff0f6',
      badge: appStats?.followUpCount ? appStats.followUpCount : undefined,
    },
    {
      title: '数据看板',
      desc: '追踪求职进度，可视化分析',
      icon: <TrophyOutlined style={{ fontSize: 48, color: '#fa8c16' }} />,
      path: '/dashboard',
      color: '#fff7e6',
    },
  ];

  return (
    <div>
      {/* 跟进提醒 */}
      {appStats && appStats.followUpCount > 0 && (
        <Alert
          message={<><BellOutlined style={{ marginRight: 8 }} />有 {appStats.followUpCount} 个投递需要跟进</>}
          description="超过7天未跟进的投递记录，建议及时联系HR了解进展"
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Button size="small" type="link" onClick={() => navigate('/applications')}>
              查看投递
            </Button>
          }
        />
      )}

      {/* Hero Section */}
      <div
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 12,
          marginBottom: 40,
          color: '#fff',
        }}
      >
        <h1 style={{ fontSize: 48, marginBottom: 16, color: '#fff' }}>
          JobMate AI 职伴
        </h1>
        <p style={{ fontSize: 20, marginBottom: 32, opacity: 0.9 }}>
          AI驱动的智能求职助手，让找工作更高效
        </p>
        <Button
          type="primary"
          size="large"
          onClick={() => navigate('/resume')}
          style={{
            height: 48,
            padding: '0 32px',
            fontSize: 16,
            background: '#fff',
            color: '#667eea',
            border: 'none',
          }}
        >
          立即开始 <ArrowRightOutlined />
        </Button>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 40 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="简历优化次数"
              value={mockStats.resumeOptimized}
              suffix="次"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="JD分析次数"
              value={mockStats.jdAnalyzed}
              suffix="次"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="面试准备"
              value={mockStats.interviewPrepared}
              suffix="次"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="用户满意度"
              value={mockStats.satisfaction}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Features */}
      <h2 style={{ marginBottom: 24, fontSize: 24 }}>核心功能</h2>
      <Row gutter={[24, 24]}>
        {features.map((feature) => (
          <Col span={12} key={feature.path}>
            <Badge count={feature.badge} offset={[-10, 10}>
              <Card
                className="hover-card"
                style={{
                  cursor: 'pointer',
                  background: feature.color,
                  border: 'none',
                }}
                onClick={() => navigate(feature.path)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  {feature.icon}
                  <div>
                    <h3 style={{ marginBottom: 8, fontSize: 20 }}>{feature.title}</h3>
                    <p style={{ color: '#666', margin: 0 }}>{feature.desc}</p>
                  </div>
                </div>
              </Card>
            </Badge>
          </Col>
        ))}
      </Row>

      {/* How it works */}
      <h2 style={{ margin: '40px 0 24px', fontSize: 24 }}>使用流程</h2>
      <Row gutter={16}>
        {[
          { step: 1, title: '上传简历', desc: '上传你的简历文件' },
          { step: 2, title: 'AI分析', desc: 'AI智能分析匹配度' },
          { step: 3, title: '获取建议', desc: '获得优化建议' },
          { step: 4, title: '一键优化', desc: '生成优化后的简历' },
        ].map((item) => (
          <Col span={3} key={item.step}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  fontWeight: 'bold',
                  margin: '0 auto 16px',
                }}
              >
                {item.step}
              </div>
              <h4 style={{ marginBottom: 8 }}>{item.title}</h4>
              <p style={{ color: '#666', fontSize: 14 }}>{item.desc}</p>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Home;
