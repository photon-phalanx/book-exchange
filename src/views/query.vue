<template>
    <div class="box">
        <p class="title">我要找书</p>
        <form class="form-horizontal">
                <label >书名:</label>
                    <input type="text"
                           v-model="query.title"
                           placeholder="  请输入书名"/>
            <br/>
                <label >分类:</label>
                    <select v-model="query.type" number class="form-control">
                        <option value=1 >教科书</option>
                        <option value=2 >小说</option>
                        <option value=3 >科学书</option>
                        <option value=4 >工具书</option>
                        <option value=5 >其他书</option>
                        <option value=6 selected>不限</option>
                    </select>
                    </br>
                    <button @click="queryBook(query)"
                                            type="button"
                                            class="btn btn-primary">
                                        查询
                    </button>



        </form>
            <table class="table table-hover table-bordered">
                <thead>
                <tr>
                    <th width="20%">书名</th>
                    <th width="30%">类型</th>
                    <th width="20%">图片</th>
                    <th width="20%">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="data in tableList" >
                    <td v-text="data.title" ></td>
                    <td v-text="data.flag"></td>
                    <td ><img :src="data.path"/></td>
                    <td >
                        <span v-if="data.flag1" class="chg" @click="borrow(data._id)">我要借走</span>
                        <span v-if="data.flag1&&data.flag2">/</span>
                        <span v-if="data.flag2" class="chg" @click="get(data._id)">我要得到</span>
                        <p><a v-link="{ name: 'message', params:{id:data.owner}}">我要留言</a></p>
                    </td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td colspan="4">
                        <div class="pull-right">
                            <page v-ref:page :len-arr.sync="lenArr" :param.sync="param" :lists.sync="lists"
                                  :flag.sync="flag" :page.sync="page" :url="url" :options.sync="options"
                                  :page-total.sync="pageTotal" :table-list.sync="tableList" :query="query"></page>
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

    export default {
        data () {
            return {
                lenArr: 5, // 每页显示长度设置
                param: {}, // 传递参数
                lists: [], // 总数据
                tableList: [], // 当前显示的数据
                page: 0, //当前页
                url: '/book/query',
                pageTotal:1,
                flag: false, //标记是否已经没有新数据
                show:false,
                query:{
                    type:'',
                    title:''
                },
                options: {},
            }
        },
        route:{
            data (next) {
                this.page =0;
                this.query.title = '';
                this.query.type = 6;
                this.tableList =[];
            }
        },
        ready () {
            vm = this;
            console.log('query', vm);
        },
        components: {
            "page" : require('../components/page.vue')
        },
        methods: {
            flagDeal(obj){
                if (/借/.test(obj.flag)) obj.flag1 = true;
                else obj.flag1 = false;
                if (/送/.test(obj.flag)) obj.flag2 = true;
                else obj.flag2 = false;
            },
            queryBook(query){
                vm.lists = [];
                vm.pageTotal = 1;
                vm.flag = false;
                vm.page = 0;
                setTimeout(function () {
                    vm.$refs.page.getDefault(vm);
                },1);
            },
            borrow(book){
                postData('/book/borrow',{id:book},function (err,res) {
                    if(errorHandle(err, res, vm)){
                        msg(vm,'操作成功，请去借到的图书页面联系书的主人');
                    }
                })
            },
            get(book){
                    postData('/book/get',{id:book},function (err,res) {
                        if(errorHandle(err, res, vm)){
                            msg(vm,'操作成功，请去待确认的赠书页面联系书的主人');
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
                for(var i = (val-1)*5;i < end; i++){
                    vm.tableList.push(vm.lists[i]);
                    vm.flagDeal(vm.tableList[vm.tableList.length-1]);
                }
                vm.show = true;
            },
            'options': function (val, oldVal) {
                msg(vm, null, val);
            }
        }
    }
</script>

<style scoped>

    div.box form {
        width: 500px;
        margin: auto;
        font-family:"微软雅黑";
    }

    div.box form label {
        width: 80px;
        border-radius: 10px;
        padding: 15px;

    }

    div.box form select,div.box form input  {
        width: 380px;
        display: inline-block;
        font-family:"微软雅黑";
    }


    div.box button {
        display: block;
        margin: auto;
        margin-top: 15px;
        margin-bottom: 20px;
        font-family:"微软雅黑";
    }

     .title {
                    font-family:"微软雅黑";
                    margin: auto;
                    margin-bottom: 30px;
                    text-align: center;
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
        margin-left: 0px;
        background-color: #ffffff;
        font-family:"微软雅黑";
    }

    span {
        color: #0275d8;
    }

    .chg:hover  {
        cursor: pointer;
        color: #ee0000;
    }

</style>