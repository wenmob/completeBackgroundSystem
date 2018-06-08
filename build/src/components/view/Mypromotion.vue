<template>
  <div>
   <el-form ref="form" :model="form" label-width="100px" style="width:600px">
     <el-form-item label="二维码：">
      <div id="qrcode" ref="qrcode"></div>
     </el-form-item>
     <el-form-item label="邀请码：">
      <el-input type="text" v-model="form.referrerId" :disabled="true"></el-input>
     </el-form-item>
     <el-form-item label="推广链接：">
      <el-input type="text" v-model="form.url" :disabled="true"></el-input>
     </el-form-item>
   </el-form>
  </div>
</template>

<script>
import { API } from '../../utils/api'
import QRCode from 'qrcodejs2'
export default {
  data () {
    return {
      form: {
        encodedReturnUrl: '',
        referrerId: '',
        url: ''
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 我的推广
    getData () {
      const that = this
      API.userQRCode().then(response => {
        if (response.code === 0) {
          that.form = response.data
          that._getQart(that.form.url)
        }
      })
    },
    _getQart (url) {
      let qrcode = new QRCode(document.getElementById('qrcode'), {
        width: 220, // 设置宽高
        height: 220
      })
      qrcode.makeCode(url)
    }
  }
}
</script>

<style>

</style>
