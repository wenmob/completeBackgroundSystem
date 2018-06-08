import request from './request'

export const APIMerchant = {
  // 获取产品配置的信息 POST /admin/merchantSetProduct/list
  merchantSetProductList: () => {
    return request({
      url: '/admin/merchantSetProduct/list',
      method: 'post',
      data: {}
    })
  },
  // 产品配置的保存 POST /admin/merchantSetProduct/save
  merchantSetProductSave: (form) => {
    return request({
      url: '/admin/merchantSetProduct/save',
      method: 'post',
      data: form
    })
  },
  // banner管理的列表 POST /admin/siteBanner/list
  siteBannerList: (form) => {
    return request({
      url: '/admin/siteBanner/list',
      method: 'post',
      data: form
    })
  },
  // 保存banner POST /admin/siteBanner/save
  siteBannerSave: (form) => {
    return request({
      url: '/admin/siteBanner/save',
      method: 'post',
      data: form
    })
  },
  // 根据id获取某banner的信息 GET /admin/siteBanner/getById
  siteBannerGetById: (id) => {
    return request({
      url: '/admin/siteBanner/getById?id=' + id,
      method: 'get',
      data: { }
    })
  },
  // 根据id删除banner POST /admin/siteBanner/del
  siteBannerDel: (id) => {
    return request({
      url: '/admin/siteBanner/del',
      method: 'post',
      data: { id }
    })
  },
  // 获取公告管理的列表 POST /admin/siteNotice/list
  siteNoticeList: (form) => {
    return request({
      url: '/admin/siteNotice/list',
      method: 'post',
      data: form
    })
  },
  // 保存公告管理 POST /admin/siteNotice/save
  siteNoticeSave: (form) => {
    return request({
      url: '/admin/siteNotice/save',
      method: 'post',
      data: form
    })
  },
  // 根据id获取公告的信息 GET /admin/siteNotice/getById
  siteNoticeGetById: (id) => {
    return request({
      url: '/admin/siteNotice/getById?id=' + id,
      method: 'get',
      data: { }
    })
  },
  // 根据id删除公告 POST /admin/siteNotice/del
  siteNoticeDel: (id) => {
    return request({
      url: '/admin/siteNotice/del',
      method: 'post',
      data: { id }
    })
  },
  // 获取服务费设置的列表 POST /admin/merchantSetProductRate/list
  merchantSetProductRateList: (form) => {
    return request({
      url: '/admin/merchantSetProductRate/list',
      method: 'post',
      data: form
    })
  },
  // 保存编辑的功能 POST /admin/merchantSetProductRate/save
  merchantSetProductRateSave: (form) => {
    return request({
      url: '/admin/merchantSetProductRate/save',
      method: 'post',
      data: form
    })
  },
  // 根据id获取服务费设置的信息 GET /admin/merchantSetProductRate/getById
  merchantSetProductRateGetById: (id) => {
    return request({
      url: '/admin/merchantSetProductRate/getById?id=' + id,
      method: 'get',
      data: { }
    })
  },
  // 根据id删除服务费的设置 POST /admin/merchantSetProductRate/del
  merchantSetProductRateDel: (id) => {
    return request({
      url: '/admin/merchantSetProductRate/del',
      method: 'post',
      data: { id }
    })
  },
  // 服务费初始化设置 POST /admin/merchantSetProductRate/init
  merchantSetProductRateInit: () => {
    return request({
      url: '/admin/merchantSetProductRate/init',
      method: 'post',
      data: {}
    })
  },
  // 获取线下转账账户的维护 POST /admin/merchantSetRechargeOff/list
  merchantSetRechargeOffList: (form) => {
    return request({
      url: '/admin/merchantSetRechargeOff/list',
      method: 'post',
      data: form
    })
  },
  // 添加线下转账账户 POST /admin/merchantSetRechargeOff/save
  merchantSetRechargeOffSave: (form) => {
    return request({
      url: '/admin/merchantSetRechargeOff/save',
      method: 'post',
      data: form
    })
  },
  // 根据id获取线下转账账户的信息 GET /admin/merchantSetRechargeOff/getById
  merchantSetRechargeOffGetById: (id) => {
    return request({
      url: '/admin/merchantSetRechargeOff/getById?id=' + id,
      method: 'get',
      data: {}
    })
  },
  // 根据id删除线下转账账户的信息 POST /admin/merchantSetRechargeOff/del
  merchantSetRechargeOffDel: (id) => {
    return request({
      url: '/admin/merchantSetRechargeOff/del',
      method: 'post',
      data: { id }
    })
  },
  // 投诉建议的列表 POST /admin/sysFeedback/list
  sysFeedbackList: (form) => {
    return request({
      url: '/admin/sysFeedback/list',
      method: 'post',
      data: form
    })
  },
  // 根据id获取投诉的信息 GET /admin/sysFeedback/getById
  sysFeedbackGetById: (id) => {
    return request({
      url: '/admin/sysFeedback/getById?id=' + id,
      method: 'get',
      data: {}
    })
  },
  // 投诉回复 POST /admin/sysFeedback/save
  sysFeedbackSave: (form) => {
    return request({
      url: '/admin/sysFeedback/save',
      method: 'post',
      data: form
    })
  },
  // 投诉删除的功能 POST /admin/sysFeedback/del
  sysFeedbackDel: (id) => {
    return request({
      url: '/admin/sysFeedback/del',
      method: 'post',
      data: { id }
    })
  },
  // 广告位管理列表 POST /admin/siteAdPosition/list
  siteAdPositionList: (form) => {
    return request({
      url: '/admin/siteAdPosition/list',
      method: 'post',
      data: form
    })
  },
  // 广告位管理的保存 POST /admin/siteAdPosition/save
  siteAdPositionSave: (form) => {
    return request({
      url: '/admin/siteAdPosition/save',
      method: 'post',
      data: form
    })
  },
  // 根据id获取广告位的信息 GET /admin/siteAdPosition/getById
  siteAdPositionGetById: (id) => {
    return request({
      url: '/admin/siteAdPosition/getById?id=' + id,
      method: 'get',
      data: {}
    })
  },
  // 根据id删除广告位 POST /admin/siteAdPosition/del
  siteAdPositionDel: (id) => {
    return request({
      url: '/admin/siteAdPosition/del',
      method: 'post',
      data: { id }
    })
  },
  // 常见问题列表 POST /admin/siteFaq/list
  siteFaqList: (form) => {
    return request({
      url: '/admin/siteFaq/list',
      method: 'post',
      data: form
    })
  },
  // 保存常见的问题 POST /admin/siteFaq/save
  siteFaqSave: (form) => {
    return request({
      url: '/admin/siteFaq/save',
      method: 'post',
      data: form
    })
  },
  // 根据id获取常见问题信息 GET /admin/siteFaq/getById
  siteFaqGetById: (id) => {
    return request({
      url: '/admin/siteFaq/getById?id=' + id,
      method: 'get',
      data: { }
    })
  },
  // 根据id删除常见问题 POST /admin/siteFaq/del
  siteFaqDel: (id) => {
    return request({
      url: '/admin/siteFaq/del',
      method: 'post',
      data: { id }
    })
  },
  // 操盘合同设置列表 POST /admin/merchantSetProductContract/list
  merchantSetProductContractList: (form) => {
    return request({
      url: '/admin/merchantSetProductContract/list',
      method: 'post',
      data: form
    })
  },
  // 操盘合同保存功能 POST /admin/merchantSetProductContract/save
  merchantSetProductContractSave: (form) => {
    return request({
      url: '/admin/merchantSetProductContract/save',
      method: 'post',
      data: form
    })
  },
  // 根据id获取操盘合同的信息 GET /admin/merchantSetProductContract/getById
  merchantSetProductContractGetById: (id) => {
    return request({
      url: '/admin/merchantSetProductContract/getById?id=' + id,
      method: 'get',
      data: {}
    })
  },
  // 根据id删除操盘合同 POST /admin/merchantSetProductContract/del
  merchantSetProductContractDel: (id) => {
    return request({
      url: '/admin/merchantSetProductContract/del',
      method: 'post',
      data: { id }
    })
  }
}
