import { Card, Row, Col, Statistic, Progress, Timeline, Tag, Calendar } from 'antd';
import {
  FileTextOutlined,
  MessageOutlined,
  TrophyOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { mockDashboardData } from '../../mock/data';

function Dashboard() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'interview':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'offer':
        return <TrophyOutlined style={{ color: '#52c41a' }} />;
      case 'rejected':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <CheckCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'interview':
        return <Tag color="warning">面试中</Tag>;
      case 'offer':
        return <Tag color="success">已录用</Tag>;
      case 'rejected':
        return <Tag color="error">未通过</Tag>;
      default:
        return <Tag color="processing">已投递</Tag>;
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>数据看板</h2>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card className="hover-card">
            <Statistic
              title="总投递数"
              value={mockDashboardData.totalApplications}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="hover-card">
            <Statistic
              title="面试率"
              value={mockDashboardData.interviewRate}
              suffix="%"
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <Progress
              percent={mockDashboardData.interviewRate}
              size="small"
              status="active"
              strokeColor="#faad14"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="hover-card">
            <Statistic
              title="Offer数"
              value={mockDashboardData.offerCount}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress
              percent={(mockDashboardData.offerCount / mockDashboardData.totalApplications) * 100}
              size="small"
              status="success"
              strokeColor="#52c41a"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="hover-card">
            <Statistic
              title="转化率"
              value={Math.round((mockDashboardData.offerCount / mockDashboardData.totalApplications) * 100)}
              suffix="%"
              prefix={<LineChartOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <Progress
              percent={Math.round((mockDashboardData.offerCount / mockDashboardData.totalApplications) * 100)}
              size="small"
              strokeColor="#722ed1"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 技能雷达和投递追踪 */}
      <Row gutter={24}>
        <Col span={12}>
          <Card title="技能雷达" style={{ height: 400 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '20px 0' }}>
              {mockDashboardData.skillRadar.map((skill) => (
                <div key={skill.skill}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 500 }}>{skill.skill}</span>
                    <span>{skill.score}/{skill.fullMark}</span>
                  </div>
                  <Progress
                    percent={(skill.score / skill.fullMark) * 100}
                    strokeColor={
                      skill.score >= skill.fullMark * 0.8
                        ? '#52c41a'
                        : skill.score >= skill.fullMark * 0.6
                        ? '#faad14'
                        : '#ff4d4f'
                    }
                    showInfo={false}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="投递追踪" style={{ height: 400 }}>
            <Timeline mode="left">
              {mockDashboardData.recentApplications.map((app, index) => (
                <Timeline.Item
                  key={index}
                  dot={getStatusIcon(app.status)}
                  label={app.date}
                >
                  <div style={{ marginBottom: 8 }}>
                    <strong style={{ fontSize: 15 }}>{app.company}</strong>
                    <span style={{ marginLeft: 8, color: '#666' }}>{app.position}</span>
                  </div>
                  {getStatusTag(app.status)}
                  {app.status === 'interview' && app.nextStep && (
                    <div style={{ marginTop: 8, color: '#faad14', fontSize: 13 }}>
                      <ClockCircleOutlined /> 下一步：{app.nextStep}
                    </div>
                  )}
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>

      {/* 投递趋势和日历 */}
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="投递趋势（近7天）">
            <div style={{ height: 250, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '20px 0' }}>
              {mockDashboardData.applicationTimeline.map((day, index) => {
                const maxVal = 10;
                const appHeight = (day.applications / maxVal) * 150;
                const intHeight = (day.interviews / maxVal) * 150;
                return (
                  <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 160 }}>
                      {day.applications > 0 && (
                        <div
                          style={{
                            width: 20,
                            height: appHeight,
                            background: '#1890ff',
                            borderRadius: 4,
                            transition: 'all 0.3s',
                          }}
                          title={`投递: ${day.applications}`}
                        />
                      )}
                      {day.interviews > 0 && (
                        <div
                          style={{
                            width: 20,
                            height: intHeight,
                            background: '#52c41a',
                            borderRadius: 4,
                            transition: 'all 0.3s',
                          }}
                          title={`面试: ${day.interviews}`}
                        />
                      )}
                    </div>
                    <span style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                      {day.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 12, height: 12, background: '#1890ff', borderRadius: 2 }} />
                <span>投递数</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 12, height: 12, background: '#52c41a', borderRadius: 2 }} />
                <span>面试数</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="求职日历">
            <Calendar fullscreen={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
