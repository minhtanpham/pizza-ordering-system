import { privateRequest, publicRequest } from './HttpServices';

const getAllToppingsURL = 'toppings';
const createNewToppingsURL = 'toppings';
const deleteToppingsURL = 'toppings';

export const getListToppings = (limit, offset) => publicRequest(`${getAllToppingsURL}?limit=${limit}&offset=${offset}`, {
  method: 'GET',
});

export const createNewToppings = data => privateRequest(createNewToppingsURL, {
  method: 'POST',
  data,
});

export const deleteToppings = id => privateRequest(`${deleteToppingsURL}/${id}/inactive`, {
  method: 'DELETE',
});
