// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

// import element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// import vue-resource
import VueResource from 'vue-resource';

// import "babel-polyfill"
import "babel-polyfill";

Vue.config.productionTip = false

Vue.use(VueResource);

Vue.use(ElementUI);


Vue.http.interceptors.push(function(request, next) {//拦截器
  // 跨域携带cookie
  request.credentials = true;

  next()
})


/* eslint-disable no-new */
window.myVue = new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
