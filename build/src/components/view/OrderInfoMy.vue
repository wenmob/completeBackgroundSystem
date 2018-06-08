<template>
  <div class="bis-page">
   <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
    <el-form-item label="用户名:">
      <el-input v-model="formInline.username" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="手机号:">
      <el-input v-model="formInline.mobile" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="姓名:">
      <el-input v-model="formInline.realNameLike" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="订单号:">
      <el-input v-model="formInline.number" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="类型:">
      <el-select v-model="formInline.type" placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option label="天天赢" value="day"></el-option>
        <el-option label="周周发" value="week"></el-option>
        <el-option label="月月赚" value="month"></el-option>
        <el-option label="互惠盈" value="free"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="状态:">
      <el-select v-model="formInline.status" placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option label="未支付" value="0"></el-option>
        <el-option label="已支付待转账" value="1"></el-option>
        <el-option label="正在操盘" value="2"></el-option>
        <el-option label="等待清算" value="3"></el-option>
        <el-option label="已清算" value="4"></el-option>
        <el-option label="已关闭" value="5"></el-option>
        <el-option label="客户终止操盘" value="6"></el-option>
        <el-option label="已支付待增资" value="7"></el-option>
        <el-option label="已支付待补充" value="8"></el-option>
        <el-option label="到期终止操盘" value="9"></el-option>
        <el-option label="盈利提取" value="10"></el-option>
        <el-option label="等待确认减资" value="12"></el-option>
        <el-option label="已支付待分配账号" value="15"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="清算时间起:">
      <el-date-picker type="date" placeholder="选择日期" v-model="formInline.dateEndBegin" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="清算时间止:">
      <el-date-picker type="date" placeholder="选择日期" v-model="formInline.dateEndEnd" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="子账号:">
      <el-input v-model="formInline.traderUsername" placeholder=""></el-input>
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
      label="类型/订单号"
      width="150">
      <template slot-scope="scope">
        <span>
          {{scope.row.typeStr}} <br/>
          {{scope.row.number}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      prop="username"
      label="用户名">
      <template slot-scope="scope">
        <span>{{scope.row.username ? scope.row.username : '-'}}<br/>{{scope.row.mobile ? scope.row.mobile : '-'}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="realName"
      label="姓名">
    </el-table-column>
    <el-table-column
      prop="bzj"
      label="保证金/操盘金额">
      <template slot-scope="scope">
        <span>
          {{scope.row.bzj ? scope.row.bzj : '-'}} <br/>
          {{scope.row.cpje ? scope.row.cpje : '-'}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      prop="startDateStr"
      label="开始/截止日期">
      <template slot-scope="scope">
        <span>
          {{scope.row.startDateStr ? scope.row.startDateStr : '-'}} <br/>
          {{scope.row.deadlineStr ? scope.row.deadlineStr : '-'}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      prop="traderUsername"
      label="子账号">
    </el-table-column>
    <el-table-column
      prop="profit"
      label="盈亏/清算时间">
      <template slot-scope="scope">
        <span>
          {{scope.row.profit ? scope.row.profit : '-'}} <br/>
          {{scope.row.dateEnd ? scope.row.dateEnd : '-'}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      prop="statuStr"
      label="状态">
    </el-table-column>
    <el-table-column
      v-if="handleAble('/admin/orderInfo/view', Buttons)"
      label="操作">
      <template slot-scope="scope">
        <el-button type="text" @click="goDetails(scope.row)" size="small">详情</el-button>
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
        dateEndBegin: '',
        dateEndEnd: '',
        username: '',
        mobile: '',
        realNameLike: '',
        number: '',
        type: '',
        status: '',
        traderUsername: ''
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
      APIOrder.orderInfoMy(formInline).then(response => {
        if (response.code === 0) {
          let result = response.data.pageBean.result
          that.pagination.pageSize = response.data.pageBean.pageSize
          that.pagination.tatal = response.data.pageBean.totalRow
          if (result.length > 0) {
            result.forEach(ele => {
              let user = response.data.userBaseInfoMap[ele.userId]
              let orderCharge = response.data.orderChargeMap[ele.chargeIdNew]
              ele.username = user.username
              ele.mobile = user.mobile
              ele.realName = user.name
              ele.bzj = orderCharge.bzj
              ele.cpje = orderCharge.cpje
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
    goDetails (data) {
      this.$router.push({path: '/admin/orderInfo/view', query: {id: data.id}})
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
