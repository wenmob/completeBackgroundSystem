<template>
  <div class="bis-page">
    <el-form label-width="100px" :model="form" style="width:600px" size="small">
      <el-form-item label="资管系统域名:">
        <el-input type="text" v-model="form.domain" @keyup.enter.native="submitForm" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户名:">
        <el-input type="text" v-model="form.u" @keyup.enter.native="submitForm" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码:">
        <el-input type="text" v-model="form.p" @keyup.enter.native="submitForm" clearable></el-input>
      </el-form-item>
      <el-form-item  v-if="handleAble('/admin/merchantSetZiguan/save', Buttons)">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <!-- <el-button @click="resetForm">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { API } from '../../utils/api'
export default {
  data () {
    return {
      form: {
        domain: '',
        u: '',
        p: ''
      }
    }
  },
  mounted () {
    this.getMerchantSetZiguan()
  },
  methods: {
    getMerchantSetZiguan () {
      const that = this
      API.getMerchantSetZiguan().then(response => {
        if (response.code === 0) {
          that.form = response.data.bean
        }
      })
    },
    // 保存资管
    saveMerchantSetZiguan () {
      const that = this
      let form = that.form
      API.saveMerchantSetZiguan(form.domain, form.u, form.p).then(response => {
        if (response.code === 0) {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: response.msg,
            type: 'warning'
          })
        }
      })
    },
    // 提交
    submitForm () {
      const that = this
      for (let index in that.form) {
        if (that.form[index] === '') {
          this.$message({
            message: '缺少必要参数',
            type: 'warning'
          })
          return false
        }
      }

      let form = that.form
      API.saveMerchantSetZiguan(form.domain, form.u, form.p).then(response => {
        if (response.code === 0) {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: response.msg,
            type: 'warning'
          })
        }
      })
    },
    // 重置
    resetForm () {
      const that = this
      for (let index in that.form) {
        that.form[index] = ''
      }
    }
  }
}
</script>

<style>
  @import url('../../assets/css/bus.css');
</style>
