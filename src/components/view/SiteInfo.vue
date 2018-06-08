<template>
  <div class="bis-page">
    <el-form :model="form" status-icon ref="ruleForm" label-width="130px" :rules="rules" class="demo-ruleForm" style="width:800px" >
      <el-form-item label="网站名称：" >
        <el-input type="text" v-model="form.siteName" @keyup.enter.native="submitForm" clearable auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="LOGO图片：">
         <el-upload
          class="avatar-uploader"
          :action="upload_url"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
            <img v-if="form.logo" :src="form.logo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
      </el-form-item>
      <el-form-item label="邀请才能注册：" prop="regUseSellerid">
        <el-select v-model="form.regUseSellerid" placeholder="请选择" @keyup.enter.native="submitForm">
          <el-option label="开启" :value="true"></el-option>
          <el-option label="关闭" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客服热线：" >
        <el-input v-model.number="form.tel" @keyup.enter.native="submitForm" clearable></el-input>
      </el-form-item>
      <el-form-item label="PC网站底部：" style="height: 386px">
        <quill-editor v-model="form.bottomContent"
          ref="myTextEditor"
          class="editer"
          :options="editorOption">
       </quill-editor>
      </el-form-item>
      <el-form-item label="PC右侧浮层代码：">
        <el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="form.floatRightHtml"></el-input>
      </el-form-item>
      <el-form-item label="提现说明：">
        <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="form.content"></el-input>
      </el-form-item>
      <el-form-item v-if="handleAble('/admin/merchantInfo/save', Buttons)">
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <!-- <el-button @click="resetForm">重置</el-button> -->
      </el-form-item>
</el-form>
  </div>
</template>

<script>
import {quillRedefine} from 'vue-quill-editor-upload'
import { quillEditor } from 'vue-quill-editor' // 调用编辑器
import { API } from '../../utils/api'
import uri from '@/utils/BaseUrl'
export default {
  data () {
    return {
      upload_url: uri + '/plupload',
      form: {
        siteName: '',
        logo: '',
        regUseSellerid: false,
        tel: '',
        bottomContent: '',
        content: '',
        floatRightHtml: ''
      },
      rules: {
        regUseSellerid: [{required: true, message: '请选择邀请注册', trigger: 'blur'}]
      },
      editorOption: {}

    }
  },
  components: {
  // 使用编辑器
    quillEditor
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
  computed: {
    editor () {
      return this.$refs.myTextEditor.quillEditor
    }
  },
  mounted () {
    this.getSiteInfo()
  },
  methods: {
    // 获取站点的信息
    getSiteInfo () {
      const that = this
      API.getSiteInfo().then(response => {
        if (response.code === 0) {
          that.form = response.data.bean
          that.form.content = response.data.content
        }
      })
    },
    // 清除图片的方法
    clearUploadedImage () {
      this.$refs.uploadLogo.clearFiles()
    },
    submitForm () {
      const that = this
      API.saveSiteInfo(that.form).then(response => {
        if (response.code === 0) {
          that.$message({
            message: '提交成功',
            type: 'success'
          })
        } else {
          that.$message({
            message: response.msg,
            type: 'warning'
          })
        }
      })
    },
    // 重置的功能
    resetForm () {
      this.clearUploadedImage()
      for (let index in this.form) { // 千万别这样做
        this.form[index] = ''
      }
    },
    handleAvatarSuccess (res, file) {
      this.form.logo = res.url
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style>
  @import url('../../assets/css/bus.css');
  .quill-editor {
    height: 300px;
  }
   .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
