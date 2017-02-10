<template>
    <div class="box">
        <p class="title">我的借出</p>
        <table class="table table-hover table-bordered">
            <thead>
            <tr>
                <th width="30%">书名</th>
                <th width="30%">应还日期</th>
                <th width="20%">与读者联系</th>
                <th width="20%">确认还书</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="data in tableList" >
                <td @click="showDetail($index)" v-text="data.title" class="chg"></td>
                <td v-text="data.rdate"></td>
                <td @click="getContact(data)" class="chg">与读者联系</td>
                <td ><span @click="returnBook(data)" class="chg">确认还书</span></td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <td colspan="4">
                    <div class="pull-left">
                        <button  class="btn btn-info" @click="refresh">刷新</button>
                    </div>
                    <div class="pull-right">
                        <page v-ref:page :len-arr.sync="lenArr" :param.sync="param" :lists.sync="lists"
                              :flag.sync="flag" :page.sync="page" :url="url" :options.sync="options"
                              :page-total.sync="pageTotal" :table-list.sync="tableList" :query="query"></page>
                    </div>
                </td>
            </tr>
            </tfoot>
        </table>
        <div v-if="detail">
            <table class="table table-bordered">
                <tbody>
                <tr >
                    <td width="30%">书名</td>
                    <td v-text="detail.title"></td>
                    <td  width="30%" rowspan="5">
                        <img :src="detail.path"/>
                    </td>
                </tr>
                <tr >
                    <td >发布时间</td>
                    <td v-text="detail.stime"></td>
                </tr>
                <tr >
                    <td >读者</td>
                    <td v-text="detail.reader"></td>
                </tr>
                <tr >
                    <td >借出日期</td>
                    <td v-text="detail.ldate"></td>
                </tr>
                <tr >
                    <td >应还日期</td>
                    <td v-text="detail.rdate"></td>
                </tr>
                <tr >
                    <td >续借情况</td>
                    <td v-text="detail.renewflag"></td>
                </tr>
                <tr >
                    <td >分类</td>
                    <td v-text="detail.type"></td>
                    <td rowspan="2"><button  class="btn btn-default" @click="close">收起</button></td>
                </tr>
                <tr >
                    <td >类型</td>
                    <td v-text="detail.flag"></td>
                </tr>
                </tbody>

            </table>
        </div>

    </div>
</template>

<script>
    var vm;
    import {clearData} from '../methods/dataDeal.js';
    import { errorHandle,msg } from '../methods/msgDeal.js'
    import { postData } from '../methods/http.js'

    export default {
        data () {
            return {
                lenArr: 5, // 每页显示长度设置
                param: {}, // 传递参数
                lists: [], // 总数据
                tableList: [], // 当前显示的数据
                page: 0, //当前页
                url: '/user/lend',
                pageTotal:1,
                flag: false, //标记是否已经没有新数据
                detail:'',
                change:false, //修改
                index:'', //这个是用来判断是否符合条件而记录的书本位置(修改信息的条件)
                book:{
                    flag:'',
                    type:'',
                    id:'',
                    path: ''
                },
                calculate:'', //这个是用来计算时间的= =
                options: {},
                query:'rdate'
            }
        },
        route:{
            data (next) {
                this.init();
            }
        },
        ready () {
            vm = this;
            console.log('lend', vm);
        },
        components: {
            "page" : require('../components/page.vue')
        },
        methods: {
            refresh(){
                vm.lists = [];
                vm.pageTotal = 1;
                vm.flag = false;
                vm.detail = '';
                vm.page = 0;
                setTimeout(function () {
                    vm.$refs.page.getDefault(vm);
                    msg(vm,'已刷新');
                },1);

            },
            init(){
                if (!vm) var vm = this;
                vm.lists = [];
                vm.pageTotal = 1;
                vm.flag = false;
                vm.detail = '';
                vm.page = 0;
                setTimeout(function () {
                    vm.$refs.page.getDefault(vm);
                },1);

            },
            showDetail(index){
                vm.detail = vm.tableList[index];
            },
            close(){
                vm.detail = '';
            },
            returnBook(data){
                        postData('/book/return',{id:data._id},function (err,res) {
                            if(errorHandle(err, res, vm)){
                                vm.refresh();
                                msg(vm,'确认操作成功');
                            }
                        })
            },
            getContact(data){
                postData('/user/phone',{id:data.reader},function (err,res) {
                    if(errorHandle(err, res, vm)){
                         var content = '联系电话:' + res.data.phone ;
                        msg(vm,null,{
                            autoClose: false,
                            content: content
                        });
                    }
                })
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
        color: #4879ff;
        margin: auto;
        display: block;
        width: 400px;
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