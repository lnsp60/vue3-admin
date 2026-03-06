import { createApp } from 'vue'
import './style.less'
import App from './App.vue'
import router from './router'
import "@/mock"
// 引入ElementPlus组件库
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入图标库
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 引入pinia
import { createPinia  } from 'pinia'

import "@/router/guard"
import permission from './directives/permission'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(ElementPlus)
//自定义指令全局注册
app.directive('permission', permission)

app.mount('#app')
