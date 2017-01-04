"use strict";

axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });



//response interceptor
axios.interceptors.response.use(function (response) {
    console.log('////////////',response);
    return response && response.data;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});


export default axios;