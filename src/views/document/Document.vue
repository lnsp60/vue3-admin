<template>
  <el-card>
    <div class="mt">
      <span class="title">文章类型</span>
      <el-tag :type="currentIndex[0]===-1?'primary':'info'" class="mr" @click="handleSelect(0,-1,'')">全部</el-tag>
      <el-tag :type="currentIndex[0]===index?'primary':'info'" class="mr" v-for="(item,index) in typeList.type" :key="item" @click="handleSelect(0,index,item)">{{ item }}</el-tag>
    </div>
    <div class="mt">
      <span class="title">重要程度</span>
      <el-tag :type="currentIndex[1]===-1?'primary':'info'" class="mr" @click="handleSelect(1,-1,'')">全部</el-tag>
      <el-tag :type="currentIndex[1]===index?'primary':'info'" class="mr" v-for="(item,index) in typeList.important" :key="item" @click="handleSelect(1,index,item)">{{ item }}</el-tag>
    </div>
    <div class="mt">
      <span class="title">发布渠道</span>
      <el-tag :type="currentIndex[2]===-1?'primary':'info'" class="mr" @click="handleSelect(2,-1,'')">全部</el-tag>
      <el-tag :type="currentIndex[2]===index?'primary':'info'" class="mr" v-for="(item,index) in typeList.publish" :key="item" @click="handleSelect(2,index,item)">{{ item }}</el-tag>
    </div>
    <el-divider></el-divider>
    <div class="mt">
      <span class="mr">已选</span>
      <el-tag @close="handleClose(item.num)" disable-transitions type="success" closable class="mr" v-for="item in selectedList" :key="item">{{ item.name }}</el-tag>
    </div>
  </el-card>
  <el-button type="primary" class="mt" @click="exportToHtml">导出富文本到HTML文件</el-button>
  <el-card class="mt">
    <Editor
      v-model="editorContent"
      apiKey="ilja8k510865v2x8cakcabtum3lhn4h1kah64q5un2ic9ce3"
      :init="{
        language: 'zh-CN',
        plugins: 'advlist anchor autolink charmap code fullscreen help image insertdatetime link lists media preview searchreplace table visualblocks wordcount',
        toolbar: 'undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
        height: 500,
      }"
    />
  </el-card>
  <el-button type="primary" @click="handleSubmit" class="mt">提交文章内容</el-button>
</template>

<script lang="ts" setup>
import { typeListApi } from '@/api/document';
import { onMounted, ref } from 'vue';
import Editor from '@tinymce/tinymce-vue'

interface ListType{
  type: string[],
  important: string[],
  publish: string[]
}

interface SelectedType{
  name: string,
  num: number
}

const typeList = ref<ListType>({
  type:[],
  important:[],
  publish:[]
})


const selectedList = ref<SelectedType[]>([]) //{name:"招商类", num:0}

const currentIndex = ref<number[]>([-1,-1,-1])
const handleSelect = (i:number,index:number,item:string) => {
  
  //findIndex获取指定数据的角标,没有的话返回-1
  const ind = selectedList.value.findIndex((item:SelectedType) => item.num === i)
  if(!item){//如果选全部，要从中删掉对应类别的数据
    selectedList.value = selectedList.value.filter((item:SelectedType) => item.num !== i)//不等的留下
  }else{
    if(ind === -1){
      //{name: item, num: i}此处命名如果相同的话可省略如{name, num}
      selectedList.value.push({name: item, num: i})
    }else{
      selectedList.value[ind] = {name: item, num: i}
    }
  }
  
  currentIndex.value[i] = index
}

const handleClose = (num:number) => {
  // selectedList.value = selectedList.value.filter((item:SelectedType) => item.num !== num)//不等的留下
  handleSelect(num,-1,'')
}

const editorContent = ref("")

const exportToHtml = () => {
  const blob = new Blob([editorContent.value],{type:"text/html"})
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = "document.html"
  link.click()
  URL.revokeObjectURL(link.href)
}

const handleSubmit = () => {
  console.log(selectedList.value.map(item=>item.name))
}

onMounted(async () => {
  const { data } = await typeListApi()
  typeList.value = data
})
</script>

<style lang="less" scoped>
.title{
  display: inline-block;
  width: 80px;
  font-size: 14px;
}
.el-tag{
  cursor: pointer;
}
</style>