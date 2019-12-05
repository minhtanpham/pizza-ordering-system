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

import { createNewCrusts, getListCrusts, deleteCrusts } from '../../services/CrustServices';

class Sizes extends Component {
  columns = [
    {
      title: 'Crust',
      dataIndex: 'crust',
      key: 'crust',
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
        <Button onClick={() => this.deleteCrust(record)}>Delete</Button>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchListCrusts = this.fetchListCrusts.bind(this);
    this.state = {
      listCrusts: [],
    };
  }


  componentDidMount() {
    this.fetchListCrusts();
  }

  fetchListCrusts() {
    getListCrusts(1000, 0).then((res) => {
      this.setState({ listCrusts: _.get(res, 'data.data') });
    }).catch((error) => {
      console.log(error);
    });
  }

  deleteCrust(record) {
    const id = record._id;
    deleteCrusts(id).then(() => {
      this.fetchListCrusts();
    }).catch((error) => {
      console.log(error);
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        createNewCrusts(values).then(() => {
          message.success('Created');
          this.fetchListCrusts();
        }).catch((error) => {
          console.log(error);
        });
      }
    });
  }

  render() {
    const { form } = this.props;
    const { listCrusts } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Row>
        <Col span={24}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item label="Name">
              {getFieldDecorator('crust', {
                rules: [{ required: true, message: 'Please input your crust name!' }],
              })(
                <Input
                  placeholder="Size"
                />,
              )}
            </Form.Item>
            <Form.Item label="Price">
              {getFieldDecorator('price', {
                rules: [{ required: true, message: 'Please input crust price!' }],
              })(
                <InputNumber
                  type="number"
                  placeholder="Crust price"
                />,
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Create new crust</Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={24}>
          <Table rowKey={record => record._id} columns={this.columns} dataSource={listCrusts} />
        </Col>
      </Row>
    );
  }
}

Sizes.propTypes = {
  form: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
};

export default Form.create({ name: 'sizes' })(Sizes);
