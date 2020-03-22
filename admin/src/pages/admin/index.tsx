import * as React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { getAdmins, IAdminUser, deleteAdmin, addAdmin } from "@/services/admin";
import { Button, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CreateForm from './components/CreateForm';


export interface IPageAdminProps {
}

export interface IPageAdminState {
  loading: boolean;
  createForm: boolean;
}

export default class PageAdmin extends React.Component<IPageAdminProps, IPageAdminState> {
  actionRef: React.RefObject<ActionType>;

  constructor(props: IPageAdminProps) {
    super(props);

    this.actionRef = React.createRef<ActionType>();

    this.state = {
      loading: false,
      createForm: false
    }
    this.addAdmin = this.addAdmin.bind(this);
  }

  addAdmin() {
    this.setState({
      createForm: true
    })
  }


  async deleteItem(record: IAdminUser) {
    this.setState({
      loading: true
    })

    await deleteAdmin(record.username);

    this.setState({
      loading: false,

    })

    this.actionRef.current?.reload();

  }

  public render() {
    const columns: ProColumns<IAdminUser>[] = [
      {
        dataIndex: 'username',
        title: '手机号码',
        width: 300
      },
      {
        title: '操作',
        width: 30,
        render: (_, record) => (
          <Popconfirm title="您确定要删除吗" onConfirm={() => {
            this.deleteItem(record);
          }}>
            <a href="#">
              <Button type='danger' size='small' >
                删除
              </Button>

            </a>
          </Popconfirm>
        )


      }
    ];


    return (
      <PageHeaderWrapper>
        <ProTable<IAdminUser>
          headerTitle="管理员列表"
          request={() => getAdmins().then((res) => {
            return {
              success: res.status ?? false,
              data: res.data ?? [],
              total: res.data ? res.data.length : 0
            }
          })}
          search={false}
          toolBarRender={() => [
            <Button icon={<PlusOutlined />} type='primary' onClick={this.addAdmin}>新增</Button>
          ]}

          actionRef={this.actionRef}
          loading={this.state.loading}
          columns={columns}
        />

        <CreateForm onCancel={() => this.setState({
          createForm: false
        })}
          modalVisible={this.state.createForm}>
          <ProTable<IAdminUser, IAdminUser>
            onSubmit={async value => {
              const success = await addAdmin(value.username);
              if (success) {
                this.setState({
                  createForm: true
                })

                this.actionRef.current?.reload();

              }
            }}
            rowKey="key"
            type="form"
            columns={columns}
            rowSelection={{}}
          />
        </CreateForm>

      </PageHeaderWrapper>
    );
  }
}
