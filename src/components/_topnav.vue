<template>

    <div class="topnav">

      <nav class="navbar navbar-default navbar-fixed-top" id="nav" role="navigation" >
       <ul class="nav navbar-nav navbar-left" ><img src="../assets/logo2.png" width="218" height="48"/></ul>
        <ul class="nav navbar-nav navbar-right" v-if="!accountCache.uid">
          <li><a v-link="{ path: '/' }"> 首页 </a></li>
          <li><a  v-link="{ path: '/login' }">登录</a></li>
          <li><a  v-link="{ path: '/register' }">注册</a></li>
        </ul>
        <ul v-else class="nav navbar-nav navbar-right">
            <li v-show="flag" class="remind"><a @click="showMsg">有新消息哦</a></li>
            <li><a v-link="{ path: '/' }"> 首页 </a></li>
            <li><a  v-link="{ path: '/query' }">我要找书</a></li>
            <li><a  v-link="{ path: '/publish' }">我要发布</a></li>
            <li><a  v-link="{ path: '/publishBook' }">我的发布</a></li>
            <li><a  v-link="{ path: '/borrowBook' }">我的借阅</a></li>
            <li><a  v-link="{ path: '/lendBook' }">我的借出</a></li>
            <li><a  v-link="{ path: '/sendBook' }">待确认的赠书</a></li>
            <li><a  v-link="{ path: '/user' }">个人中心</a></li>
            <li><a  v-link="{ name: 'message', params:{id:'#'} }">留言</a></li>
            <li id="lgOut"><a  @click="logOut()">登出</a></li>
        </ul>

      </nav>
    </div>
</template>

<style scoped>
    li.remind>a{
        color: #e38d13;
        cursor: pointer;
    }

    .topnav {
        padding-bottom: 100px;
        z-index: 10 !important;
    }
    #nav {
        z-index: 10;

    }

    #lgOut :hover {
        cursor: pointer;
    }

</style>

<script type="text/ecmascript-6">
  import {getData, deleteData, postData} from '../methods/http.js';
  import {updateAccount, removeAccount, getAccount} from '../methods/storage.js';
  import {errorHandle, msg} from '../methods/msgDeal.js';
  var vm;
  export default {
    data () {
      return {
          flag:false,//这是控制提醒的
          content:''//这是提醒的内容
      }
    },
    components: {
    },
    props: ['accountCache','show','options'],
    ready () {
      vm = this;
        postData('/user/login', {}, function (err, data){
            if(!err){
                var r =data.data.r;
                if (/正在使用中/.test(r)){
                    updateAccount('uid', parseInt(r.substring(0,12)));
                    vm.accountCache = getAccount();
                }
            }
        });
    },
    methods: {
      logOut(){
        deleteData(function(err,res){
          if(err) {
            var option = {
              autoClose: true,
              showTime: 2000,
              backgroundColor: '#fc5050',
              textColor: '#fff',
              content: '网络异常，请重试.'
            };
            if (err) {
              console.log(err);
              vm.options = option;
              vm.show = true;
            }else if(data.data.r) {
              option.content = data.data.r; //r为服务器返回的有提示的err
              vm.options = option;
              vm.show = true;
            }
          } else {
            removeAccount();
            vm.accountCache.uid = '';
            msg(vm, '已注销,将转回首页');
            setTimeout(function(){
              vm.$router.go({'path': '/'});
            },2000);
          }
        })
      },
        dealRemind(remind){
          vm.content ='请确认以下内容的新动态:';
          if (remind&1) vm.content+='我的借出,';
          if (remind&2) vm.content+='待确认的赠书,';
          if (remind&4) vm.content+='留言,';
          vm.content = vm.content.replace(/.$/,'.');
          vm.flag = true;
        },
        showMsg(){
            var option = {
                autoClose: false,
                content: vm.content
            };
            vm.options = option;
            vm.show = true;
            vm.content = '';
            vm.flag = false;
        }
    },
      events:{
          'remind'(){
              if (!vm.content){
                  getData('/user/remind',function (err,res) {
                      if(!err&&!res.data.r&&res.data.remind !=0){
                          vm.dealRemind(res.data.remind);
                      }
                  })
              }
          }
      }
  }

</script>