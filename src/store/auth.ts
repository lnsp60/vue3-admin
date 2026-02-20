import { defineStore } from "pinia"


export const useUserStore = defineStore("user", {
  state: () => ({
    token: null,//令牌
    roles: [],//权限
    username: "",
    menu: []
  }),
  actions: {
  }
})