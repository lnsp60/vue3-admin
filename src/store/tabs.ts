import { defineStore } from "pinia"
import { ref } from "vue"
import type { MenuItem } from "@/types/user/index"

//选项式
export const useTabsStore = defineStore("tabs", () => {
  const tabs = ref<MenuItem[]>([])
  const currentTab=ref<{name:string,url:string}>({name:"", url:""})

  const addTab = (name:string,url:string, icon:string) => {
    if(!tabs.value.some((tab:MenuItem) => tab.url === url))
    tabs.value.push({name, url, icon})
  }
  const setCurrentTab = (name:string, url:string) => {
    currentTab.value = {name, url}
  }
  const removeTab = (name:string) => {
    const index = tabs.value.findIndex(tab => tab.name === name)
    //提前删除标签考虑数组长度的变换导致索引变化
    tabs.value = tabs.value.filter(tab => tab.name!== name)

    //删除高亮标签
    if(currentTab.value.name === name){
      if(tabs.value.length > 0){
        //删的是第一个
        if(index === 0){
          currentTab.value = {
            name: tabs.value[0]!.name,
            url: tabs.value[0]!.url,
          }
        }else{
          currentTab.value = {
            name: tabs.value[index - 1]!.name,
            url: tabs.value[index - 1]!.url,
          }
        }
      }else{
        currentTab.value = {name: '',url: '',}
      }
    }
  }
  return { tabs, addTab,  currentTab, setCurrentTab, removeTab }
})