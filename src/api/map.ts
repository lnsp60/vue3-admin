import { post } from "@/utils/https"

const Api = {
  MapList: "/mapList",
} as const

function mapListApi(){
  return post(Api.MapList)
}
//默认导出只能导一个
export { mapListApi }