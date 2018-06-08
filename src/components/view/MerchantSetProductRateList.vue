<template>
  <div class="bis-page">
    <div v-if="merchantSet.isOwnProductRate">
      <el-button v-if="handleAble('/admin/merchantSetProductRate/save', Buttons)" type="success" size="small" @click="add"><i class="el-icon-plus"></i>添加</el-button>
      <el-button v-if="handleAble('/admin/merchantSetProductRate/init', Buttons)" type="success" size="small" @click="init"><i class="el-icon-refresh"></i>初始化</el-button>
    </div>
     <el-table
      :data="tableData"
      size="small"
      style="width: 100%;margin-top: 20px;">
      <el-table-column
        prop="typeStr"
        label="类型">
      </el-table-column>
      <el-table-column
        prop="level"
        label="杠杆">
      </el-table-column>
      <el-table-column
        prop="rate"
        label="服务费">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 'day'">{{scope.row.rate + " 元/万/天"}}</span>
          <span v-else-if="scope.row.type == 'week'">{{scope.row.rate + " 元/万/周"}}</span>
          <span v-else-if="scope.row.type == 'month'">{{scope.row.rate + " 分/月"}}</span>
          <span v-else>{{scope.row.rate + " 元"}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="maxCpje"
        label="最大操盘金额">
      </el-table-column>
      <el-table-column
        prop="jjxPercent"
        label="警戒线">
        <template slot-scope="scope">
          <span>{{scope.row.jjxPercent + "%"}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="zsxPercent"
        label="平仓线">
        <template slot-scope="scope">
          <span>{{scope.row.zsxPercent + "%"}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="启用">
        <template slot-scope="scope">
          <span>{{scope.row.status == 0 ? '启用' : '禁用'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="90">
        <template slot-scope="scope">
          <el-button v-if="handleAble('/admin/merchantSetProductRate/save', Buttons)" @click="handleClick1(scope.row)" type="text" size="small" style="color: #69AA46">编辑</el-button>
          <el-button v-if="handleAble('/admin/merchantSetProductRate/del', Buttons)" @click="handleClick2(scope.row)" type="text" size="small" style="color: #DD5A43">删除</el-button>
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

   <el-dialog :title="alert" :visible.sync="dialogFormVisible" width="30%">
    <el-form :model="formLabelAlign" ref="formLabelAlign" :rules="rules" label-width="110px" size="small">
      <el-form-item label="类型" prop="type" v-if="merchantSet.isOwnProductRate">
        <el-select v-model="formLabelAlign.type" clearable placeholder="" @keyup.enter.native="submitForm('formLabelAlign')">
          <el-option label="天天赢" value="day"></el-option>
          <el-option label="周周发" value="week"></el-option>
          <el-option label="月月赚" value="month"></el-option>
          <el-option label="互惠盈" value="free"></el-option>
         </el-select>
      </el-form-item>
      <el-form-item label="杠杆" prop="level" v-if="merchantSet.isOwnProductRate">
        <el-input v-model.number="formLabelAlign.level" @keyup.enter.native="submitForm('formLabelAlign')" clearable auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="服务费" prop="rate">
        <el-input v-model.number="formLabelAlign.rate" @keyup.enter.native="submitForm('formLabelAlign')" clearable auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="最多操盘资金" prop="maxCpje" v-if="merchantSet.isOwnProductRate">
        <el-input v-model.number="formLabelAlign.maxCpje" @keyup.enter.native="submitForm('formLabelAlign')" clearable auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="警戒线" prop="jjxPercent" v-if="merchantSet.isOwnProductRate">
        <el-col :span="8">
          <span>保证金亏损至</span>
        </el-col>
        <el-col :span="12">
          <el-input v-model.number="formLabelAlign.jjxPercent" @keyup.enter.native="submitForm('formLabelAlign')" clearable auto-complete="off"></el-input>
        </el-col>
        <el-col :span="1" :offset="1">
          <span>%</span>
        </el-col>
      </el-form-item>
      <el-form-item label="平仓线" prop="zsxPercent" v-if="merchantSet.isOwnProductRate">
        <el-col :span="8">
          <span>保证金亏损至</span>
        </el-col>
        <el-col :span="12">
          <el-input v-model.number="formLabelAlign.zsxPercent" @keyup.enter.native="submitForm('formLabelAlign')" clearable auto-complete="off"></el-input>
        </el-col>
        <el-col :span="1" :offset="1">
          <span>%</span>
        </el-col>
      </el-form-item>
      <el-form-item label="排序" prop="paixu">
        <el-input v-model.number="formLabelAlign.paixu" @keyup.enter.native="submitForm('formLabelAlign')" clearable auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="启用" prop="status">
        <el-select v-model="formLabelAlign.status" clearable placeholder="" @keyup.enter.native="submitForm('formLabelAlign')">
          <el-option label="启用" :value="0"></el-option>
          <el-option label="禁用" :value="1"></el-option>
         </el-select>
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
import { getMS } from '@/utils/auth'
export default {
  data () {
    return {
      merchantSet: {},
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
        type: '',
        level: '',
        rate: '',
        maxCpje: '',
        jjxPercent: '',
        zsxPercent: '',
        paixu: 0,
        status: ''
      },
      rules: {
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        level: [
          { required: true, message: '请输入杠杆', trigger: 'blur' },
          { type: 'number', message: '必须是数字' }
        ],
        rate: [
          { required: true, message: '请输入服务费', trigger: 'blur' },
          { type: 'number', message: '必须是数字' }
        ],
        maxCpje: [
          { required: true, message: '请输入最大操盘金额', trigger: 'blur' },
          { type: 'number', message: '必须是数字' }
        ],
        jjxPercent: [
          { required: true, message: '请输入警戒线', trigger: 'blur' },
          { type: 'number', message: '必须是数字' }
        ],
        zsxPercent: [
          { required: true, message: '请输入平仓线', trigger: 'blur' },
          { type: 'number', message: '必须是数字' }
        ],
        paixu: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          { type: 'number', message: '必须是数字' }
        ],
        status: [{ required: true, message: '请选择是否启用', trigger: 'blur' }]
      },
      dialogFormVisible: false,
      alert: '添加'
    }
  },
  mounted () {
    this.getTableDate()
    let m = JSON.parse(getMS())
    this.merchantSet = m
  },
  methods: {
    // 获取表格数据
    getTableDate () {
      const that = this
      APIMerchant.merchantSetProductRateList(that.form).then(response => {
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
        type: '',
        level: '',
        rate: '',
        maxCpje: '',
        jjxPercent: '',
        zsxPercent: '',
        paixu: 0,
        status: 0
      }
      this.dialogFormVisible = true
    },
    // 初始化功能
    init () {
      this.$confirm('确定要初始化数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        APIMerchant.merchantSetProductRateInit().then(response => {
          if (response.code === 0) {
            this.$message({
              message: '初始化成功',
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
          message: '已取消'
        })
      })
    },
    // 提交使用
    submitForm (formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          APIMerchant.merchantSetProductRateSave(that.formLabelAlign).then(response => {
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
      APIMerchant.merchantSetProductRateGetById(obj.id).then(response => {
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
        APIMerchant.merchantSetProductRateDel(obj.id).then(response => {
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
