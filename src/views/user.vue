<template>
    <div class="content">
        <h1 class="head">个人中心</h1>
        <detail :options.sync="options"></detail>
        </br>
        <div class="pw">
            <change-pw :options.sync="options"></change-pw>
        </div>
    </div>

</template>
<style  scoped>
    .content{
                        font-family:"微软雅黑";
    }
    .head {
                      font-family:"微软雅黑";
                      text-align: center;
                      margin-bottom: 30px;
                      margin-left: 0px;
                      color: $primary-color;
                      font-weight: normal;
                      font-size: 25px;
      }
      .pw{
      text-align: center;
      }


</style>
<script type="text/ecmascript-6">
    import {msg} from '../methods/msgDeal.js';
    var vm;

    export default{
        data(){
            return {
                options: {}
            }
        },
        ready () {
            vm = this;
            console.log('user', vm);
        },
        route: {
            data (next) {
                this.$broadcast('init');
            }
        },
        components:{
            "changePw" : require('../components/user/changePw.vue'),
            "detail" : require('../components/user/detail.vue')
        },
        watch: {
            'options': function (val, oldVal) {
                msg(vm, null, val);
            }
        }
}
</script>