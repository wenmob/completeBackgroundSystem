<template>
  <div class="bis-page">
   <el-form :inline="true" :model="formInline" class="demo-form-inline" >
    <el-form-item label="使用类型:">
      <el-select v-model="formInline.type" clearable placeholder="" @keyup.enter.native="onSubmit">
          <el-option label="全部" value=""></el-option>
          <el-option label="PC" :value="0"></el-option>
          <el-option label="H5" :value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否显示:">
      <el-select v-model="formInline.isShow" clearable placeholder="" @keyup.enter.native="onSubmit">
          <el-option label="全部" value=""></el-option>
          <el-option label="显示" :value="true"></el-option>
          <el-option label="隐藏" :value="false"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="使用位置:">
      <el-select v-model="formInline.position" clearable placeholder="" @keyup.enter.native="onSubmit">
          <el-option label="全部" value=""></el-option>
          <el-option label="APP下载二维码" value="pay_background_img"></el-option>
          <el-option label="PC首页微信扫一扫背景图" value="index_Extension_background"></el-option>
          <el-option label="PC首页微信扫一扫二维码" value="Extension_WX_code"></el-option>
          <el-option label="PC首页产品配置背景图" value="index_prodct_background"></el-option>
          <el-option label="登录页背景图" value="login_background_img"></el-option>
          <el-option label="注册页背景图" value="register_background_img"></el-option>
          <el-option label="服务中心页背景图" value="onlinehelp_background_img"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button type="success" @click="add"><i class="el-icon-plus" v-if="handleAble('/admin/siteAdPosition/save', Buttons)"></i>添加</el-button>
    </el-form-item>
    </el-form>

   <el-table
    :data="tableData"
    >
    <el-table-column
      prop="pic"
      label="图片">
      <template slot-scope="scope">
        <img :src="scope.row.pic" width="180"/>
      </template>
    </el-table-column>
    <el-table-column
      prop="typeStr"
      label="类型/使用位置">
      <template slot-scope="scope">
        <span>
          {{scope.row.typeStr}} <br/>
          {{scope.row.positionStr}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      prop="remark"
      label="备注"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      prop="isShow"
      label="是否显示">
      <template slot-scope="scope">
        <span>{{scope.row.isShow == true ? '显示' : '隐藏'}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="dateAdd"
      label="添加/修改时间">
      <template slot-scope="scope">
        <span>
          {{scope.row.dateAdd ? scope.row.dateAdd : '-'}}<br/>
          {{scope.row.dateUpdate ? scope.row.dateUpdate : '-'}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      width="100">
      <template slot-scope="scope">
         <el-button @click="handleClick1(scope.row)" type="text"  style="color: #467929" v-if="handleAble('/admin/siteAdPosition/save', Buttons)">编辑</el-button>
         <el-button @click="handleClick2(scope.row)" type="text"  style="color: #DD5A43" v-if="handleAble('/admin/siteAdPosition/del', Buttons)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <div class="block" align="center" style="margin-top:20px;padding-bottom:40px;">
      <el-pagination
        small
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.tatal">
      </el-pagination>
   </div>
   <!--弹出框-->
   <el-dialog
    :title="alert"
    :visible.sync="dialogFormVisible"
    width="40%">
    <el-form  label-width="100px" :model="formLabelAlign" ref="formLabelAlign" :rules="rules" >
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
      <el-form-item label="链接地址" prop="url">
        <el-input v-model="formLabelAlign.url" @keyup.enter.native="submitForm('formLabelAlign')" clearable></el-input>
      </el-form-item>
      <el-form-item label="使用类型" prop="type">
        <el-select v-model="formLabelAlign.type" clearable placeholder="请选择" @keyup.enter.native="submitForm('formLabelAlign')">
          <el-option label="PC" :value="0"></el-option>
          <el-option label="H5" :value="1"></el-option>
         </el-select>
      </el-form-item>
      <el-form-item label="使用位置" prop="position">
        <el-select v-model="formLabelAlign.position" clearable placeholder="请选择" @keyup.enter.native="submitForm('formLabelAlign')">
          <el-option label="APP下载二维码" value="pay_background_img"></el-option>
          <el-option label="PC首页微信扫一扫背景图" value="index_Extension_background"></el-option>
          <el-option label="PC首页微信扫一扫二维码" value="Extension_WX_code"></el-option>
          <el-option label="PC首页产品配置背景图" value="index_prodct_background"></el-option>
          <el-option label="登录页背景图" value="login_background_img"></el-option>
          <el-option label="注册页背景图" value="register_background_img"></el-option>
          <el-option label="服务中心页背景图" value="onlinehelp_background_img"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :rows="5" v-model="formLabelAlign.remark"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="paixu">
        <el-input v-model.number="formLabelAlign.paixu" @keyup.enter.native="submitForm('formLabelAlign')" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否显示" prop="isShow">
        <el-select v-model="formLabelAlign.isShow" clearable placeholder="请选择" @keyup.enter.native="submitForm('formLabelAlign')">
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
      upload_url: uri + '/plupload',
      dialogFormVisible: false,
      formInline: {
        page: 1,
        pageSize: 10,
        type: '',
        isShow: '',
        position: ''
      },
      tableData: [],
      formLabelAlign: {
        id: '',
        pic: '',
        url: '',
        type: '',
        position: '',
        remark: '',
        paixu: 0,
        isShow: true
      },
      pagination: {
        currentPage: 1,
        pageSizes: [10],
        pageSize: 0,
        tatal: 0
      },
      rules: {
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        position: [{ required: true, message: '请选择使用位置', trigger: 'blur' }],
        paixu: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          { type: 'number', message: '必需输入数字' }
        ],
        isShow: [{ required: true, message: '请选择是否显示', trigger: 'blur' }],
        pic: [{ required: true, message: '请选择图片', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
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
      APIMerchant.siteAdPositionList(formInline).then(response => {
        if (response.code === 0) {
          let result = response.data.pageBean.result
          that.pagination.pageSize = response.data.pageBean.pageSize
          that.pagination.tatal = response.data.pageBean.totalRow
          that.tableData = result
        }
      })
    },
    // 查询
    onSubmit () {
      const that = this
      that.formInline.page = 1
      that.getTableDate()
    },
    handleSizeChange (val) {
    // console.log(`每页 ${val} 条`)

    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      const that = this
      that.formInline.page = val
      that.getTableDate()
    },
    // 编辑的功能
    handleClick1 (data) {
      const that = this
      APIMerchant.siteAdPositionGetById(data.id).then(response => {
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
        APIMerchant.siteAdPositionDel(data.id).then(response => {
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
        pic: '',
        url: '',
        type: '',
        position: '',
        remark: '',
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
          APIMerchant.siteAdPositionSave(that.formLabelAlign).then(response => {
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
      for (let x in this.formLabelAlign) {
        this.formLabelAlign[x] = ''
      }
    },
    handleAvatarSuccess (res, file) {
      this.formLabelAlign.pic = res.url
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
