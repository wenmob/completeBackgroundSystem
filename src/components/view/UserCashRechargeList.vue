<template>
  <div class="bis-page">
   <el-form :inline="true" :model="formInline" class="demo-form-inline" >
    <el-form-item label="充值单号:">
      <el-input v-model="formInline.number" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="充值通道:">
      <el-select v-model="formInline.payWay" placeholder="请选择" @keyup.enter.native="onSubmit">
        <el-option label="全部" value=""></el-option>
        <el-option label="码支付支付宝" value="CODE_ALIPAY"></el-option>
        <el-option label="支付宝" value="ALIPAY"></el-option>
        <el-option label="微信" value="WX"></el-option>
        <el-option label="网银" value="NET_BANK"></el-option>
        <el-option label="未来优势网银" value="NET_BANK_WLYX"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="充值渠道:">
      <el-select v-model="formInline.payChannel" placeholder="请选择" @keyup.enter.native="onSubmit">
        <el-option label="全部" value=""></el-option>
        <el-option label="PC" value="PC"></el-option>
        <el-option label="H5" value="H5"></el-option>
        <el-option label="APP" value="APP"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="状态:">
      <el-select v-model="formInline.status" placeholder="请选择" @keyup.enter.native="onSubmit">
        <el-option label="全部" value=""></el-option>
        <el-option label="待支付" value="0"></el-option>
        <el-option label="失败" value="1"></el-option>
        <el-option label="成功" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="支付单号:">
      <el-input v-model="formInline.outTradeNo" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="添加时间起:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateAddBegin" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="添加时间止:">
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
      prop="id"
      label="序号"
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
      label="名称">
    </el-table-column>
    <el-table-column
      prop="number"
      label="充值/支付单号"
      width="250">
      <template slot-scope="scope">
        <span>
          {{scope.row.number ? scope.row.number : '-'}} <br/>
          {{scope.row.outTradeNo ? scope.row.outTradeNo : '-'}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      prop="amount"
      label="金额">
    </el-table-column>
    <el-table-column
      prop="payWay"
      label="通道/渠道">
      <template slot-scope="scope">
        <span v-if="scope.row.payWay == 'WX'">微信<br/>{{scope.row.payChannel}}</span>
        <span v-else-if="scope.row.payWay == 'CODE_ALIPAY'">码支付支付宝<br/>{{scope.row.payChannel}}</span>
        <span v-else-if="scope.row.payWay == 'ALIPAY'">支付宝<br/>{{scope.row.payChannel}}</span>
        <span v-else-if="scope.row.payWay == 'NET_BANK'">网银<br/>{{scope.row.payChannel}}</span>
        <span v-else-if="scope.row.payWay == 'NET_BANK_WLYX'">未来优势网银<br/>{{scope.row.payChannel}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态">
      <template slot-scope="scope">
        <span v-if="scope.row.status == 0">待支付</span>
        <span v-else-if="scope.row.status == 1">失败</span>
        <span v-else>成功</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="dateAdd"
      label="添加时间/修改时间"
      width="160">
      <template slot-scope="scope">
         <span>{{scope.row.dateAdd ? scope.row.dateAdd : '-'}}<br/>{{scope.row.dateUpdate ? scope.row.dateUpdate : '-'}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      width="140"
      v-if="merchantSet.isOwnZiguan">
      <template slot-scope="scope">
         <el-button @click="handleClick1(scope.row)" type="text"  style="color: #488624" v-if="scope.row.status == 0 && handleAble('/admin/userCashRecharge/setSuccess', Buttons)">设为成功</el-button>
         <el-button @click="handleClick2(scope.row)" type="text"  style="color: #FF892A" v-if="scope.row.status == 0 && handleAble('/admin/userCashRecharge/setFail', Buttons)">设为失败</el-button>
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
import { getMS } from '@/utils/auth'
export default {
  data () {
    return {
      formInline: {
        page: 1,
        pageSize: 10,
        dateAddBegin: '',
        dateAddEnd: '',
        number: '',
        payWay: '',
        payChannel: '',
        status: '',
        outTradeNo: ''
      },
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSizes: [10],
        pageSize: 0,
        tatal: 0
      },
      merchantSet: {}
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
      APIFinance.userCashRechargeList(formInline).then(response => {
        if (response.code === 0) {
          let result = response.data.pageBean.result
          that.pagination.pageSize = response.data.pageBean.pageSize
          that.pagination.tatal = response.data.pageBean.totalRow
          if (result.length > 0) {
            result.forEach(ele => {
              let user = response.data.userBaseInfoMap[ele.userId]
              ele.username = user.username
              ele.mobile = user.mobile
              ele.name = user.name
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
    // 设为成功的按钮
    handleClick1 (data) {
      this.$confirm('确定设为成功?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        APIFinance.userCashRechargeSetSuccess(data.id).then(response => {
          if (response.code === 0) {
            this.$message({
              type: 'success',
              message: '已设为成功'
            })
            this.getTableDate()
          } else {
            this.$message({
              type: 'warning',
              message: response.msg
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
    // 设为失败的按钮
    handleClick2 (data) {
      this.$confirm('确定设为失败?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        APIFinance.userCashRechargeSetFail(data.id).then(response => {
          if (response.code === 0) {
            this.$message({
              type: 'success',
              message: '已设为失败'
            })
            this.getTableDate()
          } else {
            this.$message({
              type: 'warning',
              message: response.msg
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }

  }
}
</script>

<style>
  @import url('../../assets/css/bus.css');
</style>
