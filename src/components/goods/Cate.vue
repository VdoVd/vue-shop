<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      </el-col>
    </el-row>
    <tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
      <template  v-slot:isok="scope">
        <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
        <i class="el-icon-error" v-else style="color: red;"></i>
      </template>
      <template  v-slot:order="scope">
        <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
        <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
        <el-tag type="warning" size="mini" v-else>三级</el-tag>
      </template>
      <!-- 操作 -->
      <template v-slot:opt="opt">
        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
      </template>
    </tree-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="queryInfo.pagenum"
                   :page-sizes="[3,5,10,15]"
                   :page-size="queryInfo.pagesize"
                   layout="total,sizes,prev,pager,next,jumper"
                   :total="total">
    </el-pagination>
  </el-card>
  <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
    <!-- 添加分类的表单 -->
    <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
      <el-form-item label="分类名称：" prop="cat_name">
        <el-input v-model="addCateForm.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类：">
        <el-cascader expand-trigger="hover" :options="parentCateList" :props="cascaderProps" v-model="selectedKeys" @change="parentCateChanged" clearable change-on-select>
        </el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      catelist: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      addCateDialogVisible: false,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt'
        }
      ],
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的Id数组
      selectedKeys: [],
      total: 0
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    async getCateList () {
      const {data: res} = await this.$http.get('categories', {params: this.queryInfo})
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败!')
      }
      this.catelist = res.data.result
      this.total = res.data.total
    },
    showAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 点击按钮，添加新的分类
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)

        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }

        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    parentCateChanged () {
      console.log(this.selectedKeys)
      // 如果 selectedKeys 数组中的 length 大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }

      console.log(res.data)
      this.parentCateList = res.data
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    }
  }
}
</script>

<style scoped lang="less">
.treeTable {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>
