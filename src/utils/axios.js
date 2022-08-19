import axios from 'axios';
// import router from '@/router';

axios.defaults.baseURL = process.env.NODE_ENV == 'development' ? '' : '';

axios.interceptors.response.use(res => {

  if (res.data.status != '200') {
    return Promise.reject(res.data);
  }

  return res.data;
})

export default axios;