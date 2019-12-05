import { privateRequest, publicRequest } from './HttpServices';

const getAllFlavoursURL = 'flavours';
const createNewFlavoursURL = 'flavours';
const deleteFlavoursURL = 'flavours';

export const getListFlavours = (limit, offset) => publicRequest(`${getAllFlavoursURL}?limit=${limit}&offset=${offset}`, {
  method: 'GET',
});

export const createNewFlavours = data => privateRequest(createNewFlavoursURL, {
  method: 'POST',
  data,
});

export const deleteFlavours = id => privateRequest(`${deleteFlavoursURL}/${id}/inactive`, {
  method: 'DELETE',
});
