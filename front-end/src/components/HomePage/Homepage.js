/* eslint no-underscore-dangle: 0 */
import React, { Component } from 'react';
import {
  Layout,
  Menu,
  Row,
  Col,
  Form,
  Button,
  Select,
  message,
  Empty,
} from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './homepage.css';
import PizzaCard from '../PizzaCard/PizzaCard';
import { getListFlavours } from '../../services/FlavoursServices';
import { getListSizes } from '../../services/SizeServices';
import { getListCrusts } from '../../services/CrustServices';
import { getListToppings } from '../../services/ToppingsServices';
import { getListPizzas } from '../../services/PizzaServices';
import { createNewOrder } from '../../services/OrderServices';

const { Header, Content, Footer } = Layout;

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
    this.state = {
      pizza: [],
      flavours: [],
      sizes: [],
      crusts: [],
      toppings: [],
    };
  }

  componentDidMount() {
    const promiseArray = [
      getListFlavours(1000, 0),
      getListSizes(1000, 0),
      getListCrusts(1000, 0),
      getListToppings(1000, 0),
    ];
    Promise.all(promiseArray).then((res) => {
      this.setState({
        flavours: _.get(res[0], 'data.data'),
        sizes: _.get(res[1], 'data.data'),
        crusts: _.get(res[2], 'data.data'),
        toppings: _.get(res[3], 'data.data'),
      });
    }).catch(() => {
      message.error('Failed to load list ingredients');
    });
    getListPizzas(100, 0).then((res) => {
      this.setState({ pizza: _.get(res, 'data.data') });
    }).catch(() => {
      message.error('Failed when fetch list Pizza');
    });
  }

  placeOrder(flavour, size, crust, topping, price) {
    const {
      flavours,
      sizes,
      crusts,
      toppings,
    } = this.state;
    let data = {};
    if (!price || price === 0) {
      // place from custom form
      data = {
        flavour: flavours.filter(item => item._id === flavour)[0],
        size: sizes.filter(item => item._id === size)[0],
        crust: crusts.filter(item => item._id === crust)[0],
        topping: toppings.filter(item => item._id === topping)[0],
        price: 0,
      };
      data.price = (parseInt(data.flavour.price, 10)
      + parseInt(data.size.price, 10)
      + parseInt(data.crust.price, 10)
      + parseInt(_.get(data, 'topping.price', 0), 10)).toString();
    } else {
      // place from pizza order
      data = {
        flavour: flavours.filter(item => item._id === flavour._id)[0],
        size: sizes.filter(item => item._id === size._id)[0],
        crust: crusts.filter(item => item._id === crust._id)[0],
        topping: toppings.filter(item => item._id === topping._id)[0],
        price,
      };
    }
    createNewOrder(data).then(() => {
      message.success('Created!');
    }).catch(() => {
      message.success('Failed to place order!');
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.placeOrder(values.flavours, values.sizes, values.crusts, values.toppings);
      }
    });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { Option } = Select;
    const {
      pizza,
      flavours,
      sizes,
      crusts,
      toppings,
    } = this.state;
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
              {
                pizza.length === 0 ? (
                  <Col span={12}>
                    <Empty />
                  </Col>
                ) : (
                  <Col span={12} className="list-card-pizza">
                    {
                      pizza.map(item => <PizzaCard key={item._id} thumbnail={item.thumbnail} flavour={item.flavour} size={item.size} crust={item.crust} topping={_.get(item, 'topping', {})} price={item.price} placeOrder={this.placeOrder} />)
                    }
                  </Col>
                )
              }
              <Col span={12}>
                <h1>Customize your pizza</h1>
                <Form onSubmit={this.handleSubmit} className="login-form">
                  <Form.Item label="Flavours">
                    {getFieldDecorator('flavours', {
                      rules: [{ required: true, message: 'Please choose flavours!' }],
                    })(
                      <Select
                        placeholder="Select a flavours"
                      >
                        {
                          flavours.map(({ _id, flavour }) => <Option key={_id} value={_id}>{flavour}</Option>)
                        }
                      </Select>,
                    )}
                  </Form.Item>
                  <Form.Item label="Size">
                    {getFieldDecorator('sizes', {
                      rules: [{ required: true, message: 'Please choose your size' }],
                    })(
                      <Select
                        placeholder="Select a size"
                      >
                        {
                          sizes.map(({ _id, size }) => <Option key={_id} value={_id}>{size}</Option>)
                        }
                      </Select>,
                    )}
                  </Form.Item>
                  <Form.Item label="Crust">
                    {getFieldDecorator('crusts', {
                      rules: [{ required: true, message: 'Please choose your crust!' }],
                    })(
                      <Select
                        placeholder="Select a crust"
                      >
                        {
                          crusts.map(({ _id, crust }) => <Option key={_id} value={_id}>{crust}</Option>)
                        }
                      </Select>,
                    )}
                  </Form.Item>
                  <Form.Item label="Topping">
                    {getFieldDecorator('toppings', {
                      rules: [],
                    })(
                      <Select
                        placeholder="Select a topping"
                      >
                        {
                          toppings.map(({ _id, topping }) => <Option key={_id} value={_id}>{topping}</Option>)
                        }
                      </Select>,
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button htmlType="submit" className="home-order-button">Place your order!</Button>
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
