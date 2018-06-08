<template>
  <div class="bis-page">
   <el-form :inline="true" :model="formInline" class="demo-form-inline" >
    <el-form-item label="用户名">
      <el-input v-model="formInline.username" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="手机号">
      <el-input v-model="formInline.mobile" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="名称">
      <el-input v-model="formInline.nameLike" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="formInline.status" clearable placeholder="请选择" @keyup.enter.native="onSubmit">
        <el-option label="全部" value=""></el-option>
        <el-option label="启用" value="0"></el-option>
        <el-option label="禁用" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
    </el-form>

   <el-table
    :data="tableData"
    style="width: 100%"
    >
    <el-table-column
      prop="id"
      label="序号"
      width="55">
    </el-table-column>
    <el-table-column
        label="用户名/手机号">
        <template slot-scope="scope">
          <span>{{scope.row.username ? scope.row.username : '-'}}<br/>{{scope.row.mobile ? scope.row.mobile : '-'}}</span>
        </template>
    </el-table-column>
    <el-table-column
        label="姓名/身份证">
        <template slot-scope="scope">
          <span>{{scope.row.name ? scope.row.name : '-'}}<br/>{{scope.row.idcard ? scope.row.idcard : '-'}}</span>
        </template>
    </el-table-column>
    <el-table-column
        prop="dateLogin"
        label="注册/登录"
        width="225">
        <template slot-scope="scope">
           <span>
             {{scope.row.dateAdd}} <br/>
             {{scope.row.dateLogin}}
           </span>
        </template>
      </el-table-column>
    <el-table-column
        label="注册/登入IP">
        <template slot-scope="scope">
          <span>{{scope.row.ipReg}}<br/>{{scope.row.ipLogin}}</span>
        </template>
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态">
      <template slot-scope="scope">
        <span>{{scope.row.status == 0 ? '启用' : '禁用'}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      width="70" v-if="handleAble('/admin/userCash/userCashInfo', Buttons)">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" >资金明细</el-button>
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
  </div>
</template>

<script>
import { API } from '../../utils/api'
export default {
  data () {
    return {
      formInline: {
        page: 1,
        pageSize: 10,
        username: '',
        mobile: '',
        nameLike: '',
        status: ''
      },
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSizes: [10],
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
    getTableDate (formInline) {
      const that = this
      API.myUser(formInline).then(response => {
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
      that.getTableDate(that.formInline)
    },

    handleClick (obj) {
      this.$router.push({path: '/admin/foundetails/list', query: {id: obj.id}})
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)

    },

    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      const that = this
      that.formInline.page = val
      that.getTableDate(that.formInline)
    }

  }
}
</script>

<style>
  @import url('../../assets/css/bus.css');
</style>
