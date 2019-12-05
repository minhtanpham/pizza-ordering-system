import { privateRequest, publicRequest } from './HttpServices';

const getAllCrustsURL = 'crusts';
const createNewCrustsURL = 'crusts';
const deleteCrustsURL = 'crusts';

export const getListCrusts = (limit, offset) => publicRequest(`${getAllCrustsURL}?limit=${limit}&offset=${offset}`, {
  method: 'GET',
});

export const createNewCrusts = data => privateRequest(createNewCrustsURL, {
  method: 'POST',
  data,
});

export const deleteCrusts = id => privateRequest(`${deleteCrustsURL}/${id}/inactive`, {
  method: 'DELETE',
});
