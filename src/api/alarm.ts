import { get } from "@/utils/https"

const Api = {
  AlarmList: "/alarmList",
} as const

function alarmListApi(){
  return get(Api.AlarmList)
}
//默认导出只能导一个
export { alarmListApi }