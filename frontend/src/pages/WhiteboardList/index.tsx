import React, { useEffect, useState } from 'react';
import { Table, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import http from '../../utils/http';
import { PermissionCheck } from '../../components/PermissionCheck';

export default function WhiteboardList() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    http.get('/whiteboards').then((res: any) => setData(res));
  }, []);

  const columns = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/board/${record.id}`)}>进入白板</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <PermissionCheck code="whiteboard:write">
          <Button type="primary">新建白板</Button>
        </PermissionCheck>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
}
