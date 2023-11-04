import request from '@/utils/request'

export function queryMenu(data) {
  return request({
    url: '/menu/query',
    method: 'get',
    params: data
  })
}

export function createMenu(data) {
  return request({
    url: '/menu/create',
    method: 'put',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: '/menu/update',
    method: 'post',
    data
  })
}
