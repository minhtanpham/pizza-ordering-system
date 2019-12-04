import { publicRequest, privateRequest } from './HttpService';
import config from '../configs/environments';

const authPrefixURL = `/api/oportal/${config.apiVersion}`;
const userPrefixURL = `/api/sales-crm/${config.apiVersion}`;
const authAzurePrefixUrl = `/api/azure/${config.apiVersion}`;
/*
| Authentication and get accesstoken of auth user
| ------------------------------------------------------
| GET /users/login
*/
export const userLogin = data => publicRequest(`${authPrefixURL}/users/login`, {
  method: 'POST',
  data,
});