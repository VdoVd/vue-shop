<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
      <el-table :data="rolelist" border stripe>
        <el-table-column type="expand">
          <template v-slot="scoped">
            <el-row :class="['bdbottom',i1 === 0 ? 'bdtop' : '']" v-for = "(iteml, i1) in scoped.row.children" :key = "iteml.id">
              <el-col :span="5">
                <el-tag  closable @close="removeRightById(scoped.row,iteml.id)">{{iteml.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="[i2 === 0 ? '' : 'bdtop']" v-for="(item2, i2) in iteml.children" :key="item2.id" >
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scoped.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id" closable @close="removeRightById(scoped.row,item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
<!--            // 编辑用户-->
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
<!--            // 删除用户-->
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)">删除</el-button>
<!--            // 分配权限-->
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!--内容主题区-->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
    </span>
      </el-dialog>
      <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <!--内容主题区-->
        <el-form :model="editForm" ref="editFormRef" label-width="70px" :rules="editFormRules">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoleInfo">确 定</el-button>
    </span>
      </el-dialog>
      <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
        <!--内容主题区-->
        <el-tree ref="treeRef" :default-checked-keys="defKeys" show-checkbox node-key="id" default-expand-all :data="rightsList" :props="treeProps"></el-tree>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确定</el-button>
    </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rolelist: [],
      editForm: {},
      addForm: {
        roleName: 'brt',
        roleDesc: 'btr'
      },
      roleId: '',
      defKeys: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      setRightDialogVisible: false,
      addDialogVisible: false,
      editDialogVisible: false,
      editFormRules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ],
        roleDesc: [
          {required: true, message: '请输入角色描述', trigger: 'blur'}
        ]
      },
      addFormRules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ]
      },
      rightsList: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 提示客户是否删除
    async removeRightById (role, rightId) {
      const confirmResult = await this.$confirm('此操作将永远删除该文件', '是否继续？', '提示', {
        confrmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败!')
      }
      role.child = res.data
    },
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    async getRolesList () {
      const {data: res} = await this.$http.get('roles')

      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!')
      }
      this.rolelist = res.data
      console.log(this.rolelist, 'rolelist')
    },
    async showEditDialog (id) {
      console.log('showEditDialog exec...')
      const {data: res} = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败!')
      }
      console.log(res, 'show res')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editRoleInfo () {
      // this.$forceUpdate()
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息的数据请求
        console.log(this.editForm, 'editForm')
        const {data: res} = await this.$http.put(
          'roles/' + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          }
        )

        if (res.meta.status !== 200) {
          console.log(res, 'res')
          console.log(this.editForm.id, 'id')
          return this.$message.error('更新角色信息失败！')
        }

        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        await this.getRolesList()
        // 提示修改成功
        this.$message.success('更新角色信息成功！')
      })
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addRole () {
      this.$refs.addFormRef.validate(async valid => {
        console.log(this.addForm, 'form')
        if (!valid) return
        const {data: res} = await this.$http.post('roles/', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        console.log(res, 'add role')
        await this.getRolesList()
      })
    },
    async removeUserById (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const {data: res} = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败!')
      this.$message.success('删除角色成功!')
      await this.getRolesList()
    },
    async showSetRightDialog (role) {
      this.roleId = role.id
      const {data: res} = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限失败')
      }
      this.rightsList = res.data
      console.log(this.rightsList)
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    setRightDialogClosed () {
      this.defKeys = []
    },
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const idStr = keys.join(',')
      console.log(idStr, 'idStr')
      const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
      console.log(res, 'res')
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败!')
      }
      this.$message.success('分配权限成功!')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
.el-table{
  margin-top: 8px;
}
.el-card{
  margin-top: 10px;
}
</style>
