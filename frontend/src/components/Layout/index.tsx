import React from 'react';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { UserOutlined, TeamOutlined, SafetyOutlined, EditOutlined, DashboardOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: '控制台' },
    { key: '/users', icon: <UserOutlined />, label: '用户管理' },
    { key: '/departments', icon: <TeamOutlined />, label: '部门管理' },
    { key: '/roles', icon: <SafetyOutlined />, label: '角色权限' },
    { key: '/whiteboards', icon: <EditOutlined />, label: '协作白板' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light">
        <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 24px', fontWeight: 'bold' }}>
          Vita Board
        </div>
        <Menu mode="inline" selectedKeys={[location.pathname]} items={menuItems} onClick={({ key }) => navigate(key)} />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Dropdown menu={{ items: [{ key: 'logout', icon: <LogoutOutlined />, label: '退出', onClick: handleLogout }] }}>
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar>{userInfo?.username?.charAt(0).toUpperCase()}</Avatar>
              <span>{userInfo?.username}</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: '24px', background: '#fff', padding: 24, borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
