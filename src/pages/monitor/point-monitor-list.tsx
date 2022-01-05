import React, { useEffect } from 'react';
import { Link, request } from 'umi';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

const MonitorList: React.FC = () => {
  type TableListItem = {
    appName: string;
    point: string;
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '应用名称',
      dataIndex: 'appName',
    },
    {
      title: '监控点',
      dataIndex: 'point',
      render: (text, record) => [
        <Link
          target="_blank"
          key="itnerfaceConfig"
          to={{
            pathname: '/monitor/point/info',
            search: `?point=${record.point}&appName=${record.appName}`,
          }}
        >
          {record.point}
        </Link>,
      ],
    },
  ];

  useEffect(() => {}, []);
  return (
    <ProTable<TableListItem>
      columns={columns}
      request={(params) => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        return request('http://127.0.0.1:8080/monitor/point/list', {
          method: 'get',
          params: { ...params },
        })
          .then((value) => {
            return { success: true, data: value };
          })
          .catch(() => {
            return { success: true, data: [] };
          });
      }}
      rowKey="ip"
      pagination={{
        showQuickJumper: true,
      }}
      search={{
        layout: 'vertical',
        defaultCollapsed: false,
      }}
      dateFormatter="string"
      toolBarRender={false}
    />
  );
};
export default MonitorList;
