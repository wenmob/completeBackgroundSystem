<template>
  <div class="bis-page">
   <el-form :inline="true" :model="formInline" class="demo-form-inline" >
    <el-form-item label="用户名：">
      <el-input v-model="formInline.username" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="手机号：">
      <el-input v-model="formInline.mobile" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="姓名：">
      <el-input v-model="formInline.realNameLike" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button type="danger" @click="exportExcel">导出</el-button>
    </el-form-item>
    </el-form>

   <el-table
    :data="tableData"
    id="out-table"
    style="width: 100%"
    >
    <el-table-column
      prop="id"
      label="用户ID"
      width="70">
    </el-table-column>
    <el-table-column
      prop="username"
      label="用户名/手机号">
      <template slot-scope="scope">
        <span>{{scope.row.username ? scope.row.username : '-'}}<br/>{{scope.row.mobile ? scope.row.mobile : '-'}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名">
    </el-table-column>
    <el-table-column
      prop="balance"
      sortable
      label="可用余额">
    </el-table-column>
    <el-table-column
      prop="freeze"
      sortable
      label="冻结金额">
    </el-table-column>
    <el-table-column
      prop="voucherMoney"
      sortable
      label="抵用金">
    </el-table-column>
    <el-table-column
      prop="score"
      sortable
      label="积分">
    </el-table-column>
    <el-table-column
      label="操作"
      width="70"
      v-if="merchantSet.isOwnZiguan && handleAble('/admin/userMoney/modify', Buttons)">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text"  style="color: #DD5A43">加减币</el-button>
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
   <el-dialog title="加减币" :visible.sync="dialogFormVisible" width="40%">
     <el-form label-width="100px" :model="formLabelAlign" :rules="rules" ref="formLabelAlign" >
        <el-form-item label="金钱" prop="amount">
          <el-input v-model="formLabelAlign.amount" @keyup.enter.native="submitForm('formLabelAlign')" clearable placeholder="减币请输入负值"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="4" v-model="formLabelAlign.remark"></el-input>
        </el-form-item>
        <el-form-item label="上传图片凭证">
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
        <el-form-item>
          <el-button type="primary" @click="submitForm('formLabelAlign')">提交</el-button>
          <!-- <el-button @click="resetForm('formLabelAlign')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { APIFinance } from '../../utils/apiFinance'
import uri from '@/utils/BaseUrl'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { getMS } from '@/utils/auth'
export default {
  data () {
    let checkNum = (rule, value, callback) => {
      if (isNaN(value)) {
        return callback(new Error('输入的必须是数字'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      upload_url: uri + '/plupload',
      merchantSet: {},
      formInline: {
        page: 1,
        pageSize: 10,
        username: '',
        mobile: '',
        realNameLike: '',
        orderBy: ''
      },
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSizes: [10],
        pageSize: 0,
        tatal: 0
      },
      formLabelAlign: {
        userId: '',
        amount: '',
        remark: '',
        pic: ''
      },
      rules: {
        amount: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { validator: checkNum, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getTableDate(this.formInline, 10)
    let m = JSON.parse(getMS())
    this.merchantSet = m
  },
  methods: {
    // 获取表格数据
    getTableDate (formInline, pageSize) {
      const that = this
      APIFinance.getUserMoney(formInline).then(response => {
        if (response.code === 0) {
          let result = response.data.pageBean.result
          that.pagination.pageSize = response.data.pageBean.pageSize
          that.pagination.tatal = response.data.pageBean.totalRow
          if (result.length > 0) {
            result.forEach(ele => {
              let userObj = response.data.userBaseInfoMap[ele.id]
              ele.mobile = userObj.mobile
              ele.name = userObj.name
              ele.username = userObj.username
            })
          }
          that.tableData = result
        }
      })
    },
    onSubmit () {
      const that = this
      that.formInline.page = 1
      that.getTableDate(that.formInline, 15)
    },

    handleClick (data) {
      for (let x in this.formLabelAlign) {
        this.formLabelAlign[x] = ''
      }
      this.formLabelAlign.userId = data.id
      this.dialogFormVisible = true
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)

    },

    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      const that = this
      that.formInline.page = val
      that.getTableDate(that.formInline, 15)
    },
    // 清除图片的方法
    clearUploadedImage () {
      this.$refs.uploadLogo.clearFiles()
    },
    // 提交的效果
    submitForm (formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let formLabelAlign = that.formLabelAlign
          APIFinance.userMoneyModify(formLabelAlign.userId, formLabelAlign.amount, formLabelAlign.remark, formLabelAlign.pic).then(response => {
            if (response.code === 0) {
              that.$message({
                message: '提交成功',
                type: 'success',
                onClose: () => {
                  that.getTableDate(that.formInline, 15)
                  that.resetForm(formName)
                  that.dialogFormVisible = false
                }
              })
            } else {
              that.$message({
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
    // 重置的效果
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 导出Excel
    exportExcel () {
      const that = this
      const defaultCellStyle = {font: {name: 'Verdana', sz: 11, color: 'FF00FF88'}, fill: {fgColor: {rgb: 'FFFFAA00'}}}
      const wopts = {bookType: 'xlsx', bookSST: false, type: 'binary', defaultCellStyle: defaultCellStyle, showGridLines: false}
      const wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} }
      let data = []
      let objArr = []
      let formSerach = Object.assign({}, that.formInline)
      formSerach.page = 1
      formSerach.pageSize = 10000
      APIFinance.getUserMoney(formSerach).then(response => {
        if (response.code === 0) {
          let result = response.data.pageBean.result
          if (result.length > 0) {
            result.forEach(ele => {
              let userObj = response.data.userBaseInfoMap[ele.id]
              ele.mobile = userObj.mobile
              ele.name = userObj.name
              ele.username = userObj.username
              let obj = {
                '序号': ele.id,
                '姓名': ele.name,
                '用户名': ele.username,
                '手机号': ele.mobile,
                '可用余额': ele.balance,
                '冻结金额': ele.freeze,
                '抵用金': ele.voucherMoney,
                '积分': ele.score
              }
              objArr.push(obj)
            })
            data = objArr
            wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(data)
            // 创建二进制对象写入转换好的字节流
            let tmpDown = new Blob([this.s2ab(XLSX.write(wb, wopts))], { type: 'application/octet-stream' })
            FileSaver.saveAs(tmpDown, '用户余额.xlsx')
          }
        }
      })
    },
    // 字符串转字符流
    s2ab (s) {
      if (typeof ArrayBuffer !== 'undefined') {
        let buf = new ArrayBuffer(s.length)
        let view = new Uint8Array(buf)
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
        return buf
      } else {
        var buf = new Array(s.length)
        for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF
        return buf
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
