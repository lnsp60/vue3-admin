<template>
  <div>
    <el-row :gutter="5">
      <el-col :span="4">
        <el-card>
          <div class="title">
            <div class="round">
              <el-icon>
                <Document/>
              </el-icon>
            </div>
            <h4>今日收入(元)</h4>
          </div>
          <div class="total mt">
            <h2>{{ formatNumberToThousands(239824) }}</h2>
            <div class="percent" style="color: green;">-21%</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card>
          <div class="title">
            <div class="round">
              <el-icon>
                  <Document />
              </el-icon>
            </div>
            <h4>本月收入(万元)</h4>
          </div>
          <div class="total mt">
            <h2>{{formatNumberToThousands(2924)}}</h2>
            <div class="percent">-21%</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card>
          <div class="title">
            <div class="round">
              <el-icon>
                <Document />
              </el-icon>
            </div>
            <h4>会员卡金额(元)</h4>
          </div>
          <div class="total mt">
            <h2>{{formatNumberToThousands(292423)}}</h2>
            <div class="percent">-16%</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card>
          <div class="title">
            <div class="round">
              <el-icon>
                <Document />
              </el-icon>
            </div>
            <h4>服务费金额(元)</h4>
          </div>
          <div class="total mt">
            <h2>{{formatNumberToThousands(16824)}}</h2>
            <div class="percent">-7%</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card>
            <div class="title">
              <div class="round">
                <el-icon>
                  <Document />
                </el-icon>
              </div>
              <h4>停车费金额(元)</h4>
            </div>
            <div class="total mt">
              <h2>{{formatNumberToThousands(9687)}}</h2>
              <div class="percent">-4%</div>
            </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card>
          <div class="title">
            <div class="round">
                <el-icon>
                    <Document />
                </el-icon>
            </div>
            <h4>电费金额(元)</h4>
          </div>
          <div class="total mt">
            <h2>{{formatNumberToThousands(223674)}}</h2>
            <div class="percent">-19%</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="mt">
        <div ref="chartRef" style="width: 100%;height: 300px;"></div>
    </el-card>
    <el-card class="mt">
      <el-input v-model="name" style="max-width: 400px;" placeholder="请输入站点名称">
        <template #append>
          <el-button icon="Search" @click="loadData"></el-button>
        </template>
      </el-input>
      <el-button icon="Refresh" @click="handleReset"></el-button>
      <!-- 表单 -->
      <el-table :data="tableData" v-loading="loading">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column label="充电站名称" prop="name"></el-table-column>
        <el-table-column label="充电站ID" prop="id"></el-table-column>
        <el-table-column label="所属城市" prop="city"></el-table-column>
        <el-table-column label="充电站总量(个)" prop="count"></el-table-column>
        <el-table-column label="单日总收入(元)" prop="day">
          <template #default="scope">
            <span>{{ scope.row.month }}</span>
            <el-tag :type="scope.row.percent>0?'danger':'success'">
              {{scope.row.percent+"%"}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="月度总收入(万元)" prop="month" sortable>
          <template #default="scope">
            <span>{{ scope.row.month }}</span>
            <el-tag :type="scope.row.mpercent>0?'danger':'success'">
              {{scope.row.mpercent+"%"}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="电费营收(元)" prop="electricity"></el-table-column>
        <el-table-column label="停车费营收(元)" prop="parkingFee"></el-table-column>
        <el-table-column label="服务费营收(元)" prop="serviceFee"></el-table-column>
        <el-table-column label="会员储值金(元)" prop="member"></el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
        class="mt fr mb"
        v-model:current-page="pageInfo.page"
        v-model:page-size="pageInfo.pageSize"
        background
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totals"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import formatNumberToThousands from "@/utils/toThousands.ts"
import { onMounted, reactive, ref } from "vue";
import { chartApi, revenueApi } from "@/api/chargingstation";
import { useChart } from "@/hooks/useChart";
import { usePagination } from "@/hooks/usePagination";

const chartRef=ref(null)
const setChartData=async ()=>{
    const chartOptions = reactive({
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: []
        },
        xAxis: {
            type: 'category',
            data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月']
        },
        yAxis: [
            {
                type: 'value',
                name: '销售',
                position: 'left'
            },
            {
                type: 'value',
                name: '访问量',
                position: 'right'
            }
        ],
        series: [
            {
                name: '',
                type: 'bar',
                data: [],
                yAxisIndex: 0,
                itemStyle: {
                    color: '#409eff'
                }
            },
            {
                name: '',
                type: 'line',
                data: [],
                yAxisIndex: 1,
                itemStyle: {
                    color: '#409eff'
                },
                smooth: true
            }
        ]
    });
    const res = await chartApi()
    chartOptions.legend.data = res.data.list.map((item: any) => item.name);
    for (let i = 0; i < res.data.list.length; i++) {
      chartOptions.series[i]!.name = res.data.list[i].name
      chartOptions.series[i]!.data = res.data.list[i].data
    }
    return chartOptions
}
useChart(chartRef,setChartData)

const name = ref<string>("")
const tableData = ref([])
const loading = ref<boolean>(false)
const loadData = async () => {
  loading.value = true
  const {data:{list, total}} = await revenueApi({...pageInfo, name:name.value})
  setTotals(total)
  tableData.value = list
  tableData.value = list.map((item:any) => ({
    ...item,
    day: item.electricity + item.parkingFee + item.serviceFee + item.member
  }))
  loading.value = false
}

const { totals, pageInfo, handleCurrentChange, handleSizeChange, setTotals, resetPagination } = usePagination(loadData)

const handleReset = () => {
  resetPagination()
  name.value = ""
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style lang="less" scoped>
.title{
  display: flex;
  align-items: center;
  .round{
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: rgb(235, 236, 245);
    text-align: center;
    line-height: 30px;
  }
  h4{
    color: #666
  }
}
.total{
  display: flex;
  align-items: center;
  h1{
    font-size: 30px;
    margin-right: 20px;
  }
  .percent{
    display: inline-block;
    padding: 3px 5px;
    height: 20px;
    font-size: 12px;
    background-color: rgb(235, 247, 239);
    border-radius: 2px;
    line-height: 20px;
    color: green
  }
}
</style>