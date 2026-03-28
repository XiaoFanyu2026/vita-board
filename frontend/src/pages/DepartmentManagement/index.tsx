import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import http from '../../utils/http';

export default function DepartmentManagement() {
  const [data, setData] = useState([]);
  useEffect(() => { http.get('/departments').then((res: any) => setData(res)); }, []);
  return <Table columns={[{ title: '部门名称', dataIndex: 'name' }]} dataSource={data} rowKey="id" />;
}
