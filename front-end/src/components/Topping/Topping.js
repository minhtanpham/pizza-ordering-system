/* eslint no-underscore-dangle: 0 */
import React, { Component } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  Table,
  Button,
  InputNumber,
  message,
} from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { createNewToppings, getListToppings, deleteToppings } from '../../services/ToppingsServices';

class Sizes extends Component {
  columns = [
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
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button onClick={() => this.deleteToppings(record)}>Delete</Button>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchListToppings = this.fetchListToppings.bind(this);
    this.state = {
      listToppings: [],
    };
  }


  componentDidMount() {
    this.fetchListToppings();
  }

  fetchListToppings() {
    getListToppings(1000, 0).then((res) => {
      this.setState({ listToppings: _.get(res, 'data.data') });
    }).catch((error) => {
      console.log(error);
    });
  }

  deleteToppings(record) {
    const id = record._id;
    deleteToppings(id).then(() => {
      this.fetchListToppings();
    }).catch((error) => {
      console.log(error);
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        createNewToppings(values).then(() => {
          message.success('Created');
          this.fetchListToppings();
        }).catch((error) => {
          console.log(error);
        });
      }
    });
  }

  render() {
    const { form } = this.props;
    const { listToppings } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Row>
        <Col span={24}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item label="Name">
              {getFieldDecorator('topping', {
                rules: [{ required: true, message: 'Please input your toppings name!' }],
              })(
                <Input
                  placeholder="Toppings"
                />,
              )}
            </Form.Item>
            <Form.Item label="Price">
              {getFieldDecorator('price', {
                rules: [{ required: true, message: 'Please input topping price!' }],
              })(
                <InputNumber
                  type="number"
                  placeholder="Topping price"
                />,
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Create new topping</Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={24}>
          <Table rowKey={record => record._id} columns={this.columns} dataSource={listToppings} />
        </Col>
      </Row>
    );
  }
}

Sizes.propTypes = {
  form: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
};

export default Form.create({ name: 'sizes' })(Sizes);
