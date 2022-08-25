import axios from '../utils/axios' 
axios.defaults.baseURL('/api')
axios.defaults.headers.post['Content-Type'] = 'application/json'
export function getAllUser (params) {
  return axios.post('/Admin/getAllUser/', params);
}