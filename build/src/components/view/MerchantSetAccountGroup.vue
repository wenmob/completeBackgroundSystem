<template>
  <div class="bis-page">
   <el-button v-if="handleAble('/admin/merchantSetAccountGroup/sync', Buttons)" type="success" @click="onSubmit" size="small"><i class="el-icon-plus"></i>同步</el-button>
   <el-table
    :data="tableData"
    style="width: 100%;margin-top:20px"
    size="small">
    <el-table-column
      prop="groupName"
      label="报单通道名称">
    </el-table-column>
    <el-table-column
      prop="isUse"
      label="是否使用">
      <template slot-scope="scope">
        <span>{{scope.row.isUse == 0 ? '禁用' : '启用'}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
          <el-button v-if="handleAble('/admin/merchantSetAccountGroup/save', Buttons)" @click="handleClick(scope.row)" type="text" style="color: #69AA46" size="small">编辑</el-button>
          <el-button v-if="handleAble('/admin/merchantSetAccountGroup/del', Buttons)" type="text" style="color: #DD5A5E" size="small" @click="del(scope.row)">删除</el-button>
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

   <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="20%">
     <el-form label-width="80px" :model="formLabelAlign" :rules="rules" ref="formLabelAlign" size="small">
        <el-form-item label="排序" prop="paixu">
          <el-input v-model="formLabelAlign.paixu" keyup.enter.native="establish('formLabelAlign')" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="isUse">
          <el-select v-model="formLabelAlign.isUse" placeholder="请选择" keyup.enter.native="establish('formLabelAlign')" clearable>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
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
        page: 1
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
        paixu: '',
        isUse: ''
      },
      rules: {
        paixu: [{ required: true, message: '请分配排序', trigger: 'blur' }],
        isUse: [{ required: true, message: '请选择是否启用', trigger: 'blur' }]
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
      API.merchantSetAccountGroupList(formInline.page).then(response => {
        console.log(response)
        if (response.code === 0) {
          let result = response.data.pageBean.result
          that.pagination.pageSize = response.data.pageBean.pageSize
          that.pagination.tatal = response.data.pageBean.totalRow
          that.tableData = result
        }
      })
    },
    // 同步的功能
    onSubmit () {
      const that = this
      API.merchantSetAccountGroupSync().then(response => {
        if (response.code === 0) {
          that.$message({
            message: '同步成功',
            type: 'success'
          })
          this.getTableDate()
        } else {
          that.$message({
            message: response.msg,
            type: 'warning'
          })
        }
      })
    },
    // 点击编辑的效果
    handleClick (obj) {
      const that = this
      let id = obj.id
      API.merchantSetAccountGroupGetById(id).then(response => {
        if (response.code === 0) {
          that.formLabelAlign = {
            id: response.data.bean.id,
            paixu: response.data.bean.paixu,
            isUse: response.data.bean.isUse + ''
          }
          that.dialogFormVisible = true
        } else {
          that.$message({
            message: response.msg,
            type: 'warning'
          })
        }
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
    // 提交的功能
    establish (formName) {
      const that = this
      let formLabelAlign = that.formLabelAlign
      this.$refs[formName].validate((valid) => {
        if (valid) {
          API.merchantSetAccountGroupSave(formLabelAlign.id, formLabelAlign.paixu, formLabelAlign.isUse).then(response => {
            if (response.code === 0) {
              that.$message({
                message: '提交成功',
                type: 'success'
              })
              this.getTableDate()
              that.dialogFormVisible = false
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
    },
    // 删除功能
    del (obj) {
      const that = this
      let id = obj.id
      that.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.merchantSetAccountGroupDel(id).then(response => {
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
        that.$message({
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
