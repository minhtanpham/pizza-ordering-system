import axios from 'axios';
import _ from 'lodash';
import i18n from 'i18next';
import { message } from 'antd';

import config from '../configs/environments';
import { requestTimeout } from '../configs/constants';
import { isEmpty } from '../utils/index';
import {
  getAccessToken,
  setAccessToken,
  setUserRole,
  getRefreshToken,
  setRefreshToken,
} from './TokenService';
import history from '../utils/history';

const handleResponseSuccess = response => response;

const handleResponseFail = (error) => {
  // Reject promise if usual error
  if (_.get(error.response, 'status') !== 403) {
    return Promise.reject(error);
  }

  const request = axios.create({
    baseURL: `${config.host}/api/oportal/${config.apiVersion}/users/refresh-token`,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'accept-language': i18n.language,
    },
  });
  const token = getRefreshToken() || '';
  request.defaults.headers.Authorization = `Bearer ${token}`;
  request.defaults.timeout = requestTimeout;
  request.defaults.tokenExpired = true;
  return request({ method: 'POST' })
    .then((response) => {
      const { accessToken, refreshToken } = response.data;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      error.response.config.headers.Authorization = `Bearer ${accessToken}`;
      return axios(error.response.config)
        .catch((err) => {
          message.error(err.message);
        });
    })
    .catch((err) => {
      setAccessToken(null);
      setRefreshToken(null);
      setUserRole(null);
      history.push('/');
      return Promise.reject(err);
    });
};

export const handleException = (err) => {
  if (_.get(err, 'response.status') === 401) {
    message.error(err.response.data.message);
  } else if (_.get(err, 'response.status') === 400) {
    message.error(err.response.data.message);
  } else if (_.get(err, 'response.status') === 404) {
    message.error(err.response.data.message);
  } else {
    message.error(err.message);
  }
};

export const privateRequest = (url, info) => {
  const request = axios.create({
    baseURL: `${config.host}${url}`,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'accept-language': i18n.language,
    },
  });
  request.interceptors.response.use(handleResponseSuccess, handleResponseFail);
  const token = getAccessToken() || '';
  if (!isEmpty(token)) {
    request.defaults.headers.Authorization = `Bearer ${token}`;
    request.defaults.timeout = requestTimeout;
    return request(info)
      .catch((err) => {
        handleException(err);
        throw (err);
      });
  }
  return null;
};

export const publicRequest = (url, info) => {
  const data = _.extend(info.data || {}, { lang: i18n.language });
  info = {
    ...info,
    data,
  };
  const request = axios.create({
    baseURL: `${config.host}${url}`,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'accept-language': i18n.language,
    },
  });
  request.defaults.timeout = requestTimeout;
  return request(info)
    .catch((err) => {
      handleException(err);
      throw (err);
    });
};

export const azureRequest = (url, info) => {
  const data = _.extend(info.data || {}, { lang: i18n.language });
  info = {
    ...info,
    data,
  };
  const request = axios.create({
    baseURL: `${config.authority}${url}`,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  request.defaults.timeout = requestTimeout;
  return request(info)
    .catch((err) => {
      handleException(err);
      throw (err);
    });
};
