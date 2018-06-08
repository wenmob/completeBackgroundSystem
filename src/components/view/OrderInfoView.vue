<template>
  <div class="bis-page">
    <!--按钮-->
    <div>
      <el-button type="primary"  icon="el-icon-arrow-left" @click="goBack">返回</el-button>
      <el-button type="warning"  icon="el-icon-tickets" @click="assigned" v-if="orderDetails.status == 15 && merchantSet.isOwnZiguan && handleAble('/admin/orderInfo/allotAccount', Buttons)">分配账号</el-button>
      <el-button type="warning"  icon="el-icon-delete" @click="closeOrder" v-if="orderDetails.status == 15 && handleAble('/admin/orderInfo/closeOrder', Buttons)">关闭订单</el-button>
      <el-button type="warning"  icon="el-icon-warning" @click="stopTrade" v-if="orderDetails.status == 2 && handleAble('/admin/orderInfo/stopOperation', Buttons)">停止操盘</el-button>
      <el-button type="warning"  icon="el-icon-document" @click="xuYue" v-if="expire == 1 && orderDetails.status == 2 && handleAble('/admin/orderInfo/xuYue', Buttons)">手动续约</el-button>
    </div>
    <!--订单信息-->
    <h3 class="order_view_t">订单信息：</h3>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form size="mini">
          <el-form-item label="状态:">
            <span>{{orderDetails.statuStr}}</span>
          </el-form-item>
          <el-form-item label="类型:">
            <span>{{orderDetails.typeStr}}</span>
          </el-form-item>
          <el-form-item label="操盘金额:">
            <span>{{orderCharge.cpje}}</span>
          </el-form-item>
          <el-form-item label="预警金额:">
            <span>{{orderCharge.jjje}}</span>
          </el-form-item>
          <el-form-item label="经纪人:">
            <span>{{merchantSubName}}</span>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-form size="mini">
          <el-form-item label="订单号:">
            <span>{{orderDetails.number}}</span>
          </el-form-item>
          <el-form-item label="子账号:">
            <span>{{orderDetails.traderUsername}}</span>
            <el-button type="text" @click="seeFinal(orderDetails.id)" v-if="orderDetails.status == 2 && handleAble('/admin/orderInfo/acountInfo', Buttons)">查看资产</el-button>
          </el-form-item>
          <el-form-item label="保证金:">
            <span>{{orderCharge.bzj}}</span>
          </el-form-item>
          <el-form-item label="止损金额:">
            <span>{{orderCharge.zsje}}</span>
          </el-form-item>
          <el-form-item label="用户名:">
            <span>{{userBean.username}}</span>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
         <el-form size="mini">
          <el-form-item label="姓名:">
            <span>{{userBean.name}}</span>
          </el-form-item>
          <el-form-item label="操盘时长:">
            <span>{{orderDetails.duration}}</span>
          </el-form-item>
          <el-form-item label="借款金额:">
            <span>{{borrow}}</span>
          </el-form-item>
          <el-form-item label="盈亏:">
            <span>{{orderDetails.profit}}</span>
          </el-form-item>
          <el-form-item label="手机号:">
            <span>{{userBean.mobile}}</span>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-form size="mini">
          <el-form-item label="开始操盘日期:">
            <span>{{orderDetails.startDateStr}}</span>
          </el-form-item>
          <el-form-item label="截止日期:">
            <span>{{orderDetails.deadlineStr}}</span>
          </el-form-item>
          <el-form-item label="累计服务费:">
            <span>{{orderDetails.fwf}}</span>
          </el-form-item>
          <el-form-item label="清算时间:">
            <span>{{orderDetails.dateEnd}}</span>
          </el-form-item>
          <el-form-item label="当前服务费:">
            <span>{{orderCharge.fwf}}</span>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!--订单其他内容-->
    <el-row :gutter="20">
      <el-col :span="12">
        <!--订单记录-->
        <h3 class="order_view_t">订单记录：</h3>
        <el-table
          :data="tableData1"
          stripe
          style="width: 100%"
          
          >
          <el-table-column
            prop="typeStr"
            label="类型"
            >
          </el-table-column>
          <el-table-column
            prop="statusStr"
            label="状态"
            >
          </el-table-column>
          <el-table-column
            prop="admin"
            label="管理员"
            >
          </el-table-column>
          <el-table-column
            prop="amount"
            label="金额"
            >
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            >
          </el-table-column>
          <el-table-column
            prop="dateAdd"
            label="添加时间"
            >
          </el-table-column>
          <el-table-column
            prop="dateUpdate"
            label="审核时间"
            >
          </el-table-column>
          <el-table-column
            label="操作"
            width="136">
            <template slot-scope="scope">
              <div v-if="scope.row.isCheck">
                <div v-if="scope.row.type == 0 && handleAble('/admin/orderInfo/checkEndOrderSuccess', Buttons)">
                  <el-button type="text"  style="color: #36B72E" @click="checkEndOrderSuccess(scope.row)">审核成功</el-button>
                </div>
                <div v-else-if="scope.row.type == 1">
                  <el-button v-if="handleAble('/admin/orderInfo/checkTypeSuccess', Buttons)" type="text"  style="color: #36B72E" @click="checkTypeSuccess(scope.row)">审核成功</el-button>
                  <el-button v-if="handleAble('/admin/orderInfo/checkTypeError', Buttons)" type="text"  style="color: #D13417" @click="checkTypeError(scope.row)">审核失败</el-button>
                </div>
                <div v-else-if="scope.row.type == 2">
                  <el-button v-if="handleAble('/admin/orderInfo/checkTypeSuccess', Buttons)" type="text"  style="color: #36B72E" @click="checkTypeSuccess(scope.row)">审核成功</el-button>
                </div>
                <div v-else-if="scope.row.type == 3">
                  <el-button v-if="handleAble('/admin/orderInfo/checkTypeSuccess', Buttons)" type="text"  style="color: #36B72E" @click="checkTypeSuccess(scope.row)">审核成功</el-button>
                </div>
                <div v-else-if="scope.row.type == 4">
                  <el-button v-if="handleAble('/admin/orderInfo/checkTypeSuccess', Buttons)" type="text"  style="color: #36B72E" @click="checkTypeSuccess(scope.row)">审核成功</el-button>
                  <el-button v-if="handleAble('/admin/orderInfo/checkTypeError', Buttons)" type="text"  style="color: #D13417" @click="checkTypeError(scope.row)">审核失败</el-button>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <!--订单记录-->
        <h3 class="order_view_t">资金记录：</h3>
         <el-table
          :data="tableData2"
          stripe
          style="width: 100%"
          
          >
          <el-table-column
            prop="behavior"
            label="收支"
            >
            <template slot-scope="scope">
              <span v-if="scope.row.behavior == 0" style="color: #36B72E">收入</span>
              <span v-else-if="scope.row.behavior == 1" style="color: #D13417">支出</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="typeStr"
            label="类型"
            >
          </el-table-column>
          <el-table-column
            prop="amount"
            label="金额"
            >
          </el-table-column>
          <el-table-column
            prop="balance"
            label="余额"
            >
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            >
          </el-table-column>
          <el-table-column
            prop="dateAdd"
            label="交易时间"
            >
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!--弹出框-->
    <el-dialog title="资产信息" :visible.sync="dialogVisible" width="45%">
      <table class="dia_t">
        <tr>
          <th>总资产</th>
          <td>{{(acountCashAggregationBean.assets*1).toFixed(2)}}</td>
          <th>当前市值</th>
          <td>{{(acountCashAggregationBean.marketValue*1).toFixed(2)}}</td>
          <th>可用</th>
          <td>{{(acountCashAggregationBean.balance*1).toFixed(2)}}</td>
        </tr>
        <tr>
          <th>冻结金额</th>
          <td>{{(acountCashAggregationBean.freeze*1).toFixed(2)}}</td>
          <th>限制金额</th>
          <td colspan="3">{{(acountCashAggregationBean.limitAmount*1).toFixed(2)}}</td>
        </tr>
        <tr>
          <th>预警线</th>
          <td>{{(acountCashAggregationBean.warningLine*1).toFixed(2)}}</td>
          <th>平仓线</th>
          <td colspan="3">{{(acountCashAggregationBean.closePositionLine*1).toFixed(2)}}</td>
        </tr>
      </table>
      <h3 class="order_view_t">当前持仓：</h3>
       <el-table
          :data="tableData3"
          stripe
          style="width: 100%"
          
          >
          <el-table-column
            label="股票名称"
            >
            <template slot-scope="scope">
              <span>{{scope.row.stockName}}<br/>{{scope.row.stockCode}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="costTotle"
            label="市值"
            >
          </el-table-column>
          <el-table-column
            label="现价/成本"
            >
            <template slot-scope="scope">
              <span>{{(scope.row.price*1).toFixed(3)}}<br/>{{(scope.row.priceCost*1).toFixed(3)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="持有/可用"
            >
            <template slot-scope="scope">
              <span>{{scope.row.number}}<br/>{{scope.row.number*1 - scope.row.numberFreeze}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="浮动/盈亏"
            >
            <template slot-scope="scope">
              <span style="color: #606266" v-if="scope.row.profix*1 == 0">{{(scope.row.profix*1).toFixed(2)}}<br/>{{(scope.row.profixpercent*1).toFixed(2) + '%'}}</span>
              <span style="color: #D13417" v-else-if="scope.row.profix*1 > 0">{{(scope.row.profix*1).toFixed(2)}}<br/>{{(scope.row.profixpercent*1).toFixed(2) + '%'}}</span>
              <span style="color: #36B72E" v-else>{{(scope.row.profix*1).toFixed(2)}}<br/>{{(scope.row.profixpercent*1).toFixed(2) + '%'}}</span>
            </template>
          </el-table-column>
        </el-table>
    </el-dialog>
    <!--分配账号的弹出框-->
    <el-dialog
      title="分配账号"
      :visible.sync="dialogVisible1"
      width="30%">
      <el-form  :model="diaFrom" ref="diaFrom" :rules="rules" label-width="100px">
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="diaFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="diaFrom.pwd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('diaFrom')">提交</el-button>
          <!-- <el-button @click="resetForm('diaFrom')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { APIOrder } from '../../utils/apiOrder'
import { getMS } from '@/utils/auth'
export default {
  data () {
    return {
      tableData1: [],
      tableData2: [],
      tableData3: [],
      orderDetails: {},
      orderCharge: {},
      merchantSubName: '',
      merchantSet: {},
      borrow: 0,
      expire: '',
      userBean: {},
      acountCashAggregationBean: {},
      dialogVisible: false,
      dialogVisible1: false,
      diaFrom: {
        id: '',
        username: '',
        pwd: ''
      },
      rules: {
        username: [{ required: true, message: '请输入账号' }],
        pwd: [{ required: true, message: '请输入密码' }]
      }
    }
  },
  mounted () {
    this.hasId()
    let m = JSON.parse(getMS())
    this.merchantSet = m
  },
  methods: {
    // 判断是否有id传来
    hasId () {
      const that = this
      if (that.$route.query.id) {
        let id = that.$route.query.id
        APIOrder.orderInfoView(id).then(response => {
          if (response.code === 0) {
            that.expire = response.data.expire
            let bean = response.data.bean
            let orderCharge = response.data.orderCharge
            // let merchantSet = response.data.merchantSet
            // that.merchantSet = merchantSet
            if (orderCharge) {
              that.borrow = (orderCharge.cpje * 1) - (orderCharge.bzj * 1)
            }
            let merchantSubAcount = response.data.merchantSubAcount
            let userBean = response.data.userBean
            that.orderDetails = bean
            that.orderCharge = orderCharge
            if (merchantSubAcount) {
              that.merchantSubName = merchantSubAcount.name
            }
            that.userBean = userBean
            let orderCaiwuList = response.data.orderCaiwuList // 订单记录列表
            if (orderCaiwuList.length > 0) {
              let merchantSubAcountMap = response.data.merchantSubAcountMap
              for (let i = 0; i < orderCaiwuList.length; i++) {
                let obj = orderCaiwuList[i]
                if (obj.adminId) {
                  obj.admin = merchantSubAcountMap[obj.adminId].name
                } else {
                  obj.admin = ''
                }
                // 判断操作是否显示
                if (obj.status === 4 || obj.status === 3) {
                  obj.isCheck = true
                } else {
                  obj.isCheck = false
                }
              }
              that.tableData1 = orderCaiwuList
            }
            let userCashList = response.data.userCashList // 资金记录
            if (userCashList.length > 0) {
              that.tableData2 = userCashList
            }
          }
        })
      }
    },
    goBack () {
      this.$router.go(-1)
    },
    // 查看子账号的情况
    seeFinal (id) {
      APIOrder.orderInfoAcountInfo(id).then(response => {
        if (response.code === 0) {
          this.acountCashAggregationBean = response.data.acountCashAggregationBean
          let positions = response.data.positions
          if (positions.length > 0) {
            positions.forEach(element => {
              let stockCode = parseInt(element.stockCode)
              let stockObj = response.data.acountCashAggregationBean.stockPriceMap[stockCode]
              element.price = stockObj.price
              // 处理浮动盈亏的代码
              if (element.number === 0) {
                element.profixpercent = ((element.profix / element.costTotle) * 100)
              } else {
                element.profix = ((element.number * element.price * 1) - (element.costTotle * 1))
                element.profixpercent = ((element.profix / element.costTotle) * 100)
              }
            })
          }
          this.tableData3 = positions
          this.dialogVisible = true
        }
      })
    },
    // 点击停止操盘的按钮
    stopTrade () {
      if (this.$route.query.id) {
        this.$confirm('确定要停止操盘?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let id = this.$route.query.id
          APIOrder.orderInfoStopOperation(id).then(response => {
            if (response.code === 0) {
              this.$message({
                type: 'success',
                message: '已停止'
              })
              this.hasId()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else {
        this.$message({
          message: '缺少用户的信息',
          type: 'warning'
        })
      }
    },
    // 审核成功的功能
    checkTypeSuccess (data) {
      this.$confirm('确定通过审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        APIOrder.orderInfoCheckTypeSuccess(data.id).then(response => {
          if (response.code === 0) {
            this.$message({
              type: 'success',
              message: '审核通过'
            })
            this.hasId()
          } else {
            this.$message({
              type: 'warning',
              message: response.data
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消审核'
        })
      })
    },
    // 审核成功的功能
    checkEndOrderSuccess (data) {
      this.$confirm('确定通过审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        APIOrder.orderInfoCheckEndOrderSuccess(data.id).then(response => {
          if (response.code === 0) {
            this.$message({
              type: 'success',
              message: '审核通过'
            })
            this.hasId()
          } else {
            this.$message({
              type: 'warning',
              message: response.data
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消审核'
        })
      })
    },
    // 审核失败的功能 post /admin/orderInfo/checkTypeError
    checkTypeError (data) {
      this.$prompt('请输入备注', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        APIOrder.orderInfoCheckTypeError(data.id, value).then(response => {
          if (response.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.hasId()
          } else {
            this.$message({
              type: 'warning',
              message: response.data
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
    // 关闭订单的功能
    closeOrder () {
      if (this.$route.query.id) {
        this.$confirm('确定要关闭订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let id = this.$route.query.id
          APIOrder.orderInfoCloseOrder(id).then(response => {
            if (response.code === 0) {
              this.$message({
                type: 'success',
                message: '已关闭'
              })
              this.hasId()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else {
        this.$message({
          message: '缺少用户的信息',
          type: 'warning'
        })
      }
    },
    // 手动续约的功能
    xuYue () {
      if (this.$route.query.id) {
        this.$confirm('确定要续约?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let id = this.$route.query.id
          APIOrder.orderInfoXuYue(id).then(response => {
            if (response.code === 0) {
              this.$message({
                type: 'success',
                message: '已续约'
              })
              this.hasId()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else {
        this.$message({
          message: '缺少用户的信息',
          type: 'warning'
        })
      }
    },
    // 分配账号的按钮 assigned
    assigned () {
      const that = this
      if (this.$route.query.id) {
        for (let x in that.diaFrom) {
          that.diaFrom[x] = ''
        }
        that.diaFrom.id = this.$route.query.id
        this.dialogVisible1 = true
      } else {
        this.$message({
          message: '缺少用户的信息',
          type: 'warning'
        })
      }
    },
    submitForm (formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          APIOrder.orderInfoAllotAccount(that.diaFrom).then(response => {
            if (response.code === 0) {
              this.$message({
                type: 'success',
                message: '分配成功'
              })
              this.hasId()
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
    }
  }
}
</script>

<style>
  @import url('../../assets/css/bus.css');
  .order_view_t {
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
    font-size: 18px;
    font-weight: 600;
  }
  .dia_t {
    width: 100%;
    border-collapse: collapse;
  }
  .dia_t th, .dia_t td {
    font-size: 13px;
    text-align: left;
    padding: 10px 15px;
    border: 1px solid #ccc;
  }
</style>
