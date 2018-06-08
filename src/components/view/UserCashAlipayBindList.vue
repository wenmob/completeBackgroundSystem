<template>
  <div class="bis-page">
   <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
    <el-form-item label="用户名:">
      <el-input v-model="formInline.username" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="手机号:">
      <el-input v-model="formInline.mobile" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="支付宝名称:">
      <el-input v-model="formInline.nameLike" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="支付宝账号:">
      <el-input v-model="formInline.accountLike" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="添加时间起:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateAddBegin" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="添加时间止:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateAddEnd" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button v-if="handleAble('/admin/userCashAlipayBind/save', Buttons)" type="success" @click="add"><i class="el-icon-plus"></i>手动绑定</el-button>
    </el-form-item>
    </el-form>

   <el-table
    :data="tableData"
    style="width: 100%"
    size="small">
    <el-table-column
      prop="username"
      label="用户名/手机号">
      <template slot-scope="scope">
        <span>{{scope.row.username ? scope.row.username : '-'}}<br/>{{scope.row.mobile ? scope.row.mobile : '-'}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      label="支付宝名称">
    </el-table-column>
    <el-table-column
      prop="account"
      label="支付宝账号">
    </el-table-column>
    <el-table-column
      prop="dateAdd"
      label="添加时间">
    </el-table-column>
    <el-table-column
     v-if="handleAble('/admin/userCashAlipayBind/del', Buttons)"
      label="操作">
      <template slot-scope="scope">
         <el-button @click="handleClick(scope.row)" type="text" size="small" style="color: #DD5A43">解除绑定</el-button>
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
    title="提示"
    :visible.sync="dialogVisible"
    width="30%">
    <el-form  label-width="100px" :model="formLabelAlign" ref="formLabelAlign" :rules="rules" size="small">
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="formLabelAlign.mobile" @keyup.enter.native="submitForm('formLabelAlign')" clearable></el-input>
      </el-form-item>
      <el-form-item label="支付宝姓名" prop="alipayName">
        <el-input v-model="formLabelAlign.alipayName" @keyup.enter.native="submitForm('formLabelAlign')" clearable></el-input>
      </el-form-item>
      <el-form-item label="支付宝账号" prop="alipayAccount">
        <el-input v-model="formLabelAlign.alipayAccount" @keyup.enter.native="submitForm('formLabelAlign')" clearable></el-input>
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
        pageSize: 15,
        dateAddBegin: '',
        dateAddEnd: '',
        username: '',
        mobile: '',
        nameLike: '',
        accountLike: ''
      },
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSizes: [15],
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
        alipayName: [{ required: true, message: '请输入支付宝姓名', trigger: 'blur' }],
        alipayAccount: [{ required: true, message: '请输入支付宝账号', trigger: 'blur' }]
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
      APIFinance.userCashAlipayBindList(formInline).then(response => {
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
    // 解除绑定的功能
    handleClick (data) {
      const that = this
      this.$confirm('确定要解除绑定？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        APIFinance.userCashAlipayBindDel(data.id).then(response => {
          if (response.code === 0) {
            this.$message({
              message: '已解除',
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
      this.dialogVisible = true
    },
    // 提交
    submitForm (formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          APIFinance.userCashAlipayBindSave(that.formLabelAlign).then(response => {
            if (response.code === 0) {
              this.$message({
                message: '绑定成功',
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
  }
}
</script>

<style>
  @import url('../../assets/css/bus.css');
</style>
