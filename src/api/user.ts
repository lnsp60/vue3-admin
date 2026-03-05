import { post } from "@/utils/https"

const Api = {
  Login: "/login",
} as const

interface LoginParams{
  username: string,
  password: string
}

function loginApi(data:LoginParams):Promise<any>{
  return post(Api.Login,data)
}
//默认导出只能导一个
export { loginApi }