<template>
  <div class="bis-page">
   <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
    <el-form-item label="订单编号:">
      <el-input v-model="formInline.number" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="状态:">
      <el-select v-model="formInline.status" placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option label="待处理" value="0"></el-option>
        <el-option label="成功" value="1"></el-option>
        <el-option label="失败" value="2"></el-option>
        <el-option label="自动处理中" value="3"></el-option>
        <el-option label="自动失败，转人工处理" value="4"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="类型:">
      <el-select v-model="formInline.type" placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option label="清算" value="0"></el-option>
        <el-option label="减资" value="1"></el-option>
        <el-option label="增资" value="2"></el-option>
        <el-option label="补充" value="3"></el-option>
        <el-option label="提取" value="4"></el-option>
        <el-option label="开户" value="5"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="添加时间起:">
      <el-date-picker type="date" placeholder="选择日期" v-model="formInline.dateAddBegin" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="添加时间止:">
      <el-date-picker type="date" placeholder="选择日期" v-model="formInline.dateAddEnd" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="修改时间起:">
      <el-date-picker type="date" placeholder="选择日期" v-model="formInline.dateUpdateBegin" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="修改时间止:">
      <el-date-picker type="date" placeholder="选择日期" v-model="formInline.dateUpdateEnd" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
    </el-form>

   <el-table
    :data="tableData"
    style="width: 100%;margin-top:20px"
    size="small">
    <el-table-column
      prop="id"
      label="序号"
      width="80">
    </el-table-column>
    <el-table-column
      prop="number"
      label="订单编号"
      width="150">
    </el-table-column>
    <el-table-column
      prop="chargeId"
      label="ChargeID">
    </el-table-column>
    <el-table-column
      prop="admin"
      label="操作人">
    </el-table-column>
    <el-table-column
      prop="name"
      label="客户姓名">
    </el-table-column>
    <el-table-column
      prop="statusStr"
      label="状态">
    </el-table-column>
    <el-table-column
      prop="typeStr"
      label="类型">
    </el-table-column>
    <el-table-column
      prop="amount"
      label="金额">
    </el-table-column>
    <el-table-column
      prop="bzj"
      label="保证金/借款金额">
      <template slot-scope="scope">
        <span>{{scope.row.bzj}}<br/>{{scope.row.jkje}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="dateAdd"
      label="添加/修改时间"
      width="150">
      <template slot-scope="scope">
        <span>
          {{scope.row.dateAdd ? scope.row.dateAdd : '-'}}<br/>
          {{scope.row.dateUpdate ? scope.row.dateUpdate : '-'}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      label="操作" v-if="handleAble('/admin/orderInfo/view', Buttons)">
      <template slot-scope="scope">
        <el-button type="text" @click="goDetails(scope.row.orderId)" size="small">订单详情</el-button>
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
import { APIOrder } from '../../utils/apiOrder'
export default {
  data () {
    return {
      formInline: {
        page: 1,
        pageSize: 15,
        dateAddBegin: '',
        dateAddEnd: '',
        dateUpdateBegin: '',
        dateUpdateEnd: '',
        number: '',
        status: '',
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
    this.getTableDate()
    this.enterToLogin()
  },
  methods: {
    // 获取表格数据
    getTableDate () {
      const that = this
      let formInline = that.formInline
      APIOrder.orderCaiwuList(formInline).then(response => {
        if (response.code === 0) {
          let result = response.data.pageBean.result
          that.pagination.pageSize = response.data.pageBean.pageSize
          that.pagination.tatal = response.data.pageBean.totalRow
          if (result.length > 0) {
            result.forEach(ele => {
              if (ele.adminId) {
                ele.admin = response.data.merchantSubAcountMap[ele.adminId].name
              }
              if (ele.orderId) {
                ele.number = response.data.orderInfoMap[ele.orderId].number
              }
              if (ele.chargeId) {
                ele.bzj = response.data.orderChargeMap[ele.chargeId].bzj
                ele.jkje = response.data.orderChargeMap[ele.chargeId].cpje - response.data.orderChargeMap[ele.chargeId].bzj
              }
              if (ele.userId) {
                ele.name = response.data.userBaseInfoMap[ele.userId].name
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
    // 查看详情
    goDetails (id) {
      this.$router.push({path: '/admin/orderInfo/view', query: {id: id}})
    },
    // 监听enter键
    enterToLogin () {
      const that = this
      document.onkeydown = function (event) {
        let e = event || window.event
        if (e && e.keyCode === 13) { // 回车键的键值为13
          that.onSubmit() // 调用登录按钮的登录事件
        }
      }
    }

  }
}
</script>

<style>
  @import url('../../assets/css/bus.css');
</style>
