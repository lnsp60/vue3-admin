import { post } from "@/utils/https"

const Api = {
  auth: "/userAuth",
  setAuth: "/setAuth",
} as const

function getAuthApi(pageAuthority:string){
  return post(Api.auth,{pageAuthority})
}

function setAuthApi(account:string,btnList:string[],pageList:string[]){
  return post(Api.setAuth,{account,btnList,pageList})
}

export { getAuthApi, setAuthApi }