<template>
  <div class="bis-page">
   <el-form :inline="true" :model="formInline" class="demo-form-inline" >
    <el-form-item label="开始日期:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateAddBegin" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="结束日期:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateAddEnd" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
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
      prop="recharge"
      label="充值">
    </el-table-column>
    <el-table-column
      prop="withdraw"
      label="提现">
    </el-table-column>
    <el-table-column
      prop="cashDepositIn"
      label="保证金入金">
    </el-table-column>
    <el-table-column
      prop="cashDepositOut"
      label="保证金出金">
    </el-table-column>
    <el-table-column
      prop="add"
      label="加币">
    </el-table-column>
    <el-table-column
      prop="minus"
      label="减币">
    </el-table-column>
    <el-table-column
      prop="balance"
      label="客户余额">
    </el-table-column>
    <el-table-column
      prop="fee"
      label="充值手续费">
    </el-table-column>
    <el-table-column
      prop="income"
      label="收入">
    </el-table-column>
    <el-table-column
      prop="buyTotal"
      label="买入/卖出总额">
      <template slot-scope="scope">
        <span>
          {{scope.row.buyTotal}}<br/>
          {{scope.row.sellTotal}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      prop="dateAdd"
      label="日期">
      <template slot-scope="scope">
        <span>{{scope.row.dateAdd|dateShort}}</span>
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
import { APIFinance } from '../../utils/apiFinance'
export default {
  data () {
    return {
      formInline: {
        page: 1,
        pageSize: 10,
        dateAddBegin: '',
        dateAddEnd: ''
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
    this.getTableDate()
  },
  methods: {
    // 获取表格数据
    getTableDate () {
      const that = this
      let formInline = that.formInline
      APIFinance.userCashDailyList(formInline).then(response => {
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

  },
  filters: {
    // 只针对时间的处理
    dateShort (val) {
      let dateTime = val.substring(0, val.indexOf(' '))
      return dateTime
    }
  }
}
</script>

<style>
  @import url('../../assets/css/bus.css');
</style>
