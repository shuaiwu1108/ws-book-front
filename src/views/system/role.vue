<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.rolename" clearable placeholder="角色名" style="width: 200px;" class="filter-item" @keyup.enter.native="fetchData" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        增加
      </el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95" type="index" />
      <el-table-column label="角色编码" property="rolecode" />
      <el-table-column label="角色名称" align="center" property="rolename" />
      <el-table-column label="是否启用" align="center" property="status" :formatter="isActive" />
      <el-table-column label="创建时间" align="center" property="createTime" />
      <el-table-column align="center" label="更新时间" property="updateTime" />
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
        <el-form-item label="角色编码" prop="rolecode">
          <el-input v-model="temp.rolecode" :readonly="dialogStatus==='update'" placeholder="角色编码必须以ROLE_开头" />
        </el-form-item>
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="temp.rolename" />
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择" style="width: 100%">
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
import { getList, createRole, updateRole } from '@/api/role'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'

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
      downloadLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      temp: {
        id: undefined,
        rolename: '',
        rolecode: '',
        status: 1
      },
      rules: {
        rolecode: [{ required: true, message: '角色编码必填', trigger: 'blur' }],
        rolename: [{ required: true, message: '角色名必填', trigger: 'blur' }],
        status: [{ required: true, message: '状态必填', trigger: 'change' }]
      },
      statusOptions: [{ 'num': 1, 'name': '是' }, { 'num': 0, 'name': '否' }]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    isActive(row, column, cellValue, index) {
      if (cellValue) {
        return '是'
      } else {
        return '否'
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateRole(tempData).then(response => {
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
          createRole(this.temp).then(() => {
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        rolename: '',
        rolecode: '',
        status: ''
      }
    },
    fetchData() {
      this.listQuery.page = 1
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
        this.total = response.data.length
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['rolecode', 'rolename', 'status', 'createTime', 'updateTime']
        const filterVal = ['rolecode', 'rolename', 'status', 'createTime', 'updateTime']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '角色管理'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j.endsWith('Time')) {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
