<template>
    <div class="box">
        <p class="title">处理中的赠书</p>

        <p class="msg">对方未确认的自己得到的赠书：</p>
        <table class="table table-hover table-bordered">
            <thead>
            <tr>
                <th width="40%">书名</th>
                <th width="40%">图片</th>
                <th width="20%">与拥有者联系</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="data in tableList" >
                <td v-text="data.title" ></td>
                <td ><img :src="data.path"/></td>
                <td ><span class="chg"  @click="getContact(data,1)">与拥有者联系</span></td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <td colspan="3">
                    <div class="pull-left">
                        <button  class="btn btn-info" @click="refresh(1)">刷新</button>
                    </div>
                    <div class="pull-right">
                        <nav class="boot-nav">
                            <ul class="pagination boot-page">
                                <li>
                                    <a href="javascript:void(0)" aria-label="Next" @click="onPrevClick(1)">
                                        <span aria-hidden="true">上一页</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)" aria-label="Next" @click="onNextClick(1)">
                                        <span aria-hidden="true">下一页</span>
                                    </a>
                                </li>
                            </ul>
                            <div class="page">
                                当前在第 <span v-text="page"></span> 页
                            </div>
                        </nav>
                    </div>
                </td>
            </tr>
            </tfoot>
        </table>

        <hr/>
        <p class="msg">自己未确认的赠送他人的书：</p>
        <table class="table table-hover table-bordered">
            <thead>
            <tr>
                <th width="30%">书名</th>
                <th width="30%">图片</th>
                <th width="20%">与赠送者联系</th>
                <th width="20%">确认赠送</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="data in tableList2" >
                <td v-text="data.title" ></td>
                <td ><img :src="data.path"/></td>
                <td ><span class="chg" @click="getContact(data,1)" >与赠送者联系</span></td>
                <td ><span class="chg" @click="confirm(data)" >确认赠送</span></td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <td colspan="4">
                    <div class="pull-left">
                        <button  class="btn btn-info" @click="refresh(2)">刷新</button>
                    </div>
                    <div class="pull-right">
                        <nav class="boot-nav">
                            <ul class="pagination boot-page">
                                <li>
                                    <a href="javascript:void(0)" aria-label="Next" @click="onPrevClick(2)">
                                        <span aria-hidden="true">上一页</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="javascript:void(0)" aria-label="Next" @click="onNextClick(2)">
                                        <span aria-hidden="true">下一页</span>
                                    </a>
                                </li>
                            </ul>
                            <div class="page">
                                当前在第 <span v-text="page2"></span> 页
                            </div>
                        </nav>
                    </div>
                </td>
            </tr>
            </tfoot>
        </table>
    </div>
</template>

<script>
    var vm;
    import {clearData} from '../methods/dataDeal.js';
    import { errorHandle,msg } from '../methods/msgDeal.js'
    import { postData } from '../methods/http.js'
    import { dataDeal } from '../methods/dataDeal.js'
    export default {
        data () {
            return {
                lenArr: 5, // 每页显示长度设置
                param: {}, // 传递参数
                lists: [], // 总数据
                tableList: [], // 当前显示的数据
                page: 0, //当前页
                pageTotal:1,

                flag2: false, //标记是否已经没有新数据
                lenArr2: 5, // 每页显示长度设置
                param2: {}, // 传递参数
                lists2: [], // 总数据
                tableList2: [], // 当前显示的数据
                page2: 0, //当前页
                pageTotal2:1,
                flag: false, //标记是否已经没有新数据
                change:false, //修改
                index:'', //这个是用来判断是否符合条件而记录的书本位置(修改信息的条件)

                options: {},
                query:'rdate'
            }
        },
        route:{
            data (next) {
                this.lists = [];
                this.pageTotal = 1;
                this.flag = false;
                this.page = 0;

                this.lists2 = [];
                this.pageTotal2 = 1;
                this.flag2 = false;
                this.page2 = 0;
                this.getDefault(1);
                this.getDefault(2);
            },
            canReuse (transition) {
                console.log('hook-example activated!');
                return false;
            }
        },
        ready () {
            vm = this;
            console.log('sendBook', vm);
        },
        components: {
        },
        methods: {
            refresh(number){
                if(number ==1){
                    vm.lists = [];
                    vm.pageTotal = 1;
                    vm.flag = false;
                    vm.page = 0;
                    setTimeout(function () {
                        vm.getDefault(1);
                        msg(vm,'已刷新');
                    },1);
                }else{
                    vm.lists2 = [];
                    vm.pageTotal2 = 1;
                    vm.flag2 = false;
                    vm.page2 = 0;
                    setTimeout(function () {
                        vm.getDefault(2);
                        msg(vm,'已刷新');
                    },1);
                }
            },
            getContact(data ,number){
                var query;
                if (number == 1) query ={id:data.owner};
                else query = {id:data.reader};
                postData('/user/phone',query,function (err,res) {
                    if(errorHandle(err, res, vm)){
                        var content = '联系电话:' + res.data.phone ;
                        msg(vm,null,{
                            autoClose: false,
                            content: content
                        });
                    }
                })
            },
            confirm(data){
                postData('/book/send',{id:data._id},function (err,res) {
                    if(errorHandle(err, res, vm)){
                        vm.refresh(2);
                        msg(vm,'操作成功');
                    }
                })
            },
            onPrevClick(number){
                if(number == 1){
                    if(vm.page !== 1){
                        vm.page = vm.page -1;
                    }
                }else{
                    if(vm.page2 !== 1){
                        vm.page2 = vm.page2 -1;
                    }
                }

            },
            onNextClick(number){
                if(number ==1){
                    if(vm.page == vm.pageTotal){
                        if(vm.flag) msg(vm, '已无更多查询的书本信息');
                        else {
                            var obj={id:vm.lists[vm.lists.length-1]._id,length: vm.lenArr};
                            postData('/user/unhandledReader',obj,function (err,res) {
                                if(errorHandle(err, res, vm)){
                                    if (res.data.length ==0){
                                        vm.flag=true;
                                        msg(vm, '已无更多查询的书本信息');
                                    }else{
                                        if (res.data.length<vm.lenArr) vm.flag=true;
                                        dataDeal(res.data);
                                        for(var i=0;i<res.data.length;i++) vm.lists.push(res.data[i]);
                                        vm.page = vm.page +1;
                                        vm.pageTotal += 1;
                                    }
                                }
                            });
                        }
                    }else vm.page = vm.page +1;
                }else{
                    if(vm.page2 == vm.pageTotal2){
                        if(vm.flag2) msg(vm, '已无更多查询的书本信息');
                        else {
                            var obj={id:vm.lists2[vm.lists2.length-1]._id,length: vm.lenArr};
                            postData('/user/unhandled',obj,function (err,res) {
                                if(errorHandle(err, res, vm)){
                                    if (res.data.length ==0){
                                        vm.flag2=true;
                                        msg(vm, '已无更多查询的书本信息');
                                    }else{
                                        if (res.data.length<vm.lenArr) vm.flag2=true;
                                        dataDeal(res.data);
                                        for(var i=0;i<res.data.length;i++) vm.lists2.push(res.data[i]);
                                        vm.page2 = vm.page2 +1;
                                        vm.pageTotal2 += 1;
                                    }
                                }
                            });
                        }
                    }else vm.page2 = vm.page2 +1;
                }
            },
            getDefault(number){
                if (!vm) var vm = this;
                var url,query={length: vm.lenArr};
                if (number == 1) url='/user/unhandledReader';
                else url = '/user/unhandled';
                postData(url,query,function (err,res) {
                    if(errorHandle(err, res, vm)){
                        if (res.data.length ==0){
                            if (number == 1) vm.flag=true;
                            else vm.flag2=true;
                            msg(vm, '已无更多');
                            if (number ==1 ){
                                if(vm.page ==0) vm.tableList =[]; //这个虽然有点不符合语义，但是用来解决删除时的显示bug
                            }else{
                                if(vm.page2 ==0) vm.tableList2 =[]; //这个虽然有点不符合语义，但是用来解决删除时的显示bug
                            }
                        }else{
                            if (number ==1 ){
                                if (res.data.length<vm.lenArr) vm.flag=true;
                                dataDeal(res.data);
                                for(var i=0;i<res.data.length;i++) vm.lists.push(res.data[i]);
                                vm.page = vm.page +1;
                            }else {
                                if (res.data.length<vm.lenArr2) vm.flag2=true;
                                dataDeal(res.data);
                                for(var i=0;i<res.data.length;i++) vm.lists2.push(res.data[i]);
                                vm.page2 = vm.page2 +1;
                            }

                        }
                    }
                });
            }
        },
        watch: {
            'page': function (val, oldVal) {
                if (val == 0) return ;
                var len =vm.lists.length;
                var end = val*5 > len ?len :val*5;
                vm.tableList =[];
                for(var i = (val-1)*5;i < end; i++)
                    vm.tableList.push(vm.lists[i]);
            },
            'page2': function (val, oldVal) {
                if (val == 0) return ;
                var len =vm.lists2.length;
                var end = val*5 > len ?len :val*5;
                vm.tableList2 =[];
                for(var i = (val-1)*5;i < end; i++)
                    vm.tableList2.push(vm.lists2[i]);
            },
            'options': function (val, oldVal) {
                msg(vm, null, val);
            }
        }
    }
</script>

<style scoped>


   .title {
                      font-family:"微软雅黑";
                      text-align: center;
                      margin-bottom: 30px;
                      margin-left: 0px;
                      color: $primary-color;
                      font-weight: normal;
                      font-size: 25px;
       }

    .msg {
                      font-family:"微软雅黑";
                      margin-bottom: 10px;
                      margin-left: 0px;
                      color: $primary-color;
                      font-weight: normal;
                      font-size: 18px;
    }
    table {
        background-color: #ffffff;
        font-family:"微软雅黑";
    }

    .chg:hover  {
        cursor: pointer;
        color: #ee0000;
    }

</style>