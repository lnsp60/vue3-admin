import axios from "axios"
import type { AxiosInstance,InternalAxiosRequestConfig,AxiosResponse,AxiosError }  from "axios"
import { ElNotification } from 'element-plus'//错误弹框

const service:AxiosInstance = axios.create({
  baseURL: "https://www.demo.com", // 后面替换成环境变量
  timeout: 5000
})

//请求拦截器
service.interceptors.request.use((config:InternalAxiosRequestConfig) => {
  return config
},(error:AxiosError) => {
  ElNotification({
    title: 'Error',
    message: error.message,
    type: "error"
  })
  return Promise.reject(error)
})

//响应拦截器
service.interceptors.response.use((response:AxiosResponse) => {
  if(response.data.code === 401){
    ElNotification({
    title: 'Error',
    message: response.data.message,
    type: "error"
  })
  }else{
    return response.data
  }
  console.log("拦截器",response)
},(error:AxiosError) => {
  ElNotification({
    title: 'Error',
    message: error.message,
    type: "error"
  })
  return Promise.reject(error)
})

export default service