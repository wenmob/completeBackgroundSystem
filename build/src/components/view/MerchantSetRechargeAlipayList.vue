<template>
  <div class="bis-page">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" style="width:500px" size="small">
      <el-form-item label="支付宝名称" prop="name">
        <el-input v-model="form.name" @keyup.enter.native="submitForm('form')" clearable></el-input>
      </el-form-item>
      <el-form-item label="支付宝账号" prop="account">
        <el-input v-model="form.account" @keyup.enter.native="submitForm('form')" clearable></el-input>
      </el-form-item>
      <el-form-item label="通讯秘钥" prop="token">
        <el-input v-model="form.token" @keyup.enter.native="submitForm('form')" clearable placeholder=""></el-input>
      </el-form-item>
      <el-form-item v-if="handleAble('/admin/merchantSetRechargeAlipay/save', Buttons)">
       <el-button type="primary" @click="submitForm('form')">提交</el-button>
       <!-- <el-button @click="resetForm('form')">重置</el-button> -->
      </el-form-item>
     </el-form>
  </div>
</template>

<script>
import { APIFinance } from '../../utils/apiFinance'
export default {
  data () {
    return {
      form: {
        id: '',
        account: '',
        name: '',
        token: ''
      },
      rules: {
        name: [{ required: true, message: '请输入支付宝名称', trigger: 'blur' }],
        account: [{ required: true, message: '请输入支付宝账号', trigger: 'blur' }],
        token: [{ required: true, message: '请输入通用秘钥', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.getDatas()
  },
  methods: {
    getDatas () {
      APIFinance.merchantSetRechargeAlipayList().then(response => {
        if (response.code === 0) {
          if (response.data.bean) {
            this.form = response.data.bean
          }
        } else {
          this.$message({
            message: response.data,
            type: 'warning'
          })
        }
      })
    },
    // 提交功能
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          APIFinance.merchantSetRechargeAlipaySave(this.form).then(response => {
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
</style>
