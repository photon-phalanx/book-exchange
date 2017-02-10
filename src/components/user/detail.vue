<template >
    <table class="table table-hover table-bordered">
        <tbody>
        <tr >
            <td >最多可借阅和赠书确认的总和</td>
            <td v-text="maxNum"></td>
        </tr>
        <tr>
            <td >自己发布的图书</td>
            <td v-text="publish"></td>
        </tr>
        <tr>
            <td >自己借出的图书</td>
            <td v-text="lend"></td>
        </tr>
        <tr>
            <td >自己借到的图书</td>
            <td v-text="borrow"></td>
        </tr>
        </tbody>
    </table>
</template>



<style scoped>
    table {
        width: 35%;
        margin: auto;
        background-color: #fff;
    }

    tr:first-child{
        width: 70%;
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
                maxNum : '',
                borrow : '',
                publish : '',
                lend : ''
            }
        },
        components:{
        },
        props: ['options'],
        ready () {
            vm = this;
            console.log('detail', vm);
        },
        events:{
            'init' (event){
                this.maxNum = '';
                this.borrow = '';
                this.publish = '';
                this.lend = '';
                var that = this;
                postData('/user/count', {}, function (err, data) {
                    if(errorHandleCom(err, data, that)){
                        that.maxNum = data.data.maxNum + '本';
                        that.borrow = data.data.borrow + '本';
                        that.publish = data.data.publish + '本';
                        that.lend = data.data.lend + '本';
                    }
                })
            }
        },
        methods: {

        }
    }
</script>
