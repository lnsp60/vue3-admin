import type { Ref } from "vue"
import { onBeforeMount, onMounted, ref, markRaw } from "vue"
import * as echarts from 'echarts';

export function useChart(chartRef:Ref<HTMLElement|null>, setChartData:any){
  const chartInstance = ref<echarts.ECharts|null>(null)

  const initChart = async() => {
    if(chartRef.value){
      //markRaw：取消vue的响应式监视
      chartInstance.value = markRaw(echarts.init(chartRef.value))
      const option = await setChartData()
      chartInstance.value.setOption(option)
    }
  }

  const resizeChart = () => {
    chartInstance.value?.resize()
  }

  onMounted(()=> {
    initChart()
    //窗口改变时表改变
    window.addEventListener("resize",resizeChart)
  })

  onBeforeMount(() => {
    window.removeEventListener("resize",resizeChart)
    if(chartInstance.value){
      //释放资源
      chartInstance.value.dispose()
    }
  })
}