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

import { createNewSizes, getListSizes, deleteSizes } from '../../services/SizeServices';

class Sizes extends Component {
  columns = [
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
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
        <Button onClick={() => this.deleteSize(record)}>Delete</Button>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchListSizes = this.fetchListSizes.bind(this);
    this.state = {
      listSizes: [],
    };
  }


  componentDidMount() {
    this.fetchListSizes();
  }

  fetchListSizes() {
    getListSizes(1000, 0).then((res) => {
      this.setState({ listSizes: _.get(res, 'data.data') });
    }).catch((error) => {
      console.log(error);
    });
  }

  deleteSize(record) {
    const id = record._id;
    deleteSizes(id).then(() => {
      this.fetchListSizes();
    }).catch((error) => {
      console.log(error);
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        createNewSizes(values).then(() => {
          message.success('Created');
          this.fetchListSizes();
        }).catch((error) => {
          console.log(error);
        });
      }
    });
  }

  render() {
    const { form } = this.props;
    const { listSizes } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Row>
        <Col span={24}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item label="Name">
              {getFieldDecorator('size', {
                rules: [{ required: true, message: 'Please input your size!' }],
              })(
                <Input
                  placeholder="Size"
                />,
              )}
            </Form.Item>
            <Form.Item label="Price">
              {getFieldDecorator('price', {
                rules: [{ required: true, message: 'Please input size price!' }],
              })(
                <InputNumber
                  type="number"
                  placeholder="Size price"
                />,
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Create new size</Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={24}>
          <Table rowKey={record => record._id} columns={this.columns} dataSource={listSizes} />
        </Col>
      </Row>
    );
  }
}

Sizes.propTypes = {
  form: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
};

export default Form.create({ name: 'sizes' })(Sizes);
