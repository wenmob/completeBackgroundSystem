// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import 'normalize.css/normalize.css'
import 'font-awesome/css/font-awesome.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import VueQuillEditor from 'vue-quill-editor'
Vue.use(VueQuillEditor)

Vue.use(ElementUI)
Vue.config.productionTip = false

Vue.prototype.Buttons = []

Vue.prototype.setButtons = (btns) => {
  Vue.prototype.Buttons = btns
}

Vue.prototype.getButtons = () => {
  return Vue.prototype.Buttons
}

Vue.prototype.handleAble = (url, btns) => {
  let n = btns.findIndex(element => {
    return element.url === url
  })
  if (n === -1) {
    return false
  } else {
    return true
  }
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
