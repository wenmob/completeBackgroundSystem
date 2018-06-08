<template>
  <div class="bis-page">
   <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
    <el-form-item label="类型:">
      <el-select v-model="formInline.type" clearable placeholder="" @keyup.enter.native="onSubmit">
          <el-option label="全部" value=""></el-option>
          <el-option label="常见问题" value="0"></el-option>
          <el-option label="新手指引" value="1"></el-option>
          <el-option label="安全保障" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="标题:">
      <el-input v-model="formInline.titleLike" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button v-if="handleAble('/admin/siteFaq/save', Buttons)" type="success" @click="add"><i class="el-icon-plus"></i>添加</el-button>
    </el-form-item>
    </el-form>

   <el-table
    :data="tableData"
    style="width: 100%"
    size="small">
    <el-table-column
      prop="typeStr"
      label="类型"
      width="100">
    </el-table-column>
    <el-table-column
      prop="title"
      label="标题"
      show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{scope.row.title}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="查看内容"
      width="100">
      <template slot-scope="scope">
        <el-button type="text" @click="readDetails(scope.row)">查看</el-button>
      </template>
    </el-table-column>
    <el-table-column
      prop="dateAdd"
      label="添加/修改时间"
      width="150">
      <template slot-scope="scope">
        {{scope.row.dateAdd ? scope.row.dateAdd : '-'}}<br/>
        {{scope.row.dateUpdate ? scope.row.dateUpdate : '-'}}
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      width="90">
      <template slot-scope="scope">
         <el-button v-if="handleAble('/admin/siteFaq/save', Buttons)" @click="handleClick1(scope.row)" type="text" size="small" style="color: #467929">编辑</el-button>
         <el-button v-if="handleAble('/admin/siteFaq/del', Buttons)" @click="handleClick2(scope.row)" type="text" size="small" style="color: #DD5A43">删除</el-button>
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

   <!--查看详情的效果-->
   <el-dialog
    title="问题"
    :visible.sync="dialogVisible1"
    width="40%">
    <div v-html="value1"></div>
   </el-dialog>
  </div>
</template>

<script>
import { APIMerchant } from '../../utils/apiMerchant'
export default {
  data () {
    return {
      dialogVisible1: false,
      value1: '',
      formInline: {
        page: 1,
        pageSize: 15,
        titleLike: '',
        type: ''
      },
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSizes: [15],
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
      APIMerchant.siteFaqList(formInline).then(response => {
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
      this.$router.push({path: '/admin/addFaq', query: {id: data.id}})
    },
    // 删除的功能
    handleClick2 (data) {
      const that = this
      this.$confirm('确定要删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        APIMerchant.siteFaqDel(data.id).then(response => {
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
      this.$router.push({path: '/admin/addFaq', query: {}})
    },
    // 查看详情的内容
    readDetails (data) {
      this.value1 = data.content
      this.dialogVisible1 = true
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
  .quill-editor {
    height: 175px;
  }
</style>
