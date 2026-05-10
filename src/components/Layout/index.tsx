import { useState, useEffect } from 'react';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Button, Space, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  FileTextOutlined,
  SearchOutlined,
  MessageOutlined,
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import type { ReactNode } from 'react';
import { getCurrentUser, isAuthenticated, logout, type User } from '../../types/user';
import './style.css';

const { Header, Sider, Content } = AntLayout;
const { Text } = Typography;

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  // 检查登录状态
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = getCurrentUser();
      const isAuth = isAuthenticated();
      setUser(currentUser);
      setAuthenticated(isAuth);
    };

    checkAuth();

    // 监听 storage 变化（支持多标签页同步）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'jobmate_user' || e.key === 'jobmate_auth') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: '首页' },
    { key: '/resume', icon: <FileTextOutlined />, label: '简历优化' },
    { key: '/jd', icon: <SearchOutlined />, label: 'JD分析' },
    { key: '/interview', icon: <MessageOutlined />, label: '面试准备' },
    { key: '/dashboard', icon: <DashboardOutlined />, label: '数据看板' },
    { key: '/settings', icon: <SettingOutlined />, label: 'AI设置' },
  ];

  // 处理退出登录
  const handleLogout = () => {
    logout();
    setUser(null);
    setAuthenticated(false);
    navigate('/login');
  };

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  // 渲染用户信息区域
  const renderUserSection = () => {
    if (authenticated && user) {
      return (
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <Space style={{ cursor: 'pointer' }} className="user-info">
            <Avatar
              src={user.avatar}
              icon={<UserOutlined />}
              size="small"
            />
            <Text style={{ color: '#333' }}>{user.username}</Text>
          </Space>
        </Dropdown>
      );
    }

    return (
      <Button
        type="primary"
        icon={<LoginOutlined />}
        onClick={() => navigate('/login')}
        className="login-btn"
      >
        登录
      </Button>
    );
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          background: '#fff',
          borderBottom: '1px solid #e8e8e8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            J
          </div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
            JobMate AI 职伴
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Text type="secondary" style={{ fontSize: 14 }}>
            AI智能求职助手
          </Text>
          {renderUserSection()}
        </div>
      </Header>

      <AntLayout>
        <Sider
          width={200}
          style={{
            background: '#fff',
            borderRight: '1px solid #e8e8e8',
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0 }}
          >
            {menuItems.map(item => (
              <Menu.Item key={item.key} icon={item.icon} onClick={() => navigate(item.key)}>
                {item.label}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>

        <Content
          style={{
            margin: 24,
            padding: 24,
            background: '#fff',
            borderRadius: 8,
            minHeight: 280,
            overflow: 'auto',
          }}
          className="page-content"
        >
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
}

export default Layout;
