<!-- 表格分页组件 -->
<template>
    <nav class="boot-nav">
        <ul class="pagination boot-page">

            <li>
                <a href="javascript:void(0)" aria-label="Next" @click="onPrevClick($parent)">
                    <span aria-hidden="true">上一页</span>
                </a>
            </li>
            <li>
                <a href="javascript:void(0)" aria-label="Next" @click="onNextClick($parent)">
                    <span aria-hidden="true">下一页</span>
                </a>
            </li>
        </ul>
        <div class="page">
            当前在第 <span v-text="page"></span> 页
        </div>
    </nav>
</template>

<script type="text/ecmascript-6">
    import {postData} from '../methods/http.js';
    import { errorHandle,msg } from '../methods/msgDeal.js'
    import { dataDeal } from '../methods/dataDeal.js'
    var vm;

    function clone(obj) {
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            var copy = [];
            for (var i = 0, len = obj.length; i < len; ++i) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            var copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }

    }

    export default {
        props: ["lenArr","param","lists","page","url","options","pageTotal","flag","tableList","query"],
        data () {
            return {
            }
        },
        ready () {
            vm = this;
            console.log('page', vm);
        },
        route:{

        },
        methods: {
            onPrevClick(vm){
                if(vm.page !== 1){
                    vm.page = vm.page -1;
                }
            },
            onNextClick(vm){
                if(vm.page == vm.pageTotal){
                    if(vm.flag) msg(vm, '已无更多查询的书本信息');
                    else {
                        var obj;
                        if(!vm.query ) obj={id:vm.lists[vm.lists.length-1]._id,length: vm.lenArr};
                        else if(vm.query =='rdate') obj={rdate:vm.lists[vm.lists.length-1].calculate,length: vm.lenArr};
                        else if(typeof(vm.query)=='object') {
                            obj = clone(vm.query);
                            obj.length = vm.lenArr;
                            obj.id = vm.lists[vm.lists.length-1]._id;
                        }
                        postData(vm.url,obj,function (err,res) {
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
            },
            getDefault(vm){
                var query={};
                if ((typeof (vm.query) =='object')&& vm.query ) query = clone(vm.query);
                query.length= vm.lenArr;
                postData(vm.url,query,function (err,res) {
                    if(errorHandle(err, res, vm)){
                        if (res.data.length ==0){
                            vm.flag=true;
                            msg(vm, '已无更多');
                            if(vm.page ==0) vm.tableList =[]; //这个虽然有点不符合语义，但是用来解决删除时的显示bug
                        }else{
                            if (res.data.length<vm.lenArr) vm.flag=true;
                            dataDeal(res.data);
                            for(var i=0;i<res.data.length;i++) vm.lists.push(res.data[i]);
                            vm.page = vm.page +1;
                        }
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .boot-select {
        float: right;
        width: 80px;
    }

    .boot-nav {
        float: right;
    }

    .boot-page {
        display: inline-block;
        margin: 2px 10px 0 20px;
        vertical-align: middle;
    }

    .page {
        display: inline-block;
        vertical-align: middle;
    }
</style>