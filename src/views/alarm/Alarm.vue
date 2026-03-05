<template>
  <el-card>
    <el-radio-group v-model="radio1" size="large" class="mt">
      <el-radio-button label="严重告警" :value="1"></el-radio-button>
      <el-radio-button label="紧急告警" :value="2"></el-radio-button>
      <el-radio-button label="重要告警" :value="3"></el-radio-button>
      <el-radio-button label="一般告警" :value="4"></el-radio-button>
    </el-radio-group>
  </el-card>
  <el-card class="mt" v-for="item in alarmList" :key="item.equNo">
    <el-alert :title="`${item.address}充电桩充电异常`" type="warning" show-icon />
    <el-descriptions :border="true" :column="4" direction="vertical" class="mt">
      <!-- 遍历数组时，(item, index) in arr（第一个是元素，第二个是索引） -->
      <!-- 遍历对象时，(val, key) 是「值在前、键在后」 -->
      <el-descriptions-item v-for="(val,key) in item" :label="getLabel(key)">
        <el-tag v-if="key==='level'" :type="val===1?'danger':val===2?'warning':'info'">
          {{ val===1?'严重':val===2?'紧急':'一般' }}
        </el-tag>
        <el-text type="danger" v-else-if="key==='status'">
          {{ val===1?'得指派':val===2?'处理中':'处理异常' }}
        </el-text>
        <span v-else>{{ val }}</span>
      </el-descriptions-item>
      <el-descriptions-item label="操作">
        <el-button @click="drawer=true; CDtitle=item.equNo" :type="item.status===2?'warning':'primary'">{{ item.status===1?"指派":item.status===2?"催办":"查看" }}</el-button>
      </el-descriptions-item>
    </el-descriptions>
  </el-card>
  <el-drawer
    v-model="drawer"
    title="报警任务指派"
  >
    <StepForm :steps="steps" :form1="form1" :form2="form2" :form3="form3" @handle-submit="handleSubmit">
      <template #step-1>
        <el-form :model="formData.basicInfo" :rules="basicRules" ref="form1">
          <!-- prop:与规则相关 -->
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formData.basicInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.basicInfo.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="tel">
            <el-input v-model="formData.basicInfo.tel"></el-input>
          </el-form-item>
          <el-form-item label="工号" prop="no">
            <el-input v-model="formData.basicInfo.no"></el-input>
          </el-form-item>
          <el-form-item label="是否加急">
            <el-switch v-model="formData.basicInfo.urgent"></el-switch>
          </el-form-item>
          <el-form-item label="其他选项">
            <el-checkbox-group v-model="formData.basicInfo.other">
              <el-checkbox value="1">更换设备</el-checkbox>
              <el-checkbox value="2">仅维修</el-checkbox>
              <el-checkbox value="3">需拍照片</el-checkbox>
              <el-checkbox value="4">需报备</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="其他信息">
            <el-input type="textarea" v-model="formData.basicInfo.remarks"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #step-2>
        <el-form :model="formData.shenpi" :rules="shenpiRules" ref="form2">
          <el-form-item label="审批部门" prop="a">
            <el-select placeholder="请选择申办部门" v-model="formData.shenpi.a">
              <el-option label="总裁办" value="1"></el-option>
              <el-option label="运营部" value="2"></el-option>
              <el-option label="维修部" value="3"></el-option>
              <el-option label="市场部" value="4"></el-option>
              <el-option label="财务部" value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label="抄送部门" prop="b">
            <el-select placeholder="请选择抄送部门" v-model="formData.shenpi.b">
              <el-option label="总裁办" value="1"></el-option>
              <el-option label="运营部" value="2"></el-option>
              <el-option label="维修部" value="3"></el-option>
              <el-option label="市场部" value="4"></el-option>
              <el-option label="财务部" value="5"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template #step-3>
        <el-form :model="formData.pInfo" :rules="pInfoRules" ref="form3">
          <el-form-item label="负责人姓名：" prop="person">
              <el-input  v-model="formData.pInfo.person"/>
            </el-form-item>
            <el-form-item label="负责人电话：" prop="tel">
              <el-input  v-model="formData.pInfo.tel"/>
          </el-form-item>
        </el-form>
      </template>
    </StepForm>
    <el-result
      icon="warning"
      :title="`设备编号：${CDtitle}`"
      sub-title="该任务已催促2次，请抓紧处理"
    >
      <template #extra>
        <el-button type="primary" @click="drawer=false">我已知晓</el-button>
      </template>
    </el-result>
  </el-drawer>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { alarmListApi } from '@/api/alarm';
import { getLabel } from './fieldLabelMap'
import StepForm from '@/components/stepForm/StepForm.vue';
import { ElMessage, type FormInstance } from 'element-plus';

interface AlarmListType{
  description: string,
  address: string,
  equNo: string,
  level: number,//1严重 2紧急 3一般
  time: string,
  code: number,//故障代码
  status: number,//1待指派 2处理中 处理异常
}

const alarmList = ref<AlarmListType[]>([])

const radio1 = ref<number>(1)
onMounted(async() => {
  const { data } = await alarmListApi()
  alarmList.value = data
})

// 
const drawer = ref<boolean>(false)
const steps = ref([
  {title: "基本信息"},
  {title: "审批信息"},
  {title: "负责人信息"}
])

const formData = ref({
  basicInfo:{
    name:"",
    email:"",
    tel:"",
    no:"",
    urgent:true,
    other: [],
    remarks: ""
  },
  shenpi:{
    a:"",
    b:""
  },
  pInfo:{
    person:"",
    tel:""
  }
})
const CDtitle = ref("")

const basicRules = {
  name:[
    {required:true,message:"请输入姓名",trigger:"blur"}
  ],
  email:[
    {required:true,message:"请输入邮箱",trigger:"blur"}
  ],
  tel:[
    {required:true,message:"请输入电话",trigger:"blur"}
  ],
  no:[
    {required:true,message:"请输入工号",trigger:"blur"}
  ]
}

const shenpiRules={
  a:[
    {required:true,message:"不能为空",trigger:"blur"}
  ],
  b:[
    {required:true,message:"不能为空",trigger:"blur"}
  ],
}

const pInfoRules={
  person:[
    {required:true,message:"不能为空",trigger:"blur"}
  ],
  tel:[
    {required:true,message:"不能为空",trigger:"blur"}
  ],
}

const form1 = ref<FormInstance>()
const form2 = ref<FormInstance>()
const form3 = ref<FormInstance>()

//提交表单
const handleSubmit = () => {
  console.log(formData.value)
  ElMessage({
    message: '指派成功',
    type: 'success',
  })
  drawer.value = false
}

</script>