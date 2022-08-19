import axios from '../utils/axios' 

export function getAllUser (params) {
  return axios.post('/Admin/getAllUser/', params);
}