<template>
    <div class="my-container">
        <validator name="validation">
        </br>
        <h1 class="header">登录</h1>
        <div class="form">
        <form class="form-horizontal" novalidate>
            <input type="text"
                   class="form-control"
                   v-model="account.uid"
                   v-validate:uid="{ required: true, uid: true}"
                   placeholder="请输入学号">
            <input type="password"
                   class="form-control"
                   v-model="account.pw"
                   v-validate:pw="{ required: true }"
                   @keyup.enter="login(account)"
                   placeholder="请输入密码">
            <div class="btn-container">
                <a @click="login(account)"
              class="btn btn-primary">
                登录
            </a>
            </div>
        </form>
        </div>
        </validator>
    </div>
</template>

<style scoped>
    .my-container{
      height: 270px;
      width:400px;
      margin:0 auto;
      border:1px solid white;
      border-radius:20px;
      background:white;
     }
    .header {
        font-family:"微软雅黑";
        text-align: center;
        margin-bottom: 30px;
        margin-left: 0;
        color: rgb(55, 58, 60);
        font-size: 30   px;
      }
     .form{
      width:300px;
      margin:0 auto;
      font-family:"微软雅黑";
      }
    .form-control {
      margin-top: 15px;
      width:300px;
    }
    .btn-container{
    text-align: center;
      margin-top: 20px;
     }
</style>

<script type="text/ecmascript-6">
    import {postData} from '../../methods/http.js';
    import {updateAccount} from '../../methods/storage.js';
    import {clearData} from '../../methods/dataDeal.js';
    import {errorHandle, msg} from '../../methods/msgDeal.js';
    var vm;
    export default {
        data () {
            return {
                account: {
                    uid: '',
                    pw: ''
                }
            }
        },
        components:{
         },
        ready () {
            vm = this;
          console.log('login', vm);
        },
        route:{
            data (next) {
                clearData(this.account);
            }
        },
        methods: {
            login(account){
                if (vm.$validation.valid) {
                    account.uid = parseInt(account.uid);
                    postData('/user/login', account, function (err, data) {
                        if(errorHandle(err, data, vm)){
                            updateAccount('uid', data.data._id);
                            vm.$router.app.$emit('updateIf');
                            msg(vm,'登录成功，三秒后转向用户界面');
                            setTimeout(function(){
                                vm.$router.go({'path': '/'});
                            },1700);//TODO 如果有个人中心的话，应该跳转到个人中心吧
                        }
                    })
                }else{
                    msg(vm, '请输入正确的学号和密码');
                }
            }
        }
    };

</script>
