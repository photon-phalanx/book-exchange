'use strict'

import Vue from 'vue'
Vue.config.devtools = true;
import Vue_Router from 'vue-router'
import Vue_Resource from 'vue-resource'
import Vue_validator from 'vue-validator'

import FastClick from 'fastclick'

import routerMap from './routers'
import filters from './filters'
import App from './views/App.vue'


Vue.use(Vue_Router);
Vue.use(Vue_Resource);
Vue.use(Vue_validator);

Vue.validator('email', function (val) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
});

Vue.validator('uid', function (val) {
    return /^[0-9]{12}$/.test(val)
});

Vue.validator('phone', function (val) {
    return /^1[3|4|5|7|8]\d{9}$/.test(val)
});



let router = new Vue_Router({
    hashbang:true,
    history:false,
    saveScrollPosition: false,
    transitionOnLoad: true
})

//全局的前置钩子函数，在路由切换开始时调用
router.beforeEach(function(transition){
    if(transition.to.path!=='/login'&&transition.to.path !== '/register'&&transition.to.path !== '/'){
        if (!transition.to.router.app.accountCache.uid){
            transition.redirect('/login');
            transition.to.router.app.$emit('msg',{
                autoClose: true,
                showTime: 2000,
                backgroundColor: '#fc5050',
                textColor: '#fff',
                content: '必须先登录哦~'
            });
        }else {
            transition.next();
        }
    }else {
        transition.next();
    }
    window.scrollTo(0,0);

});

router.afterEach(function (transition) {
    transition.to.router.app.$emit('remind');
});

//独立出来的路由
routerMap(router);

router.start(App,'#app');
