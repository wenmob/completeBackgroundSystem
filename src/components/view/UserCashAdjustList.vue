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
    <el-form-item label="订单号:">
      <el-input v-model="formInline.number" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="操作金额:">
      <el-input v-model="formInline.amount" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="状态:">
      <el-select v-model="formInline.status" placeholder="请选择" @keyup.enter.native="onSubmit">
        <el-option label="全部" value=""></el-option>
        <el-option label="待审核" value="0"></el-option>
        <el-option label="拒绝" value="1"></el-option>
        <el-option label="成功" value="2"></el-option>
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
    </el-form-item>
    </el-form>

   <el-table
    :data="tableData"
    style="width: 100%"
    >
    <el-table-column
      prop="username"
      label="用户名/手机号">
      <template slot-scope="scope">
        <span>{{scope.row.username ? scope.row.username : '-'}}<br/>{{scope.row.mobile ? scope.row.mobile : '-'}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名">
    </el-table-column>
    <el-table-column
      prop="number"
      label="订单号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="amount"
      label="操作金额">
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态">
      <template slot-scope="scope">
        <span v-if="scope.row.status == 0">待审核</span>
        <span v-else-if="scope.row.status == 1">拒绝</span>
        <span v-else>成功</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="pic"
      label="图片">
      <template slot-scope="scope">
        <a :href="scope.row.pic" target="_blank" v-if="scope.row.pic" >查看凭证</a>
      </template>
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
    <el-table-column
      prop="saveAdmin"
      label="添加人/审核人">
      <template slot-scope="scope">
        <span>{{scope.row.saveAdmin ? scope.row.saveAdmin : '-'}}<br/>{{scope.row.checkAdmin ? scope.row.checkAdmin : '-'}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="dateAdd"
      label="添加时间/修改时间"
      width="150">
      <template slot-scope="scope">
       <span>{{scope.row.dateAdd ? scope.row.dateAdd : '-'}}<br/>{{scope.row.dateUpdate ? scope.row.dateUpdate : '-'}}</span>
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
        dateUpdateBegin: '',
        dateUpdateEnd: '',
        status: '',
        page: 1,
        pageSize: 10,
        amount: '',
        number: '',
        dateAddBegin: '',
        dateAddEnd: '',
        username: '',
        mobile: '',
        realNameLike: ''
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
      APIFinance.userCashAdjustList(formInline).then(response => {
        if (response.code === 0) {
          let result = response.data.pageBean.result
          that.pagination.pageSize = response.data.pageBean.pageSize
          that.pagination.tatal = response.data.pageBean.totalRow
          if (result.length > 0) {
            result.forEach(ele => {
              let user = response.data.userBaseInfoMap[ele.userId]
              let checkAdmin = response.data.adminIdCheckMap[ele.adminId2]
              let saveAdmin = response.data.adminIdSaveMap[ele.adminId1]
              ele.username = user.username
              ele.mobile = user.mobile
              ele.name = user.name
              ele.checkAdmin = checkAdmin.name
              ele.saveAdmin = saveAdmin.name
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
