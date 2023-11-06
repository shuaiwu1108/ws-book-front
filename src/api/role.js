import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/roles/all',
    method: 'get',
    params: query
  })
}

export function createRole(data) {
  return request({
    url: '/roles/create',
    method: 'put',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/roles/update',
    method: 'post',
    data
  })
}

export function allRoles() {
  return request({
    url: '/roles/all',
    method: 'get'
  })
}

export function queryRolePermission(roleId) {
  return request({
    url: '/rolesMenu/queryRolePermission',
    method: 'get',
    params: {
      roleId: roleId
    }
  })
}

export function saveMenuPermission(roleId, menuIds) {
  return request({
    url: '/rolesMenu/saveMenuPermission',
    method: 'post',
    data: {
      roleId: roleId,
      menuIds: menuIds
    }
  })
}
