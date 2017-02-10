'use strict'

export default function(router){
    router.map({
        '/':{
            component: require('./views/Index.vue')
        },
        /* 404路由 */
        '*': {
            component: require('./views/Index.vue')
        },
        '/register':{
            component: require('./views/sign/Register.vue')
        },
        '/login':{
            component: require('./views/sign/login.vue')
        },
        '/user':{
            component: require('./views/user.vue')
        },
        '/publish':{
            component: require('./views/publish.vue')
        },
        '/publishBook':{
            component: require('./views/publishBook.vue')
        },
        '/borrowBook':{
            component: require('./views/borrowBook.vue')
        },
        '/lendBook':{
            component: require('./views/lendBook.vue')
        },
        '/query':{
            component: require('./views/query.vue')
        },
        '/sendBook':{
        component: require('./views/sendBook.vue')
        },
        '/message/:id':{
            name:'message',
            component: require('./views/message.vue')
        },
})
}

