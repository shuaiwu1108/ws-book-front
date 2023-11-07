<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" clearable placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="fetchData" />
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
      <el-table-column label="用户名" align="center" property="username" />
      <el-table-column label="密码" align="center" property="password" />
      <el-table-column label="邮箱" align="center" property="email" />
      <el-table-column label="手机号" align="center" property="phone" />
      <el-table-column label="是否启用" align="center" property="status" :formatter="isActive" />
      <el-table-column label="创建时间" align="center" property="createTime" />
      <el-table-column align="center" label="更新时间" property="updateTime" />
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template v-slot:="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="primary" size="mini" @click="handleRole(row)">角色配置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />

    <!-- 新增与修改弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" placeholder="默认密码为用户名" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择" style="width: 100%;">
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

    <!-- 角色配置弹框 -->
    <el-dialog title="角色配置" :visible.sync="dialogFormVisibleHandleRole" :before-close="clearUserRole">
      <el-form ref="dataFormUserRole" :model="tempUserRole" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名">
          <el-input v-model="tempUserRole.username" readonly />
        </el-form-item>
        <el-form-item label="用户角色">
          <el-select v-model="roleIds" class="filter-item" placeholder="请选择" multiple style="width: 100%;">
            <el-option v-for="item in rolesOptions" :key="item.id" :label="item.rolename" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleHandleRole = false; roleIds = []">
          取消
        </el-button>
        <el-button type="primary" @click="saveUserRoles()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, createUser, updateUser, getUserRoles, saveUserRoles } from '@/api/user'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'
import { allRoles } from '@/api/role'

export default {
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      downloadLoading: false,
      dialogFormVisible: false,
      dialogFormVisibleHandleRole: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      temp: {
        id: undefined,
        username: '',
        password: '',
        email: '',
        phone: '',
        status: ''
      },
      tempUserRole: {
        id: undefined,
        username: '',
        password: '',
        email: '',
        phone: '',
        status: '',
        roleIds: []
      },
      rules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        status: [{ required: true, message: '状态必填', trigger: 'change' }]
      },
      statusOptions: [{ 'num': 1, 'name': '是' }, { 'num': 0, 'name': '否' }],
      rolesOptions: [],
      roleIds: []
    }
  },
  created() {
    this.fetchData()
    this.allRoles()
  },
  methods: {
    clearUserRole() {
      this.roleIds = []
      this.dialogFormVisibleHandleRole = false
    },
    allRoles() {
      allRoles().then(response => {
        this.rolesOptions = response.data
      })
    },
    saveUserRoles() {
      this.tempUserRole.roleIds = this.roleIds
      saveUserRoles(this.tempUserRole).then(() => {
        this.dialogFormVisibleHandleRole = false
        this.roleIds = []
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '编辑成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleRole(row) {
      this.tempUserRole = Object.assign({}, row)
      getUserRoles(this.tempUserRole).then(response => {
        const rolesList = response.data
        for (let i = 0; i < rolesList.length; i++) {
          const tmp = rolesList[i]
          this.roleIds.push(tmp.id)
        }
        this.dialogFormVisibleHandleRole = true
      })
    },
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
          updateUser(tempData).then(response => {
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
          if (this.temp.password === '') {
            this.temp.password = this.temp.username
          }
          createUser(this.temp).then(() => {
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
        username: '',
        password: '',
        email: '',
        phone: '',
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
      }).catch(
        this.listLoading = false
      )
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['username', 'password', 'email', 'phone', 'status', 'createTime', 'updateTime']
        const filterVal = ['username', 'password', 'email', 'phone', 'status', 'createTime', 'updateTime']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '用户管理'
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
