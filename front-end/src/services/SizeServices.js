import { privateRequest } from './HttpServices';

const getAllSizesURL = 'sizes';
const createNewSizesURL = 'sizes';
const deleteSizessURL = 'sizes';

export const getListSizes = (limit, offset) => privateRequest(`${getAllSizesURL}?limit=${limit}&offset=${offset}`, {
  method: 'GET',
});

export const createNewSizes = data => privateRequest(createNewSizesURL, {
  method: 'POST',
  data,
});

export const deleteSizes = id => privateRequest(`${deleteSizessURL}/${id}/inactive`, {
  method: 'DELETE',
});
