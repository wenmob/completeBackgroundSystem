<template>
  <div class="bis-page">
   <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
    <el-form-item label="用户名:">
      <el-input v-model="formInline.username" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="手机号:">
      <el-input v-model="formInline.mobile" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="姓名:">
      <el-input v-model="formInline.realNameLike" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="订单号:">
      <el-input v-model="formInline.number" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="类型:">
      <el-select v-model="formInline.type" placeholder="请选择" clearable>
        <el-option label="全部" value=""></el-option>
        <el-option label="天天赢" value="day"></el-option>
        <el-option label="周周发" value="week"></el-option>
        <el-option label="月月赚" value="month"></el-option>
        <el-option label="互惠盈" value="free"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="状态:">
      <el-select v-model="formInline.status" placeholder="请选择" clearable>
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
      <el-date-picker type="date" placeholder="选择日期" clearable v-model="formInline.dateEndBegin" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="清算时间止:">
      <el-date-picker type="date" placeholder="选择日期" clearable v-model="formInline.dateEndEnd" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="子账号:">
      <el-input v-model="formInline.traderUsername" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
    </el-form>
    <!--显示的其他信息-->
    <div class="otherInfo">
      <p class="otherInfo-p1">待结算：<span class="otherInfo-s1">{{orderUt.endSum}}</span>笔，</p>
      <p class="otherInfo-p1">&nbsp;待加配：<span class="otherInfo-s1">{{orderUt.addSum}}</span>笔，</p>
      <p class="otherInfo-p1">&nbsp;待减配：<span class="otherInfo-s1">{{orderUt.subSum}}</span>笔，</p>
      <p class="otherInfo-p1">&nbsp;待补充：<span class="otherInfo-s1">{{orderUt.supplementSum}}</span>笔，</p>
      <p class="otherInfo-p1">&nbsp;待赢提：<span class="otherInfo-s1">{{orderUt.extractProfitSum}}</span>笔，</p>
      <p class="otherInfo-p1">&nbsp;待分配账号：<span class="otherInfo-s1">{{orderUt.accountSumUp}}</span>笔</p>
      <div style="clear:both"></div>
    </div>
    <!--显示的合计信息-->
    <div class="otherInfo" style="margin-top:10px">
      <p class="otherInfo-p1">总共<span class="otherInfo-s1">{{orderSum.countNumber}}</span>个账号，</p>
      <p class="otherInfo-p1">&nbsp;总计：<span class="otherInfo-s1">{{orderSum.bzj|parseFormatNum(2)}}</span>元保证金，</p>
      <p class="otherInfo-p1">&nbsp;共计：<span class="otherInfo-s1">{{orderSum.cpje|parseFormatNum(2)}}</span>元操盘金额</p>
      <div style="clear:both"></div>
    </div>

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
      prop="bzj"
      label="保证金/操盘资金">
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
      },
      orderUt: {
        endSum: 0,
        addSum: 0,
        subSum: 0,
        supplementSum: 0,
        extractProfitSum: 0,
        accountSumUp: 0
      },
      orderSum: {
        bzj: 0,
        countNumber: 0,
        cpje: 0
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
      APIOrder.orderInfoList(formInline).then(response => {
        if (response.code === 0) {
          let result = response.data.pageBean.result
          that.pagination.pageSize = response.data.pageBean.pageSize
          that.pagination.tatal = response.data.pageBean.totalRow
          that.orderUt = {
            endSum: response.data.endSum,
            addSum: response.data.addSum,
            subSum: response.data.subSum,
            supplementSum: response.data.supplementSum,
            extractProfitSum: response.data.extractProfitSum,
            accountSumUp: response.data.accountSumUp
          }
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
          that.orderSum = response.data.orderCpjeTongji
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

  },
  filters: {
    parseFormatNum (number, n) {
      if (n !== 0) {
        n = (n > 0 && n <= 20) ? n : 2
      }
      number = parseFloat((number + '').replace(/[^\\d\\.-]/g, '')).toFixed(n) + ''
      let subVal = number.split('.')[0].split('').reverse()
      let subXs = number.split('.')[1]

      let showHtml = ''
      for (let i = 0; i < subVal.length; i++) {
        showHtml += subVal[i] + ((i + 1) % 3 === 0 && (i + 1) !== subVal.length ? ',' : '')
      }

      if (n === 0) {
        return showHtml.split('').reverse().join('')
      } else {
        return showHtml.split('').reverse().join('') + '.' + subXs
      }
    }
  }
}
</script>

<style>
  @import url('../../assets/css/bus.css');
  .otherInfo{
    margin-top: 10px;
  }
  .otherInfo-p1 {
    float: left;
    margin: 0px;
    padding: 0px;
    color: #343434;
    font-size: 14px;
  }
  .otherInfo-s1{
    color: #DD5A43;
  }
</style>
