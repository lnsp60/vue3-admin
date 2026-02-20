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