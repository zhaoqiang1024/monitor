import React, { useEffect } from 'react';
import { Link, request } from 'umi';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

const MonitorList: React.FC = () => {
  type TableListItem = {
    appName: string;
    ip: string;
    pid: number;
    lastStartTime: string;
    pingTime: string;
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '应用名称',
      dataIndex: 'appName',
    },
    {
      title: '服务器IP',
      dataIndex: 'ip',
      render: (text, record) => [
        <Link
          target="_blank"
          key="itnerfaceConfig"
          to={{ pathname: '/monitor/jvm/info', search: `?ip=${record.ip}&pid=${record.pid}` }}
        >
          {record.ip}
        </Link>,
      ],
    },
    {
      title: '启动ID',
      dataIndex: 'pid',
      search: false,
    },
    {
      title: '启动时间',
      width: 200,
      dataIndex: 'lastStartTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '最后一次心跳时间',
      dataIndex: 'pingTime',
      valueType: 'dateTime',
      search: false,
    },
  ];

  useEffect(() => {}, []);
  return (
    <ProTable<TableListItem>
      columns={columns}
      request={(params) => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        return request('http://127.0.0.1:8080/server/list', {
          method: 'get',
          params: { ...params },
        }).then((value) => {
          return { success: true, data: value };
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
      toolbar={{
        title: '高级表格',
        tooltip: '这是一个标题提示',
      }}
      toolBarRender={false}
    />
  );
};
export default MonitorList;
