<template>
  <div class="bis-page">
   <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
    <el-form-item label="名称:">
      <el-input v-model="formInline.nameLike" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="使用类型:">
      <el-select v-model="formInline.type" clearable placeholder="" @keyup.enter.native="onSubmit">
          <el-option label="全部" value=""></el-option>
          <el-option label="PC" value="0"></el-option>
          <el-option label="H5" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="使用位置:">
      <el-select v-model="formInline.pos" clearable placeholder="" @keyup.enter.native="onSubmit">
          <el-option label="全部" value=""></el-option>
          <el-option label="首页" value="0"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否显示:">
      <el-select v-model="formInline.isShow" clearable placeholder="" @keyup.enter.native="onSubmit">
          <el-option label="全部" value=""></el-option>
          <el-option label="显示" :value="true"></el-option>
          <el-option label="隐藏" :value="false"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="添加时间起:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateAddBegin" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="添加时间止:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateAddEnd" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button v-if="handleAble('/admin/siteBanner/save', Buttons)" type="success" @click="add"><i class="el-icon-plus"></i>添加</el-button>
    </el-form-item>
    </el-form>

   <el-table
    :data="tableData"
    style="width: 100%"
    size="small">
    <el-table-column
      prop="name"
      label="名称">
    </el-table-column>
    <el-table-column
      prop="pic"
      label="图片">
      <template slot-scope="scope">
        <img :src="scope.row.pic" width="180">
      </template>
    </el-table-column>
    <el-table-column
      prop="typeStr"
      label="类型">
    </el-table-column>
    <el-table-column
      prop="posStr"
      label="位置">
    </el-table-column>
    <el-table-column
      label="链接">
      <template slot-scope="scope">
        <a :href="scope.row.url" target="_target" v-if="scope.row.url">预览</a>
        <a :href="scope.row.pic" target="_target" v-else>预览</a>
      </template>
    </el-table-column>
    <el-table-column
      prop="profile"
      label="描述">
      <template slot-scope="scope">
        <el-tooltip class="item" effect="dark" :content="scope.row.profile" placement="left">
          <span>{{scope.row.profile|WidthCheck(12)}}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column
      prop="isShow"
      label="是否显示">
      <template slot-scope="scope">
        <span>{{scope.row.isShow == true ? '显示' : '隐藏'}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      width="90">
      <template slot-scope="scope">
         <el-button v-if="handleAble('/admin/siteBanner/save', Buttons)" @click="handleClick1(scope.row)" type="text" size="small" style="color: #467929">编辑</el-button>
         <el-button v-if="handleAble('/admin/siteBanner/del', Buttons)" @click="handleClick2(scope.row)" type="text" size="small" style="color: #DD5A43">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

   <!--弹出框-->
   <el-dialog
    :title="alert"
    :visible.sync="dialogFormVisible"
    width="30%">
    <el-form  label-width="100px" :model="formLabelAlign" ref="formLabelAlign" :rules="rules" size="small">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formLabelAlign.name" @keyup.enter.native="submitForm('formLabelAlign')" clearable></el-input>
      </el-form-item>
      <el-form-item label="上传图片" prop="pic">
         <el-upload
          class="avatar-uploader"
          :action="upload_url"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
            <img v-if="formLabelAlign.pic" :src="formLabelAlign.pic" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
      </el-form-item>
      <el-form-item label="使用类型" prop="type">
        <el-select v-model="formLabelAlign.type" clearable placeholder="" @keyup.enter.native="submitForm('formLabelAlign')">
          <el-option label="PC" :value="0"></el-option>
          <el-option label="H5" :value="1"></el-option>
         </el-select>
      </el-form-item>
      <el-form-item label="使用位置" prop="pos">
        <el-select v-model="formLabelAlign.pos" clearable placeholder="" @keyup.enter.native="submitForm('formLabelAlign')">
          <el-option label="首页" :value="0"></el-option>
         </el-select>
      </el-form-item>
      <el-form-item label="链接地址" prop="url">
        <el-input v-model="formLabelAlign.url" @keyup.enter.native="submitForm('formLabelAlign')" clearable></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="profile">
        <el-input type="textarea" :rows="2" v-model="formLabelAlign.profile"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="paixu">
        <el-input v-model.number="formLabelAlign.paixu" @keyup.enter.native="submitForm('formLabelAlign')" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否显示" prop="isShow">
        <el-select v-model="formLabelAlign.isShow" clearable placeholder="" @keyup.enter.native="submitForm('formLabelAlign')">
          <el-option label="显示" :value="true"></el-option>
          <el-option label="隐藏" :value="false"></el-option>
         </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formLabelAlign')">提交</el-button>
        <!-- <el-button @click="resetForm('formLabelAlign')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </el-dialog>
  </div>
</template>

<script>
import { APIMerchant } from '../../utils/apiMerchant'
import uri from '@/utils/BaseUrl'
export default {
  data () {
    return {
      dialogFormVisible: false,
      upload_url: uri + '/plupload',
      formInline: {
        pos: '',
        page: 1,
        dateAddBegin: '',
        dateAddEnd: '',
        type: '',
        isShow: '',
        nameLike: ''
      },
      tableData: [],
      formLabelAlign: {
        id: '',
        name: '',
        pic: '',
        url: '',
        type: 0,
        pos: 0,
        profile: '',
        paixu: 0,
        isShow: true
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        pos: [{ required: true, message: '请选择位置', trigger: 'blur' }],
        paixu: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          { type: 'number', message: '排序必须是数字' }
        ],
        isShow: [{ required: true, message: '请选择是否显示', trigger: 'blur' }],
        pic: [{ required: true, message: '请选择图片', trigger: 'blur' }]
      },
      alert: '添加'
    }
  },
  mounted () {
    this.getTableDate()
  },
  methods: {
    // 获取表格数据
    getTableDate () {
      const that = this
      let formInline = that.formInline
      APIMerchant.siteBannerList(formInline).then(response => {
        if (response.code === 0) {
          let result = response.data.list
          that.tableData = result
        }
      })
    },
    onSubmit () {
      const that = this
      that.formInline.page = 1
      that.getTableDate()
    },
    // 编辑的功能
    handleClick1 (data) {
      const that = this
      APIMerchant.siteBannerGetById(data.id).then(response => {
        if (response.code === 0) {
          that.imgArr = []
          let bean = response.data.bean
          that.formLabelAlign = bean
          that.imgArr.push({name: 'pic', url: bean.pic})
          that.alert = '编辑'
          that.dialogFormVisible = true
        }
      })
    },
    // 删除的功能
    handleClick2 (data) {
      const that = this
      this.$confirm('确定要删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        APIMerchant.siteBannerDel(data.id).then(response => {
          if (response.code === 0) {
            this.$message({
              message: '已删除',
              type: 'success'
            })
            that.getTableDate()
          } else {
            this.$message({
              message: response.data,
              type: 'warning'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 手动添加的功能
    add () {
      const that = this
      that.alert = '添加'
      that.formLabelAlign = {
        id: '',
        name: '',
        pic: '',
        url: '',
        type: 0,
        pos: 0,
        profile: '',
        paixu: 0,
        isShow: true
      }
      that.dialogFormVisible = true
    },
    // 提交
    submitForm (formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          APIMerchant.siteBannerSave(that.formLabelAlign).then(response => {
            if (response.code === 0) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              that.resetForm(formName)
              that.getTableDate()
              that.dialogFormVisible = false
            } else {
              this.$message({
                message: response.data,
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
    },
    handleAvatarSuccess (res, file) {
      this.formLabelAlign.pic = URL.createObjectURL(file.raw)
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
  },
  filters: {
    WidthCheck (str, maxLen) {
      let w = 0
      let temp = str
      if (!temp) {
        return '-'
      }
      //  length 获取字数数，不区分汉子和英文
      for (let i = 0; i < temp.length; i++) {
        //  charCodeAt()获取字符串中某一个字符的编码
        let c = temp.charCodeAt(i)
        //  单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
          w++
        } else {
          w += 2
        }
        if (w > maxLen) {
          temp = str.substr(0, i) + '...'
          break
        }
      }
      return temp
    }
  }
}
</script>

<style>
  @import url('../../assets/css/bus.css');
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
