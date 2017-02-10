<template >
<div v-if="willshow">
<button v-on:click="beshow">修改密码</button>
</div>

  <div v-else class="my-container">
  <h1 class="header2">修改密码</h1>
    <validator name="validation">
      <form novalidate class="formclass">
        <input type="password"
               class="form-control"
               v-validate:pw="{ required: true }"
               v-model="account.oldPw"
               placeholder="请输入您的旧密码">
          <div v-if="$validation.pw.required"
               class="msg">

          </div>
          <input type="password"
                         class="form-control"
                         v-validate:npw="{ required: true }"
                         v-model="account.newPw"
                         placeholder="请输入您的新密码">
                    <div v-if="$validation.npw.required"
                         class="msg">

                    </div>
        <input type="password"
               class="form-control"
               v-model="rpw"
               placeholder="请重复您的密码">
          <div v-if=" rpw !== account.newPw" class="msg">两次输入的密码不相同</div>

        <div class="btn-container">
          <button @click="changePw(account)"
                  type="button"
                  class="btn btn-primary">
           修改
          </button>
        </div>
      </form>
    </validator>

  </div>
</template>




<style>
    .header2 {
            font-family:"微软雅黑";
            text-align: center;
            margin-bottom: 30px;
            color: $primary-color;
            font-weight: normal;
            font-size: 20px;
          }
    .my-container{
        margin-left:auto;
        margin-right:auto;
         }
    .formclass{
          width:300px;
          margin: auto;
          }
        .form-control {
          margin-top: 15px;
          width:300px;
        }
        .btn-container{
          margin-top: 20px;
         }
</style>
<script type="text/ecmascript-6">

    import {postData} from '../../methods/http.js';
    import {updateAccount} from '../../methods/storage.js';
    import {clearData} from '../../methods/dataDeal.js';
    import { errorHandleCom,msgCom } from '../../methods/msgDeal.js'

    var vm;

    export default {
        data () {
            return {
                account: {
                  newPw: '',
                  oldPw: ''
                },
                rpw: '',
                willshow:true,
            }
        },
        components:{
        },
        props: ['options'],
        ready () {
            vm = this;
            console.log('changePw', vm);
        },
        events:{
           'init' (event){
              this.willshow=true;
            }
         },
         methods: {
                    changePw(account){
                        if (vm.$validation.valid) {
                            postData('/user/changePw', account, function (err, data) {
                                if(errorHandleCom(err, data, vm)){
                                  msgCom(vm,'修改成功');
                                  vm.willshow=true;
                                  clearData(vm.account);
                                  vm.rpw = '';
                                }
                            })
                        }else{
                            msgCom(vm, '请正确填写表单信息');
                        }
                    },
                    beshow:function (event){
                    vm.willshow=false
                    }

                }
    }
</script>
