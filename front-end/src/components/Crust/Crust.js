import React, { Component } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  Table,
  Button,
} from 'antd';
import PropTypes from 'prop-types';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <span>
        <a href="javascript(0)">Delete</a>
      </span>
    ),
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
];

class Crust extends Component {
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Row>
        <Col span={24}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item label="Name">
              {getFieldDecorator('thumbnail', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input
                  placeholder="thumbnail"
                />,
              )}
            </Form.Item>
            <Form.Item label="Price">
              {getFieldDecorator('thumbnail', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input
                  placeholder="thumbnail"
                />,
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary">Create new crust</Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={24}>
          <Table columns={columns} dataSource={data} />
        </Col>
      </Row>
    );
  }
}

Crust.propTypes = {
  form: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
};

export default Form.create({ name: 'crust' })(Crust);
