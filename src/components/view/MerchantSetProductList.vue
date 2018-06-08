<template>
  <div class="bis-page">
    <el-radio-group v-model="labelPosition" size="small">
      <el-radio-button label="day">天天赢</el-radio-button>
      <el-radio-button label="week">周周发</el-radio-button>
      <el-radio-button label="month">月月赚</el-radio-button>
      <el-radio-button label="free">互惠盈</el-radio-button>
    </el-radio-group>
    <div style="margin-top:20px;"></div>
     <el-form label-width="130px" :model="form" style="" size="small">
       <el-form-item label="开启/关闭">
        <el-radio-group v-model="isOpen" @keyup.enter.native="submit">
          <el-radio :label="true">开启</el-radio>
          <el-radio :label="false">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="最少保证金(元)">
        <el-input v-model="minBzj" @keyup.enter.native="submit" clearable></el-input>
      </el-form-item>
      <el-form-item label="最大杠杆(倍)">
        <el-input v-model="maxLevel" @keyup.enter.native="submit" clearable></el-input>
      </el-form-item>
      <el-form-item :label="minFreeLabel" v-if="labelPosition != 'free'">
        <el-input v-model="minFee" @keyup.enter.native="submit" clearable></el-input>
      </el-form-item>
      <el-form-item label="最多订单数">
        <el-input v-model="maxOrderNumber" @keyup.enter.native="submit" clearable></el-input>
      </el-form-item>
      <el-form-item label="单票持仓分组" v-if="merchantSet.isOwnZiguan">
        <el-select v-model="riskPositionPercentGroupId" @keyup.enter.native="submit" clearable placeholder="请选择">
          <el-option
            v-for="item in riskPositionPercentGroups"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收费方案" v-if="merchantSet.isOwnZiguan">
        <el-select v-model="feeGroupId" clearable placeholder="请选择" @keyup.enter.native="submit">
          <el-option
            v-for="item in feeGroups"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分成比例">
        <el-col :span="8">
          <el-input v-model="costSys" @keyup.enter.native="submit" clearable></el-input>
        </el-col>
        <el-col :span="4" :offset="1">
          <span style="color:#606266">%给网站</span>
        </el-col>
      </el-form-item>
      <el-form-item label="成本">
        <el-col :span="8">
          <el-input v-model="cost" @keyup.enter.native="submit" clearable></el-input>
        </el-col>
        <el-col :span="4" :offset="1">
          <span style="color:#606266">{{costString}}</span>
        </el-col>
      </el-form-item>
      <el-form-item label="操盘协议">
        <el-input type="textarea" :rows="12" v-model="protocol"></el-input>
      </el-form-item>
     </el-form>

     <div style="padding-bottom: 40px" align="center" v-if="handleAble('/admin/merchantSetProduct/save', Buttons)">
        <el-button type="primary" size="small" @click="submit">提交</el-button>
     </div>
  </div>
</template>

<script>
import { APIMerchant } from '../../utils/apiMerchant'
import { getMS } from '@/utils/auth'
export default {
  data () {
    return {
      merchantSet: {},
      labelPosition: 'day',
      riskPositionPercentGroups: [],
      feeGroups: [],
      form: {
        protocolDay: '',
        protocolWeek: '',
        protocolMonth: '',
        protocolFree: '',
        isOpenDay: false,
        isOpenWeek: false,
        isOpenMonth: false,
        isOpenFree: false,
        minBzjDay: '',
        minBzjWeek: '',
        minBzjMonth: '',
        minBzjFree: '',
        maxLevelDay: '',
        maxLevelWeek: '',
        maxLevelMonth: '',
        maxLevelFree: '',
        minFeeDay: '',
        minFeeWeek: '',
        minFeeMonth: '',
        maxOrderNumberDay: '',
        maxOrderNumberWeek: '',
        maxOrderNumberMonth: '',
        maxOrderNumberFree: '',
        riskPositionPercentGroupIdDay: '',
        riskPositionPercentGroupIdWeek: '',
        riskPositionPercentGroupIdMonth: '',
        riskPositionPercentGroupIdFree: '',
        feeGroupIdDay: '',
        feeGroupIdWeek: '',
        feeGroupIdMonth: '',
        feeGroupIdFree: '',
        costDay: '',
        costWeek: '',
        costMonth: '',
        costFree: '',
        costDaySys: '',
        costWeekSys: '',
        costMonthSys: '',
        costFreeSys: ''
      }
    }
  },
  computed: {
    costString () {
      let type = this.labelPosition
      if (type === 'day') {
        return '元/万/天'
      } else if (type === 'week') {
        return '元/万/周'
      } else if (type === 'month') {
        return '分/月'
      } else {
        return '%'
      }
    },
    minFreeLabel () {
      let type = this.labelPosition
      if (type === 'day') {
        return '最少服务费(元/天)'
      } else if (type === 'week') {
        return '最少服务费(元/周)'
      } else if (type === 'month') {
        return '最少服务费(分/月)'
      } else {
        return false
      }
    },
    isOpen: {
      set (newValue) {
        let type = this.labelPosition
        if (type === 'day') {
          this.form.isOpenDay = newValue
        } else if (type === 'week') {
          this.form.isOpenWeek = newValue
        } else if (type === 'month') {
          this.form.isOpenMonth = newValue
        } else {
          this.form.isOpenFree = newValue
        }
      },
      get () {
        let type = this.labelPosition
        if (type === 'day') {
          return this.form.isOpenDay
        } else if (type === 'week') {
          return this.form.isOpenWeek
        } else if (type === 'month') {
          return this.form.isOpenMonth
        } else {
          return this.form.isOpenFree
        }
      }
    },
    minBzj: {
      set (newValue) {
        let type = this.labelPosition
        if (type === 'day') {
          this.form.minBzjDay = newValue
        } else if (type === 'week') {
          this.form.minBzjWeek = newValue
        } else if (type === 'month') {
          this.form.minBzjMonth = newValue
        } else {
          this.form.minBzjFree = newValue
        }
      },
      get () {
        let type = this.labelPosition
        if (type === 'day') {
          return this.form.minBzjDay
        } else if (type === 'week') {
          return this.form.minBzjWeek
        } else if (type === 'month') {
          return this.form.minBzjMonth
        } else {
          return this.form.minBzjFree
        }
      }
    },
    maxLevel: {
      set (newValue) {
        let type = this.labelPosition
        if (type === 'day') {
          this.form.maxLevelDay = newValue
        } else if (type === 'week') {
          this.form.maxLevelWeek = newValue
        } else if (type === 'month') {
          this.form.maxLevelMonth = newValue
        } else {
          this.form.maxLevelFree = newValue
        }
      },
      get () {
        let type = this.labelPosition
        if (type === 'day') {
          return this.form.maxLevelDay
        } else if (type === 'week') {
          return this.form.maxLevelWeek
        } else if (type === 'month') {
          return this.form.maxLevelMonth
        } else {
          return this.form.maxLevelFree
        }
      }
    },
    minFee: {
      set (newValue) {
        let type = this.labelPosition
        if (type === 'day') {
          this.form.minFeeDay = newValue
        } else if (type === 'week') {
          this.form.minFeeWeek = newValue
        } else if (type === 'month') {
          this.form.minFeeMonth = newValue
        }
      },
      get () {
        let type = this.labelPosition
        if (type === 'day') {
          return this.form.minFeeDay
        } else if (type === 'week') {
          return this.form.minFeeWeek
        } else if (type === 'month') {
          return this.form.minFeeMonth
        } else {
          return false
        }
      }
    },
    maxOrderNumber: {
      set (newValue) {
        let type = this.labelPosition
        if (type === 'day') {
          this.form.maxOrderNumberDay = newValue
        } else if (type === 'week') {
          this.form.maxOrderNumberWeek = newValue
        } else if (type === 'month') {
          this.form.maxOrderNumberMonth = newValue
        } else {
          this.form.maxOrderNumberFree = newValue
        }
      },
      get () {
        let type = this.labelPosition
        if (type === 'day') {
          return this.form.maxOrderNumberDay
        } else if (type === 'week') {
          return this.form.maxOrderNumberWeek
        } else if (type === 'month') {
          return this.form.maxOrderNumberMonth
        } else {
          return this.form.maxOrderNumberFree
        }
      }
    },
    riskPositionPercentGroupId: {
      set (newValue) {
        let type = this.labelPosition
        if (type === 'day') {
          this.form.riskPositionPercentGroupIdDay = newValue
        } else if (type === 'week') {
          this.form.riskPositionPercentGroupIdWeek = newValue
        } else if (type === 'month') {
          this.form.riskPositionPercentGroupIdMonth = newValue
        } else {
          this.form.riskPositionPercentGroupIdFree = newValue
        }
      },
      get () {
        let type = this.labelPosition
        if (type === 'day') {
          return this.form.riskPositionPercentGroupIdDay
        } else if (type === 'week') {
          return this.form.riskPositionPercentGroupIdWeek
        } else if (type === 'month') {
          return this.form.riskPositionPercentGroupIdMonth
        } else {
          return this.form.riskPositionPercentGroupIdFree
        }
      }
    },
    feeGroupId: {
      set (newValue) {
        let type = this.labelPosition
        if (type === 'day') {
          this.form.feeGroupIdDay = newValue
        } else if (type === 'week') {
          this.form.feeGroupIdWeek = newValue
        } else if (type === 'month') {
          this.form.feeGroupIdMonth = newValue
        } else {
          this.form.feeGroupIdFree = newValue
        }
      },
      get () {
        let type = this.labelPosition
        if (type === 'day') {
          return this.form.feeGroupIdDay
        } else if (type === 'week') {
          return this.form.feeGroupIdWeek
        } else if (type === 'month') {
          return this.form.feeGroupIdMonth
        } else {
          return this.form.feeGroupIdFree
        }
      }
    },
    costSys: {
      set (newValue) {
        let type = this.labelPosition
        if (type === 'day') {
          this.form.costDaySys = newValue
        } else if (type === 'week') {
          this.form.costWeekSys = newValue
        } else if (type === 'month') {
          this.form.costMonthSys = newValue
        } else {
          this.form.costFreeSys = newValue
        }
      },
      get () {
        let type = this.labelPosition
        if (type === 'day') {
          return this.form.costDaySys
        } else if (type === 'week') {
          return this.form.costWeekSys
        } else if (type === 'month') {
          return this.form.costMonthSys
        } else {
          return this.form.costFreeSys
        }
      }
    },
    cost: {
      set (newValue) {
        let type = this.labelPosition
        if (type === 'day') {
          this.form.costDay = newValue
        } else if (type === 'week') {
          this.form.costWeek = newValue
        } else if (type === 'month') {
          this.form.costMonth = newValue
        } else {
          this.form.costFree = newValue
        }
      },
      get () {
        let type = this.labelPosition
        if (type === 'day') {
          return this.form.costDay
        } else if (type === 'week') {
          return this.form.costWeek
        } else if (type === 'month') {
          return this.form.costMonth
        } else {
          return this.form.costFree
        }
      }
    },
    protocol: {
      set (newValue) {
        let type = this.labelPosition
        if (type === 'day') {
          this.form.protocolDay = newValue
        } else if (type === 'week') {
          this.form.protocolWeek = newValue
        } else if (type === 'month') {
          this.form.protocolMonth = newValue
        } else {
          this.form.protocolFree = newValue
        }
      },
      get () {
        let type = this.labelPosition
        if (type === 'day') {
          return this.form.protocolDay
        } else if (type === 'week') {
          return this.form.protocolWeek
        } else if (type === 'month') {
          return this.form.protocolMonth
        } else {
          return this.form.protocolFree
        }
      }
    }
  },
  mounted () {
    this.getDatas()
    let m = JSON.parse(getMS())
    this.merchantSet = m
  },
  methods: {
    getDatas () {
      const that = this
      APIMerchant.merchantSetProductList().then(response => {
        if (response.code === 0) {
          let feeGroups = response.data.feeGroups
          let riskPositionPercentGroups = response.data.riskPositionPercentGroups
          that.riskPositionPercentGroups = riskPositionPercentGroups
          that.feeGroups = feeGroups
          that.form = response.data.bean
          let protocolDay = response.data.contentMap['day']
          let protocolWeek = response.data.contentMap['week']
          let protocolMonth = response.data.contentMap['month']
          let protocolFree = response.data.contentMap['free']
          if (protocolDay) {
            that.form.protocolDay = protocolDay
          } else {
            that.form.protocolDay = ''
          }
          if (protocolWeek) {
            that.form.protocolWeek = protocolWeek
          } else {
            that.form.protocolWeek = ''
          }
          if (protocolMonth) {
            that.form.protocolMonth = protocolMonth
          } else {
            that.form.protocolMonth = ''
          }
          if (protocolFree) {
            that.form.protocolFree = protocolFree
          } else {
            that.form.protocolFree = ''
          }
        }
      })
    },
    submit () {
      APIMerchant.merchantSetProductSave(this.form).then(response => {
        if (response.code === 0) {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: response.data,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>

<style>
 @import url('../../assets/css/bus.css');
</style>
