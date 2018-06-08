<template>
  <div class="bis-page">
     <el-form  label-width="100px" :model="formLabelAlign" ref="formLabelAlign" :rules="rules" >
      <el-form-item label="类型" prop="type">
        <el-select v-model="formLabelAlign.type" clearable placeholder="" @keyup.enter.native="submitForm('formLabelAlign')">
          <el-option label="全站公告" :value="0"></el-option>
          <el-option label="会员公告" :value="1"></el-option>
         </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="formLabelAlign.title" @keyup.enter.native="submitForm('formLabelAlign')" clearable></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content" style="height: 320px">
         <quill-editor v-model="formLabelAlign.content"
          ref="myTextEditor"
          class="editer"
          :options="editorOption">
         </quill-editor>
      </el-form-item>

      <el-form-item label="是否显示" prop="isShow">
        <el-select v-model="formLabelAlign.isShow" clearable placeholder="全部" @keyup.enter.native="submitForm('formLabelAlign')">
          <el-option label="显示" :value="true"></el-option>
          <el-option label="隐藏" :value="false"></el-option>
         </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formLabelAlign')">提交</el-button>
        <!-- <el-button @click="resetForm('formLabelAlign')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { APIMerchant } from '../../utils/apiMerchant'
import {quillRedefine} from 'vue-quill-editor-upload'
import { quillEditor } from 'vue-quill-editor' // 调用编辑器
import uri from '@/utils/BaseUrl'
export default {
  data () {
    return {
      formLabelAlign: {
        id: '',
        type: 0,
        title: '',
        content: '',
        isShow: true
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        content: [{ required: true, message: '公告内容不能为空', trigger: 'blur' }],
        isShow: [{ required: true, message: '请选择是否显示', trigger: 'blur' }]
      },
      editorOption: {}
    }
  },
  created () {
    this.editorOption = quillRedefine(
      {
        // 图片上传的设置
        uploadConfig: {
          action: uri + '/plupload', // 必填参数 图片上传地址
          // 必选参数  res是一个函数，函数接收的response为上传成功时服务器返回的数据
          // 你必须把返回的数据中所包含的图片地址 return 回去
          res: (respnse) => {
            return respnse.url
          },
          methods: 'POST', // 可选参数 图片上传方式  默认为post
          token: sessionStorage.token, // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
          name: 'file', // 可选参数 文件的参数名 默认为img
          size: 500, // 可选参数   图片限制大小，单位为Kb, 1M = 1024Kb
          accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon', // 可选参数 可上传的图片格式
          // start: function (){}
          start: () => {
          }, // 可选参数 接收一个函数 开始上传数据时会触发
          end: () => {
          }, // 可选参数 接收一个函数 上传数据完成（成功或者失败）时会触发
          success: () => {
          }, // 可选参数 接收一个函数 上传数据成功时会触发
          error: () => {
          } // 可选参数 接收一个函数 上传数据中断时会触发
        },
        // 以下所有设置都和vue-quill-editor本身所对应
        placeholder: '', // 可选参数 富文本框内的提示语
        theme: '', // 可选参数 富文本编辑器的风格
        // 可选参数  选择工具栏的需要哪些功能  默认是全部
        handlers: {} // 可选参数 重定义的事件，比如link等事件
      }
    )
  },
  components: {
  // 使用编辑器
    quillEditor
  },
  computed: {
    editor () {
      return this.$refs.myTextEditor.quillEditor
    }
  },
  mounted () {
    this.checkHasId()
  },
  methods: {
    // 判断是否有id传入
    checkHasId () {
      const that = this
      if (this.$route.query.id) {
        let id = this.$route.query.id
        APIMerchant.siteNoticeGetById(id).then(response => {
          if (response.code === 0) {
            let bean = response.data.bean
            that.formLabelAlign = bean
          }
        })
      }
    },
    // 提交
    submitForm (formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          APIMerchant.siteNoticeSave(that.formLabelAlign).then(response => {
            if (response.code === 0) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$router.push('/admin/siteNotice/list')
            } else {
              this.$message({
                message: response.msg,
                type: 'warning'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>
  @import url('../../assets/css/bus.css');
  .quill-editor {
    height: 310px;
  }
  .ql-container {
    height: 260px;
  }
</style>
