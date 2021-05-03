import axios from 'axios';
import { encodeQueryString } from '../util/qs';
import { orchestartionEngineURl } from '../util/apiManager';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
const defaultHttp = axios.create({
  baseURL: orchestartionEngineURl,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  paramsSerializer(params) {
    return encodeQueryString(params);
  },
  withCredentials: true
});

/* defaultHttp.validateStatus = function (status) {
  return status >= 200 && status < 305;
} */

defaultHttp.interceptors.response.use(function (response) {
  if (response['headers']['concierto-auth']) {
    const coockies = response['headers']['concierto-auth'].split('Set-Cookie:');
    coockies.forEach(coockie => {
      if (coockie) {
        if (coockie.includes('HttpOnly;')) {
          coockie = coockie.replace('HttpOnly;', '');
        }
        document.cookie = coockie.trim();
      }
    });
  }
  return response;
}, function (error) {
  return Promise.reject(error);
});

class Base {
  constructor(http = defaultHttp, baseURL) {
    this.http = http;
    this.baseUrl = baseURL;
  }

  create(data) {
    return this.http.post(this.baseUrl, data);
  }

  destroy(id) {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }

  read(params) {
    return this.http.get(this.baseUrl, {
      params,
    });
  }

  readDetail(id) {
    return this.http.get(`${this.baseUrl}${id}/`);
  }

  readOptions() {
    return this.http.options(this.baseUrl);
  }

  replace(id, data) {
    return this.http.put(`${this.baseUrl}${id}/`, data);
  }

  update(id, data) {
    return this.http.patch(`${this.baseUrl}${id}/`, data);
  }

  copy(id, data) {
    return this.http.post(`${this.baseUrl}${id}/copy/`, data);
  }
}

export default Base;
export { defaultHttp }