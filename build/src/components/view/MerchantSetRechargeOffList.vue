<template>
  <div class="bis-page">
    <div>
      <el-button v-if="handleAble('/admin/merchantSetRechargeOff/save', Buttons)" type="success" size="small" @click="add"><i class="el-icon-plus"></i>添加</el-button>
    </div>
     <el-table
      :data="tableData"
      size="small"
      style="width: 100%;margin-top: 20px;">
      <el-table-column
        prop="id"
        label="序号"
        width="55">
      </el-table-column>
      <el-table-column
        label="开户银行"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.bankName + scope.row.branch}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="account"
        label="账号">
      </el-table-column>
      <el-table-column
        prop="status"
        label="启用">
        <template slot-scope="scope">
          <span>{{scope.row.isUse == true ? '启用' : '禁用'}}</span>
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
        width="90">
        <template slot-scope="scope">
          <el-button v-if="handleAble('/admin/merchantSetRechargeOff/save', Buttons)" @click="handleClick1(scope.row)" type="text" size="small" style="color: #69AA46">编辑</el-button>
          <el-button v-if="handleAble('/admin/merchantSetRechargeOff/del', Buttons)" @click="handleClick2(scope.row)" type="text" size="small" style="color: #DD5A43">删除</el-button>
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

   <el-dialog :title="alert" :visible.sync="dialogFormVisible" width="26%">
    <el-form :model="formLabelAlign" ref="formLabelAlign" :rules="rules" label-width="110px" size="small">
      <el-form-item label="开户银行" prop="bankName">
        <el-input v-model="formLabelAlign.bankName" @keyup.enter.native="submitForm('formLabelAlign')" clearable auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="支行" prop="branch">
        <el-input v-model="formLabelAlign.branch" @keyup.enter.native="submitForm('formLabelAlign')" clearable auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formLabelAlign.name" @keyup.enter.native="submitForm('formLabelAlign')" clearable auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="account">
        <el-input v-model="formLabelAlign.account" @keyup.enter.native="submitForm('formLabelAlign')" clearable auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="是否启用" prop="isUse">
        <el-select v-model="formLabelAlign.isUse" clearable placeholder="" @keyup.enter.native="submitForm('formLabelAlign')">
          <el-option label="启用" :value="true"></el-option>
          <el-option label="禁用" :value="false"></el-option>
         </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="paixu">
        <el-input v-model.number="formLabelAlign.paixu" @keyup.enter.native="submitForm('formLabelAlign')" clearable auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formLabelAlign')">提交</el-button>
        <!-- <el-button @click="resetForm('formLabelAlign')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </el-dialog>
  </div>
</template>

<script>
import { APIMerchant } from '../../utils/apiMerchant'
export default {
  data () {
    return {
      form: {
        page: 1,
        pageSize: 15
      },
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSizes: [15],
        pageSize: 0,
        tatal: 0
      },
      formLabelAlign: {
        id: '',
        bankName: '',
        branch: '',
        name: '',
        account: '',
        isUse: 0,
        paixu: 0
      },
      rules: {
        bankName: [{ required: true, message: '请选择是否启用', trigger: 'blur' }],
        branch: [{ required: true, message: '请选择是否启用', trigger: 'blur' }],
        name: [{ required: true, message: '请选择是否启用', trigger: 'blur' }],
        account: [{ required: true, message: '请选择是否启用', trigger: 'blur' }],
        isUse: [{ required: true, message: '请选择是否启用', trigger: 'blur' }],
        paixu: [
          { required: true, message: '请选择是否启用', trigger: 'blur' },
          { type: 'number', message: '必需是数字' }
        ]
      },
      dialogFormVisible: false,
      alert: '添加'
    }
  },
  mounted () {
    this.getTableDate()
  },
  methods: {
    // 获取表格数据
    getTableDate () {
      const that = this
      APIMerchant.merchantSetRechargeOffList(that.form).then(response => {
        if (response.code === 0) {
          that.pagination.pageSize = response.data.pageBean.pageSize
          that.pagination.tatal = response.data.pageBean.totalRow
          that.tableData = response.data.pageBean.result
        }
      })
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)

    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      const that = this
      that.form.page = val
      that.getTableDate()
    },
    // 点击添加的按钮
    add () {
      this.alert = '添加'
      this.formLabelAlign = {
        id: '',
        bankName: '',
        branch: '',
        name: '',
        account: '',
        isUse: true,
        paixu: 0
      }
      this.dialogFormVisible = true
    },
    // 提交使用
    submitForm (formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          APIMerchant.merchantSetRechargeOffSave(that.formLabelAlign).then(response => {
            if (response.code === 0) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              that.resetForm(formName)
              that.dialogFormVisible = false
              this.getTableDate()
            } else {
              this.$message({
                message: response.msg,
                type: 'warning'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置的功能
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 点击编辑的功能
    handleClick1 (obj) {
      const that = this
      APIMerchant.merchantSetRechargeOffGetById(obj.id).then(response => {
        if (response.code === 0) {
          this.alert = '编辑'
          let bean = response.data.bean
          that.formLabelAlign = bean
          that.dialogFormVisible = true
        } else {
          this.$message({
            message: response.msg,
            type: 'warning'
          })
        }
      })
    },
    // 点击删除的功能
    handleClick2 (obj) {
      this.$confirm('确定要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        APIMerchant.merchantSetRechargeOffDel(obj.id).then(response => {
          if (response.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getTableDate()
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
