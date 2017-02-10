<template>
    <div class="box">
        <p class="title">我的发布</p>
        <table class="table table-hover table-bordered">
            <thead>
            <tr>
                <th width="30%">书名</th>
                <th width="30%">发布日期</th>
                <th width="20%">种类</th>
                <th width="20%">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="data in tableList" >
                <td @click="showDetail($index)" v-text="data.title" class="chg"></td>
                <td v-text="data.stime"></td>
                <td v-text="data.flag"></td>
                <td @click="open($index)" class="chg">删除/修改</td>
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
                    <td >读者/赠送者</td>
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
        <div v-if="change">
            <table class="table table-bordered">
                <tbody>
                <tr >
                    <td colspan="2">如您想删除该书本，请按下面的删除按钮</td>
                    <td rowspan="5">
                        <img :src="tableList[index].path"/>
                    </td>
                </tr>
                <tr >
                    <td colspan="2" ><button  class="btn btn-default" @click="del">删除</button></td>
                </tr>
                <tr >
                    <td colspan="2">下面可以修改书本相关选项，仅在未借出或未送出时可以操作</td>
                </tr>
                <tr >
                    <td >分类</td>
                    <td >
                        <select v-model="book.type" number class="form-control">
                            <option value=1 selected>教科书</option>
                            <option value=2 >小说</option>
                            <option value=3 >科学书</option>
                            <option value=4 >工具书</option>
                            <option value=5 >其他书</option>
                        </select>
                    </td>
                </tr>
                <tr >
                    <td >类型</td>
                    <td ><select v-model="book.flag" number class="form-control">
                        <option value=1 >免费送出</option>
                        <option value=2 >无偿借出</option>
                        <option value=4 selected>以上两者均可</option>
                    </select>
                    </td>
                </tr>
                <tr >
                    <td colspan="2"><button  class="btn btn-default" @click="chg">提交修改</button></td>
                </tr>
                <tr >
                    <td colspan="2"><button  class="btn btn-default" @click="close2">收起</button></td>
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
                url: '/user/publish',
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
                options: {},
                query:null
            }
        },
        ready () {
            vm = this;
            console.log('publish', vm);
        },
        route:{
            data (next) {
                this.init();
            }
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
                process.nextTick(function () {
                    window.scrollTo(10000,10000);
                });
            },
            close(){
                vm.detail = '';
            },
            open(index){
                vm.change = true;
                vm.book.id = vm.tableList[index]._id;
                vm.index = index;
                process.nextTick(function () {
                    window.scrollTo(10000,10000);
                });
             //   vm.book.path = vm.tableList[index].path;
            },
            close2(){
                vm.change = false;
                clearData(vm.book);
            },
            del(){
                if (!vm.tableList[vm.index].reader){
                    postData('/book/deleteBook',vm.book,function (err,res) {
                        if(errorHandle(err, res, vm)){
                            vm.change = false;
                            clearData(vm.book);
                            vm.refresh();
                            msg(vm,'删除成功');
                        }
                    })
                }else{
                    msg(vm,'只有未借出或者未处于送出交易状态的书本才可以删除');
                }

            },
            chg(){
                if (!vm.tableList[vm.index].reader){
                    if(vm.book.flag &&vm.book.type){
                        postData('/book/changeBook',vm.book,function (err,res) {
                            if(errorHandle(err, res, vm)){
                                vm.change = false;
                                clearData(vm.book);
                                vm.refresh();
                                msg(vm,'修改成功');
                            }
                        })
                    }else{
                        msg(vm, '请填写相关信息');
                    }
                }else{
                    msg(vm,'只有未借出或者未处于送出交易状态的书本才可以修改状态');
                }

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
        font-family:"微软雅黑";
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