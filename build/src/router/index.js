import Vue from 'vue'
import Router from 'vue-router'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'

import Parent from '@/components/layer/Parent'

import { getToken } from '@/utils/auth'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Parent',
      redirect: '/admin',
      component: Parent,
      children: [
        {
          path: 'admin',
          name: '首页',
          component: () => import('@/components/view/Home'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/userBaseInfo/list',
          name: '用户列表',
          component: () => import('@/components/view/UserList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/userBaseInfo/my',
          name: '我的用户',
          component: () => import('@/components/view/MyuserList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/foundetails/list',
          name: '用户的资金明细',
          component: () => import('@/components/view/FFoundetails'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/userQRCode/list',
          name: '我的推广',
          component: () => import('@/components/view/Mypromotion'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/merchantInfo/list',
          name: '站点信息',
          component: () => import('@/components/view/SiteInfo'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/sysShortMessage/list',
          name: '短信验证码',
          component: () => import('@/components/view/MessageCode'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/merchantSetZiguan/add',
          name: '资管系统对接配置',
          component: () => import('@/components/view/MerchantSetZiguan'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/sysTraderSon/list',
          name: '操盘账号管理',
          component: () => import('@/components/view/SysTraderSon'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/merchantSetAccountGroup/list',
          name: '报单通道管理',
          component: () => import('@/components/view/MerchantSetAccountGroup'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/sysLogMerchant/list',
          name: '系统日志',
          component: () => import('@/components/view/SysLogMerchant'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/merchantSubAcount/list',
          name: '管理员列表',
          component: () => import('@/components/view/MerchantSubAcount'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/roles/list',
          name: '角色管理',
          component: () => import('@/components/view/RolesList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/roles/addRoles',
          name: '添加角色',
          component: () => import('@/components/view/AddRoles'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/userMoney/list',
          name: '用户余额',
          component: () => import('@/components/view/UserMoneyList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/userCashAdjust/list',
          name: '加减币记录',
          component: () => import('@/components/view/UserCashAdjustList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/userCashAlipayFree/list',
          name: '支付宝转账记录',
          component: () => import('@/components/view/UserCashAlipayFreeList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/userCashRecharge/list',
          name: '充值管理',
          component: () => import('@/components/view/UserCashRechargeList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/userCashWithdraw/list',
          name: '提现管理',
          component: () => import('@/components/view/UserCashWithdrawList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/userCash/list',
          name: '资金明细',
          component: () => import('@/components/view/UserCashList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/userCashAlipayBind/list',
          name: '支付宝绑定',
          component: () => import('@/components/view/UserCashAlipayBindList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/withdrawBlacklist/list',
          name: '提现黑名单管理',
          component: () => import('@/components/view/WithdrawBlacklistList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/userCashLock/list',
          name: '用户资金冻结管理',
          component: () => import('@/components/view/UserCashLockList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/userBank/list',
          name: '银行卡绑定管理',
          component: () => import('@/components/view/UserBankList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/userCashAlipayQrcode/list',
          name: '支付宝付款码',
          component: () => import('@/components/view/UserCashAlipayQrcodeList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/merchantSetRechargeAlipay/list',
          name: '支付宝转账配置',
          component: () => import('@/components/view/MerchantSetRechargeAlipayList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/merchantSetRechargePay/list',
          name: '网银支付配置',
          component: () => import('@/components/view/MerchantSetRechargePayList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/userCashDaily/list',
          name: '财务对账',
          component: () => import('@/components/view/UserCashDailyList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/acountCashLog/list',
          name: '子账号资金流水',
          component: () => import('@/components/view/AcountCashLogList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/merchantSetRechargeWechatPay/list',
          name: '微信支付配置',
          component: () => import('@/components/view/MerchantSetRechargeWechatPayList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/merchantSetRechargeAlipayPay/list',
          name: '支付宝支付配置',
          component: () => import('@/components/view/MerchantSetRechargeAlipayPayList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/merchantSetProduct/list',
          name: '产品配置',
          component: () => import('@/components/view/MerchantSetProductList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/siteBanner/list',
          name: 'banner管理',
          component: () => import('@/components/view/SiteBannerList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/siteNotice/list',
          name: '公告管理',
          component: () => import('@/components/view/SiteNoticeList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/addNotice',
          name: '添加/编辑公告',
          component: () => import('@/components/view/AddNotice'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/merchantSetProductRate/list',
          name: '服务费设置',
          component: () => import('@/components/view/MerchantSetProductRateList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/merchantSetRechargeOff/list',
          name: '线下转账账号维护',
          component: () => import('@/components/view/MerchantSetRechargeOffList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/sysFeedback/list',
          name: '投诉建议',
          component: () => import('@/components/view/SysFeedbackList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/siteAdPosition/list',
          name: '广告位管理',
          component: () => import('@/components/view/SiteAdPositionList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/siteFaq/list',
          name: '常见问题',
          component: () => import('@/components/view/SiteFaqList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/addFaq',
          name: '添加问题',
          component: () => import('@/components/view/AddFaq'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/merchantSetProductContract/list',
          name: '操盘合同设置',
          component: () => import('@/components/view/MerchantSetProductContractList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/addProductContract',
          name: '添加操盘合同设置',
          component: () => import('@/components/view/AddProductContract'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/orderInfo/list',
          name: '订单列表',
          component: () => import('@/components/view/OrderInfoList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/orderInfo/view',
          name: '查看详情',
          component: () => import('@/components/view/OrderInfoView'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/orderInfo/my',
          name: '我的订单',
          component: () => import('@/components/view/OrderInfoMy'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/orderCaiwu/list',
          name: '订单处理',
          component: () => import('@/components/view/OrderCaiwuList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/orderInfo/expire',
          name: '到期提醒',
          component: () => import('@/components/view/OrderInfoExpire'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/orderInfo/expireMy',
          name: '我的到期',
          component: () => import('@/components/view/OrderInfoExpireMy'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/statisticsSallerYeji/list',
          name: '销售业绩',
          component: () => import('@/components/view/StatisticsSallerYejiList'),
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/admin/statisticsSallerYeji/my',
          name: '我的业绩',
          component: () => import('@/components/view/StatisticsSallerYejiMy'),
          meta: {
            requireAuth: true
          }
        }
      ]
    },
    {
      path: '/login',
      name: '登录',
      component: () => import('@/components/login/Login'),
      meta: {
        requireAuth: false
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (getToken()) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
export default router
