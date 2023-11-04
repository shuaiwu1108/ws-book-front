<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      row-key="id"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95" type="index" />
      <el-table-column label="路径" property="path" />
      <el-table-column label="名称" align="center" property="name" />
      <el-table-column label="标题" align="center" property="title" />
      <el-table-column label="图标" align="center" property="icon" />
      <el-table-column label="组件" property="component" />
      <el-table-column label="是否有效" property="status" :formatter="isActive" />
      <el-table-column label="是否隐藏" property="hidden" :formatter="isActive" />
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template v-slot:="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="路径" prop="path">
          <el-input v-model="temp.path" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="temp.icon" />
        </el-form-item>
        <el-form-item label="组件" prop="component">
          <el-input v-model="temp.component" />
        </el-form-item>
        <el-form-item label="启用" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in statusOptions" :key="item.num" :label="item.name" :value="item.num" />
          </el-select>
        </el-form-item>
        <el-form-item label="隐藏" prop="hidden">
          <el-select v-model="temp.hidden" class="filter-item" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in statusOptions" :key="item.num" :label="item.name" :value="item.num" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue'
import { createMenu, queryMenu, updateMenu } from '@/api/menu'

export default {
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      temp: {},
      rules: {
        path: [{ required: true, message: '地址必填', trigger: 'blur' }],
        name: [{ required: true, message: '名称必填', trigger: 'blur' }],
        status: [{ required: true, message: '状态必填', trigger: 'change' }],
        hidden: [{ required: true, message: '隐藏必填', trigger: 'change' }]
      },
      statusOptions: [{ 'num': 1, 'name': '是' }, { 'num': 0, 'name': '否' }]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateMenu(this.temp).then(response => {
            this.dialogFormVisible = false
            this.fetchData()
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = undefined
          createMenu(this.temp).then(() => {
            this.dialogFormVisible = false
            this.fetchData()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    resetTemp() {
      this.temp = {}
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    isActive(row, column, cellValue, index) {
      if (cellValue) {
        return '是'
      } else {
        return '否'
      }
    },
    fetchData() {
      this.listQuery.page = 1
      this.listLoading = true
      queryMenu(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
        this.total = response.data.length
      })
    }
  }
}
</script>
