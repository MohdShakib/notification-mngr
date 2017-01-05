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
    return response && response.data;
}, function (error) {

    let errorData;
    if(error.response){
        errorData = error.response && error.response.data;
    }else {
        errorData = error || {};
    }

    // Do something with response error
    return Promise.reject(errorData);
});


export default axios;
