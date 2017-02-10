<template >
  <div class="my-container">
    <validator name="validation">
    </br>
    <h1 class="header">注册</h1>
    <div class="form">
      <form novalidate>
        <input type="text"
               class="form-control"
               v-model="account.uid"
               v-validate:uid="{ required: true, uid: true}"
               placeholder="请设置您的学号">
          <div v-if="$validation.uid.required"
               class="msg">

          </div>
          <div v-else>
            <div v-if="$validation.uid.uid"
                 class="msg">
                只能输入学号哦
            </div>
          </div>

        <input type="password"
               class="form-control"
               v-validate:pw="{ required: true }"
               v-model="account.pw"
               placeholder="请设置您的密码">
          <div v-if="$validation.pw.required"
               class="msg">

          </div>
        <input type="password"
               class="form-control"
               v-model="repeatPw"
               placeholder="请重复您的密码">
          <div v-if=" repeatPw !== account.pw" class="msg">两次输入的密码不相同</div>

        <input type="text"
               class="form-control"
               v-validate:address="{ required: true, email: true }"
               v-model="account.email"
               placeholder="请输入您的email">
        <div v-if="$validation.address.required"
             class="msg">

        </div>
        <div v-else>
         <div v-if="$validation.address.email"
              class="msg">
           请正确填写您的email
         </div>
        </div>
        <input type="text"
               class="form-control"
               v-validate:phone="{ required: true, phone: true }"
               v-model="account.phone"
               placeholder="请输入您的手机号码">
        <div v-if="$validation.phone.required"
             class="msg">

        </div>
        <div v-else>
          <div v-if="$validation.phone.phone"
             class="msg">
            请正确填写您的手机号码
          </div>
        </div>
        <div class="btn-container">
          <button @click="register(account)"
                  type="button"
                  class="btn btn-primary">
            注册
          </button>
        </div>
      </form>
      </div>
    </validator>

  </div>
</template>

<style scoped>
    .my-container{
          height:470px;
          width:500px;
          margin:0 auto;
          border:1px solid white;
          border-radius:20px;
          background:white;
         }
    .header {
            font-family:"微软雅黑";
            text-align: center;
            margin-bottom: 30px;
            color: $primary-color;
            font-size: 30px;
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
  import {clearData} from '../../methods/dataDeal.js';
  import {errorHandle, msg} from '../../methods/msgDeal.js';


  var vm;
  var vmData = {
    account: {
      uid: '',
      pw: '',
      name: '',
      email: '',
      phone: ''
    },
    repeatPw: ''
  };


  var methods = {};

  methods.register = (account) => {
    if (vm.$validation.valid) {
      if (vmData.repeatPw === account.pw) {
          account.uid = parseInt(account.uid);
          postData('/user/register', account, function(err, data){
          if (errorHandle(err, data, vm)){
            msg(vm,'注册成功，三秒后转向登陆界面');
            setTimeout(function(){
              vm.$router.go({'path': '/login'});
            },1700);
          }
        })


      } else {
        msg(vm, '2次密码不一致.');
      }
    } else {
      msg(vm,'请正确填写表单信息.');
    }
  };
  export default {
    data () {
      return vmData;
    },
    route:{
      data (next) {
        clearData(this.account);
        this.repeatPw = '';
      }
    },
    components:{
    },
    ready () {
      vm = this;
      console.log('register', vm);
    },
    methods: methods
  };

</script>
