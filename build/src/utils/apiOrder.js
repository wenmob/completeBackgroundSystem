import request from './request'

export const APIOrder = {
  // 订单列表post /admin/orderInfo/list
  orderInfoList: (form) => {
    return request({
      url: '/admin/orderInfo/list',
      method: 'post',
      data: form
    })
  },
  // 产品详情 get /admin/orderInfo/view
  orderInfoView: (id) => {
    return request({
      url: '/admin/orderInfo/view?id=' + id,
      method: 'get',
      data: { id }
    })
  },
  // 查看子资产的详情 get admin/orderInfo/acountInfo
  orderInfoAcountInfo: (id) => {
    return request({
      url: '/admin/orderInfo/acountInfo?id=' + id,
      method: 'get',
      data: { id }
    })
  },
  // 停止操盘的功能 post /admin/orderInfo/stopOperation
  orderInfoStopOperation: (id) => {
    return request({
      url: '/admin/orderInfo/stopOperation',
      method: 'post',
      data: { id }
    })
  },
  // 关闭订单的功能 post /admin/orderInfo/closeOrder
  orderInfoCloseOrder: (id) => {
    return request({
      url: '/admin/orderInfo/closeOrder',
      method: 'post',
      data: { id }
    })
  },
  // 分配账号的功能 post /admin/orderInfo/allotAccount
  orderInfoAllotAccount: (form) => {
    return request({
      url: '/admin/orderInfo/allotAccount',
      method: 'post',
      data: form
    })
  },
  // 审核成功 post /admin/orderInfo/checkTypeSuccess
  orderInfoCheckTypeSuccess: (caiwuId) => {
    return request({
      url: '/admin/orderInfo/checkTypeSuccess',
      method: 'post',
      data: { caiwuId }
    })
  },
  // 审核成功 post /admin/orderInfo/checkTypeSuccess
  orderInfoCheckEndOrderSuccess: (caiwuId) => {
    return request({
      url: '/admin/orderInfo/checkEndOrderSuccess',
      method: 'post',
      data: { caiwuId }
    })
  },
  // 审核失败 post /admin/orderInfo/checkTypeError
  orderInfoCheckTypeError: (caiwuId, remark) => {
    return request({
      url: '/admin/orderInfo/checkTypeError',
      method: 'post',
      data: { caiwuId, remark }
    })
  },
  // 手动续约 post /admin/orderInfo/xuYue
  orderInfoXuYue: (id) => {
    return request({
      url: '/admin/orderInfo/xuYue',
      method: 'post',
      data: { id }
    })
  },
  // 我的订单列表 POST /admin/orderInfo/my
  orderInfoMy: (form) => {
    return request({
      url: '/admin/orderInfo/my',
      method: 'post',
      data: form
    })
  },
  // 订单处理 post /admin/orderCaiwu/list
  orderCaiwuList: (form) => {
    return request({
      url: '/admin/orderCaiwu/list',
      method: 'post',
      data: form
    })
  },
  // 到期提醒 POST /admin/orderInfo/expire
  orderInfoExpire: (form) => {
    return request({
      url: '/admin/orderInfo/expire',
      method: 'post',
      data: form
    })
  },
  // 我的到期 POST /admin/orderInfo/expireMy
  orderInfoExpireMy: (form) => {
    return request({
      url: '/admin/orderInfo/expireMy',
      method: 'post',
      data: form
    })
  },
  // 销售业绩的列表 POST /admin/statisticsSallerYeji/list
  statisticsSallerYejiList: (form) => {
    return request({
      url: '/admin/statisticsSallerYeji/list',
      method: 'post',
      data: form
    })
  },
  // 分配销售经理 POST /admin/statisticsSallerYeji/batchAllotment
  statisticsSallerYejiBatchAllotment: (ids, adminId) => {
    return request({
      url: '/admin/statisticsSallerYeji/batchAllotment',
      method: 'post',
      data: { ids, adminId }
    })
  },
  // 作废 POST /admin/statisticsSallerYeji/cancel
  statisticsSallerYejiCancel: (id) => {
    return request({
      url: '/admin/statisticsSallerYeji/cancel',
      method: 'post',
      data: { id }
    })
  },
  // 我的业绩 get /admin/statisticsSallerYeji/my
  statisticsSallerYejiMy: (form) => {
    return request({
      url: '/admin/statisticsSallerYeji/my',
      method: 'post',
      data: form
    })
  },
  // 我的作废 POST /admin/statisticsSallerYeji/cancelMy
  statisticsSallerYejiCancelMy: (id) => {
    return request({
      url: '/admin/statisticsSallerYeji/cancelMy',
      method: 'post',
      data: { id }
    })
  }
}
