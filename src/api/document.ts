import { get } from "@/utils/https"

const Api = {
  TypeList: "/document",
} as const

function typeListApi(){
  return get(Api.TypeList)
}

export { typeListApi }