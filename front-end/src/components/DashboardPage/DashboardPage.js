import React, { Component } from 'react';
import {
  Layout,
  Menu,
  Row,
  Col,
  Tabs,
  Table,
} from 'antd';
import './Dashboard.css';

import CreatePizza from '../CreatePizza/CreatePizza';
import Flavours from '../Flavours/Flavours';
import Size from '../Size/Size';
import Crust from '../Crust/Crust';
import Topping from '../Topping/Topping';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    filters: [
      {
        text: 'Joe',
        value: 'Joe',
      },
      {
        text: 'Jim',
        value: 'Jim',
      },
      {
        text: 'Submenu',
        value: 'Submenu',
        children: [
          {
            text: 'Green',
            value: 'Green',
          },
          {
            text: 'Black',
            value: 'Black',
          },
        ],
      },
    ],
    defaultFilterValues: ['Jim'],
    // specify the condition of filtering result
    // here is that finding the name started with `value`
    onFilter: (value, record) => record.name.indexOf(value) === 0,
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ['descend'],
  },
  {
    title: 'Age',
    dataIndex: 'age',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    filters: [
      {
        text: 'London',
        value: 'London',
      },
      {
        text: 'New York',
        value: 'New York',
      },
    ],
    filterMultiple: false,
    onFilter: (value, record) => record.address.indexOf(value) === 0,
    sorter: (a, b) => a.address.length - b.address.length,
    sortDirections: ['descend', 'ascend'],
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
];

class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: data,
    };
  }

  onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
    this.setState({ field: [] });
  }

  render() {
    const { field } = this.state;
    const { Header, Content, Footer } = Layout;
    const { TabPane } = Tabs;
    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">Home</Menu.Item>
            <Menu.Item key="3">Admin Dashboard</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '50px', minHeight: 'calc(100vh - 133px)' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Row gutter={20}>
              <Col span={12}>
                <Tabs defaultActiveKey="1">
                  <TabPane tab="Customize your pizza" key="1">
                    <CreatePizza />
                  </TabPane>
                  <TabPane tab="Manage Flavours" key="2">
                    <Flavours />
                  </TabPane>
                  <TabPane tab="Manage Size" key="3">
                    <Size />
                  </TabPane>
                  <TabPane tab="Manage Crust" key="4">
                    <Crust />
                  </TabPane>
                  <TabPane tab="Manage Topping" key="5">
                    <Topping />
                  </TabPane>
                </Tabs>
              </Col>
              <Col span={12}>
                <h1>Your Orders</h1>
                <Table columns={columns} dataSource={field} onChange={this.onChange} />
              </Col>
            </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Pizza Ordering System ©2019</Footer>
      </Layout>
    );
  }
}

export default DashboardPage;
