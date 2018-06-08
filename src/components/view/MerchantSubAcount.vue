<template>
  <div class="bis-page">
    <el-form :inline="true" :model="formInline" class="demo-form-inline" >
      <el-form-item label="用户名">
        <el-input v-model="formInline.username" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="formInline.nameLike" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formInline.mobile" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formInline.status" @keyup.enter.native="onSubmit" placeholder="请选择">
         <el-option label="全部" value=""></el-option>
         <el-option label="启用" value="0"></el-option>
         <el-option label="禁用" value="1"></el-option>
         <el-option label="删除" value="-1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间起">
       <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateAddBegin" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item label="添加时间止">
        <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateAddEnd" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button v-if="handleAble('/admin/merchantSubAcount/save', Buttons)" type="success" @click="add"><i class="el-icon-plus"></i>添加</el-button>
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
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">启用</span>
          <span v-else-if="scope.row.status == 1">禁用</span>
          <span v-else-if="scope.row.status == -1">删除</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="dateAdd"
        label="创建时间/登录时间">
        <template slot-scope="scope">
          <span>{{scope.row.dateAdd}}<br/>{{scope.row.lastVisitDate}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ipLogin"
        label="登入IP">
      </el-table-column>
      <el-table-column
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="primary">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><el-button v-if="handleAble('/admin/merchantSubAcount/save', Buttons)" @click="modify(scope.row)" type="text"  style="color:#7EB561">修改</el-button></el-dropdown-item>
              <el-dropdown-item><el-button v-if="handleAble('/admin/merchantSubAcount/resetPwd', Buttons)" type="text"  @click="rePwd(scope.row)" style="color:#FD9A49">重置密码</el-button></el-dropdown-item>
              <el-dropdown-item><el-button v-if="scope.row.status == 0 && handleAble('/admin/merchantSubAcount/stop', Buttons)" type="text"  @click="tradeUse(scope.row)" style="color:#E27360">禁用</el-button></el-dropdown-item>
              <el-dropdown-item><el-button v-if="scope.row.status == 1 && handleAble('/admin/merchantSubAcount/unstop', Buttons)" type="text"  @click="tradeUse(scope.row)" style="color:#E27360">启用</el-button></el-dropdown-item>
              <el-dropdown-item><el-button type="text"  @click="delUse(scope.row)" style="color:red" v-if="handleAble('/admin/merchantSubAcount/del', Buttons)">删除</el-button></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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

   <!--弹出框-->
   <el-dialog :title="spanTitle" :visible.sync="dialogFormVisible" width="25%">
     <el-form label-width="100px" :model="formLabelAlign" :rules="rules" ref="formLabelAlign" >
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="formLabelAlign.username" @keyup.enter.native="establish('formLabelAlign')" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="pwd" v-if="passShow">
          <el-input v-model="formLabelAlign.pwd" @keyup.enter.native="establish('formLabelAlign')" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="formLabelAlign.name" @keyup.enter.native="establish('formLabelAlign')" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="mobile" @keyup.enter.native="establish('formLabelAlign')" clearable>
          <el-input v-model="formLabelAlign.mobile"></el-input>
        </el-form-item>
        <el-form-item label="角色分配:" prop="roless">
          <el-checkbox-group v-model="roless" @keyup.enter.native="establish('formLabelAlign')">
            <el-checkbox v-for="(role,index) in roleArr" :label="role.id" :key="index" name="type" style="display: block;margin-left: 0px">{{role.name}}</el-checkbox>
          </el-checkbox-group>
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
      formInline: {
        page: 1,
        pageSize: 10,
        dateAddBegin: '',
        dateAddEnd: '',
        nameLike: '',
        username: '',
        mobile: '',
        status: ''
      },
      tableData: [],
      formLabelAlign: {
        id: '',
        username: '',
        pwd: '',
        name: '',
        mobile: '',
        roleIds: ''
      },
      roless: [],
      roleArr: [],
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      dialogFormVisible: false,
      spanTitle: '',
      pagination: {
        currentPage: 1,
        pageSizes: [10],
        pageSize: 0,
        tatal: 0
      },
      passShow: false
    }
  },
  mounted () {
    this.getRoles()
    this.getTableDate()
  },
  methods: {
    // 获取角色的信息
    getRoles () {
      const that = this
      API.rolesList().then(response => {
        if (response.code === 0) {
          that.roleArr = response.data.list
        }
      })
    },
    // 获取表格数据
    getTableDate () {
      const that = this
      let formInline = that.formInline
      API.merchantSubAcountList(formInline).then(response => {
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
    // 添加
    add () {
      const that = this
      let formLabelAlign = that.formLabelAlign
      for (let x in formLabelAlign) {
        formLabelAlign[x] = ''
      }
      that.roless = []
      that.spanTitle = '添加'
      that.passShow = true
      that.dialogFormVisible = true
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
    // 提交保存 编辑  merchantSubAcountSave
    establish (formName) {
      const that = this
      let formLabelAlign = that.formLabelAlign
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(that.formLabelAlign.roless)
          that.formLabelAlign.roleIds = that.roless.toString()
          API.merchantSubAcountSave(formLabelAlign.id, formLabelAlign.username, formLabelAlign.pwd, formLabelAlign.name, formLabelAlign.mobile, formLabelAlign.roleIds).then(response => {
            if (response.code === 0) {
              that.$refs[formName].resetFields()
              that.dialogFormVisible = false
              that.getTableDate()
            } else {
              that.$message({
                message: '提交失败',
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
    },
    // 修改
    modify (obj) {
      const that = this
      API.merchantSubAcountAdd(obj.id).then(response => {
        if (response.code === 0) {
          that.formLabelAlign = response.data.bean
          let myRoles = response.data.myRoles
          if (myRoles.length > 0) {
            let ids = []
            myRoles.forEach(ele => {
              ids.push(ele.rid)
            })
            that.roless = ids
          }
          that.spanTitle = '修改'
          that.passShow = false
          that.dialogFormVisible = true
        }
      })
    },
    // 重置密码
    rePwd (obj) {
      this.$prompt('请输入密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        API.merchantSubAcountResetPwd(obj.id, value).then(response => {
          if (response.code === 0) {
            this.$message({
              type: 'success',
              message: '密码重置成功'
            })
          } else {
            this.$message({
              type: 'warning',
              message: '请输入密码'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    // 启用还是禁用
    tradeUse (obj) {
      let str = obj.status === 0 ? '确定要禁用？' : '确定要启用？'
      this.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (obj.status === 0) {
          this.merchantSubAcountStop(obj.id)
        } else {
          this.merchantSubAcountUnstop(obj.id)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 启用的接口
    merchantSubAcountUnstop (id) {
      API.merchantSubAcountUnstop(id).then(response => {
        if (response.code === 0) {
          this.$message({
            type: 'success',
            message: '启用成功!'
          })
          this.getTableDate()
        } else {
          this.$message({
            type: 'warning',
            message: response.msg
          })
        }
      })
    },
    // 禁用的接口
    merchantSubAcountStop (id) {
      API.merchantSubAcountStop(id).then(response => {
        if (response.code === 0) {
          this.$message({
            type: 'success',
            message: '禁用成功!'
          })
          this.getTableDate()
        } else {
          this.$message({
            type: 'warning',
            message: response.msg
          })
        }
      })
    },
    // 删除的功能
    delUse  (obj) {
      this.$confirm('确定要删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.merchantSubAcountDel(obj.id).then(response => {
          if (response.code === 0) {
            this.$message({
              type: 'success',
              message: '已删除'
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
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style>
  @import url('../../assets/css/bus.css');
</style>
