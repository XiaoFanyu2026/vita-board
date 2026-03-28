import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import http from '../../utils/http';

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const onFinish = async (values: any) => {
    try {
      const res: any = await http.post('/auth/login', values);
      setAuth(res.access_token, res.user);
      message.success('登录成功');
      navigate('/dashboard');
    } catch (e) {
      message.error('登录失败，请检查用户名或密码');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
      <Card title="Vita Board - 登录" style={{ width: 400 }}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true }]}><Input.Password /></Form.Item>
          <Button type="primary" htmlType="submit" block>登录</Button>
        </Form>
      </Card>
    </div>
  );
}
