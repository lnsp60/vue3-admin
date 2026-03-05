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
  <!-- keep-alive：Vue 内置的缓存组件， 作用是缓存包裹的组件实例，避免组件重复创建 / 销毁（比如列表页滚动到第 20 条，切换路由再返回，仍停留在第 20 条） -->
  <RouterView v-slot="{Component}"> 
    <keep-alive>
      <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive"></component>
    </keep-alive>
    <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive"></component>
  </RouterView>
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