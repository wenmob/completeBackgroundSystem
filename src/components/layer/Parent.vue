<template>
  <el-container class="bis-page">
    <el-header id="layer-head">
        <icon name="gm" scale="2.3" class="layer-head-ico"></icon>
        <span class="layer-head-title">后台管理系统</span>
        <el-button type="text" class="layer-head-btn1" style="color:#fff" @click="logout"><i class="fa fa-power-off"></i>&nbsp;退出</el-button>
        <el-button type="text" class="layer-head-btn2" style="color:#fff" @click="modifyPwd"><i class="fa fa-cog"></i>&nbsp;修改密码</el-button>
        <span class="layer-head-s1">当前用户：{{name}}</span>
    </el-header>
    <el-container>
      <el-aside width="200px" id="layer-aside-left">
        <el-menu
         :default-active="leftStats"
         class="el-menu-vertical-demo"
         @select="menuSelected"
         background-color="transparent"
         text-color="#fff"
         active-text-color="black"
         router
         >
         <NavMenu :navMenus="leftMenus"></NavMenu>
        </el-menu>
      </el-aside>
      <el-aside id="layer-aside-right">
        <el-header id="layer-aside-head">
          <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="skipNext">
            <el-tab-pane
              v-for="item in editableTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
            >
            </el-tab-pane>
          </el-tabs>
          <div style="clear:both"></div>
        </el-header>
        <el-main id="layer-app">
          <transition :name="transitionName">
           <router-view class="Router"/>
          </transition>
        </el-main>
      </el-aside>
     <!-- <el-main>
          asdasd
      </el-main>  -->
    </el-container>
    <!--修改密码-->
    <el-dialog title="修改密码" :visible.sync="dialogPasswordVisible" width="30%">
      <el-form  :model="formPwd" ref="formPwd" :rules="rulePwd" label-width="70px">
        <el-form-item label="原密码" prop="oldPwd">
          <el-input type="password" v-model="formPwd.oldPwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="formPwd.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password_confirm">
          <el-input type="password" v-model="formPwd.password_confirm"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('formPwd')">提交</el-button>
          <el-button @click="resetForm('formPwd')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
import Icon from 'vue-svg-icon/Icon.vue'
import NavMenu from './NavMenu'
import { API } from '@/utils/api'
import { getToken, removeToken } from '@/utils/auth'
import { treeObj } from '@/utils/rolesTree'
export default {
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formPwd.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      name: '',
      dialogPasswordVisible: false,
      leftStats: this.$route.name,
      transitionName: 'slide-right',
      editableTabs: [],
      editableTabsValue: '', // 标签被选中的位置
      tabIndex: 0, // 标签的索引
      leftMenus: [],
      formPwd: {
        oldPwd: '',
        password: '',
        password_confirm: ''
      },
      rulePwd: {
        oldPwd: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        password: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        password_confirm: [ { validator: validatePass, trigger: 'blur' } ]
      },
      buttons: []
    }
  },
  components: {
    Icon,
    NavMenu
  },
  mounted () {
    this.initData()
  },
  methods: {
    // 初始化
    initData () {
      this.createMenu()
      let name = this.leftStats
      let path = this.$route.path
      this.addTab(name, path)
      this.checkStatus()
    },
    // 添加标签的方法
    addTab (name, path) {
      let n = this.editableTabs.findIndex(ele => {
        return ele.title === name
      })
      if (n === -1) {
        let newTabName = ++this.tabIndex + ''
        this.editableTabs.push({
          title: name,
          name: newTabName,
          path: path
        })
        this.editableTabsValue = newTabName
      } else {
        this.editableTabsValue = this.editableTabs[n].name
      }
    },
    // 删除标签的方法
    removeTab (targetName) {
      let _this = this
      let tabs = this.editableTabs
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
              _this.$router.push(nextTab.path)
            }
          }
        })
      }
      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter(tab => tab.name !== targetName)
    },
    // 获取登录的信息
    checkStatus () {
      const that = this
      API.checkStatus().then(response => {
        if (response.code === 0) {
          that.name = response.data.name
        }
      })
    },
    // 点击标签方法
    skipNext (obj) {
      let tabs = this.editableTabs
      let n = parseInt(obj.index)
      this.$router.push(tabs[n].path)
      this.editableTabsValue = tabs[n].name
      this.leftStats = tabs[n].title
    },
    // 点击左边菜单的方法
    menuSelected (name, arr, obj) {
      this.leftStats = name
      this.addTab(name, obj.route)
      // console.log(obj.route)
    },
    // 获取权限的列表
    createMenu () {
      let token = getToken()
      API.menu(token).then(response => {
        if (response.code === 0) {
          let newArry = []
          let data = response.data.menu
          if (response.data.button.length > 0) {
            this.setButtons(response.data.button)
          }
          let menu = treeObj.doneTreeData(data, newArry, 0)
          // console.dir(menu)
          this.leftMenus = menu
        } else {
          this.leftMenus = []
        }
      })
    },
    // 退出的功能
    logout () {
      removeToken()
      this.$router.push('/login')
    },
    // 修改密码
    modifyPwd () {
      this.password_confirm = ''
      for (let x in this.formPwd) {
        this.formPwd[x] = ''
      }
      this.dialogPasswordVisible = true
    },
    // 提交修改密码
    submitForm (formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          API.modifyPassword(that.formPwd.oldPwd, that.formPwd.password).then(response => {
            if (response.code === 0) {
              that.$message({
                message: '密码修改成功',
                type: 'success'
              })
              that.logout()
            } else {
              that.$message({
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

  },
  watch: {
    // 监听路由的方法
    '$route' (to, from) {
      let isBack = this.$router.isBack // 监听路由变化时的状态为前进还是后退
      if (isBack) {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = 'slide-left'
      }
      this.$router.isBack = false
      this.leftStats = to.name
    }
  }
}
</script>

<style>
  @import url('../../assets/css/bus.css');
  #layer-head {
    background-color: #394D86;
    height: 46px !important;
  }
  #layer-aside-left {
    background-color: #29365D;
    overflow-x: hidden;
    border-right: 1px solid #29365D;
  }
  #layer-aside-right {
     width: calc(100% - 200px) !important;
  }
  #layer-aside-head{
    height: 40px !important;
    padding: 0px !important;
  }
  .Router {
     width: 100%;
     transition: all .3s ease;
     -webkit-transition: all .3s ease;
     -moz-transition: all .3s ease;
     -o-transition: all .3s ease;
    }

  .slide-left-enter,
  .slide-right-leave-active {
     opacity: 0;
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
  }

  .slide-left-leave-active,
  .slide-right-enter {
     opacity: 0;
    -webkit-transform: translate(-100%, 0);
    transform: translate(-100% 0);
  }
  .el-menu{
    border-style: none !important;
  }
  .layer-head-ico{
    float: left;
    margin-top: 12px;
  }
  .layer-head-title{
    float: left;
    color: #fff;
    font-size: 15px;
    font-weight: 500;
    margin-left: 10px;
    margin-top: 15px;
  }
  .layer-head-useico {
    float: right;
    margin-top: 12px;
  }
  .layer-head-s1 {
    float: right;
    color: #fff;
    font-size: 14px;
    margin-top: 15px;
    margin-right: 20px;
  }
  .layer-head-btn1 {
    float: right;
    font-size: 14px;
    margin-top: 3px;
    margin-left: 20px;
  }
  .layer-head-btn2 {
    float: right;
    font-size: 14px;
    margin-top: 3px;
    margin-left: 20px;
  }
  #layer-app {
    width: 100%;
    height: calc(100% - 40px);
    overflow-x: hidden;
    overflow-y: auto;
  }
  .el-tabs__item {
    font-size: 12px !important;
    padding: 0 15px !important;
    height: 30px !important;
    line-height: 30px !important;
  }
  .el-tabs__item.is-active {
    background-color: #409EFF !important;
    color: #fff !important;
  }
</style>
