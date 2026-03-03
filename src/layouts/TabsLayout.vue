<template>
  <el-tabs closable @tab-remove="remove" v-model="currentTab.name" type="card" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane 
      v-for="tab in tabs" 
      :key="tab.url" 
      :label="tab.name" 
      :name="tab.name"
    >
      <template #label>
        <span class="custom-tabs-label">
          <el-icon><component :is="tab.icon"></component></el-icon>
          <span>&nbsp{{ tab.name }}</span>
        </span>
      </template>
    </el-tab-pane>
  </el-tabs > 
  <RouterView/>
</template>

<script setup lang="ts">
import { useTabsStore } from "@/store/tabs"
import { storeToRefs } from "pinia"
import { useRouter,useRoute } from "vue-router"
import { useUserStore } from "@/store/auth"
import { onMounted } from "vue"

const tabsStore = useTabsStore()
const { tabs,currentTab } = storeToRefs(tabsStore)
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { menu } = storeToRefs(userStore)
const { setCurrentTab,addTab,removeTab } = tabsStore
// console.log(tabs.value)

function findObjectByUrl(arr:any[], url:string){
  for(const item of arr){
    if(item.url === url){
      return item
    }
    if(item.children){
      const found:any = findObjectByUrl(item.children, url)
      if(found){
        return found
      }
    }
  }
  return null
}

onMounted(() => {
  const {name,url,icon} = findObjectByUrl(menu.value, route.path)
  addTab(name,url,icon)
  setCurrentTab(name,url)
});

const handleClick = ({index}:{index:number}) => {
  // console.log(tabs.value[index]!.name)
  router.push(tabs.value[index]!.url)
  setCurrentTab(tabs.value[index]!.name,tabs.value[index]!.url );//设置当前高亮
}

const remove = (TabPaneName:string) => {
  removeTab(TabPaneName)
  router.push(currentTab.value.url)
}
</script>

<style lang="less" scoped>
.demo-tabs{
  ::v-deep .is-active{background-color:  rgb(34, 136, 255); color:white}
}
</style>