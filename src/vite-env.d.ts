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
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    // 这里定义你的 formatNumberToThousands 方法类型
    // 根据实际功能调整参数和返回值类型，示例是“数字/字符串 → 千分位字符串”
    formatNumberToThousands: (num: number | string) => string
    // 如果方法名带 $ 前缀（比如 $formatNumberToThousands），就改成：
    // $formatNumberToThousands: (num: number | string) => string
  }
}