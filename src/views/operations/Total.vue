<template>
  <el-row :gutter="10">
    <el-col :span="6">
      <el-card> 
        <el-input style="width: 80%;" placeholder="请输入关键词" v-model="filterText">
          <template #append>
            <el-button icon="Search"></el-button>
          </template>
        </el-input>
        <el-tree 
          ref="treeRef"
          class="mt" 
          :data="treeData" 
          style="max-width: 600px" 
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        ></el-tree>
      </el-card>
    </el-col>
    <el-col :span="18">
      <el-card>
        <template #header>
          <div class="card-header">
            <h3>{{ title }}:计费模板</h3>
          </div>
        </template>
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto">
          <el-form-item label="模板名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入模板名称" :disabled="!title"/>
          </el-form-item>
          <el-form-item
            :label="'时间区间'+(index+1)" 
            v-for="(timeSlot, index) in ruleForm.date" 
            :key="index"
          >
            <el-form-item :prop="'date.'+index+'.date1'" :rules="{required:true,message:'时间不能为空',trigger:'blur'}">
              <el-col :span="8">
                <el-time-picker
                  value-format="hh:mm:ss"
                  v-model="timeSlot.date1"
                  placeholder="选择开始时间"
                  :disabled="!title"
                >
                </el-time-picker>
              </el-col>
            </el-form-item>
            
            <el-col :span="1">--</el-col>
            <el-col :span="8">
              <el-form-item :prop="'date.'+index+'.date2'" :rules="{required:true,message:'时间不能为空',trigger:'blur'}">
                <el-time-picker
                  value-format="hh:mm:ss"
                  v-model="timeSlot.date2"
                  placeholder="选择结束时间"
                  :disabled="!title"
                >
                </el-time-picker>
              </el-form-item>
              
            </el-col>
            <el-col :span="7">
              <el-form-item label="电费" :prop="'date.'+index+'.electricity'" :rules="{required:true,message:'电费不能为空',trigger:'blur'}">
                <el-input :disabled="!title" v-model="timeSlot.electricity" placeholder="请输入电费"/>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-button class="mb" type="primary" @click="addTimeSlot">+ 添加时间区间</el-button>
          <el-form-item label="服务费" prop="service">
            <el-input :disabled="!title" v-model="ruleForm.service" placeholder="请输入服务费" style="max-width: 200px;"/>
          </el-form-item>
          <el-form-item label="停车费" prop="parking">
            <el-input :disabled="!title" v-model="ruleForm.parking" placeholder="请输入停车费" style="max-width: 200px;"/>
          </el-form-item>
          <el-form-item label="特别备注" prop="remarks">
            <el-input :disabled="!title" v-model="ruleForm.remarks" type="textarea" placeholder="请输入备注"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">创建</el-button>
            <el-button  @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { cityListApi } from '@/api/operation';
import { ElTree, type FormInstance, type FormRules } from 'element-plus';

interface Tree{
  label: string,
  children: Tree[]
}

interface RuleFormType{
  name: string,
  service: string,
  parking: string,
  remarks: string,
  date: Array<{date1:string, date2:string, electricity:string}>
}

const filterText = ref<string>("")
const treeRef = ref<InstanceType<typeof ElTree>>()

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

const defaultProps = {
  children: 'children',
  label: 'label'
}

const treeData = ref<Tree[]>([])
onMounted(
async() => {
  const { data } = await cityListApi()
  treeData.value = data
})

const filterNode:any = (value: string, data: Tree) => {
  if(!value){
    return true
  }
  return data.label.includes(value)
}

// 计费模板
const title = ref<string>("")
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<RuleFormType>>({
  name:[
    {required:true,message:"请输入模板名称",trigger:"blur"}
  ],
  service:[
    {required:true,message:"请输入服务费",trigger:"blur"}
  ],
  parking:[
    {required:true,message:"请输入停车费",trigger:"blur"}
  ],
  remarks:[
    {required:true,message:"请输入备注",trigger:"blur"}
  ],
})
const ruleForm = ref<RuleFormType>({
  name: "",
  service: "",
  parking: "",
  remarks: "",
  date: [
    {date1: "", date2: "", electricity:""}
  ]
})

const addTimeSlot = () => {
  ruleForm.value.date.push({date1: "", date2: "", electricity:""})
}

const submitForm = () => {
  ruleFormRef.value?.validate((valid) => {
    if(valid){
      console.log(ruleForm)
    }
  })
}

const handleNodeClick = (data:Tree) => {
  if(!data.children){
    title.value = data.label
    resetForm()
  }
}

const resetForm = () => {
  ruleForm.value = {
    name: "",
    service: "",
    parking: "",
    remarks: "",
    date: [
      {date1: "", date2: "", electricity:""}
    ]
  }
}
</script>