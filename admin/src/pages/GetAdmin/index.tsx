import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';

import Detail from './components/DetailModal';
import UpdateForm, { FormValueType } from './components/DetailModal';
import { IPostTask } from './data';
import { getItems, reject, accept } from './service';



const TableList: React.FC<{}> = () => {
  const [sorter, setSorter] = useState<string>('');
  const [detailShow, setDetailShow] = useState<boolean>(false);
  const [showItem, setShowItem] = useState<IPostTask>();
  const actionRef = useRef<ActionType>();

  const rejectTask = async (id: string) => {
    const hide = message.loading('正在操作');

    try {
      await reject(id);
      hide();
      message.success('操作成功，马上刷新');
    } catch (error) {
      hide();
      message.error('失败，请重试');
    }

    actionRef.current?.reload();
  };

  const acceptTask = async (id: string) => {
    const hide = message.loading('正在操作');
    try {
      await accept(id);
      hide();
      message.success('操作成功，马上刷新');
    } catch (error) {
      hide();
      message.error('失败，请重试');
    }

    actionRef.current?.reload();
  };

  const columns: ProColumns<IPostTask>[] = [
    {
      title: '任务ID',
      dataIndex: 'id',
    },
    {
      title: '标题',
      dataIndex: 'title',
      valueType: 'text',
    },
    {
      title: '用户手机',
      dataIndex: 'username',
      valueType: 'text',
    },
    {
      title: '价格',
      dataIndex: 'price',
      // sorter: true,
      hideInSearch: true,
      hideInForm: true,
      renderText: (val) => `￥ ${val}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: { text: '等待审核', status: 'Processing' },
        1: { text: '已经驳回', status: 'Error' },
        2: { text: '发布成功', status: 'Default' },
        3: { text: '已接单', status: 'Default' },
        4: { text: '完成', status: 'Success' }
      },
    },
    {
      title: '发布时间',
      dataIndex: 'time',
      // sorter: true,
      valueType: 'dateRange',
      hideInForm: true,
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a onClick={() => {
            setShowItem(record);
            setDetailShow(true);
          }}>查看详情</a>
          <Divider type="vertical" />

          {(record.status == 0) ? <>

            <Popconfirm title="确定审核?" onConfirm={()=>{acceptTask(record.id)}}>
              <a href="#">审核</a>
            </Popconfirm>

            <Divider type="vertical" />
            <Popconfirm title="确定驳回?" onConfirm={()=>{rejectTask(record.id)}}>
              <a href="#">驳回</a>
            </Popconfirm>

          </> : record.status != 4 && <>
            {/* <Popconfirm title="确认取消?">
              <a href="#">取消并退款</a>
            </Popconfirm> */}

          </>}

        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<IPostTask>
        headerTitle="所有发单"
        actionRef={actionRef}
        rowKey="key"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<IPostTask>;
          if (sorterResult.field) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          }
        }}
        params={{
          sorter,
        }}


        request={params => getItems({
          ...params,
          page: params?.current,
          size: params?.pageSize
        })}
        columns={columns}
      />
      <Detail {...showItem} onCancel={() => setDetailShow(false)} modalVisible={detailShow} />


    </PageHeaderWrapper>
  );
};

export default TableList;
