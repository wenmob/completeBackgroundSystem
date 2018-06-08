<template>
  <div class="bis-page">
   <el-form :inline="true" :model="formInline" class="demo-form-inline" >
    <el-form-item label="用户名:">
      <el-input v-model="formInline.username" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="手机号:">
      <el-input v-model="formInline.mobile" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="姓名:">
      <el-input v-model="formInline.realNameLike" @keyup.enter.native="onSubmit" clearable placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="银行名称:">
      <el-select v-model="formInline.bankId" clearable placeholder="全部" @keyup.enter.native="onSubmit">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="银行卡号:">
      <el-input v-model="formInline.number" placeholder="" @keyup.enter.native="onSubmit" clearable></el-input>
    </el-form-item>
    <el-form-item label="添加时间起:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateAddBegin" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item label="添加时间止:">
      <el-date-picker type="date" placeholder="选择日期" @keyup.enter.native="onSubmit" clearable v-model="formInline.dateAddEnd" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button v-if="handleAble('/admin/userBank/save', Buttons)" type="success" @click="add"><i class="el-icon-plus"></i>添加</el-button>
    </el-form-item>
    </el-form>

   <el-table
    :data="tableData"
    style="width: 100%"
    >
    <el-table-column
      prop="username"
      label="用户名/手机号">
      <template slot-scope="scope">
        <span>{{scope.row.username ? scope.row.username : '-'}}<br/>{{scope.row.mobile ? scope.row.mobile : '-'}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="realName"
      label="姓名">
    </el-table-column>
    <el-table-column
      prop="bankName"
      label="银行/支行">
      <template slot-scope="scope">
        <span>
          {{scope.row.bankName}} <br/>
          {{scope.row.branch}}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      prop="province"
      label="所在地">
      <template slot-scope="scope">
        <span>{{scope.row.province + scope.row.city + scope.row.district}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="number"
      label="账号">
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
      width="120">
      <template slot-scope="scope">
         <el-button v-if="handleAble('/admin/userBank/save', Buttons)" @click="handleClick1(scope.row)" type="text"  style="color: #467929">编辑</el-button>
         <el-button v-if="handleAble('/admin/userBank/del', Buttons)" @click="handleClick2(scope.row)" type="text"  style="color: #DD5A43">删除</el-button>
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
   <el-dialog
    :title="alert"
    :visible.sync="dialogVisible"
    width="30%">
    <el-form  label-width="100px" :model="formLabelAlign" ref="formLabelAlign" :rules="rules" >
      <el-form-item v-if="adtrue == 0">
        <el-tag type="warning">账号或手机号，二选一</el-tag>
      </el-form-item>
      <el-form-item label="账号" prop="username" v-if="adtrue == 0">
        <el-input v-model="formLabelAlign.username" @keyup.enter.native="submitForm('formLabelAlign')" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile" v-if="adtrue == 0">
        <el-input v-model="formLabelAlign.mobile" @keyup.enter.native="submitForm('formLabelAlign')" clearable></el-input>
      </el-form-item>
      <el-form-item label="银行名称" prop="bankId">
        <el-select v-model="formLabelAlign.bankId" clearable placeholder="全部" @keyup.enter.native="submitForm('formLabelAlign')">
          <el-option
            v-for="item in banks"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
         </el-select>
      </el-form-item>
      <el-form-item label="省/市/区" prop="pcd">
       <!--省-->
        <el-col :span="7">
          <el-select v-model="formLabelAlign.province" clearable placeholder="全部" @change="chooseP" @keyup.enter.native="submitForm('formLabelAlign')">
            <el-option
              v-for="item in provinces"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <!--市-->
        <el-col :span="7" :offset="1">
          <el-select v-model="formLabelAlign.city" clearable placeholder="全部" @change="chooseC" @keyup.enter.native="submitForm('formLabelAlign')">
            <el-option
              v-for="item in citys"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <!--区-->
        <el-col :span="7" :offset="1">
          <el-select v-model="formLabelAlign.district" clearable placeholder="全部" @change="chooseD" @keyup.enter.native="submitForm('formLabelAlign')">
            <el-option
              v-for="item in areas"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="支行" prop="branch">
        <el-input v-model="formLabelAlign.branch" @keyup.enter.native="submitForm('formLabelAlign')" clearable></el-input>
      </el-form-item>
      <el-form-item label="银行卡号" prop="number">
        <el-input v-model="formLabelAlign.number" @keyup.enter.native="submitForm('formLabelAlign')" clearable></el-input>
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
export default {
  data () {
    return {
      dialogVisible: false,
      formInline: {
        page: 1,
        pageSize: 10,
        dateAddBegin: '',
        dateAddEnd: '',
        username: '',
        mobile: '',
        realNameLike: '',
        bankId: '',
        number: ''
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
        username: '',
        mobile: '',
        bankId: '',
        province: '',
        city: '',
        district: '',
        branch: '',
        number: ''
      },
      rules: {
        bankId: [{ required: true, message: '请输入银行名称', trigger: 'blur' }],
        branch: [{ required: true, message: '请输入支行', trigger: 'blur' }],
        number: [{ required: true, message: '请输入银行卡号', trigger: 'blur' }]
      },
      options: [],
      banks: [],
      provinces: [],
      citys: [],
      areas: [],
      adtrue: 0,
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
      let formInline = that.formInline
      APIFinance.userBankList(formInline).then(response => {
        if (response.code === 0) {
          let result = response.data.pageBean.result
          that.pagination.pageSize = response.data.pageBean.pageSize
          that.pagination.tatal = response.data.pageBean.totalRow
          if (that.options.length <= 0) {
            let ops = []
            for (let x in response.data.sysBankMap) {
              let op = response.data.sysBankMap[x]
              ops.push(op)
            }
            that.options = ops
          }
          if (result.length > 0) {
            result.forEach(ele => {
              let user = response.data.userBaseInfoMap[ele.id]
              let bank = response.data.sysBankMap[ele.bankId]
              ele.bankName = bank.name
              if (user) {
                ele.username = user.username
                ele.mobile = user.mobile
                ele.realName = user.name
              } else {
                ele.username = ''
                ele.mobile = ''
                ele.realName = ''
              }
            })
          }
          that.tableData = result
        }
      })
    },
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
      const that = this
      that.getDigDatas().then(APIFinance.userBankGetById(data.id).then(response => {
        if (response.code === 0) {
          let bean = response.data.bean
          that.formLabelAlign = {
            id: bean.id,
            username: '',
            mobile: '',
            bankId: bean.bankId,
            province: bean.province,
            city: bean.city,
            district: bean.district,
            branch: bean.branch,
            number: bean.number
          }
          that.adtrue = 1
          that.alert = '编辑'
          that.dialogVisible = true
        }
      }))
    },
    // 删除的功能
    handleClick2 (data) {
      const that = this
      this.$confirm('确定要删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        APIFinance.userBankDel(data.id).then(response => {
          if (response.code === 0) {
            this.$message({
              message: '已解除',
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
      const that = this
      that.adtrue = 0
      that.alert = '添加'
      for (let x in that.formLabelAlign) {
        that.formLabelAlign[x] = ''
      }
      that.getDigDatas().then(() => {
        that.dialogVisible = true
      })
    },
    // 获取银行和省的方法
    getDigDatas () {
      const that = this
      return new Promise((resolve, reject) => {
        APIFinance.userBankGetById(that.formLabelAlign.id).then(response => {
          if (response.code === 0) {
            that.banks = response.data.sysBanks
          }
          APIFinance.getProvince().then(res => {
            if (res.code === 0) {
              that.provinces = res.data
              resolve()
            }
          })
        })
      })
    },
    // 提交
    submitForm (formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(that.formLabelAlign)

          APIFinance.userBankSave(that.formLabelAlign).then(response => {
            if (response.code === 0) {
              this.$message({
                message: '绑定成功',
                type: 'success'
              })
              that.resetForm(formName)
              that.getTableDate()
              that.dialogVisible = false
            } else {
              this.$message({
                message: response.data,
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
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 选择省后获得市
    chooseP (id) {
      const that = this
      let n = that.provinces.findIndex(ele => {
        return ele.id === id
      })
      that.formLabelAlign.province = that.provinces[n].name
      APIFinance.getChild(id).then(response => {
        if (response.code === 0) {
          that.citys = response.data
          that.formLabelAlign.city = ''
          that.formLabelAlign.district = ''
        }
      })
    },
    // 选择市获得区县
    chooseC (id) {
      const that = this
      let n = that.citys.findIndex(ele => {
        return ele.id === id
      })
      that.formLabelAlign.city = that.citys[n].name
      APIFinance.getChild(id).then(response => {
        if (response.code === 0) {
          that.areas = response.data
          that.formLabelAlign.district = ''
        }
      })
    },
    // 选择区县的功能
    chooseD (id) {
      const that = this
      let n = that.areas.findIndex(ele => {
        return ele.id === id
      })
      that.formLabelAlign.district = that.areas[n].name
    }
  }

}
</script>

<style>
  @import url('../../assets/css/bus.css');
</style>
