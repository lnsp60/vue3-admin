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
import { useRouter } from "vue-router"

const tabsStore = useTabsStore()
const { tabs,currentTab } = storeToRefs(tabsStore)
const { setCurrentTab } = tabsStore
const router = useRouter()
// console.log(tabs.value)

const handleClick = ({index}:{index:number}) => {
  // console.log(tabs.value[index]!.name)
  router.push(tabs.value[index]!.url)
  setCurrentTab(tabs.value[index]!.name,tabs.value[index]!.url );//设置当前高亮
}

const remove = (TabPaneName:string) => {
  console.log(TabPaneName)
}
</script>

<style lang="less" scoped>
.demo-tabs{
  ::v-deep .is-active{background-color:  rgb(34, 136, 255); color:white}
}
</style>