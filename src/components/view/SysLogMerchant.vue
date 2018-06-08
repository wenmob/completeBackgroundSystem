<template>
  <div class="bis-page">
   <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
    <el-form-item label="模块名称:">
      <el-input v-model="formInline.moduleType" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="模块类型:">
      <el-input v-model="formInline.oprateType" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="操作名称:">
      <el-input v-model="formInline.name" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="链接地址:">
      <el-input v-model="formInline.uriLike" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="内容:">
      <el-input v-model="formInline.msgLike" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="管理员:">
      <el-select v-model="formInline.adminId" @keyup.enter.native="onSubmit" placeholder="请选择">
        <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
        :value="item.id">
       </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="ip地址:">
      <el-input v-model="formInline.ipLike" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="时间起:">
      <el-date-picker type="date" placeholder="选择日期" v-model="formInline.dateAddBegin" @keyup.enter.native="onSubmit" clearable value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="时间止:">
      <el-date-picker type="date" placeholder="选择日期" v-model="formInline.dateAddEnd" @keyup.enter.native="onSubmit" clearable value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
    </el-form>

   <el-table
    :data="tableData"
    style="width: 100%"
    size="small">
    <el-table-column
      prop="moduleType"
      label="所属模块">
    </el-table-column>
    <el-table-column
      prop="name"
      label="操作"
      width="150">
    </el-table-column>
    <el-table-column
      prop="oprateType"
      label="操作类型"
      width="150">
    </el-table-column>
    <el-table-column
      prop="uri"
      label="相关链接">
    </el-table-column>
    <el-table-column
      prop="msg"
      label="操作记录">
      <template slot-scope="scope">
        <el-tooltip class="item" effect="dark" :content="scope.row.msg" placement="left">
         <span>{{scope.row.msg|WidthCheck(20)}}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column
      prop="adminName"
      label="管理员"
      width="150">
    </el-table-column>
    <el-table-column
      prop="ip"
      label="ip"
      width="150">
    </el-table-column>
    <el-table-column
      prop="dateAdd"
      label="操作时间"
      width="150">
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
import { API } from '../../utils/api'
export default {
  data () {
    return {
      formInline: {
        page: 1,
        dateAddBegin: '',
        dateAddEnd: '',
        moduleType: '',
        oprateType: '',
        name: '',
        adminId: '',
        uriLike: '',
        msgLike: '',
        ipLike: ''
      },
      tableData: [],
      options: [],
      pagination: {
        currentPage: 1,
        pageSizes: [15],
        pageSize: 0,
        tatal: 0
      }
    }
  },
  mounted () {
    this.getTableDate(this.formInline)
  },
  methods: {
    // 获取表格数据
    getTableDate () {
      const that = this
      let formInline = that.formInline
      API.sysLogMerchantList(formInline.page, formInline.dateAddBegin, formInline.dateAddEnd, formInline.moduleType, formInline.oprateType, formInline.name, formInline.adminId, formInline.uriLike, formInline.msgLike, formInline.ipLike).then(response => {
        if (response.code === 0) {
          that.options = []
          let result = response.data.pageBean.result
          that.pagination.pageSize = response.data.pageBean.pageSize
          that.pagination.tatal = response.data.pageBean.totalRow
          let admins = response.data.admins
          let obj = {id: '', name: '全部'}
          that.options.push(obj)
          let adminMap = new Map()
          admins.forEach(ele => {
            that.options.push(ele)
            adminMap.set(ele.id, ele.name)
          })
          result.forEach(e => {
            if (e.adminId) {
              e.adminName = adminMap.get(e.adminId)
            }
          })
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
