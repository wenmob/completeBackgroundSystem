<template>
   <div class="app-container">
     <el-button type="success" icon="el-icon-plus" @click="goAddRole" size="small" v-if="handleAble('/admin/roles/add', Buttons)">添加</el-button>
    <el-table
    :data="roles"
    border
    size="small"
    style="width: 100%; margin-top: 20px">
    <el-table-column
      prop="name"
      label="名称">
    </el-table-column>
    <el-table-column
      prop="profile"
      label="备注">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button @click="edit(scope.row)" type="text" size="small" style="color: #67C23A" v-if="handleAble('/admin/roles/add', Buttons)">编辑</el-button>
        <el-button type="text" size="small" style="color: #FA3B1A" @click="remove(scope.row)" v-if="handleAble('/admin/roles/del', Buttons)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
   </div>
</template>

<script>
import {API} from '@/utils/api'
export default {
  data () {
    return {
      roles: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted () {
    this.getRoles()
  },
  methods: {
    // 获取角色的数据
    getRoles () {
      const that = this
      API.rolesList().then(response => {
        if (response.code === 0) {
          let data = response.data.list
          that.roles = data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 点击添加的效果
    goAddRole () {
      this.$router.push({path: '/admin/roles/addRoles', query: {}})
    },
    // 编辑角色的功能
    edit (data) {
      this.$router.push({path: '/admin/roles/addRoles', query: {rolesId: data.id}})
    },
    // 删除权限的功能
    remove (data) {
      this.$confirm('确定要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.delRoles(data.id).then(response => {
          if (response.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getRoles()
          } else {
            this.$message({
              type: 'warning',
              message: response.msg
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style>
.treeTable {
  width: 360px;
  margin-top:16px;
}
.treeTable .el-tree-node {
  min-height: 30px;
  padding-top: 3px;
  padding-bottom: 5px;
}
</style>
