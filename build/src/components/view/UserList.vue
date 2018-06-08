<template>
  <div class="bis-page">
    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
      <el-form-item label="用户名">
        <el-input v-model="formInline.username" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formInline.mobile" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="formInline.nameLike" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formInline.status" clearable placeholder="请选择"  @keyup.enter.native="onSubmit">
          <el-option label="全部" value=""></el-option>
          <el-option label="启用" value="0"></el-option>
          <el-option label="禁用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="经纪人">
        <el-select v-model="formInline.salesManager" clearable placeholder="全部"  @keyup.enter.native="onSubmit">
          <el-option
            v-for="item in options2"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
   </el-form>

    <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
      size="small"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
      v-loading="loading">
      <el-table-column
      type="selection"
      width="55">
     </el-table-column>
      <el-table-column
        prop="id"
        label="序号"
        width="55">
      </el-table-column>
      <el-table-column
        prop="salesManagerName"
        label="经纪人">
      </el-table-column>
      <el-table-column
        label="用户名/手机号">
        <template slot-scope="scope">
          <span>{{scope.row.username ? scope.row.username : '-'}}<br/>{{scope.row.mobile ? scope.row.mobile : '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="姓名/身份证">
        <template slot-scope="scope">
          <span>{{scope.row.name ? scope.row.name : '-'}}<br/>{{scope.row.idcard ? scope.row.idcard : '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="dateLogin"
        label="注册/登录"
        width="225">
        <template slot-scope="scope">
           <span>
             {{scope.row.dateAdd}} <br/>
             {{scope.row.dateLogin}}
           </span>
        </template>
      </el-table-column>
      <el-table-column
        label="注册/登入IP">
        <template slot-scope="scope">
          <span>{{scope.row.ipReg}}<br/>{{scope.row.ipLogin}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">启用</span>
          <span v-if="scope.row.status == 1">禁用</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="handleAble('/admin/userBaseInfo/resetPwd', Buttons)"
        label="操作"
        width="70">
        <template slot-scope="scope">
         <el-button @click="handleClick(scope.row)" type="text" size="small" style="color: #FF892A">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="block" style="margin-top:10px;">
      <el-button type="success" size="small" @click="batchStop" v-if="handleAble('/admin/userBaseInfo/batchStop', Buttons)">批量禁用</el-button>
      <el-button type="success" size="small" @click="batchStart" v-if="handleAble('/admin/userBaseInfo/batchStart', Buttons)">批量启用</el-button>
      <el-select v-model="value2" clearable placeholder="分配经纪人" @change="allotBatch" size="small" v-if="handleAble('/admin/userBaseInfo/batchAllotment', Buttons)">
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
import { API } from '../../utils/api'
export default {
  data () {
    return {
      loading: true,
      formInline: {
        page: 1,
        username: '',
        mobile: '',
        nameLike: '',
        status: '',
        salesManager: ''
      },
      tableData: [],
      multipleSelection: [],
      value2: '',
      options2: [],
      pagination: {
        currentPage: 1,
        pageSizes: [15],
        pageSize: 0,
        tatal: 0
      }
    }
  },
  mounted () {
    this.getTableDatas(this.formInline)
  },
  methods: {
    // 获取表格的数据
    getTableDatas (formInline) {
      const that = this
      API.baseInfoList(formInline.page, formInline.username, formInline.mobile, formInline.status, formInline.salesManager, formInline.nameLike)
        .then(response => {
          if (response.code === 0) {
            let result = response.data.pageBean.result
            that.pagination.pageSize = response.data.pageBean.pageSize
            that.pagination.tatal = response.data.pageBean.totalRow
            // 创建Map 方便获取销售经理的名称
            let bean = new Map()
            if (response.data.admins.length > 0) {
              response.data.admins.forEach(e => {
                bean.set(e.id, e.name)
              })
            }
            result.forEach(ele => {
              if (ele.salesManager) {
                ele.salesManagerName = bean.get(ele.salesManager)
              }
            })
            that.tableData = result
            that.options2 = response.data.admins
          } else {
            that.tableData = []
          }
          that.loading = false
        })
    },
    // 查看
    onSubmit () {
      const that = this
      that.formInline.page = 1
      that.getTableDatas(that.formInline)
    },
    // 分配销售经理
    allotBatch () {
      const that = this
      let adminId = that.value2
      let idsArr = []
      if (that.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择记录'
        })
        that.value2 = ''
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
        API.batchAllotment(ids, adminId).then(response => {
          if (response.code === 0) {
            that.getTableDatas(that.formInline)
            that.value2 = ''
          } else {
            return false
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
    // 批量启用
    batchStart () {
      const that = this
      if (that.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择记录'
        })
        return false
      }
      let idsArr = []
      that.multipleSelection.forEach(ele => {
        idsArr.push(ele.id)
      })
      let ids = idsArr.toString()
      that.$confirm('确定要启用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.batchStart(ids).then(response => {
          if (response.code === 0) {
            that.getTableDatas(that.formInline)
          } else {
            return false
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 批量禁用
    batchStop () {
      const that = this
      if (that.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择记录'
        })
        return false
      }
      let idsArr = []
      that.multipleSelection.forEach(ele => {
        idsArr.push(ele.id)
      })
      let ids = idsArr.toString()
      that.$confirm('确定要禁用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.batchStop(ids).then(response => {
          if (response.code === 0) {
            that.getTableDatas(that.formInline)
          } else {
            return false
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },

    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      const that = this
      that.formInline.page = val
      that.getTableDatas(that.formInline)
    },
    // 点击重置密码的功能
    handleClick (obj) {
      let id = obj.id
      this.$prompt('请输入新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        API.resetPassword(id, value).then(response => {
          if (response.code === 0) {
            this.$message({
              type: 'success',
              message: '重置成功'
            })
          } else {
            this.$message({
              type: 'warning',
              message: '请输入密码'
            })
          }
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '取消输入'
        // })
      })
    }
  }
}
</script>

<style>
@import url('../../assets/css/bus.css');
</style>
