import React, { Component } from 'react';
import {
  Layout,
  Menu,
  Row,
  Col,
  Form,
  Button,
  Select,
} from 'antd';
import PropTypes from 'prop-types';

import './homepage.css';
import PizzaCard from '../PizzaCard/PizzaCard';

const { Header, Content, Footer } = Layout;

class HomePage extends Component {
  handleSubmit(e) {
    const { form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { Option } = Select;
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
              <Col span={12} className="list-card-pizza">
                <PizzaCard />
                <PizzaCard />
                <PizzaCard />
                <PizzaCard />
              </Col>
              <Col span={12}>
                <h1>Customize your pizza</h1>
                <Form onSubmit={this.handleSubmit} className="login-form">
                  <Form.Item label="Flavours">
                    {getFieldDecorator('username', {
                      rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                      <Select
                        placeholder="Select a person"
                      >
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="tom">Tom</Option>
                      </Select>,
                    )}
                  </Form.Item>
                  <Form.Item label="Size">
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                      <Select
                        placeholder="Select a person"
                      >
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="tom">Tom</Option>
                      </Select>,
                    )}
                  </Form.Item>
                  <Form.Item label="Crust">
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                      <Select
                        placeholder="Select a person"
                      >
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="tom">Tom</Option>
                      </Select>,
                    )}
                  </Form.Item>
                  <Form.Item label="Topping">
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                      <Select
                        placeholder="Select a person"
                      >
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="tom">Tom</Option>
                      </Select>,
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button className="home-order-button">Create your Pizza!</Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Pizza Ordering System ©2019</Footer>
      </Layout>
    );
  }
}

HomePage.propTypes = {
  form: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
};

export default Form.create({ name: 'homepage' })(HomePage);
