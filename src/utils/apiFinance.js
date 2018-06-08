import request from './request'
export const APIFinance = {
  // 获取用户余额的列表
  getUserMoney: (page, pageSize, username, mobile, realNameLike, orderBy) => {
    return request({
      url: '/admin/userMoney/list',
      method: 'post',
      data: { page, pageSize, username, mobile, realNameLike, orderBy }
    })
  },
  // 加减币的功能
  userMoneyModify: (userId, amount, remark, pic) => {
    return request({
      url: '/admin/userMoney/modify',
      method: 'post',
      data: { userId, amount, remark, pic }
    })
  },
  // 加减币记录
  userCashAdjustList: (form) => {
    return request({
      url: '/admin/userCashAdjust/list',
      method: 'post',
      data: form
    })
  },
  // 支付宝转账记录
  userCashAlipayFreeList: (form) => {
    return request({
      url: '/admin/userCashAlipayFree/list',
      method: 'post',
      data: form
    })
  },
  // 支付宝转账作废的功能 POST /admin/userCashAlipayFree/cancel
  userCashAlipayFreeCancel: (id) => {
    return request({
      url: '/admin/userCashAlipayFree/cancel',
      method: 'post',
      data: { id }
    })
  },
  // 充值管理列表
  userCashRechargeList: (form) => {
    return request({
      url: '/admin/userCashRecharge/list',
      method: 'post',
      data: form
    })
  },
  // 设为成功的按钮
  userCashRechargeSetSuccess: (id) => {
    return request({
      url: '/admin/userCashRecharge/setSuccess',
      method: 'post',
      data: { id }
    })
  },
  // 设为失败的按钮
  userCashRechargeSetFail: (id) => {
    return request({
      url: '/admin/userCashRecharge/setFail',
      method: 'post',
      data: { id }
    })
  },
  // 提现管理列表 POST /admin/userCashWithdraw/list
  userCashWithdrawList: (form) => {
    return request({
      url: '/admin/userCashWithdraw/list',
      method: 'post',
      data: form
    })
  },
  // 提现代付的功能 POST /admin/userCashWithdraw/pay
  userCashWithdrawPay: (id) => {
    return request({
      url: '/admin/userCashWithdraw/pay',
      method: 'post',
      data: { id }
    })
  },
  // 未来优势代付 POST /admin/userCashWithdraw/payWlyx
  userCashWithdrawPayWlyx: (id) => {
    return request({
      url: '/admin/userCashWithdraw/payWlyx',
      method: 'post',
      data: { id }
    })
  },
  // 提现管理通过 POST /admin/userCashWithdraw/setSuccess
  userCashWithdrawSetSuccess: (form) => {
    return request({
      url: '/admin/userCashWithdraw/setSuccess',
      method: 'post',
      data: form
    })
  },
  // 提现不通过 POST /admin/userCashWithdraw/setFail
  userCashWithdrawSetFail: (form) => {
    return request({
      url: '/admin/userCashWithdraw/setFail',
      method: 'post',
      data: form
    })
  },
  // 资金明细列表 POST /admin/userCash/list
  userCashList: (form) => {
    return request({
      url: '/admin/userCash/list',
      method: 'post',
      data: form
    })
  },
  // 支付宝绑定 POST /admin/userCashAlipayBind/list
  userCashAlipayBindList: (form) => {
    return request({
      url: '/admin/userCashAlipayBind/list',
      method: 'post',
      data: form
    })
  },
  // 支付宝解除绑定 POST /admin/userCashAlipayBind/del
  userCashAlipayBindDel: (id) => {
    return request({
      url: '/admin/userCashAlipayBind/del',
      method: 'post',
      data: { id }
    })
  },
  // 绑定支付宝的功能 POST /admin/userCashAlipayBind/save
  userCashAlipayBindSave: (form) => {
    return request({
      url: '/admin/userCashAlipayBind/save',
      method: 'post',
      data: form
    })
  },
  // 提现黑名单管理列表 POST /admin/withdrawBlacklist/list
  withdrawBlacklistList: (form) => {
    return request({
      url: '/admin/withdrawBlacklist/list',
      method: 'post',
      data: form
    })
  },
  // 提现黑名单的提交 POST /admin/withdrawBlacklist/save
  withdrawBlacklistSave: (form) => {
    return request({
      url: '/admin/withdrawBlacklist/save',
      method: 'post',
      data: form
    })
  },
  // 删除提现黑名单 POST /admin/withdrawBlacklist/del
  withdrawBlacklistDel: (id) => {
    return request({
      url: '/admin/withdrawBlacklist/del',
      method: 'post',
      data: { id }
    })
  },
  // 锁定用户金额的列表 POST /admin/userCashLock/list
  userCashLockList: (form) => {
    return request({
      url: '/admin/userCashLock/list',
      method: 'post',
      data: form
    })
  },
  // 解锁的功能 POST /admin/userCashLock/unlock
  userCashLockUnlock: (id, remark) => {
    return request({
      url: '/admin/userCashLock/unlock',
      method: 'post',
      data: { id, remark }
    })
  },
  // 冻结用户资金 POST /admin/userCashLock/lock
  userCashLockLock: (form) => {
    return request({
      url: '/admin/userCashLock/lock',
      method: 'post',
      data: form
    })
  },
  // 银行卡绑定 POST /admin/userBank/list
  userBankList: (form) => {
    return request({
      url: '/admin/userBank/list',
      method: 'post',
      data: form
    })
  },
  // 获取银行名称的接口 GET /admin/userBank/getById
  userBankGetById: (id) => {
    return request({
      url: '/admin/userBank/getById?id=' + id,
      method: 'get',
      data: {}
    })
  },
  // 获取省的接口
  getProvince: () => {
    return request({
      url: '/common/region/province',
      method: 'get',
      data: {}
    })
  },
  // 获取市区的方法
  getChild: (id) => {
    return request({
      url: '/common/region/child?pid=' + id,
      method: 'get',
      data: {}
    })
  },
  // 保存银行卡 POST /admin/userBank/save
  userBankSave: (form) => {
    return request({
      url: '/admin/userBank/save',
      method: 'post',
      data: form
    })
  },
  // 删除银行卡的数据 POST /admin/userBank/del
  userBankDel: (id) => {
    return request({
      url: '/admin/userBank/del',
      method: 'post',
      data: {id}
    })
  },
  // 获取支付宝付款码的列表 POST /admin/userCashAlipayQrcode/list
  userCashAlipayQrcodeList: (form) => {
    return request({
      url: '/admin/userCashAlipayQrcode/list',
      method: 'post',
      data: form
    })
  },
  // 提交支付宝二维码的功能 POST /admin/userCashAlipayQrcode/save
  userCashAlipayQrcodeSave: (form) => {
    return request({
      url: '/admin/userCashAlipayQrcode/save',
      method: 'post',
      data: form
    })
  },
  // 根据id获取支付宝付款码的信息 GET /admin/userCashAlipayQrcode/getById
  userCashAlipayQrcodeGetById: (id) => {
    return request({
      url: '/admin/userCashAlipayQrcode/getById?id=' + id,
      method: 'get',
      data: { }
    })
  },
  // 根据id删除支付宝付款码 POST /admin/userCashAlipayQrcode/del
  userCashAlipayQrcodeDel: (id) => {
    return request({
      url: '/admin/userCashAlipayQrcode/del',
      method: 'post',
      data: { id }
    })
  },
  // 支付宝转账配置 POST /admin/merchantSetRechargeAlipay/save
  merchantSetRechargeAlipaySave: (form) => {
    return request({
      url: '/admin/merchantSetRechargeAlipay/save',
      method: 'post',
      data: form
    })
  },
  // 支付宝转账配置的信息 POST /admin/merchantSetRechargeAlipay/list
  merchantSetRechargeAlipayList: () => {
    return request({
      url: '/admin/merchantSetRechargeAlipay/list',
      method: 'post',
      data: {}
    })
  },
  // 网银的支付配置信息 POST /admin/merchantSetRechargePay/list
  merchantSetRechargePayList: () => {
    return request({
      url: '/admin/merchantSetRechargePay/list',
      method: 'post',
      data: {}
    })
  },
  // 网银配置的提交 POST /admin/merchantSetRechargePay/save
  merchantSetRechargePaySave: (form) => {
    return request({
      url: '/admin/merchantSetRechargePay/save',
      method: 'post',
      data: form
    })
  },
  // 财务对账 POST /admin/userCashDaily/list
  userCashDailyList: (form) => {
    return request({
      url: '/admin/userCashDaily/list',
      method: 'post',
      data: form
    })
  },
  // 子账户资金流水 POST /admin/acountCashLog/list
  acountCashLogList: (form) => {
    return request({
      url: '/admin/acountCashLog/list',
      method: 'post',
      data: form
    })
  },
  // 微信支付配置的信息 POST /admin/merchantSetRechargeWechatPay/list
  merchantSetRechargeWechatPayList: () => {
    return request({
      url: '/admin/merchantSetRechargeWechatPay/list',
      method: 'post',
      data: {}
    })
  },
  // 微信支付配置的保存 POST /admin/merchantSetRechargeWechatPay/save
  merchantSetRechargeWechatPaySave: (form) => {
    return request({
      url: '/admin/merchantSetRechargeWechatPay/save',
      method: 'post',
      data: form
    })
  },
  // 获取支付宝支付配置的信息 POST /admin/merchantSetRechargeAlipayPay/list
  merchantSetRechargeAlipayPayList: () => {
    return request({
      url: '/admin/merchantSetRechargeAlipayPay/list',
      method: 'post',
      data: {}
    })
  },
  // 支付宝支付配置的保存 POST /admin/merchantSetRechargeAlipayPay/save
  merchantSetRechargeAlipayPaySave: (form) => {
    return request({
      url: '/admin/merchantSetRechargeAlipayPay/save',
      method: 'post',
      data: form
    })
  }
}
