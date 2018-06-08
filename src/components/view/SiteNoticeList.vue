<template>
  <div class="bis-page">
   <el-form :inline="true" :model="formInline" class="demo-form-inline" >
    <el-form-item label="标题:">
      <el-input v-model="formInline.titleLike" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="是否显示:">
      <el-select v-model="formInline.isShow" clearable placeholder="" @keyup.enter.native="onSubmit">
          <el-option label="全部" value=""></el-option>
          <el-option label="显示" :value="true"></el-option>
          <el-option label="隐藏" :value="false"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="类型:">
      <el-select v-model="formInline.type" clearable placeholder="" @keyup.enter.native="onSubmit">
          <el-option label="全部" value=""></el-option>
          <el-option label="全站公告" value="0"></el-option>
          <el-option label="会员公告" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="添加时间起:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateAddBegin" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="添加时间止:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateAddEnd" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="修改时间起:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateUpdateBegin" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="修改时间止:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateUpdateEnd" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button type="success" @click="add" v-if="handleAble('/admin/siteNotice/save', Buttons)"><i class="el-icon-plus"></i>添加</el-button>
    </el-form-item>
    </el-form>

   <el-table
    :data="tableData"
    style="width: 100%"
    >
    <el-table-column
      prop="type"
      label="类型">
      <template slot-scope="scope">
        <span style="color:#F51231" v-if="scope.row.type == 1">会员公告</span>
        <span style="color: #0DC436" v-else-if="scope.row.type == 0">全站公告</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="title"
      label="标题"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      prop="isShow"
      label="是否显示">
      <template slot-scope="scope">
        <span>{{scope.row.isShow == true ? '显示' : '隐藏'}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="dateAdd"
      label="添加/修改时间">
      <template slot-scope="scope">
        <span>
          {{scope.row.dateAdd ? scope.row.dateAdd : '-'}} <br/>
          {{scope.row.dateUpdate ? scope.row.dateUpdate : '-'}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      width="120">
      <template slot-scope="scope">
         <el-button @click="handleClick1(scope.row)" type="text"  style="color: #467929" v-if="handleAble('/admin/siteNotice/save', Buttons)">编辑</el-button>
         <el-button @click="handleClick2(scope.row)" type="text"  style="color: #DD5A43" v-if="handleAble('/admin/siteNotice/del', Buttons)">删除</el-button>
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
import { APIMerchant } from '../../utils/apiMerchant'
export default {
  data () {
    return {
      dialogFormVisible: false,
      formInline: {
        page: 1,
        pageSize: 10,
        dateAddBegin: '',
        dateAddEnd: '',
        dateUpdateBegin: '',
        dateUpdateEnd: '',
        type: '',
        isShow: '',
        titleLike: ''
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
      APIMerchant.siteNoticeList(formInline).then(response => {
        if (response.code === 0) {
          let result = response.data.pageBean.result
          that.pagination.pageSize = response.data.pageBean.pageSize
          that.pagination.tatal = response.data.pageBean.totalRow
          that.tableData = result
        }
      })
    },
    // 查询
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
    // 编辑的功能
    handleClick1 (data) {
      this.$router.push({path: '/admin/addNotice', query: {id: data.id}})
    },
    // 删除的功能
    handleClick2 (data) {
      const that = this
      this.$confirm('确定要删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        APIMerchant.siteNoticeDel(data.id).then(response => {
          if (response.code === 0) {
            this.$message({
              message: '已删除',
              type: 'success'
            })
            that.getTableDate()
          } else {
            this.$message({
              message: response.data,
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
    // 手动添加的功能
    add () {
      this.$router.push({path: '/admin/addNotice', query: {}})
    }
  }
}
</script>

<style>
  @import url('../../assets/css/bus.css');
  .quill-editor {
    height: 175px;
  }
</style>
