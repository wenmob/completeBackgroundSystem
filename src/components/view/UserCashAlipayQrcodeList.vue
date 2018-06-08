<template>
  <div class="bis-page">
    <el-button v-if="handleAble('/admin/userCashAlipayQrcode/save', Buttons)" type="success" size="small" @click="add"><i class="el-icon-plus"></i>添加</el-button>
     <el-table
      :data="tableData"
      size="small"
      style="width: 100%;margin-top: 20px;">
      <el-table-column
        prop="id"
        label="收款码编号">
      </el-table-column>
      <el-table-column
        prop="name"
        label="收款码备注"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="dateAdd"
        label="添加时间">
      </el-table-column>
      <el-table-column
        label="操作"
         v-if="handleAble('/admin/userCashAlipayQrcode/del', Buttons)"
        width="90">
        <template slot-scope="scope">
          <el-button @click="handleClick2(scope.row)" type="text" size="small" style="color: #DD5A43">删除</el-button>
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
    <el-form :model="formLabelAlign" label-width="100px" size="small">
      <el-form-item label="收款码备注" prop="name">
        <el-input type="textarea" :rows="3" v-model="formLabelAlign.name" clearable auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="上传付款码：">
         <el-upload
          class="avatar-uploader"
          :action="upload_url"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
            <img v-if="formLabelAlign.qrcodePic" :src="formLabelAlign.qrcodePic" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
import { APIFinance } from '../../utils/apiFinance'
import uri from '@/utils/BaseUrl'
export default {
  data () {
    return {
      upload_url: uri + '/plupload',
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
        name: '',
        qrcodePic: ''
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
      APIFinance.userCashAlipayQrcodeList(that.form).then(response => {
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
      for (let x in this.formLabelAlign) {
        this.formLabelAlign[x] = ''
      }
      this.dialogFormVisible = true
    },
    // 提交使用
    submitForm (formName) {
      const that = this
      if (that.formLabelAlign.qrcodePic === '') {
        this.$message({
          message: '请上传二维码后，再提交',
          type: 'warning'
        })
        return false
      }

      APIFinance.userCashAlipayQrcodeSave(that.formLabelAlign).then(response => {
        if (response.code === 0) {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.resetForm()
          this.dialogFormVisible = false
          this.getTableDate()
        } else {
          this.$message({
            message: response.data,
            type: 'warning'
          })
        }
      })
    },
    // 重置的功能
    resetForm (formName) {
      for (let x in this.formLabelAlign) {
        this.formLabelAlign[x] = ''
      }
    },
    // 点击编辑的功能
    handleClick1 (obj) {
      const that = this
      APIFinance.userCashAlipayQrcodeGetById(obj.id).then(response => {
        if (response.code === 0) {
          that.formLabelAlign = {
            id: response.data.id,
            name: response.data.name,
            qrcodePic: response.data.qrcodePic
          }
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
        APIFinance.userCashAlipayQrcodeDel(obj.id).then(response => {
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
    },
    handleAvatarSuccess (res, file) {
      this.formLabelAlign.qrcodePic = res.url
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style>
@import url('../../assets/css/bus.css');
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
