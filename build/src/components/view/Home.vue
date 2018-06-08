<template>
    <el-container class="bis-page" id="home-page">
      <el-aside id="home-left">
        <!--今日概要-->
        <div class="home-left-head">
          <div class="home-left-head-cn" style="background-color: #0866C6">
             <span class="home-left-head-cn-s">今日注册</span>
             <div class="home-left-head-cn-d1">
               <icon name="datatu" scale="5.2"></icon>
               <el-tooltip class="item" effect="dark" :content="data.register" placement="top-start">
                 <span>{{data.register|changeVal}}</span>
               </el-tooltip>
               <div style="clear:both"></div>
             </div>
             <div class="home-left-head-cn-d2">
              <span>近30天</span>
              <span>总共</span>
              <div style="clear:both"></div>
             </div>
             <div class="home-left-head-cn-d2" style="margin-top:5px;">
               <el-tooltip class="item" effect="dark" :content="data.regSum30" placement="top-start">
                 <span>{{data.regSum30|changeVal}}</span>
               </el-tooltip>
               <el-tooltip class="item" effect="dark" :content="data.totalRegister" placement="top-start">
                 <span>{{data.totalRegister|changeVal}}</span>
               </el-tooltip>
              <div style="clear:both"></div>
             </div>
          </div>
          <!--收入-->
          <div class="home-left-head-cn" style="background-color: #F36A6A">
             <span class="home-left-head-cn-s">今日收入</span>
             <div class="home-left-head-cn-d1">
               <icon name="datatu" scale="5.2"></icon>
               <el-tooltip class="item" effect="dark" :content="data.cpjeCapacity" placement="top-start">
                 <span>￥{{data.cpjeCapacity|changeVal}}</span>
               </el-tooltip>
               <div style="clear:both"></div>
             </div>
             <div class="home-left-head-cn-d2">
              <span>本月收入</span>
              <span></span>
              <div style="clear:both"></div>
             </div>
             <div class="home-left-head-cn-d2" style="margin-top:5px;">
              <el-tooltip class="item" effect="dark" :content="data.monthCpjeCapacity" placement="top-start">
               <span>￥{{data.monthCpjeCapacity|changeValTypeOne}}</span>
              </el-tooltip>
              <span></span>
              <div style="clear:both"></div>
             </div>
          </div>
          <!--新增-->
          <div class="home-left-head-cn" style="background-color: #6F42C1">
             <span class="home-left-head-cn-s">今日新增</span>
             <div class="home-left-head-cn-d1">
               <icon name="datatu" scale="5.2"></icon>
               <el-tooltip class="item" effect="dark" :content="data.cpjeAdd" placement="top-start">
                <span>￥{{data.cpjeAdd|changeVal}}</span>
              </el-tooltip>
               <div style="clear:both"></div>
             </div>
             <div class="home-left-head-cn-d2">
              <span>本月存量</span>
              <span></span>
              <div style="clear:both"></div>
             </div>
             <div class="home-left-head-cn-d2" style="margin-top:5px;">
               <el-tooltip class="item" effect="dark" :content="data.monthCpjeAdd" placement="top-start">
                <span>￥{{data.monthCpjeAdd|changeValTypeOne}}</span>
               </el-tooltip>
              <span></span>
              <div style="clear:both"></div>
             </div>
          </div>
          <!--清算-->
          <div class="home-left-head-cn" style="background-color: #2B333E">
            <span class="home-left-head-cn-s">今日清算</span>
             <div class="home-left-head-cn-d1">
               <icon name="datatu" scale="5.2"></icon>
               <el-tooltip class="item" effect="dark" :content="data.cpjeEnd" placement="top-start">
                 <span>￥{{data.cpjeEnd|changeVal}}</span>
               </el-tooltip>
               <div style="clear:both"></div>
             </div>
             <div class="home-left-head-cn-d2">
              <span>本月清算</span>
              <span></span>
              <div style="clear:both"></div>
             </div>
             <div class="home-left-head-cn-d2" style="margin-top:5px;">
               <el-tooltip class="item" effect="dark" :content="data.monthCpjeEnd" placement="top-start">
                <span>￥{{data.monthCpjeEnd|changeValTypeOne}}</span>
               </el-tooltip>
              <span></span>
              <div style="clear:both"></div>
             </div>
          </div>
        </div>
        <!--会员注册数据-->
          <div class="home-register" id="drawDate">

          </div>
        <!--数据图-->
      </el-aside>
      <el-aside id="home-right">
        <div class="home-right-cont" align="center">
          <el-date-picker
            v-model="timeDefault"
            type="date"
            placeholder="选择日期"
            size="small"
            style="width:320px;"
            value-format="yyyy-MM-dd"
            @change="changeTypeFun">
        </el-date-picker>
        <div class="home-right-d1" v-for="(td,index) in typeDatas" :key="index">
          <span class="home-right-s1">{{td.typeStr}}</span>
          <div class="home-right-dv1">
            <span class="s1">存量</span>
            <div class="line"><span class="linevv" :style="'width: 100%;'"></span></div>
            <span class="s2">{{(td.cpjeCapacity/10000).toFixed(2)}}万</span>
            <div style="clear:both"></div>
          </div>
          <div class="home-right-dv1">
            <span class="s1">新增</span>
            <div class="line"><span class="linevv1" :style="'width:' + (td.cpjeAdd/td.cpjeCapacity)*100 + '%'"></span></div>
            <span class="s2">{{(td.cpjeAdd/10000).toFixed(2)}}万</span>
            <div style="clear:both"></div>
          </div>
        </div>
        </div>
      </el-aside>
    </el-container>
</template>

<script>
import { API } from '../../utils/api'
import Icon from 'vue-svg-icon/Icon.vue'
import echarts from 'echarts'
export default {
  name: 'Sysgm',
  data () {
    return {
      timeDefault: '',
      myChart: undefined,
      data: {
        register: '-',
        cpjeCapacity: '-',
        regSum30: '-',
        cpjeAdd: '-',
        cpjeEnd: '-',
        monthCpjeCapacity: '-',
        monthCpjeAdd: '-',
        monthCpjeEnd: '-',
        totalRegister: '-'
      },
      typeDatas: []
    }
  },
  components: {
    Icon
  },
  beforeDestroy () {
    this.myChart = undefined
  },
  mounted () {
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
        that.myChart.resize()
      })()
    }
    this.myChart = echarts.init(document.getElementById('drawDate'))
    this.getMemberDatas()
    this.beginDayDatas()
    this.beginMonthDatas()
    this.getMemberDatas()
    this.getTypeDatas()
  },
  methods: {
    // 每日数据的更新
    beginDayDatas () {
      const that = this
      API.indexInit().then(response => {
        if (response.code === 0) {
          if (JSON.stringify(response.data.dayAdd) === '{}') {
            return false
          } else {
            that.data.register = response.data.dayAdd.register + ''
            that.data.cpjeAdd = response.data.dayAdd.cpjeAdd + ''
            that.data.cpjeCapacity = response.data.dayAdd.cpjeCapacity + ''
            that.data.regSum30 = response.data.regSum30 + ''
            that.data.cpjeEnd = response.data.dayAdd.cpjeEnd + ''
          }
        }
      })
    },
    // 每月的数据的更新
    beginMonthDatas () {
      const that = this
      API.indexMonth().then(response => {
        if (response.code === 0) {
          that.data.monthCpjeCapacity = response.data.cpjeCapacity + ''
          that.data.monthCpjeAdd = response.data.cpjeAdd + ''
          that.data.monthCpjeEnd = response.data.cpjeEnd + ''
          that.data.totalRegister = response.data.register + ''
        } else {
          return false
        }
      })
    },
    // 会员的注册数据
    getMemberDatas () {
      const that = this
      return new Promise((resolve, reject) => {
        API.indexInit().then(response => {
          if (response.code === 0) {
            if (response.data.day30List.length !== 0) {
              let day30List = response.data.day30List
              let t1 = []
              let d1 = []
              day30List.forEach(element => {
                d1.push(element.register)
                let dateAdd = element.dateAdd
                let n = dateAdd.indexOf(' ')
                let tStr = dateAdd.substring(0, n)
                t1.push(tStr)
              })
              that.createOption(t1, d1)
            }
          } else {
            return false
          }
          resolve()
        })
      })
    },
    // 获取今天不同类型的数据
    getTypeDatas () {
      const that = this
      API.indexDayType().then(response => {
        if (response.code === 0) {
          response.data.forEach(ele => {
            if (ele.type === 'day') {
              ele.typeStr = '天天赢'
            } else if (ele.type === 'week') {
              ele.typeStr = '周周发'
            } else if (ele.type === 'month') {
              ele.typeStr = '月月赚'
            } else {
              ele.typeStr = '互惠盈'
            }
          })
          that.typeDatas = response.data
        } else {
          return false
        }
      })
    },
    changeTypeFun () {
      const that = this
      API.indexDayType(that.timeDefault).then(response => {
        if (response.code === 0) {
          response.data.forEach(ele => {
            if (ele.type === 'day') {
              ele.typeStr = '天天赢'
            } else if (ele.type === 'week') {
              ele.typeStr = '周周发'
            } else if (ele.type === 'month') {
              ele.typeStr = '月月赚'
            } else {
              ele.typeStr = '互惠盈'
            }
          })
          that.typeDatas = response.data
        } else {
          that.typeDatas = []
        }
      })
    },
    createOption (t1, d1) {
      const that = this
      console.log(that.chartData)
      let option = {
        title: {
          text: '会员注册数据',
          subtext: ''
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {// 坐标轴指示器，坐标轴触发有效
            type: 'shadow'// 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: t1,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '注册数量',
            type: 'bar',
            barWidth: '60%',
            data: d1
          }
        ]
      }
      that.myChart.setOption(option)
    }
  },
  // 过滤器
  filters: {
    changeVal (val) {
      let str = val + ''
      if (str.length > 6) {
        return str.substring(0, 6) + '...'
      } else {
        return str
      }
    },
    changeValTypeOne (val) {
      let str = val + ''
      if (str.length > 12) {
        return str.substring(0, 12) + '...'
      } else {
        return str
      }
    }
  }
}
</script>

<style scoped>
  @import url('../../assets/css/bus.css');
  #home-page{
    min-width: 1200px;
  }
  #home-left{
    width: 70% !important;
  }
  #home-right{
    width: 29% !important;
    margin-left: 20px;
  }
  .home-left-head{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .home-left-head-cn{
    width: 21%;
    padding: 13px 15px;
    height: 140px;
  }
  .home-left-head-cn-s{
    display: block;
    color: #fff;
    font-size: 16px;
  }
  .home-left-head-cn-d1{
    margin-top: 15px;
    border-bottom:1px solid #81B0E0;
  }
 .home-left-head-cn-d1 icon{
   float: left;
 }
 .home-left-head-cn-d1 span{
   float: right;
   color: #fff;
   font-size: 20px;
   margin-top:21px;
 }
 .home-left-head-cn-d2{
  margin-top:8px;
}
 .home-left-head-cn-d2 :nth-child(1){
   float: left;
   color: #fff;
   font-size: 15px;
 }
 .home-left-head-cn-d2 :nth-child(2){
   float: right;
   color: #fff;
   font-size: 15px;
 }
 .home-right-cont{
   height: 570px;
   padding: 24px 24px;
   border: 5px solid #F2F2F2;
 }
 .home-right-d1{
   border-top: 1px solid #F2F2F2;
   text-align: left;
   margin-top: 18px;
   padding-top: 10px;
   padding-bottom: 10px;
 }
 .home-right-s1{
   color: #585858;
   font-size: 16px;
 }
 .home-right-dv1{
   margin-top: 20px;
   padding-left: 26px;
 }
 .home-right-dv1 .s1{
   float: left;
   color: #393939;
   font-size: 15px;
 }
 .home-right-dv1 .line {
   float: left;
   display: block;
   color: #393939;
   font-size: 16px;
   width: 100px;
   height: 5px;
   margin-left: 30px;
   margin-top: 7px;
 }
 .home-right-dv1 .line > .linevv{
   display: block;
   height: 100%;
   background-color: #2A91D8;
   float: left;
 }
 .home-right-dv1 .line > .linevv1{
   display: block;
   height: 100%;
   background-color: #D6487E;
   float: left;
 }
 .home-right-dv1 .s2{
   float: left;
   margin-left: 30px;
   font-size: 16px;
   color: #F36A6A;
 }
 .home-register{
  height: 436px;
  margin-top: 15px;
  border: 5px solid #F2F2F2;
 }
</style>
