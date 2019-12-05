import { publicRequest, privateRequest } from './HttpServices';

const createNewOrdersURL = 'orders';
const getAllOrderURL = 'orders';

export const createNewOrder = data => privateRequest(createNewOrdersURL, {
  method: 'POST',
  data,
});

export const getListPizzas = (limit, offset) => publicRequest(`${getAllOrderURL}?limit=${limit}&offset=${offset}`, {
  method: 'GET',
});
