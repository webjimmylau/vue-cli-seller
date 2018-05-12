import axios from 'axios';

const baseURL = (function() {
  if (process.env.NODE_ENV === 'development') {
    // 本地环境
    return '/';
  } else {
    let host = window.location.host;
    if (host == 'www.yos168.com') {
      // 正式环境
      return 'http://www.yos168.com';
    } else if (host == 'zzs.lessoald.cn') {
      // 测试环境
      return 'http://zzs.lessoald.cn';
    } else if (host == 'prd.lessoald.cn') {
      // 准正式环境
      return 'http://prd.lessoald.cn';
    } else if (host == 'www.lessoshangcheng.com') {
      // 开发环境
      return 'http://www.lessoshangcheng.com';
    }
  }
})();
const axiosInstance = axios.create({ baseURL });
const CODE = {
  NotLogged: 's-1002', // 未登录
  NoAuth: 's-1001' // 没有权限
};

// 拦截器（响应后）
axiosInstance.interceptors.response.use(response => {
  if ((typeof response.data).toLowerCase() === 'string') {
    let s = response.data;
    if (/.*id=\"lable-for-vue-auth\".*/i.test(s)) {
      // 若 session id 失效或未登录时，后端接口会重定向到卖家中心登录页面
      response.data = { recode: CODE.NotLogged, msg: 'session id invalid' };
    }
  }
  return response;
});

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  err => {
    let res = err.response;
    if (res && (typeof res.data).toLowerCase() === 'string') {
      let s = res.data;
      if (/.*id=\"lable-for-vue-action-auth\".*/i.test(s)) {
        // 没有权限
        res.data = { recode: CODE.NoAuth, msg: 'no authority' };
      }
    }
    return Promise.reject(err);
  }
);

function request(type, url, conf) {
  let config = conf;

  config.url = url;
  config.method = type;
  return axiosInstance
    .request(config)
    .then(response => {
      let data = response.data;
      if (data && data.recode === '0000') {
        return data;
      }
      throw data;
    })
    .catch(err => {
      err._cancel = false;
      if (err && err.recode === CODE.NotLogged) {
        err._cancel = true;
        window.location.href = '/lots-web/user/login/';
      }
      if (
        err &&
        err.response &&
        err.response.data &&
        err.response.data.recode === CODE.NoAuth
      ) {
        err._cancel = true;
        window.location.href = '/lots-web/noPermission.jsp';
      }
      throw err;
    });
}

const methods = {
  get(url, params = {}, config = {}) {
    let conf = config;
    conf.params = params;
    conf.params.__timestamp__ = +new Date();
    return request('get', url, conf);
  },
  post(url, data = {}, config = {}) {
    let conf = config;
    conf.data = data;
    return request('post', url, conf);
  }
};

export default {
  install(Vue, name = '$http') {
    Object.defineProperty(Vue.prototype, name, { value: methods });
  }
};

export const http = methods;
