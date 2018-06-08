<template>
  <div class="bis-page">
   <el-form :inline="true" :model="formInline" class="demo-form-inline" >
    <el-form-item label="订单号:">
      <el-input v-model="formInline.number" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="银行名称:">
      <el-input v-model="formInline.bankName" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="银行卡号:">
      <el-input v-model="formInline.beankNumber" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="状态:">
      <el-select v-model="formInline.status" placeholder="请选择" @keyup.enter.native="onSubmit">
        <el-option label="全部" value=""></el-option>
        <el-option label="待支付" value="0"></el-option>
        <el-option label="打款中" value="3"></el-option>
        <el-option label="失败" value="1"></el-option>
        <el-option label="成功" value="2"></el-option>
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
      <el-button type="danger" @click="exportExcel">导出</el-button>
    </el-form-item>
    </el-form>

   <el-table
    :data="tableData"
    >
    <el-table-column
      prop="username"
      label="用户名/手机号">
      <template slot-scope="scope">
        <span>{{scope.row.username ? scope.row.username : '-'}}<br/>{{scope.row.mobile ? scope.row.mobile : '-'}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="姓名/订单号">
      <template slot-scope="scope">
        <span>
          {{scope.row.name}}<br/>
          {{scope.row.number}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      label="所在地">
      <template slot-scope="scope">
        <span>{{scope.row.province + scope.row.city}}<br>{{scope.row.district}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="银行信息">
      <template slot-scope="scope">
        {{scope.row.bankName + scope.row.branch}}<br>
        {{scope.row.beankNumber}}
      </template>
    </el-table-column>
    <el-table-column
    width="100%"
      label="金额/手续费">
      <template slot-scope="scope">
        {{(scope.row.amount*1).toFixed(2)}}<br>
        {{(scope.row.fee*1).toFixed(2)}}
      </template>
    </el-table-column>
    <el-table-column
      prop="statusStr"
      width="100%"
      label="状态">
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      width="100%"
      label="审核人">
      <template slot-scope="scope">
        <span>{{scope.row.admin}} <br> {{scope.row.remark}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="dateAdd"
      label="添加/修改时间">
      <template slot-scope="scope">
        {{scope.row.dateAdd}}<br>
        {{scope.row.dateUpdate}}
      </template>
    </el-table-column>
    <el-table-column
    width="100%"
      label="操作"
      v-if="merchantSet.isOwnZiguan">
      <template slot-scope="scope">
        <div v-if="scope.row.status == 0">
          <el-dropdown>
            <el-button type="primary">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><el-button v-if="handleAble('/admin/userCashWithdraw/pay', Buttons)" @click="handleClick1(scope.row)" type="text"  style="color: #DD5A43">代付</el-button></el-dropdown-item>
              <el-dropdown-item><el-button v-if="handleAble('/admin/userCashWithdraw/payWlyx', Buttons)" @click="handleClick2(scope.row)" type="text"  style="color: #DD5A43">未来优势代付</el-button></el-dropdown-item>
              <el-dropdown-item><el-button v-if="handleAble('/admin/userCashWithdraw/setSuccess', Buttons)" @click="handleClick3(scope.row)" type="text"  style="color: #4D9029">通过</el-button></el-dropdown-item>
              <el-dropdown-item><el-button v-if="handleAble('/admin/userCashWithdraw/setFail', Buttons)" @click="handleClick4(scope.row)" type="text"  style="color: #DD5A43">不通过</el-button></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
       </div>
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
   <el-dialog :title="passStr" :visible.sync="dialogFormVisible" width="40%">
     <el-form label-width="100px" :model="formLabelAlign" ref="formLabelAlign" >
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
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import { APIFinance } from '../../utils/apiFinance'
import uri from '@/utils/BaseUrl'
import { getMS } from '@/utils/auth'
export default {
  data () {
    return {
      dialogFormVisible: false,
      merchantSet: {},
      upload_url: uri + '/plupload',
      formInline: {
        page: 1,
        pageSize: 10,
        dateAddBegin: '',
        dateAddEnd: '',
        number: '',
        bankName: '',
        beankNumber: '',
        status: ''
      },
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSizes: [10],
        pageSize: 0,
        tatal: 0
      },
      formLabelAlign: {
        id: '',
        remark: '',
        pic: ''
      },
      pass: 0,
      passStr: ''
    }
  },
  mounted () {
    this.getTableDate()
    let m = JSON.parse(getMS())
    this.merchantSet = m
  },
  methods: {
    // 获取表格数据
    getTableDate () {
      const that = this
      let formInline = that.formInline
      APIFinance.userCashWithdrawList(formInline).then(response => {
        if (response.code === 0) {
          let result = response.data.pageBean.result
          that.pagination.pageSize = response.data.pageBean.pageSize
          that.pagination.tatal = response.data.pageBean.totalRow
          if (result.length > 0) {
            result.forEach(ele => {
              let user = response.data.userBaseInfoMap[ele.userId]
              ele.username = user.username
              ele.name = user.name
              ele.mobile = user.mobile
              if (ele.adminId) {
                ele.admin = response.data.merchantSubAcountMap[ele.adminId].name
              }
            })
          }
          that.tableData = result
        }
      })
    },
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
    // 代付的功能
    handleClick1 (data) {
      const that = this
      this.$confirm('确定要代付？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        APIFinance.userCashWithdrawPay(data.id).then(response => {
          if (response.code === 0) {
            this.$message({
              message: '代付成功',
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
    // 未来优势代付
    handleClick2 (data) {
      const that = this
      this.$confirm('确定要代付？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        APIFinance.userCashWithdrawPayWlyx(data.id).then(response => {
          if (response.code === 0) {
            this.$message({
              message: '未来优势代付成功',
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
    // 通过
    handleClick3 (data) {
      this.formLabelAlign.id = data.id
      this.pass = 0
      this.passStr = '通过'
      this.dialogFormVisible = true
    },
    // 不通过
    handleClick4 (data) {
      this.formLabelAlign.id = data.id
      this.pass = 1
      this.passStr = '不通过'
      this.dialogFormVisible = true
    },
    // 提交的功能
    submitForm (formName) {
      const that = this
      if (that.formLabelAlign.pic === '') {
        that.$message({
          message: '缺少图片',
          type: 'warning'
        })
        return false
      }

      if (that.pass === 0) {
        that.userCashWithdrawSetSuccess(formName)
      } else {
        that.userCashWithdrawSetFail(formName)
      }
    },
    // 重置的效果
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 调不通过的接口
    userCashWithdrawSetFail (formName) {
      const that = this
      if (!that.formLabelAlign.remark) {
        this.$message({
          message: '请输入备注',
          type: 'warning'
        })
        return false
      }
      APIFinance.userCashWithdrawSetFail(that.formLabelAlign).then(response => {
        if (response.code === 0) {
          this.$message({
            message: '已设为不通过',
            type: 'success'
          })
          this.resetForm(formName)
          this.getTableDate()
          this.dialogFormVisible = false
        } else {
          this.$message({
            message: response.msg,
            type: 'warning'
          })
        }
      })
    },
    // 调通过的接口
    userCashWithdrawSetSuccess (formName) {
      const that = this
      APIFinance.userCashWithdrawSetSuccess(that.formLabelAlign).then(response => {
        if (response.code === 0) {
          this.$message({
            message: '已设为通过',
            type: 'success'
          })
          this.resetForm(formName)
          this.getTableDate()
          this.dialogFormVisible = false
        } else {
          this.$message({
            message: response.data,
            type: 'warning'
          })
        }
      })
    },
    // 导出Excel
    exportExcel () {
      const that = this
      const defaultCellStyle = {font: {name: 'Verdana', sz: 11, color: 'FF00FF88'}, fill: {fgColor: {rgb: 'FFFFAA00'}}}
      const wopts = {bookType: 'xlsx', bookSST: false, type: 'binary', defaultCellStyle: defaultCellStyle, showGridLines: false}
      const wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} }
      let data = []
      let formSerach = Object.assign({}, that.formInline)
      formSerach.page = 1
      formSerach.pageSize = 10000
      APIFinance.userCashWithdrawList(formSerach).then(response => {
        if (response.code === 0) {
          let result = response.data.pageBean.result
          let objArr = []
          if (result.length > 0) {
            result.forEach(ele => {
              let user = response.data.userBaseInfoMap[ele.userId]
              if (user) {
                ele.username = user.username
                ele.mobile = user.mobile
                ele.name = user.name
              } else {
                ele.username = ''
                ele.mobile = ''
                ele.name = ''
              }
              if (ele.adminId) {
                ele.admin = response.data.merchantSubAcountMap[ele.adminId].name
              }
              let obj = {
                '用户名': ele.username,
                '手机号': ele.mobile,
                '姓名': ele.realName,
                '订单号': ele.number,
                '银行名称': ele.bankName,
                '开户行省': ele.province,
                '开户行市': ele.city,
                '区县': ele.district,
                '支行': ele.branch,
                '开户名': ele.realName,
                '银行卡号': ele.beankNumber,
                '提现金额': ele.amount,
                '手续费': ele.fee,
                '状态': ele.statusStr,
                '操作管理员': ele.admin,
                '备注': ele.remark,
                '添加时间': ele.dateAdd,
                '修改时间': ele.dateUpdate
              }
              objArr.push(obj)
            })
          }
          data = objArr
          wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(data)
          // 创建二进制对象写入转换好的字节流
          let tmpDown = new Blob([this.s2ab(XLSX.write(wb, wopts))], { type: 'application/octet-stream' })
          FileSaver.saveAs(tmpDown, '提现管理.xlsx')
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
