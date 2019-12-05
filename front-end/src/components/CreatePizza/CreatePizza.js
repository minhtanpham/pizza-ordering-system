/* eslint no-underscore-dangle: 0 */
import React, { Component } from 'react';
import {
  Row,
  Col,
  Form,
  Button,
  Input,
  Select,
  message,
} from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { getListFlavours } from '../../services/FlavoursServices';
import { getListSizes } from '../../services/SizeServices';
import { getListCrusts } from '../../services/CrustServices';
import { getListToppings } from '../../services/ToppingsServices';
import { createNewPizza } from '../../services/PizzaServices';

class CreatePizza extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
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
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form } = this.props;
    const {
      flavours,
      sizes,
      crusts,
      toppings,
    } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        const data = {
          thumbnail: values.thumbnail,
          flavour: flavours.filter(item => item._id === values.flavours)[0],
          size: sizes.filter(item => item._id === values.sizes)[0],
          crust: crusts.filter(item => item._id === values.crusts)[0],
          topping: toppings.filter(item => item._id === values.toppings)[0],
          price: 0,
        };
        data.price = (parseInt(data.flavour.price, 10)
        + parseInt(data.size.price, 10)
        + parseInt(data.crust.price, 10)
        + parseInt(_.get(data, 'topping.price', 0), 10)).toString();
        createNewPizza(data).then(() => {
          message.success('Created');
        }).catch(() => {
          message.error('Failed to create a new pizza');
        });
      }
    });
  }

  render() {
    const { form } = this.props;
    const {
      flavours,
      sizes,
      crusts,
      toppings,
    } = this.state;
    const { getFieldDecorator } = form;
    const { Option } = Select;
    return (
      <Row>
        <Col span={24}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item label="Thumbnail">
              {getFieldDecorator('thumbnail', {
                rules: [{ required: true, message: 'Please input your thumbnail!' }],
              })(
                <Input
                  placeholder="thumbnail"
                />,
              )}
            </Form.Item>
            <Form.Item label="Flavours">
              {getFieldDecorator('flavours', {
                rules: [{ required: true, message: 'Please choose your flavours!' }],
              })(
                <Select
                  placeholder="Select a flavour"
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
              <Button htmlType="submit" className="home-order-button">Create your Pizza!</Button>
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
