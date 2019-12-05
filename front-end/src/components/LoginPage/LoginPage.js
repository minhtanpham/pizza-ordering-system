import React, { Component } from 'react';
import {
  Form,
  Icon,
  Input,
  Button,
  message,
} from 'antd';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import _ from 'lodash';
import { userLogin } from '../../services/UserServices';
import {
  setAccessToken,
  getAccessToken,
  setRefreshToken,
} from '../../services/TokenServices';
import { isEmpty } from '../../utils/index';

import './LoginPage.css';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    if (!isEmpty(getAccessToken())) {
      history.push('/dashboard');
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form, history } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        userLogin(values).then((res) => {
          setAccessToken(_.get(res, 'data.data.token'));
          setRefreshToken(_.get(res, 'data.data.refreshToken').replace(/"/g, ''));
          message.success('Login successful');
          history.push('/dashboard');
        });
      }
    });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className="container">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [
                { required: true, message: 'Please input your email!' },
              ],
            })(
              <Input
                type="email"
                prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

LoginPage.propTypes = {
  form: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  history: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
};

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(LoginPage);

export default withRouter(WrappedNormalLoginForm);
