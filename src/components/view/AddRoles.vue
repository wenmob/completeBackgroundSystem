<template>
  <div>
    <el-form ref="form" :model="form" :rules="formRules" label-width="80px"  style="width: 500px;">
      <el-form-item label="名称：" prop="name">
        <el-input v-model="form.name" @keyup.enter.native="submitForm('form')" clearable></el-input>
      </el-form-item>
      <el-form-item label="说明：" prop="profile">
        <el-input type="textarea" v-model="form.profile" :rows="4" @keyup.enter.native="submitForm('form')" clearable></el-input>
      </el-form-item>
      <el-form-item label="权限：">
        <el-tree
          :data="roles"
          show-checkbox
          node-key="id"
          default-expand-all
          ref="tree"
          highlight-current
          :default-checked-keys="form.defArr"
          @keyup.enter.native="submitForm('form')">
      </el-tree>
     </el-form-item>
     <el-form-item>
       <el-button type="primary" @click="submitForm('form')">提交</el-button>
       <!-- <el-button @click="resetForm('form')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {API} from '@/utils/api'
import {treeObj} from '@/utils/rolesTree'
export default {
  data () {
    return {
      actions: [],
      roles: [],
      form: {
        id: '',
        name: '',
        profile: '',
        actionsIds: [],
        defArr: []
      },
      formRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        profile: [{ required: true, message: '请输入说明', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.hasID()
  },
  methods: {
    // 判断是否有id
    hasID () {
      const that = this
      if (that.$route.query.rolesId) {
        that.form.id = that.$route.query.rolesId
      } else {
        that.form.id = ''
      }
      that.getRoleList(that.form.id)
    },
    // 获取角色的权限
    getRoleList (id) {
      const that = this
      API.getRoles(id).then(response => {
        if (response.code === 0) {
          let data = response.data.actions
          that.actions = data
          let myActions = response.data.myActions
          let bean = response.data.bean
          let defArr = []
          let newArry = []
          that.roles = treeObj.doneTreeData(data, newArry, 0)
          if (myActions) {
            myActions.forEach(ele => {
              defArr.push(ele.aid)
            })
          }
          if (bean) {
            that.form = {
              id: bean.id,
              name: bean.name,
              profile: bean.profile,
              actionsIds: [],
              defArr: defArr
            }
          }
          // console.log(that.form.defArr);
          defArr.forEach(ele => {
            that.removeParentActions(ele)
          })
          // console.log(that.form.defArr);
        }
      })
    },

    // 删除父亲
    removeParentActions (aid) {
      let curObj = this.actions.find(ele => {
        return ele.id === aid
      })
      if (curObj) {
        this.form.defArr.forEach((ele, index) => {
          if (ele === curObj.pid) {
            this.form.defArr.splice(index, 1)
          }
        })
        this.removeParentActions(curObj.pid)
      }
    },
    // 增加父亲
    addParentActions (aid) {
      let curObj = this.actions.find(ele => {
        return ele.id === aid
      })
      if (curObj) {
        let pid = curObj.pid
        if (pid === 0) {
          return
        }
        let idx = this.form.actionsIds.findIndex(ele => {
          return ele === pid
        })
        if (idx === -1) {
          this.form.actionsIds.push(pid)
          this.addParentActions(pid)
        }
      }
    },

    // 重置的效果
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.$refs.tree.setCheckedKeys([])
    },
    // 提交的功能
    submitForm (formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.form.actionsIds = that.$refs.tree.getCheckedKeys() // 获取被选中的id集合
          // console.log(that.form.actionsIds);

          that.form.actionsIds.forEach(ele => {
            that.addParentActions(ele)
          })
          // console.log(that.form.actionsIds);

          API.saveRoles(that.form.id, that.form.profile, that.form.name, that.form.actionsIds.toString()).then(response => {
            if (response.code === 0) {
              that.$message({
                message: '提交成功',
                type: 'success',
                onClose: () => {
                  that.$router.push('/admin/roles/list')
                }
              })
            } else {
              that.$message({
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
    }
  }
}
</script>

<style>

</style>
