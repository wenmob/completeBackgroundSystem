<template>
  <div class="bis-page">
    <el-form ref="form" :model="form" :rules="rules" label-width="110px" style="width:500px" size="small">
      <el-form-item label="码支付ID：" prop="appId">
        <el-input v-model="form.appId" @keyup.enter.native="submitForm('form')" clearable auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="通信秘钥：" prop="pwd">
        <el-input v-model="form.pwd" @keyup.enter.native="submitForm('form')" clearable auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="token：" prop="token">
        <el-input v-model="form.token" @keyup.enter.native="submitForm('form')" clearable auto-complete="off" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="充值手续费：" required>
        <el-col :span="10">
          <el-form-item prop="fee">
            <el-input v-model.number="form.fee" @keyup.enter.native="submitForm('form')" clearable auto-complete="off"  placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1" :offset="1">
          <el-form-item>
            <span>%</span>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item v-if="handleAble('/admin/merchantSetRechargeWechatPay/save', Buttons)">
       <el-button type="primary" @click="submitForm('form')">提交</el-button>
       <!-- <el-button @click="resetForm('form')"></el-button> -->
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
        appId: '',
        pwd: '',
        token: '',
        fee: 0
      },
      rules: {
        appId: [{ required: true, message: '请输入码支付ID', trigger: 'blur' }],
        pwd: [{ required: true, message: '请输入通用秘钥', trigger: 'blur' }],
        token: [{ required: true, message: '请输入token', trigger: 'blur' }],
        fee: [
          { required: true, message: '请输入手续费', trigger: 'blur' },
          { type: 'number', message: '请输入数字' }
        ]
      }
    }
  },
  mounted () {
    this.getDatas()
  },
  methods: {
    getDatas () {
      APIFinance.merchantSetRechargeWechatPayList().then(response => {
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
          APIFinance.merchantSetRechargeWechatPaySave(this.form).then(response => {
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
