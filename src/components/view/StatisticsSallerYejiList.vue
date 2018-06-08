<template>
  <div class="bis-page">
   <el-form :inline="true" :model="formInline" class="demo-form-inline" >
    <el-form-item label="经纪人:">
      <el-select v-model="formInline.sellerId" clearable placeholder="请选择">
        <el-option
        v-for="item in options2"
        :key="item.id"
        :label="item.name"
        :value="item.id">
       </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="产品类型:">
      <el-select v-model="formInline.type" placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option label="天天赢" value="day"></el-option>
        <el-option label="周周发" value="week"></el-option>
        <el-option label="月月赚" value="month"></el-option>
        <el-option label="互惠盈" value="free"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="交易类型:">
      <el-select v-model="formInline.typeSub" placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option label="新配" value="1"></el-option>
        <el-option label="续约" value="2"></el-option>
        <el-option label="加配" value="3"></el-option>
        <el-option label="结算" value="4"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="添加时间起:">
      <el-date-picker type="date" placeholder="选择日期" v-model="formInline.dateAddBegin" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="添加时间止:">
      <el-date-picker type="date" placeholder="选择日期" v-model="formInline.dateAddEnd" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="状态:">
      <el-select v-model="formInline.status" placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option label="正常" value="1"></el-option>
        <el-option label="作废" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button type="danger" @click="exportExcel">导出</el-button>
    </el-form-item>
    </el-form>

   <el-table
    ref="multipleTable"
    :data="tableData"
    tooltip-effect="dark"
    style="width: 100%;margin-top:20px"
    @selection-change="handleSelectionChange"
    >
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      prop="dateAdd"
      label="扣款时间/业绩日期"
      width="170">
      <template slot-scope="scope">
        <span>{{scope.row.dateAdd}}<br/>{{scope.row.yejiDate}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="mobile"
      label="用户名/手机号码">
      <template slot-scope="scope">
        <span>{{scope.row.username ? scope.row.username : '-'}}<br/>{{scope.row.mobile ? scope.row.mobile : '-'}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="产品类型">
      <template slot-scope="scope">
        <span>{{scope.row.typeStr}}/{{scope.row.typeSubStr}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="realName"
      label="客户/经纪人">
      <template slot-scope="scope">
        <span>{{scope.row.realName}}<br/>{{scope.row.admin}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="traderUsername"
      label="证券账号">
    </el-table-column>
    <el-table-column
      prop="bzj"
      label="保证金/操盘金额">
      <template slot-scope="scope">
        <span>{{scope.row.bzj}}<br/>{{scope.row.cpje}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="income"
      label="收入/成本">
      <template slot-scope="scope">
        <span>{{scope.row.income}}<br/>{{scope.row.cost}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="yeji"
      label="业绩">
    </el-table-column>
    <el-table-column
      prop="orderNumber"
      label="订单号"
      width="150">
    </el-table-column>
    <el-table-column
      prop="statusStr"
      label="状态">
    </el-table-column>
    <el-table-column
      label="操作" v-if="handleAble('/admin/statisticsSallerYeji/cancel', Buttons)">
      <template slot-scope="scope">
        <el-button type="text" style="color: #F56C6C" @click="del(scope.row)"  v-if="scope.row.status == 1">作废</el-button>
      </template>
    </el-table-column>
  </el-table>

  <div class="block" style="margin-top:10px;">
      <el-select v-model="value2" clearable placeholder="分配经纪人" @change="allotBatch" >
       <el-option
        v-for="item in options2"
        :key="item.id"
        :label="item.name"
        :value="item.id">
       </el-option>
      </el-select>
  </div>
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
import { APIOrder } from '../../utils/apiOrder'
export default {
  data () {
    return {
      formInline: {
        page: 1,
        pageSize: 10,
        dateAddBegin: '',
        dateAddEnd: '',
        sellerId: '',
        type: '',
        typeSub: '',
        status: ''
      },
      tableData: [],
      value2: '',
      options2: [],
      multipleSelection: [],
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
    this.enterToLogin()
  },
  methods: {
    // 获取表格数据
    getTableDate () {
      const that = this
      let formInline = that.formInline
      APIOrder.statisticsSallerYejiList(formInline).then(response => {
        if (response.code === 0) {
          let result = response.data.pageBean.result
          that.pagination.pageSize = response.data.pageBean.pageSize
          that.pagination.tatal = response.data.pageBean.totalRow
          if (result.length > 0) {
            result.forEach(ele => {
              if (ele.userId) {
                let user = response.data.userBaseInfoMap[ele.userId]
                ele.username = user.username
                ele.mobile = user.mobile
                ele.realName = user.name
              }
              if (ele.sellerId) {
                let admins = response.data.admins
                let n = admins.findIndex(element => {
                  return element.id === ele.sellerId
                })
                if (n !== -1) {
                  ele.admin = admins[n].name
                }
              }
            })
          }
          that.tableData = result
          that.options2 = response.data.admins
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
    // 监听enter键
    enterToLogin () {
      const that = this
      document.onkeydown = function (event) {
        let e = event || window.event
        if (e && e.keyCode === 13) { // 回车键的键值为13
          that.onSubmit() // 调用登录按钮的登录事件
        }
      }
    },
    // 选择的效果
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 分配销售经理
    allotBatch () {
      const that = this
      let adminId = that.value2
      let idsArr = []
      if (that.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请先选择记录'
        })
        return false
      }
      that.multipleSelection.forEach(ele => {
        idsArr.push(ele.id)
      })
      let ids = idsArr.toString()
      that.$confirm('确定分配销售经理?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        APIOrder.statisticsSallerYejiBatchAllotment(ids, adminId).then(response => {
          if (response.code === 0) {
            this.getTableDate()
            that.value2 = ''
          } else {
            this.$message({
              type: 'warning',
              message: response.msg
            })
          }
        })
      }).catch(() => {
        that.value2 = ''
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 删除的按钮
    del (data) {
      this.$confirm('确定要作废?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        APIOrder.statisticsSallerYejiCancel(data.id).then(response => {
          if (response.code === 0) {
            this.$message({
              type: 'success',
              message: '已作废'
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
      APIOrder.statisticsSallerYejiList(formSerach).then(response => {
        if (response.code === 0) {
          let result = response.data.pageBean.result
          let objArr = []
          if (result.length > 0) {
            result.forEach(ele => {
              if (ele.userId) {
                let user = response.data.userBaseInfoMap[ele.userId]
                ele.username = user.username
                ele.mobile = user.mobile
                ele.realName = user.name
              }
              if (ele.sellerId) {
                let admins = response.data.admins
                let n = admins.findIndex(element => {
                  return element.id === ele.sellerId
                })
                if (n !== -1) {
                  ele.admin = admins[n].name
                }
              }
              let obj = {
                '序号': ele.id,
                '姓名': ele.realName,
                '手机号码': ele.mobile,
                '用户名': ele.username,
                '产品类型': ele.typeStr + '/' + ele.typeSubStr,
                '经纪人': ele.admin,
                '证券账号': ele.traderUsername,
                '订单号': ele.orderNumber,
                '保证金': ele.bzj,
                '操盘金额': ele.cpje,
                '收入': ele.income,
                '成本': ele.cost,
                '业绩': ele.yeji,
                '状态': ele.statusStr,
                '扣款时间': ele.dateAdd,
                '业绩时间': ele.yejiDate
              }
              objArr.push(obj)
            })
          }
          data = objArr
          wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(data)
          // 创建二进制对象写入转换好的字节流
          let tmpDown = new Blob([this.s2ab(XLSX.write(wb, wopts))], { type: 'application/octet-stream' })
          FileSaver.saveAs(tmpDown, '销售业绩.xlsx')
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

  }
}
</script>

<style>
  @import url('../../assets/css/bus.css');
</style>
