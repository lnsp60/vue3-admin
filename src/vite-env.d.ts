/// <reference types="vite/client" />

declare module 'mockjs'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 新增图片、字体等静态资源的类型声明
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.svg'
declare module '*.ico'
declare module '*.ttf'
declare module '*.woff'
declare module '*.woff2'

// 补充 Vue 全局方法的类型声明（解决 formatNumberToThousands 报错）
import type { App } from 'vue'
// 关键：导入 Vue Router 的类型
import type { Router, RouteLocationNormalized } from 'vue-router'

// 扩展路由 Query 类型（可选，让 orderNo 有精准类型提示）
declare module 'vue-router' {
  interface RouteQuery {
    orderNo?: string // 声明订单编号为可选字符串
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    // 千分位格式化方法类型
    formatNumberToThousands: (num: number | string) => string
    // $route/$router 类型声明
    $route: RouteLocationNormalized
    $router: Router
  }
}