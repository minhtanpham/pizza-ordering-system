import { publicRequest, privateRequest } from './HttpServices';

const createNewOrdersURL = 'orders';
const getAllOrderURL = 'orders';

export const createNewOrder = data => publicRequest(createNewOrdersURL, {
  method: 'POST',
  data,
});

export const getListOrders = (limit, offset) => privateRequest(`${getAllOrderURL}?limit=${limit}&offset=${offset}`, {
  method: 'GET',
});
