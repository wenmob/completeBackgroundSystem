<template>
  <div class="bis-page" id="login">
    <div id="login-cont">
       <h3 id="login-h">业务后台管理系统<br/><span>版本 v1.0</span></h3>
       <el-form id="login-form"  :model="userInfo" :rules="rules" ref="userInfo" label-width="100px">
          <el-form-item prop="username" label="账号">
              <el-input type="text" v-model="userInfo.username" placeholder="请输入账号" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
              <el-input type="password" v-model="userInfo.password" placeholder="请输入密码" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="picCode" label="验证码">
            <el-col :span="16">
              <el-input type="text" v-model="userInfo.picCode" placeholder="请输入验证码" auto-complete="off"></el-input>
            </el-col>
            <el-col :span="7" :offset="1">
              <img id="pic-code" width="100%" height="32" @click="refCode" :src="srcCode"/>
            </el-col>
          </el-form-item>
          <el-form-item>
           <el-button type="primary" style="width: 100%;" @click="submitForm('userInfo')">提交</el-button>
          </el-form-item>
       </el-form>
    </div>
  </div>
</template>

<script>
import {API} from '../../utils/api'
import { setToken, setMS } from '../../utils/auth'
import uri from '@/utils/BaseUrl'
export default {
  name: 'Login',
  data () {
    return {
      userInfo: {
        picKey: '',
        username: '',
        password: '',
        picCode: ''
      },
      rules: {
        username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        picCode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]

      },
      srcCode: ''
    }
  },
  mounted () {
    this.refCode()
    this.enterToLogin()
  },
  methods: {
    uuid () {
      let s = []
      let hexDigits = '0123456789abcdef'
      for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '-'
      let uuid = s.join('')
      return uuid
    },
    refCode () {
      let uuid = this.uuid()
      this.userInfo.picKey = uuid
      this.srcCode = uri + '/adminCode?key=' + uuid
    },
    // 监听enter键
    enterToLogin () {
      const that = this
      document.onkeydown = function (event) {
        let e = event || window.event
        if (e && e.keyCode === 13) { // 回车键的键值为13
          that.submitForm('userInfo') // 调用登录按钮的登录事件
        }
      }
    },
    submitForm (formName) {
      let _this = this
      let userInfo = _this.userInfo
      this.$refs[formName].validate((valid) => {
        if (valid) {
          API.login(userInfo.picKey, userInfo.username, userInfo.password, userInfo.picCode).then(response => {
            if (response.code === 0) {
              setToken(response.data.token)
              setMS(response.data.merchantSet)
              _this.$router.push('/')
            } else {
              _this.$message({
                message: response.msg,
                type: 'warning'
              })
              _this.refCode()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style>
  @import url('../../assets/css/bus.css');
  #login {
    background-image: url('../../assets/images/bg.jpg');
    background-repeat: no-repeat;
  }
  #login-cont{
    position: absolute;
    width: 400px;
    height: 360px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 4px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    -webkit-box-shadow:0 0 10px rgba(255, 255, 255, .4);
    -moz-box-shadow:0 0 10px rgba(255, 255, 255, .4);
    box-shadow:0 0 10px rgba(255, 255, 255, .4);
  }
  #login-h{
   width: 100%;
   color: #0862C4;
   text-align: center;
   font-weight: 600;
   font-size: 20px;
   padding: 7px 0px;
   border-radius: 2px;
  }
  #login-h span{
    font-size: 12px;
  }
  #login-form{
    width: 300px;
  }
  #pic-code{
    border-radius: 2px;
  }
</style>
