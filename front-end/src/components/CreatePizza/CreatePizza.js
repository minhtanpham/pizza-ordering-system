import React, { Component } from 'react';
import {
  Row,
  Col,
  Form,
  Button,
  Input,
  Select,
} from 'antd';
import PropTypes from 'prop-types';

class CreatePizza extends Component {
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { Option } = Select;
    return (
      <Row>
        <Col span={24}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item label="Thumbnail">
              {getFieldDecorator('thumbnail', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input
                  placeholder="thumbnail"
                />,
              )}
            </Form.Item>
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
    );
  }
}

CreatePizza.propTypes = {
  form: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
};

export default Form.create({ name: 'createpizza' })(CreatePizza);
