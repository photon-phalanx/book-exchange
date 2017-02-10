<template >
<topnav :account-cache="accountCache"
        :options.sync="options"
        :show.sync="show"
        v-ref:top></topnav>
  <notification
          :options.sync="options"
          :show.sync="show"></notification>
<div class="main">
  <router-view class="view" keep-alive transition transition-mode="out-in"></router-view>
</div>
</template>
<script type="text/ecmascript-6">
    import { getAccount} from '../methods/storage.js';
    import { dealMsg} from '../methods/msgDeal.js';
    var vm;
export default {
    data(){
        return {
          accountCache : '',
          show: false,
          options: {}
        }
    },
    components:{
            "topnav":require('../components/_topnav.vue'),
            "bottom":require('../components/_footer.vue'),
            "notification" : require('../components/Notification.vue')
    },
    ready () {
        vm = this;
        vm.accountCache = getAccount();
        console.log('login', vm);
    },
    events:{
      'updateIf' (event){
            vm.accountCache = getAccount();
        },
      'msg'(option){
            dealMsg(vm, option);
        },
      'remind'(){
          //真可怜啊，要走这么远的路做通讯，下次应该用vuex的
        vm.$refs.top.$emit('remind');
      }
    }
}
  
</script>

<style>
@import '../assets/bootstrap.min.css';
*{
  margin:0;
  padding:0;
}

body{
  background-color: #f4f4f4;
  z-index: -1;
}
.main{
  padding:5px;
}
</style>