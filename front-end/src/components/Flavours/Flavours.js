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

import { createNewFlavours, getListFlavours, deleteFlavours } from '../../services/FlavoursServices';

class Flavours extends Component {
  columns = [
    {
      title: 'Name',
      dataIndex: 'flavour',
      key: 'flavour',
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
        <Button onClick={() => this.deleteFlavour(record)}>Delete</Button>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchListFlavours = this.fetchListFlavours.bind(this);
    this.state = {
      listFlavours: [],
    };
  }


  componentDidMount() {
    this.fetchListFlavours();
  }

  fetchListFlavours() {
    getListFlavours(1000, 0).then((res) => {
      this.setState({ listFlavours: _.get(res, 'data.data') });
    }).catch((error) => {
      console.log(error);
    });
  }

  deleteFlavour(record) {
    const id = record._id;
    deleteFlavours(id).then(() => {
      this.fetchListFlavours();
    }).catch((error) => {
      console.log(error);
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        createNewFlavours(values).then(() => {
          message.success('Created');
          this.fetchListFlavours();
        }).catch((error) => {
          console.log(error);
        });
      }
    });
  }

  render() {
    const { form } = this.props;
    const { listFlavours } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Row>
        <Col span={24}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item label="Name">
              {getFieldDecorator('flavour', {
                rules: [{ required: true, message: 'Please input your flavour name!' }],
              })(
                <Input
                  placeholder="Flavours name"
                />,
              )}
            </Form.Item>
            <Form.Item label="Price">
              {getFieldDecorator('price', {
                rules: [{ required: true, message: 'Please input flavour price!' }],
              })(
                <InputNumber
                  type="number"
                  placeholder="Flavours price"
                />,
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Create new flavours</Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={24}>
          <Table columns={this.columns} dataSource={listFlavours} />
        </Col>
      </Row>
    );
  }
}

Flavours.propTypes = {
  form: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
};

export default Form.create({ name: 'flavours' })(Flavours);
