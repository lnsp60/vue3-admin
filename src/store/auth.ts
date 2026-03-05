import { defineStore } from "pinia"
import { loginApi } from "@/api/user"
interface LoginParams{
  username: string,
  password: string
}
//组合式
export const useUserStore = defineStore("user", {
  state: () => ({
    token: sessionStorage.getItem("token") || "",
    roles: sessionStorage.getItem("roles") ? JSON.parse(sessionStorage.getItem("roles")!) : [],
    //! 为非空断言操作符，非空断言：告诉编译器这里的值一定不是 null/undefined
    // 先把值存到变量，避免重复读取，也让类型判断更清晰
    // const rolesStr = sessionStorage.getItem("roles");
    // const roles = rolesStr ? JSON.parse(rolesStr) : [];
    username: sessionStorage.getItem("username") || "",
    menu: sessionStorage.getItem("menu") ? JSON.parse(sessionStorage.getItem("menu")!) : [],
  }),
  actions: {
    async login(data:LoginParams){
      try{
        //pinia中存一份，响应式,性能
        const {data:{token,user:{username,roles},menulist}} = await loginApi(data)
        this.token = token
        this.username = username
        this.roles = roles
        this.menu = menulist
        //本地存一份
        sessionStorage.setItem("token",token)
        sessionStorage.setItem("username",username)//只能存基本类型
        sessionStorage.setItem("roles",JSON.stringify(roles))
        sessionStorage.setItem("menu",JSON.stringify(menulist))
      }catch(error){
        console.log("store-error", error)
      }
    },
    logout(){
      this.token = ""
      this.username = ""
      this.roles = []
      this.menu = []
      sessionStorage.clear()
    }
  }
})