import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import http from '../../utils/http';

export default function RoleManagement() {
  const [data, setData] = useState([]);
  useEffect(() => { http.get('/roles').then((res: any) => setData(res)); }, []);
  return <Table columns={[{ title: '角色名称', dataIndex: 'name' }]} dataSource={data} rowKey="id" />;
}
