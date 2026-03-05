<script setup lang="ts">
import logo from "@/assets/logo.png"
import { ref,reactive } from "vue"
import type { FormRules,FormInstance } from 'element-plus'
import { useUserStore } from "@/store/auth"
import { useRouter } from "vue-router"
interface ruleForm{
  username:string,
  password:string
}

const ruleForm = reactive({
  username:"",
  password:""
})

const rules = reactive<FormRules<ruleForm>>({
  username:[
    {required: true,message: "用户名不能为空",trigger:"blur"},
    {min: 4,max: 8,message: "用户名要求4-8位数字字母组合",trigger:"blur"},
  ],
  password:[
    {required: true,message: "密码不能为空",trigger:"blur"},
    // {pattern: /^\d{6}$/,message: "密码必须是6位纯数字",trigger:"blur"},
  ]
})

const formRef = ref<FormInstance>()
const userStore = useUserStore()
const router = useRouter()
const handleLogin = () => {
  formRef.value?.validate(async (valid:boolean) => { //?. 可选链操作符   obj?obj.name:"" obj?.name
    if(valid){
      //校验通过
      //userStore.login(ruleForm) 大概率是异步操作（比如发 AJAX 请求给后端验证密码），
      // 但你没有等待它执行完成、也没有判断返回结果；
      // router.push("/") //错误.
      //加守卫可行
      await userStore.login(ruleForm)
      router.push("/") 
    }
  })
}
</script>

<template>
  <div class="bg">
    <div class="login">
      <div class="logo">
        <img :src="logo" alt="" width="70px" height="70px">
        <h1 class="ml">动力港湾资源管理平台</h1>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="formRef">
        <!-- prop的作用是将当前表单项与表单验证规则、表单数据进行关联，是实现表单验证、错误提示、数据联动的关键 -->
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入用户名" prefix-icon="User"/>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="ruleForm.password" placeholder="请输入密码" prefix-icon="Lock" type="password"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" style="width: 100%">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
.bg {
  background-image: url("@/assets/bg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  .login {
    width: 500px;
    height: 300px;
    padding: 50px;
    box-shadow: 0 0 10px 10px #f4f4f4;
    text-align: center;
    position: absolute;
    top: 50%;
    margin-top: -200px;
    left: 10%;

    .logo {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 40px;
      h1 {
        color: rgb(14, 53, 148);
      }
    }
  }
}
</style>
