import request from './request'
export const API = {
  // 获取登录状态 GET /admin/checkStatus
  checkStatus: (token) => {
    return request({
      url: '/admin/checkStatus',
      method: 'get',
      data: { token }
    })
  },
  // 登录的接口
  login: (picKey, username, password, picCode) => {
    return request({
      url: '/admin/login/check',
      method: 'post',
      data: {
        picKey,
        username,
        password,
        picCode
      }
    })
  },
  // 修改密码的功能 POST /admin/editPwd/save
  modifyPassword: (oldPwd, password) => {
    return request({
      url: '/admin/editPwd/save',
      method: 'post',
      data: { oldPwd, password }
    })
  },
  // 获取菜单列表
  menu: token => {
    return request({
      url: '/admin/menu',
      method: 'get',
      data: { token }
    })
  },
  // 获取今天的数据(返回数组)
  indexDays: () => {
    return request({
      url: '/admin/statistics/indexDays',
      method: 'post',
      data: {}
    })
  },
  // 获取 所有每日新增、注册30日和、注册30日数据
  indexInit: () => {
    return request({
      url: '/admin/statistics/indexInit',
      method: 'post',
      data: {}
    })
  },
  // 获取每月的数据
  indexMonth: () => {
    return request({
      url: '/admin/statistics/indexMonth',
      method: 'post',
      data: {}
    })
  },
  // 获取不同类型的数据
  indexDayType: (date) => {
    return request({
      url: '/admin/statistics/indexDayType',
      method: 'post',
      data: { date }
    })
  },
  // 获取用户列表
  baseInfoList: (page, username, mobile, status, salesManager, nameLike) => {
    return request({
      url: '/admin/userBaseInfo/list',
      method: 'post',
      data: {
        page,
        username,
        mobile,
        status,
        salesManager,
        nameLike
      }
    })
  },
  // 批量分配销售经理
  batchAllotment: (ids, adminId) => {
    return request({
      url: '/admin/userBaseInfo/batchAllotment',
      method: 'post',
      data: {
        ids,
        adminId
      }
    })
  },
  // 批量禁用
  batchStop: ids => {
    return request({
      url: '/admin/userBaseInfo/batchStop',
      method: 'post',
      data: {
        ids
      }
    })
  },
  // 批量启用
  batchStart: ids => {
    return request({
      url: '/admin/userBaseInfo/batchStart',
      method: 'post',
      data: {
        ids
      }
    })
  },
  // 重置密码的功能
  resetPassword: (id, pwd) => {
    return request({
      url: '/admin/userBaseInfo/resetPwd',
      method: 'post',
      data: {
        id,
        pwd
      }
    })
  },
  // 我的用户
  myUser: (page, username, mobile, status, nameLike) => {
    return request({
      url: '/admin/userBaseInfo/my',
      method: 'post',
      data: {
        page,
        username,
        mobile,
        status,
        nameLike
      }
    })
  },
  // 资金明细
  userFoundetails: (page, id) => {
    return request({
      url: '/admin/userCash/userCashInfo?page=' + page + '&id=' + id,
      method: 'get',
      data: {
        page,
        id
      }
    })
  },
  // 我的推广
  userQRCode: () => {
    return request({
      url: '/admin/userQRCode/list',
      method: 'post',
      data: {}
    })
  },
  // 获取站点的信息
  getSiteInfo: () => {
    return request({
      url: '/admin/merchantInfo/list',
      method: 'get',
      data: {}
    })
  },
  // 保持站点信息
  saveSiteInfo: (form) => {
    return request({
      url: '/admin/merchantInfo/save',
      method: 'post',
      data: form
    })
  },
  // 短信验证码
  SysShortMessage: (ip, page, dateAddBegin, dateAddEnd, mobile, code, type) => {
    return request({
      url: '/admin/sysShortMessage/list',
      method: 'post',
      data: { ip, page, dateAddBegin, dateAddEnd, mobile, code, type }
    })
  },
  // 获取资管系统对接配置
  getMerchantSetZiguan: () => {
    return request({
      url: '/admin/merchantSetZiguan/getOne',
      method: 'get',
      data: { }
    })
  },
  // 保存资管系统对接配置
  saveMerchantSetZiguan: (domain, u, p) => {
    return request({
      url: '/admin/merchantSetZiguan/save',
      method: 'post',
      data: { domain, u, p }
    })
  },
  // 获取操盘账号的列表
  sysTraderSonList: (page, account, status) => {
    return request({
      url: '/admin/sysTraderSon/list',
      method: 'post',
      data: { page, account, status }
    })
  },
  // 新增操盘账号或编辑操盘账号
  sysTraderSonSave: (account, tradePwd, coPwd, status, remark, id) => {
    return request({
      url: '/admin/sysTraderSon/save',
      method: 'post',
      data: { account, tradePwd, coPwd, status, remark, id }
    })
  },
  // 根据id获取操盘账号
  sysTraderSonGetById: (id) => {
    return request({
      url: '/admin/sysTraderSon/getById?id=' + id,
      method: 'get',
      data: {}
    })
  },
  // 根据id删除操盘账号
  sysTraderSonDel: (id) => {
    return request({
      url: '/admin/sysTraderSon/del',
      method: 'post',
      data: { id }
    })
  },
  // 报单通道管理列表
  merchantSetAccountGroupList: (page) => {
    return request({
      url: '/admin/merchantSetAccountGroup/list',
      method: 'post',
      data: { page }
    })
  },
  // 报单通道的同步功能
  merchantSetAccountGroupSync: () => {
    return request({
      url: '/admin/merchantSetAccountGroup/sync',
      method: 'get',
      data: {}
    })
  },
  // 根据id获取报单通道、
  merchantSetAccountGroupGetById: (id) => {
    return request({
      url: '/admin/merchantSetAccountGroup/getById?id=' + id,
      method: 'get',
      data: {}
    })
  },
  // 报单通道的保存
  merchantSetAccountGroupSave: (id, paixu, isUse) => {
    return request({
      url: '/admin/merchantSetAccountGroup/save',
      method: 'post',
      data: { id, paixu, isUse }
    })
  },
  // 删除报单通道
  merchantSetAccountGroupDel: (id) => {
    return request({
      url: '/admin/merchantSetAccountGroup/del',
      method: 'post',
      data: { id }
    })
  },
  // 获取系统日志
  sysLogMerchantList: (page, dateAddBegin, dateAddEnd, moduleType, oprateType, name, adminId, uriLike, msgLike, ipLike) => {
    return request({
      url: '/admin/sysLogMerchant/list',
      method: 'post',
      data: { page, dateAddBegin, dateAddEnd, moduleType, oprateType, name, adminId, uriLike, msgLike, ipLike }
    })
  },
  // 获取管理员列表
  merchantSubAcountList: (page, dateAddBegin, dateAddEnd, nameLike, username, mobile, status) => {
    return request({
      url: '/admin/merchantSubAcount/list',
      method: 'post',
      data: { page, dateAddBegin, dateAddEnd, nameLike, username, mobile, status }
    })
  },
  // 获取角色列表
  rolesList: () => {
    return request({
      url: '/admin/roles/list',
      method: 'post',
      data: {}
    })
  },
  // 管理员列表
  merchantSubAcountSave: (id, username, pwd, name, mobile, roleIds) => {
    return request({
      url: '/admin/merchantSubAcount/save',
      method: 'post',
      data: { id, username, pwd, name, mobile, roleIds }
    })
  },
  // 根据id获取管理员
  merchantSubAcountAdd: (id) => {
    return request({
      url: '/admin/merchantSubAcount/add?id=' + id,
      method: 'get',
      data: {}
    })
  },
  // 管理员重置密码
  merchantSubAcountResetPwd: (id, pwd) => {
    return request({
      url: '/admin/merchantSubAcount/resetPwd',
      method: 'post',
      data: { id, pwd }
    })
  },
  // 管理员启用接口
  merchantSubAcountUnstop: (id) => {
    return request({
      url: '/admin/merchantSubAcount/unstop',
      method: 'post',
      data: { id }
    })
  },
  // 管理员禁用的接口
  merchantSubAcountStop: (id) => {
    return request({
      url: '/admin/merchantSubAcount/stop',
      method: 'post',
      data: { id }
    })
  },
  // 管理员删除的功能
  merchantSubAcountDel: (id) => {
    return request({
      url: '/admin/merchantSubAcount/del',
      method: 'post',
      data: { id }
    })
  },
  // 获取角色的权限
  getRoles: (id) => {
    return request({
      url: '/admin/roles/add?id=' + id,
      method: 'get',
      data: {}
    })
  },
  // 角色的修改和添加
  saveRoles: (id, profile, name, actionsIds) => {
    return request({
      url: '/admin/roles/save',
      method: 'post',
      data: { id, profile, name, actionsIds }
    })
  },
  // 删除角色
  delRoles: (id) => {
    return request({
      url: '/admin/roles/del',
      method: 'post',
      data: { id }
    })
  }

}
