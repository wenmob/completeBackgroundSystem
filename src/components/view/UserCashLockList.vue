<template>
  <div class="bis-page">
   <el-form :inline="true" :model="formInline" class="demo-form-inline" >
    <el-form-item label="用户名:">
      <el-input v-model="formInline.username" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="手机号:">
      <el-input v-model="formInline.mobile" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="姓名:">
      <el-input v-model="formInline.realNameLike" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="状态:">
      <el-select v-model="formInline.status" placeholder="请选择" @keyup.enter.native="onSubmit">
        <el-option label="全部" value=""></el-option>
        <el-option label="锁定中" value="0"></el-option>
        <el-option label="已解锁" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="锁定时间起:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateAddBegin" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="锁定时间止:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateAddEnd" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button type="success" @click="add" v-if="handleAble('/admin/userCashLock/lock', Buttons)"><i class="el-icon-plus"></i>锁定资金</el-button>
    </el-form-item>
    </el-form>

   <el-table
    :data="tableData"
    style="width: 100%"
    >
    <el-table-column
      prop="id"
      label="序号"
      width="100">
    </el-table-column>
    <el-table-column
      prop="username"
      label="用户名/手机号">
      <template slot-scope="scope">
        <span>{{scope.row.username ? scope.row.username : '-'}}<br/>{{scope.row.mobile ? scope.row.mobile : '-'}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="realName"
      label="姓名">
    </el-table-column>
    <el-table-column
      prop="amount"
      label="冻结金额">
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态">
      <template slot-scope="scope">
        <span v-if="scope.row.status == 0">锁定中</span>
        <span v-else-if="scope.row.status == 1">已解锁</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="remark"
      label="描述"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      prop="dateAdd"
      label="锁定/解除时间">
      <template slot-scope="scope">
        <span>
          {{scope.row.dateAdd ? scope.row.dateAdd : '-'}} <br/>
          {{scope.row.dateUpdate ? scope.row.dateUpdate : '-'}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      label="操作" v-if="handleAble('/admin/userCashLock/unlock', Buttons)">
      <template slot-scope="scope">
        <div v-if="scope.row.status == 0">
         <el-button @click="handleClick(scope.row)" type="text"  style="color: #DD5A43">解锁</el-button>
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
   <el-dialog
    title="锁定用户可用余额"
    :visible.sync="dialogVisible"
    width="30%">
    <el-form  label-width="100px" :model="formLabelAlign" ref="formLabelAlign" :rules="rules" >
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="formLabelAlign.mobile" @keyup.enter.native="submitForm('formLabelAlign')" clearable></el-input>
      </el-form-item>
      <el-form-item label="锁定金额" prop="amount">
        <el-input v-model.number="formLabelAlign.amount" @keyup.enter.native="submitForm('formLabelAlign')" clearable></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :rows="3" v-model="formLabelAlign.remark"></el-input>
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
export default {
  data () {
    let checkPhone = (rule, value, callback) => {
      let reg = /^1[0-9]{10}$/
      if (reg.test(value)) {
        callback()
      } else {
        return callback(new Error('请输入正确的手机号'))
      }
    }
    return {
      dialogVisible: false,
      formInline: {
        page: 1,
        pageSize: 10,
        dateAddBegin: '',
        dateAddEnd: '',
        status: '',
        username: '',
        mobile: '',
        realNameLike: ''
      },
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSizes: [10],
        pageSize: 0,
        tatal: 0
      },
      formLabelAlign: {
        mobile: '',
        alipayName: '',
        alipayAccount: ''
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入锁定的金额', trigger: 'blur' },
          { type: 'number', message: '金额必须为数字' }
        ],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]

      }
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
      APIFinance.userCashLockList(formInline).then(response => {
        if (response.code === 0) {
          let result = response.data.pageBean.result
          that.pagination.pageSize = response.data.pageBean.pageSize
          that.pagination.tatal = response.data.pageBean.totalRow
          if (result.length > 0) {
            result.forEach(ele => {
              let user = response.data.userBaseInfoMap[ele.userId]
              if (user) {
                ele.username = user.username
                ele.mobile = user.mobile
                ele.realName = user.name
              } else {
                ele.username = ''
                ele.mobile = ''
                ele.realName = ''
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
    // 解锁
    handleClick (data) {
      this.$prompt('请输入描述', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        APIFinance.userCashLockUnlock(data.id, value).then(response => {
          if (response.code === 0) {
            this.$message({
              type: 'success',
              message: '解除成功'
            })
            this.getTableDate()
          } else {
            this.$message({
              type: 'warning',
              message: response.data
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    // 锁定资金
    add () {
      this.dialogVisible = true
    },
    // 提交
    submitForm (formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          APIFinance.userCashLockLock(that.formLabelAlign).then(response => {
            if (response.code === 0) {
              this.$message({
                message: '锁定成功',
                type: 'success'
              })
              that.resetForm(formName)
              that.getTableDate()
              that.dialogVisible = false
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
</style>
