import { post, get } from "@/utils/https"
import type { RowType } from "@/types/station"

const Api = {
  List: "/stationList",
  Edit:"/station/edit",
  Delete:"/station/delete",
  RevenueChart:"/revenueChart",
  Revenue:"/revenueList",
  CurrentList:"/currentList",
} as const

interface ListType{
  page: number,
  pageSize: number,
  name?: string,
  id?: string,
  status: number
}

interface RevenueType{
  page: number,
  pageSize: number,
  name?: string,
}

function listApi(data:ListType){
  return post(Api.List,data)
}

function editApi(data:RowType){
  return post(Api.Edit,data)
}

function deleteApi(id:string){
  return post(Api.Delete,{id})
}

function chartApi(){
  return get(Api.RevenueChart)
}

function revenueApi(data:RevenueType){
  return post(Api.Revenue, data)
}

function currentListApi(){
  return post(Api.CurrentList)
}

export { listApi, editApi, deleteApi, chartApi, revenueApi, currentListApi }