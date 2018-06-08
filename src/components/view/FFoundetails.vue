<template>
  <div class="bis-page">
   <el-button type="primary" icon="el-icon-arrow-left"  @click="goBack">返回</el-button>
   <el-table
    :data="tableData"
    style="width: 100%;margin-top:15px"
    >
    <el-table-column
      prop="dateAdd"
      label="交易时间">
    </el-table-column>
    <el-table-column
      prop="typeStr"
      label="类型">
    </el-table-column>
    <el-table-column
      prop="amount"
      label="金额">
    </el-table-column>
    <el-table-column
      prop="balance"
      label="余额">
    </el-table-column>
    <el-table-column
      prop="freeze"
      label="冻结">
    </el-table-column>
    <el-table-column
      prop="total"
      label="总资产">
    </el-table-column>
    <el-table-column
      prop="orderNumber"
      label="业务订单">
    </el-table-column>
    <el-table-column
      label="备注">
      <template slot-scope="scope">
         <el-tooltip class="item" effect="dark" :content="scope.row.remark" placement="left">
          <span>{{scope.row.remark|WidthCheck(12)}}</span>
         </el-tooltip>
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
  </div>
</template>

<script>
import { API } from '../../utils/api'
export default {
  data () {
    return {
      formInline: {
        page: 1,
        id: ''
      },
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSizes: [10],
        pageSize: 0,
        tatal: 0
      }
    }
  },
  mounted () {
    this.getTableDate(this.formInline)
  },
  methods: {
    // 获取表格数据
    getTableDate (formInline) {
      const that = this
      if (this.$route.query.id) {
        that.formInline.id = that.$route.query.id
        API.userFoundetails(formInline.page, formInline.id).then(response => {
          if (response.code === 0) {
            that.pagination.pageSize = response.data.pageBean.pageSize
            that.pagination.tatal = response.data.pageBean.totalRow
            let result = response.data.pageBean.result
            that.tableData = result
            console.log(response)
          }
        })
      } else {
        that.tableData = []
      }
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)

    },

    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      const that = this
      that.formInline.page = val
      that.getTableDate(that.formInline)
    },
    // 返回
    goBack () {
      this.$router.go(-1)
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
