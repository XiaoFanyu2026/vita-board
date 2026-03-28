import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import http from '../../utils/http';

export default function UserManagement() {
  const [data, setData] = useState([]);
  useEffect(() => { http.get('/users').then((res: any) => setData(res)); }, []);
  return <Table columns={[{ title: '用户名', dataIndex: 'username' }]} dataSource={data} rowKey="id" />;
}
