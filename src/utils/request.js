import axios from "axios"
import { Message } from 'element-ui';
// 创建axios，赋值给service
//替换成手把手撸码前端的地址 http://www.web-jshtml.cn/productapi
const BASEURL = process.env.NODE_ENV === "production" ? "" : "/devapi";
const service = axios.create({
    baseURL: BASEURL, // http://localhost:8080/api == http://www.web-jshtml.cn/productapi
    timeout: 6000,//超时
})
console.log(
    process.env.VUE_APP_ABC
)

// 请求接口前，做一些数据处理（添加请求拦截器）
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    //  后台需要前端这边传输相关的参数（在请求头添加参数）
    //  token
    //  userId
    //  sui
    //  业务需求

    //  最终目的是在请求头的header中添加参数
    config.headers['token'] = 'token';
    config.headers[userId] = 'userId';
    config.headers[sui] = 'sui'






    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 请求接口后，返回数据进行拦截（添加响应拦截器）
service.interceptors.response.use(function (response) {
    if(response.data.resCode !== 0){
        Message.error(response.data.message)
        return Promise.reject(response.data)
    }else{
        return response;
    }
    // 对响应数据做点什么
    // return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default service