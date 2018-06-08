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
    <el-form-item label="账户编号:">
      <el-input v-model="formInline.acountId" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="订单编号:">
      <el-input v-model="formInline.orderNumber" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="收支:">
      <el-select v-model="formInline.behavior" placeholder="请选择" @keyup.enter.native="onSubmit" clearable>
        <el-option label="全部" value=""></el-option>
        <el-option label="收入" value="0"></el-option>
        <el-option label="支出" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="类型:">
      <el-select v-model="formInline.type" placeholder="请选择" @keyup.enter.native="onSubmit" clearable>
        <el-option label="全部" value=""></el-option>
        <el-option label="清算" value="0"></el-option>
        <el-option label="减资" value="1"></el-option>
        <el-option label="增资" value="2"></el-option>
        <el-option label="补充" value="3"></el-option>
        <el-option label="盈提" value="4"></el-option>
        <el-option label="开户" value="5"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="生成时间起:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateAddBegin" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="生成时间止:">
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
    >
    <el-table-column
      prop="dateAdd"
      label="时间">
    </el-table-column>
    <el-table-column
      prop="typeStr"
      label="操作类型">
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
      prop="acountId"
      label="账户编号">
    </el-table-column>
    <el-table-column
      prop="behaviorStr"
      label="收入/支出">
      <template slot-scope="scope">
        <span style="color:#B9391C" v-if="scope.row.behaviorStr == '收入'">{{scope.row.behaviorStr+"："+scope.row.amount}}</span>
        <span style="color:#1A9358" v-else-if="scope.row.behaviorStr == '支出'">{{scope.row.behaviorStr+"："+scope.row.amount}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="orderNumber"
      label="支付订单">
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
        pageSize: 10,
        dateAddBegin: '',
        dateAddEnd: '',
        username: '',
        mobile: '',
        realNameLike: '',
        orderNumber: '',
        acountId: '',
        behavior: '',
        type: ''
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
      APIFinance.acountCashLogList(formInline).then(response => {
        if (response.code === 0) {
          let result = response.data.pageBean.result
          that.pagination.pageSize = response.data.pageBean.pageSize
          that.pagination.tatal = response.data.pageBean.totalRow
          if (result.length > 0) {
            result.forEach(ele => {
              ele.orderNumber = response.data.orderInfoMap[ele.orderId].number
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
      const that = this
      const defaultCellStyle = {font: {name: 'Verdana', sz: 11, color: 'FF00FF88'}, fill: {fgColor: {rgb: 'FFFFAA00'}}}
      const wopts = {bookType: 'xlsx', bookSST: false, type: 'binary', defaultCellStyle: defaultCellStyle, showGridLines: false}
      const wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} }
      let data = []
      let formSerach = Object.assign({}, that.formInline)
      formSerach.page = 1
      formSerach.pageSize = 10000
      APIFinance.acountCashLogList(formSerach).then(response => {
        if (response.code === 0) {
          let result = response.data.pageBean.result
          let objArr = []
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
              ele.orderNumber = response.data.orderInfoMap[ele.orderId].number
              let obj = {
                '序号': ele.id,
                '时间': ele.dateAdd,
                '操作类型': ele.typeStr,
                '用户名': ele.username,
                '手机号': ele.mobile,
                '姓名': ele.realName,
                '账户编号': ele.acountId,
                '收入/支出': ele.behaviorStr,
                '支付订单': ele.orderNumber,
                '备注': ele.remark
              }
              objArr.push(obj)
            })
          }
          data = objArr
          wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(data)
          // 创建二进制对象写入转换好的字节流
          let tmpDown = new Blob([this.s2ab(XLSX.write(wb, wopts))], { type: 'application/octet-stream' })
          FileSaver.saveAs(tmpDown, '子账户资金流水.xlsx')
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
