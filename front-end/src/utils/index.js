import _ from 'lodash';

// Config
export const validEmail = (email) => {
  const regex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,4})+$/;
  return regex.test(email);
};

export const validURL = (url) => {
  // eslint-disable-next-line
  const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  return regex.test(url);
};

export const isEmpty = (input) => {
  if (input === null || input === undefined) {
    return true;
  }
  if (typeof (input) === 'string' && input.trim() === '') {
    return true;
  }
  if (Array.isArray(input) && input.length === 0) {
    return true;
  }
  if (typeof (input) === 'object' && Object.keys(input).length === 0) {
    return true;
  }
  return false;
};