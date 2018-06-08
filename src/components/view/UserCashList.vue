<template>
  <div class="bis-page">
   <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
    <el-form-item label="用户名:">
      <el-input v-model="formInline.username" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="手机号:">
      <el-input v-model="formInline.mobile" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="姓名:">
      <el-input v-model="formInline.realNameLike" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="收支:">
      <el-select v-model="formInline.behavior" placeholder="请选择" @keyup.enter.native="onSubmit">
        <el-option label="全部" value=""></el-option>
        <el-option label="收入" value="0"></el-option>
        <el-option label="支出" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="类型:">
      <el-select v-model="formInline.type" placeholder="请选择" @keyup.enter.native="onSubmit">
        <el-option label="全部" value=""></el-option>
        <el-option label="充值" value="0"></el-option>
        <el-option label="加币" value="11"></el-option>
        <el-option label="减币" value="12"></el-option>
        <el-option label="提现冻结" value="21"></el-option>
        <el-option label="提现成功" value="22"></el-option>
        <el-option label="提现撤销" value="23"></el-option>
        <el-option label="冻结保证金" value="31"></el-option>
        <el-option label="解冻保证金" value="32"></el-option>
        <el-option label="服务费" value="41"></el-option>
        <el-option label="服务费退还" value="42"></el-option>
        <el-option label="补充" value="51"></el-option>
        <el-option label="提现" value="61"></el-option>
        <el-option label="盈亏" value="71"></el-option>
        <el-option label="锁定" value="81"></el-option>
        <el-option label="解除锁定" value="82"></el-option>
        <el-option label="充值手续费" value="91"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="业务订单:">
      <el-input v-model="formInline.orderNumber" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="备注:">
      <el-input v-model="formInline.remarkLike" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="交易时间起:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateAddBegin" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="交易时间止:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateAddEnd" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button type="danger" @click="exportExcel">导出</el-button>
    </el-form-item>
    </el-form>

   <el-table
    :data="tableData"
    style="width: 100%"
    size="small">
    <el-table-column
      prop="dateAdd"
      label="时间/业务订单">
      <template slot-scope="scope">
        <span>
          {{scope.row.dateAdd}} <br/>
          {{scope.row.orderNumber}}
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
      prop="typeStr"
      label="类型">
    </el-table-column>
    <el-table-column
      prop="amount"
      label="金额">
    </el-table-column>
    <el-table-column
      prop="balance"
      label="余额">
    </el-table-column>
    <el-table-column
      prop="freeze"
      label="冻结">
    </el-table-column>
    <el-table-column
      prop="total"
      label="总资产">
    </el-table-column>
    <el-table-column
      prop="remark"
      label="备注">
      <template slot-scope="scope">
        <el-tooltip class="item" effect="dark" :content="scope.row.remark" placement="left">
          <span>{{scope.row.remark|WidthCheck(12)}}</span>
        </el-tooltip>
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
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import { APIFinance } from '../../utils/apiFinance'
export default {
  data () {
    return {
      formInline: {
        page: 1,
        pageSize: 15,
        dateAddBegin: '',
        dateAddEnd: '',
        remarkLike: '',
        realNameLike: '',
        mobile: '',
        username: '',
        type: '',
        behavior: '',
        orderNumber: ''
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
  },
  methods: {
    // 获取表格数据
    getTableDate () {
      const that = this
      let formInline = that.formInline
      APIFinance.userCashList(formInline).then(response => {
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
    // 导出Excel
    exportExcel () {
      const defaultCellStyle = {font: {name: 'Verdana', sz: 11, color: 'FF00FF88'}, fill: {fgColor: {rgb: 'FFFFAA00'}}}
      const wopts = {bookType: 'xlsx', bookSST: false, type: 'binary', defaultCellStyle: defaultCellStyle, showGridLines: false}
      const wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} }
      let data = []
      APIFinance.userCashList({page: 1, pageSize: 10000}).then(response => {
        if (response.code === 0) {
          let result = response.data.pageBean.result
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
          data = result
          wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(data)
          // 创建二进制对象写入转换好的字节流
          let tmpDown = new Blob([this.s2ab(XLSX.write(wb, wopts))], { type: 'application/octet-stream' })
          FileSaver.saveAs(tmpDown, '资金明细.xlsx')
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
