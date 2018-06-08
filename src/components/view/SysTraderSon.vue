<template>
  <div class="bis-page">
   <el-form :inline="true" :model="formInline" class="demo-form-inline" >
    <el-form-item label="账号:">
      <el-input type="text" v-model="formInline.account" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="状态:">
      <el-select v-model="formInline.status" @keyup.enter.native="onSubmit" placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option label="可用" value="0"></el-option>
        <el-option label="正在操盘" value="1"></el-option>
        <el-option label="待清算" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button type="success" @click="add" v-if="handleAble('/admin/sysTraderSon/save', Buttons)">添加</el-button>
    </el-form-item>
    </el-form>

   <el-table
    :data="tableData"
    style="width: 100%"
    >
    <el-table-column
      prop="account"
      label="账号">
    </el-table-column>
    <el-table-column
      prop="tradePwd"
      label="交易密码">
    </el-table-column>
    <el-table-column
      prop="coPwd"
      label="通讯密码">
    </el-table-column>
    <el-table-column
      prop="statusStr"
      label="状态">
    </el-table-column>
    <el-table-column
      prop="remark"
      label="备注">
    </el-table-column>
    <el-table-column
      prop="dateAdd"
      label="添加时间">
    </el-table-column>
    <el-table-column
      prop="dateUpdate"
      label="修改时间">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button v-if="handleAble('/admin/sysTraderSon/save', Buttons)" @click="handleClick(scope.row)" type="text" style="color: #69AA46" >编辑</el-button>
        <el-button v-if="handleAble('/admin/sysTraderSon/del', Buttons)" type="text" style="color: #DD5A5E"  @click="del(scope.row)">删除</el-button>
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

   <el-dialog :title="spanTitle" :visible.sync="dialogFormVisible" width="30%">
     <el-form label-width="80px" :model="formLabelAlign" :rules="rules" ref="formLabelAlign" >
        <el-form-item label="账号" prop="account">
          <el-input v-model="formLabelAlign.account"></el-input>
        </el-form-item>
        <el-form-item label="交易密码" prop="tradePwd">
          <el-input v-model="formLabelAlign.tradePwd"></el-input>
        </el-form-item>
        <el-form-item label="通讯密码" prop="coPwd">
          <el-input v-model="formLabelAlign.coPwd"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formLabelAlign.status" placeholder="请选择">
            <el-option label="可用" value="0"></el-option>
            <el-option label="正在操盘" value="1"></el-option>
            <el-option label="待清算" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="4" v-model="formLabelAlign.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="establish('formLabelAlign')">提交</el-button>
          <!-- <el-button @click="resetForm('formLabelAlign')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { API } from '../../utils/api'
export default {
  data () {
    return {
      spanTitle: '',
      formInline: {
        page: 1,
        pageSize: 10,
        account: '',
        status: ''
      },
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSizes: [10],
        pageSize: 0,
        tatal: 0
      },
      formLabelAlign: {
        id: '',
        account: '',
        tradePwd: '',
        coPwd: '',
        status: '',
        remark: ''
      },
      rules: {
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        tradePwd: [{ required: true, message: '请输入交易密码', trigger: 'blur' }],
        coPwd: [{ required: true, message: '请输入通讯密码', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      dialogFormVisible: false
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
      API.sysTraderSonList(formInline).then(response => {
        if (response.code === 0) {
          let result = response.data.pageBean.result
          that.pagination.pageSize = response.data.pageBean.pageSize
          that.pagination.tatal = response.data.pageBean.totalRow
          that.tableData = result
        }
      })
    },
    onSubmit () {
      const that = this
      that.formInline.page = 1
      that.getTableDate()
    },
    // 点击添加的功能
    add () {
      const that = this
      for (let index in that.formLabelAlign) {
        that.formLabelAlign[index] = ''
      }
      that.spanTitle = '添加'
      that.dialogFormVisible = true
    },
    // 编辑的功能
    handleClick (obj) {
      const that = this
      let id = obj.id
      API.sysTraderSonGetById(id).then(response => {
        if (response.code === 0) {
          let data = response.data.bean
          that.formLabelAlign = {
            id: data.id,
            account: data.account,
            tradePwd: data.tradePwd,
            coPwd: data.coPwd,
            status: data.status + '',
            remark: data.remark
          }
          that.spanTitle = '编辑'
          that.dialogFormVisible = true
        } else {
          that.$message({
            message: response.msg,
            type: 'warning'
          })
        }
      })
    },
    // 点击删除的功能
    del (obj) {
      const that = this
      let id = obj.id
      this.$confirm('确定要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.sysTraderSonDel(id).then(response => {
          if (response.code === 0) {
            that.$message({
              type: 'success',
              message: '删除成功'
            })
            that.getTableDate()
          } else {
            that.$message({
              type: 'warning',
              message: response.msg
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
    // 提交 编辑
    establish (formName) {
      const that = this
      let formLabelAlign = that.formLabelAlign
      this.$refs[formName].validate((valid) => {
        if (valid) {
          API.sysTraderSonSave(formLabelAlign.account, formLabelAlign.tradePwd, formLabelAlign.coPwd, formLabelAlign.status, formLabelAlign.remark, formLabelAlign.id).then(response => {
            if (response.code === 0) {
              that.$refs[formName].resetFields()
              that.dialogFormVisible = false
              that.getTableDate()
            } else {
              that.$message({
                message: response.msg,
                type: 'warning'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }

  }
}
</script>

<style>
  @import url('../../assets/css/bus.css');
</style>
