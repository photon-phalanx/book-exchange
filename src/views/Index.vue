<template >
    <newadd :options.sync="options"></newadd>
    <hr/>
    <div class="main">
        <router-view class="view" keep-alive transition transition-mode="out-in"></router-view>
    </div>

</template>
<script type="text/ecmascript-6">
    import {msg} from '../methods/msgDeal.js';
    var vm;

    export default {
        data (){
            return {
                options: {}
             }
        },
        ready () {
            vm = this;
            console.log('Index', vm);
        },
        components:{
            "newadd" : require('../components/index/newAdd.vue')
        },
        watch: {
            'options': function (val, oldVal) {
                msg(vm, null, val);
            }
        }
    };

</script>
