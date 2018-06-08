<template>
  <div class="bis-page">
   <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
    <el-form-item label="手机号码:">
      <el-input v-model="formInline.mobile" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="验证码:">
      <el-input v-model="formInline.code" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="类型:">
      <el-select v-model="formInline.type" placeholder="请选择" @keyup.enter.native="onSubmit">
        <el-option label="全部" value=""></el-option>
        <el-option label="注册" value="1"></el-option>
        <el-option label="找回密码" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="ip:">
      <el-input v-model="formInline.ip" @keyup.enter.native="onSubmit" clearable  placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="发送时间起:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable  v-model="formInline.dateAddBegin" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="发送时间止:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable  v-model="formInline.dateAddEnd" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
    </el-form>

   <el-table
    :data="tableData"
    style="width: 100%"
    size="small">
    <el-table-column
      prop="mobile"
      label="手机号码">
    </el-table-column>
    <el-table-column
      prop="code"
      label="验证码">
    </el-table-column>
    <el-table-column
      prop="typeStr"
      label="类型">
    </el-table-column>
    <el-table-column
      prop="ip"
      label="IP">
    </el-table-column>
    <el-table-column
      prop="dateAdd"
      label="发送时间">
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
  </div>
</template>

<script>
import { API } from '../../utils/api'
export default {
  data () {
    return {
      formInline: {
        ip: '',
        page: 1,
        mobile: '',
        dateAddBegin: '',
        dateAddEnd: '',
        code: '',
        type: ''
      },
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSizes: [15],
        pageSize: 0,
        tatal: 0
      }
    }
  },
  mounted () {
    this.getTableDate(this.formInline)
  },
  methods: {
    // 获取表格数据
    getTableDate () {
      const that = this
      let formInline = that.formInline
      API.SysShortMessage(formInline.ip, formInline.page, formInline.dateAddBegin, formInline.dateAddEnd, formInline.mobile, formInline.code, formInline.type).then(response => {
        if (response.code === 0) {
          let result = response.data.pageBean.result
          that.pagination.pageSize = response.data.pageBean.pageSize
          that.pagination.tatal = response.data.pageBean.totalRow
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
    }

  }
}
</script>

<style>
  @import url('../../assets/css/bus.css');
</style>
