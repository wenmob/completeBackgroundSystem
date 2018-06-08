<template>
  <div class="bis-page">
   <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
    <el-form-item label="反馈类型:">
      <el-select v-model="formInline.type" clearable placeholder="" @keyup.enter.native="onSubmit">
          <el-option label="全部" value=""></el-option>
          <el-option label="投诉" value="0"></el-option>
          <el-option label="建议" value="1"></el-option>
          <el-option label="反馈" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否回复:">
      <el-select v-model="formInline.isReply" clearable placeholder="" @keyup.enter.native="onSubmit">
          <el-option label="全部" value=""></el-option>
          <el-option label="待回复" value="0"></el-option>
          <el-option label="已回复" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="添加时间起:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateAddBegin" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="添加时间止:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateAddEnd" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="回复时间起:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateUpdateBegin" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="回复时间止:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateUpdateEnd" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
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
      prop="id"
      label="序号">
    </el-table-column>
    <el-table-column
      prop="username"
      label="用户名/手机号">
      <template slot-scope="scope">
        <span>{{scope.row.username ? scope.row.username : '-'}}<br/>{{scope.row.mobile ? scope.row.mobile : '-'}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="realName"
      label="姓名/联系方式">
      <template slot-scope="scope">
        <span>
          {{scope.row.realName ? scope.row.realName : '-'}} <br/>
          {{scope.row.contact ? scope.row.contact : '-'}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      prop="typeStr"
      label="反馈类型">
    </el-table-column>
    <el-table-column
      prop="details"
      label="反馈内容"
      show-overflow-tooltip>
      <template slot-scope="scope">
          <span>{{scope.row.details}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="replyDetails"
      label="回复内容"
      show-overflow-tooltip>
      <template slot-scope="scope">
          <span>{{scope.row.replyDetails}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="dateAdd"
      label="添加/回复时间">
      <template slot-scope="scope">
        <span>
          {{scope.row.dateAdd ? scope.row.dateAdd : '-'}}<br/>
          {{scope.row.dateUpdate ? scope.row.dateUpdate : '-'}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      width="130">
      <template slot-scope="scope">
         <el-button @click="handleClick1(scope.row)" type="text" size="small" style="color: #318BD6">详情</el-button>
         <el-button @click="handleClick2(scope.row)" type="text" size="small" style="color: #467929" v-if="!scope.row.replyDetails && handleAble('/admin/sysFeedback/save', Buttons)">回复</el-button>
         <el-button v-if="handleAble('/admin/sysFeedback/del', Buttons)" @click="handleClick3(scope.row)" type="text" size="small" style="color: #DD5A43">删除</el-button>
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

  <!--详情-->
  <el-dialog title="详情" :visible.sync="dialogFromVisible" width="30%" label-width="100px">
    <el-form :model="formLabelAlign" size="mini">
      <el-form-item label="序号：">
        <span>{{formLabelAlign.id}}</span>
      </el-form-item>
      <el-form-item label="用户名：">
        <span>{{formLabelAlign.username}}</span>
      </el-form-item>
      <el-form-item label="手机号：">
        <span>{{formLabelAlign.mobile}}</span>
      </el-form-item>
      <el-form-item label="姓名：">
        <span>{{formLabelAlign.realName}}</span>
      </el-form-item>
      <el-form-item label="反馈类型：">
        <span>{{formLabelAlign.typeStr}}</span>
      </el-form-item>
      <el-form-item label="联系方式：">
        <span>{{formLabelAlign.contact}}</span>
      </el-form-item>
      <el-form-item label="反馈内容：">
        <span>{{formLabelAlign.details}}</span>
      </el-form-item>
      <el-form-item label="回复内容：">
        <span>{{formLabelAlign.replyDetails}}</span>
      </el-form-item>
      <el-form-item label="反馈时间：">
        <span>{{formLabelAlign.dateAdd}}</span>
      </el-form-item>
      <el-form-item label="回复时间：">
        <span>{{formLabelAlign.dateUpdate}}</span>
      </el-form-item>
    </el-form>
  </el-dialog>

  <!--回复-->
  <el-dialog title="回复" :visible.sync="dialogVisible" width="30%" label-width="100px">
     <el-form size="small" :rules="rules" :model="formReply" ref="formReply" label-width="100px">
       <el-form-item label="回复内容：" prop="replyDetails">
         <el-input type="textarea" :rows="5" v-model="formReply.replyDetails"></el-input>
       </el-form-item>
       <el-form-item>
        <el-button type="primary" @click="submitForm('formReply')">提交</el-button>
        <!-- <el-button @click="resetForm('formReply')">重置</el-button> -->
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
      dialogFromVisible: false,
      dialogVisible: false,
      formInline: {
        page: 1,
        pageSize: 15,
        dateAddBegin: '',
        dateAddEnd: '',
        dateUpdateBegin: '',
        dateUpdateEnd: '',
        isReply: '',
        type: ''
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
        username: '',
        mobile: '',
        realName: '',
        typeStr: '',
        contact: '',
        details: '',
        replyDetails: '',
        dateAdd: '',
        dateUpdate: ''
      },
      formReply: {
        id: '',
        replyDetails: ''
      },
      rules: {
        replyDetails: [{ required: true, message: '请输入回复内容', trigger: 'blur' }]
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
      APIMerchant.sysFeedbackList(formInline).then(response => {
        if (response.code === 0) {
          let result = response.data.pageBean.result
          that.pagination.pageSize = response.data.pageBean.pageSize
          that.pagination.tatal = response.data.pageBean.totalRow
          if (result.length > 0) {
            result.forEach(ele => {
              let user = response.data.userBaseInfoMap[ele.userId]
              if (user) {
                ele.username = user.username
                ele.realName = user.name
                ele.mobile = user.mobile
              } else {
                ele.username = ''
                ele.realName = ''
                ele.mobile = ''
              }
            })
          }
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
    // 查看详情
    handleClick1 (data) {
      const that = this
      APIMerchant.sysFeedbackGetById(data.id).then(response => {
        if (response.code === 0) {
          let bean = response.data.bean
          let user = response.data.userBaseInfo
          bean.username = user.username
          bean.mobile = user.mobile
          bean.realName = user.name
          that.formLabelAlign = bean
          that.dialogFromVisible = true
        }
      })
    },
    // 回复
    handleClick2 (data) {
      this.formReply.id = data.id
      this.dialogVisible = true
    },
    // 删除的功能
    handleClick3 (data) {
      const that = this
      this.$confirm('确定要删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        APIMerchant.sysFeedbackDel(data.id).then(response => {
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
    // 提交的功能
    submitForm (formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          APIMerchant.sysFeedbackSave(that.formReply).then(response => {
            if (response.code === 0) {
              this.$message({
                type: 'success',
                message: '回复成功'
              })
              that.resetForm(formName)
              that.dialogVisible = false
              this.getTableDate()
            } else {
              this.$message({
                type: 'warning',
                message: response.msg
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
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
