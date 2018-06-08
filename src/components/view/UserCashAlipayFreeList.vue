<template>
  <div class="bis-page">
   <el-form :inline="true" :model="formInline" class="demo-form-inline" >
    <el-form-item label="订单号:">
      <el-input v-model="formInline.ddh" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="状态:">
      <el-select v-model="formInline.status" placeholder="请选择" @keyup.enter.native="onSubmit">
        <el-option label="全部" value=""></el-option>
        <el-option label="未领取" value="0"></el-option>
        <el-option label="已领取" value="1"></el-option>
        <el-option label="已作废" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="添加时间起:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateAddBegin" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="添加时间止:">
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
      prop="id"
      label="序号"
      width="55">
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
      prop="name"
      label="支付宝 姓名/账号">
      <template slot-scope="scope">
         <span>{{scope.row.name ? scope.row.name : '-'}}<br/>{{scope.row.account ? scope.row.account : '-'}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="ddh"
      label="订单号"
      width="280">
    </el-table-column>
    <el-table-column
      prop="money"
      label="金额"
      width="150">
    </el-table-column>
    <el-table-column
      prop="statusStr"
      label="状态"
      width="120">
    </el-table-column>
    <el-table-column
      prop="goodsName"
      label="备注">
      <template slot-scope="scope">
        <el-tooltip class="item" effect="dark" :content="scope.row.goodsName" placement="left">
          <span>{{scope.row.goodsName|WidthCheck(12)}}</span>
        </el-tooltip>
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
      v-if="handleAble('/admin/userCashAlipayFree/cancel', Buttons)"
      label="操作">
      <template slot-scope="scope">
         <el-button @click="handleClick(scope.row)" type="text"  style="color: #DD5A43" v-if="scope.row.status == 0">作废</el-button>
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
        ddh: '',
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
    this.getTableDate()
  },
  methods: {
    // 获取表格数据
    getTableDate () {
      const that = this
      let formInline = that.formInline
      APIFinance.userCashAlipayFreeList(formInline).then(response => {
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
    // 作废的功能
    handleClick (data) {
      const that = this
      this.$confirm('确定要作废？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        APIFinance.userCashAlipayFreeCancel(data.id).then(response => {
          if (response.code === 0) {
            this.$message({
              message: '作废成功',
              type: 'success'
            })
            that.getTableDate()
          } else {
            this.$message({
              message: response.msg,
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
      APIFinance.userCashAlipayFreeList(formSerach).then(response => {
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
              let obj = {
                '序号': ele.id,
                '用户名': ele.username,
                '手机号': ele.mobile,
                '姓名': ele.realName,
                '支付宝姓名': ele.name,
                '支付宝账号': ele.account,
                '订单号': ele.ddh,
                '金额': ele.money,
                '状态': ele.statusStr,
                '备注': ele.goodsName,
                '添加时间': ele.dateAdd,
                '修改时间': ele.dateUpdate
              }
              objArr.push(obj)
            })
          }
          data = objArr
          wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(data)
          // 创建二进制对象写入转换好的字节流
          let tmpDown = new Blob([this.s2ab(XLSX.write(wb, wopts))], { type: 'application/octet-stream' })
          FileSaver.saveAs(tmpDown, '支付宝转账记录.xlsx')
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
