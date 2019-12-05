/* eslint no-underscore-dangle: 0 */
/* eslint no-plusplus: 0 */
import React, { Component } from 'react';
import {
  Layout,
  Menu,
  Row,
  Col,
  Tabs,
  Table,
  message,
} from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import './Dashboard.css';
import CreatePizza from '../CreatePizza/CreatePizza';
import Flavours from '../Flavours/Flavours';
import Size from '../Size/Size';
import Crust from '../Crust/Crust';
import Topping from '../Topping/Topping';
import { getListOrders } from '../../services/OrderServices';
import { setRefreshToken, setAccessToken } from '../../services/TokenServices';

const proccessData = (rawData) => {
  let result = [];
  for (let i = 0; i < rawData.length; i++) {
    const indexItem = rawData[i];
    const item = {
      id: indexItem._id,
      flavour: indexItem.flavour.flavour,
      crust: indexItem.crust.crust,
      size: indexItem.size.size,
      topping: _.get(indexItem, 'topping.topping', ''),
      price: indexItem.price,
      created_at: indexItem.created_at,
    };
    result = [...result, item];
  }
  return result;
};

class DashboardPage extends Component {
  columns = [
    {
      title: 'Flavour',
      dataIndex: 'flavour',
      key: 'flavour',
    },
    {
      title: 'Crust',
      dataIndex: 'crust',
      key: 'crust',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Topping',
      dataIndex: 'topping',
      key: 'topping',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Created Date',
      dataIndex: 'created_at',
      key: 'created_at',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      field: [],
    };
  }

  componentDidMount() {
    getListOrders(1000, 0).then((res) => {
      this.setState({ field: _.get(res, 'data.data') });
    }).catch(() => {
      message.error('Failed to load orders');
    });
  }

  logout() {
    const { history } = this.props;
    setRefreshToken('');
    setAccessToken('');
    message.success('Logout successful');
    history.push('/');
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
            <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
            <Menu.Item key="2"><Link to="/login">Admin Dashboard</Link></Menu.Item>
            <Menu.Item key="3" onClick={() => this.logout()}>Log out</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '50px', minHeight: 'calc(100vh - 133px)' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Row gutter={20}>
              <Col span={8}>
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
              <Col span={16}>
                <h1>Your Orders</h1>
                <Table columns={this.columns} rowKey={record => record.id} dataSource={proccessData(field)} />
              </Col>
            </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Pizza Ordering System ©2019</Footer>
      </Layout>
    );
  }
}

DashboardPage.propTypes = {
  history: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
};

export default withRouter(DashboardPage);
