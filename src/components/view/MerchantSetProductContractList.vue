<template>
  <div class="bis-page">
   <el-button type="success" @click="add" size="small"><i class="el-icon-plus" v-if="handleAble('/admin/merchantSetProductContract/save', Buttons)"></i>添加</el-button>

   <el-table
    :data="tableData"
    style="width: 100%; margin-top: 20px"
    size="small">
    <el-table-column
      prop="type"
      label="类型">
      <template slot-scope="scope">
        <span v-if="scope.row.type == 'day'">天天赢</span>
        <span v-else-if="scope.row.type == 'week'">周周发</span>
        <span v-else-if="scope.row.type == 'month'">月月赚</span>
        <span v-else>互惠盈</span>
      </template>
    </el-table-column>
    <el-table-column
      label="查看内容">
      <template slot-scope="scope">
        <el-button type="text" @click="readDetails(scope.row)">查看</el-button>
      </template>
    </el-table-column>
    <el-table-column
      prop="dateAdd"
      label="添加/修改时间">
      <template slot-scope="scope">
        <span>
          {{scope.row.dateAdd ? scope.row.dateAdd : '-'}}<br/>
          {{scope.row.dateUpdate ? scope.row.dateUpdate : '-'}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      width="90">
      <template slot-scope="scope">
         <el-button @click="handleClick1(scope.row)" type="text" size="small" style="color: #467929" v-if="handleAble('/admin/merchantSetProductContract/save', Buttons)">编辑</el-button>
         <el-button @click="handleClick2(scope.row)" type="text" size="small" style="color: #DD5A43" v-if="handleAble('/admin/merchantSetProductContract/del', Buttons)">删除</el-button>
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
    title="合同内容"
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
        pageSize: 15
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
      APIMerchant.merchantSetProductContractList(formInline).then(response => {
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
      this.$router.push({path: '/admin/addProductContract', query: {id: data.id}})
    },
    // 删除的功能
    handleClick2 (data) {
      const that = this
      this.$confirm('确定要删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        APIMerchant.merchantSetProductContractDel(data.id).then(response => {
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
      this.$router.push({path: '/admin/addProductContract', query: {}})
    },
    // 查看详情的内容
    readDetails (data) {
      this.value1 = data.content
      this.dialogVisible1 = true
    }
  }
}
</script>

<style>
  @import url('../../assets/css/bus.css');
  .quill-editor {
    height: 300px;
  }
</style>
