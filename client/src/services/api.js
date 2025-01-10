import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://server:3000/api/v1',
});


instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token')

    //for every request add this headers
    config.headers.Authorization = `Bearer ${token}`

    // add Content-Type if the data is FormData
    if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
    }

    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});


// Add a response interceptor
instance.interceptors.response.use(function (response) {


    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    console.log("----------->", error)

    if (error.message == 'Network Error') {
        window.location.href = '/down'
    }
    else if (error.response.status == 401) {
        localStorage.clear()
        window.location.href = '/login'
    }


    return Promise.reject(error);
});


export default instance;


/*
storing token on client side:
localStorage: axios interceptor
cookies: no need
*/