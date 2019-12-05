import { publicRequest, privateRequest } from './HttpServices';

const createNewPizzaURL = 'pizzas';
const getAllPizzaURL = 'pizzas';

export const createNewPizza = data => privateRequest(createNewPizzaURL, {
  method: 'POST',
  data,
});

export const getListPizzas = (limit, offset) => publicRequest(`${getAllPizzaURL}?limit=${limit}&offset=${offset}`, {
  method: 'GET',
});
