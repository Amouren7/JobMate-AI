import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Tag,
  Space,
  Typography,
  Card,
  Statistic,
  Row,
  Col,
  Popconfirm,
  message,
  Tooltip,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  DashboardOutlined,
  BellOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { JobApplication, ApplicationStatus } from '../../types/application';
import {
  loadApplications,
  addApplication,
  updateApplication,
  deleteApplication,
  getApplicationStats,
  STATUS_CONFIG,
} from '../../types/application';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

function Applications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [form] = Form.useForm();
  const [stats, setStats] = useState(getApplicationStats());

  // 加载数据
  useEffect(() => {
    setApplications(loadApplications());
    setStats(getApplicationStats());
  }, []);

  // 刷新数据
  const refreshData = () => {
    setApplications(loadApplications());
    setStats(getApplicationStats());
  };

  // 打开新增弹窗
  const handleAdd = () => {
    setEditingApp(null);
    form.resetFields();
    form.setFieldsValue({
      applyDate: dayjs(),
      status: 'applied',
    });
    setIsModalOpen(true);
  };

  // 打开编辑弹窗
  const handleEdit = (record: JobApplication) => {
    setEditingApp(record);
    form.setFieldsValue({
      ...record,
      applyDate: dayjs(record.applyDate),
    });
    setIsModalOpen(true);
  };

  // 删除
  const handleDelete = (id: string) => {
    deleteApplication(id);
    refreshData();
    message.success('删除成功');
  };

  // 保存
  const handleSave = (values: any) => {
    const data = {
      ...values,
      applyDate: values.applyDate.format('YYYY-MM-DD'),
    };

    if (editingApp) {
      updateApplication(editingApp.id, data);
      message.success('更新成功');
    } else {
      addApplication(data);
      message.success('添加成功');
    }

    setIsModalOpen(false);
    refreshData();
  };

  // 快速更新状态
  const handleStatusChange = (id: string, status: ApplicationStatus) => {
    updateApplication(id, { status });
    refreshData();
    message.success('状态已更新');
  };

  const columns = [
    {
      title: '公司',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text: string, record: JobApplication) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          {record.platform && <Text type="secondary" style={{ fontSize: 12 }}>{record.platform}</Text>}
        </Space>
      ),
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: '匹配度',
      dataIndex: 'matchScore',
      key: 'matchScore',
      render: (score?: number) =>
        score ? (
          <Badge
            count={`${score}%`}
            style={{
              backgroundColor: score >= 80 ? '#52c41a' : score >= 60 ? '#faad14' : '#ff4d4f',
            }}
          />
        ) : (
          '-'
        ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: ApplicationStatus, record: JobApplication) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record.id, value)}
          style={{ width: 120 }}
        >
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <Option key={key} value={key}>
              <Tag color={config.color}>{config.icon} {config.label}</Tag>
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: '投递日期',
      dataIndex: 'applyDate',
      key: 'applyDate',
      render: (date: string) => dayjs(date).format('MM-DD'),
    },
    {
      title: '薪资',
      dataIndex: 'salary',
      key: 'salary',
      render: (salary?: string) => salary || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: JobApplication) => (
        <Space>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确认删除"
              description="删除后无法恢复，是否继续？"
              onConfirm={() => handleDelete(record.id)}
              okText="删除"
              cancelText="取消"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>
        <FileTextOutlined style={{ marginRight: 12 }} />
        投递管理
      </Title>
      <Text type="secondary" style={{ marginBottom: 24, display: 'block' }}>
        记录和管理你的求职投递，追踪投递状态，AI提醒你及时跟进
      </Text>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="总投递"
              value={stats.total}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="面试中"
              value={stats.byStatus.interview}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="已录用"
              value={stats.byStatus.offer}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="响应率"
              value={stats.responseRate}
              suffix="%"
              valueStyle={{ color: stats.responseRate >= 30 ? '#52c41a' : '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="面试率"
              value={stats.interviewRate}
              suffix="%"
              valueStyle={{ color: stats.interviewRate >= 10 ? '#52c41a' : '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="需跟进"
              value={stats.followUpCount}
              prefix={<BellOutlined />}
              valueStyle={{ color: stats.followUpCount > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 操作栏 */}
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
          记录新投递
        </Button>
      </div>

      {/* 表格 */}
      <Table
        columns={columns}
        dataSource={applications}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: '暂无投递记录，点击上方按钮添加' }}
      />

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingApp ? '编辑投递记录' : '记录新投递'}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="companyName"
                label="公司名称"
                rules={[{ required: true, message: '请输入公司名称' }]}
              >
                <Input placeholder="如：阿里巴巴" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="position"
                label="职位名称"
                rules={[{ required: true, message: '请输入职位名称' }]}
              >
                <Input placeholder="如：前端开发工程师" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="当前状态"
                rules={[{ required: true }]}
              >
                <Select>
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <Option key={key} value={key}>
                      {config.icon} {config.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="applyDate"
                label="投递日期"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="platform" label="投递平台">
                <Select placeholder="选择平台" allowClear>
                  <Option value="Boss直聘">Boss直聘</Option>
                  <Option value="智联招聘">智联招聘</Option>
                  <Option value="拉勾网">拉勾网</Option>
                  <Option value="前程无忧">前程无忧</Option>
                  <Option value="猎聘">猎聘</Option>
                  <Option value="官网">公司官网</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="salary" label="薪资范围">
                <Input placeholder="如：20-30K" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="matchScore" label="匹配度评分">
            <Input type="number" placeholder="如：85" suffix="%" />
          </Form.Item>

          <Form.Item name="jdContent" label="JD内容（用于AI分析）">
            <TextArea
              rows={4}
              placeholder="粘贴职位描述，可用于AI生成求职信..."
            />
          </Form.Item>

          <Form.Item name="notes" label="备注">
            <TextArea rows={2} placeholder="联系人、内推码等其他信息..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Applications;
