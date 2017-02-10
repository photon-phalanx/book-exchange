<template>
    <div class="publish">
    <p class="title">留言</p>
        <form class="form-horizontal">

                <label >收件人:</label>
                    <input type="text"
                           v-model="req.receiver"
                           placeholder="请输入收件人"/>
            <br/>
                <label >  内 容 :</label>
                        <textarea v-model="req.content"  placeholder="请输入内容"></textarea>
            <br/>
            <button @click="send(req)" type="button" class="btn btn-primary">发送</button>
        </form>
    </div>
    <hr/>
    <div class="main">
        <div class="msg-box" v-for="data in tableList" :class="{active: data.show}">
            <p @click="switchMsg(data)">与{{data.talkTo}}的交流(点击展开或合上)
                <a @click.stop="giveMsg(data.talkTo)">给ta回复</a>
            </p>
            <div class="detail" v-if="data.show">
                <div class="msg" v-for="talk in data.comments">
                    <p class="poster">{{talk.poster}}说:</p>
                    <p class="content">{{talk.content}}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="page">
    <nav class="boot-nav pull-right">
        <ul class="pagination boot-page">

            <li>
                <a href="javascript:void(0)" aria-label="Next" @click="onPrevClick()">
                    <span aria-hidden="true">上一页</span>
                </a>
            </li>
            <li>
                <a href="javascript:void(0)" aria-label="Next" @click="onNextClick()">
                    <span aria-hidden="true">下一页</span>
                </a>
            </li>
        </ul>
        </br>
        <div class="page">
            当前在第 <span v-text="page"></span> 页
        </div>
    </nav>
    </div>
</template>
<style scoped>

       .title {
                    font-family:"微软雅黑";
                    margin: auto;
                    margin-bottom: 30px;
                    text-align: center;
                    color: $primary-color;
                    font-weight: normal;
                    font-size: 25px;
     }
    div.publish {
        width: 500px;
        margin: auto;
        font-family:"微软雅黑";
    }

    div.publish label {
        width: 90px;
        padding: 15px;
        font-family:"微软雅黑";

    }

    div.publish input {
        display: inline-block;
        width: 330px;
    }

    div.publish textarea {
        display: inline-block;
        width: 330px;
        resize: none;
        font-family:"微软雅黑";
    }

    div.publish button {
        display: block;
        margin: auto;
        margin-top: 15px;
        margin-bottom: 20px;
    }



    div.main {
        background-color: #FFF;
        width: 80%;
        margin: auto;
        font-family:"微软雅黑";
    }

    div.msg-box {
        border: 2px solid #cdcdcd;
    }

    div.msg-box p {
        font-size: 15px;
        line-height: 30px;
        cursor: pointer;
        width: 100%;
        margin-bottom: 0;
    }

    div.msg-box p a {
        float: right;
        z-index: 2;
    }

    div.msg {
        border-bottom: 1px dashed #ccc;
        border-top: 1px dashed #ccc;
    }

    div.msg:after {
        content: '.';
        visibility: hidden;
        display: block;
        height: 0;
        clear: both;
    }

    div.msg .poster {
        float: left;
        width: 200px;
        border-right: 1px solid #cdcdcd ;
        display: inline;
    }

    div.msg .content {
        float: left;
        display: inline;
        width: auto;
    }

    div.msg:hover {
        background-color: #E5EDF2;
    }

    .active {
        margin-bottom: 40px;
    }
    .page{
    float: right;
    margin-right:80px;
    font-family:"微软雅黑";
    }

</style>
<script>
    var vm;
    import { errorHandle,msg } from '../methods/msgDeal.js'
    import { getAccount } from '../methods/storage.js'
    import { postData} from '../methods/http.js'
    export default{
        data(){
            return{
                lenArr: 10, // 每页显示长度设置
                lists: [], // 总数据
                tableList: [], // 当前显示的数据
                page: 0, //当前页
                pageTotal:1,
                flag: false, //标记是否已经没有新数据
                detail:'',
                req:{
                    receiver:'',
                    content:''
                }
            }
        },
        ready () {
            vm = this;
            console.log('message', vm);
        },
        route:{
            data () {
                this.lenArr = 10;
                this.lists = [];
                this.tableList = [];
                this.page = 0;
                this.pageTotal = 1;
                this.flag = false;
                if(this.$route.params.id !='#') this.req.receiver = this.$route.params.id;
                else this.req.receiver = '';
                this.req.content = '';
                this.getDefault(this);

            }
        },
        methods: {
            send(req){
                if(!req.receiver||!req.content) msg(vm,'请将表单填写完整');
                else {
                    req.receiver=parseInt(req.receiver);
                    postData('/user/addMessage',req,function (err,res) {
                        if(errorHandle(err, res, vm)){
                            vm.lists = [];
                            vm.tableList = [];
                            vm.page = 0;
                            vm.pageTotal = 1;
                            vm.flag = false;
                            vm.getDefault(vm);
                            vm.req.receiver ='';
                            vm.req.content = '';
                            msg(vm,'发送成功');
                        }
                    });
                }

            },

            onPrevClick(){
                if(vm.page !== 1){
                    vm.closeMsg();
                    vm.page = vm.page -1;
                }
            },
            onNextClick(){
                if(vm.page == vm.pageTotal){
                    if(vm.flag) msg(vm, '已无更多留言');
                    else {
                        postData('/user/searchMessage',{id:vm.lists[vm.lists.length-1]._id,length: vm.lenArr},function (err,res) {
                            if(errorHandle(err, res, vm)){
                                if (res.data.length ==0){
                                    vm.flag=true;
                                    msg(vm, '已无更多留言');
                                }else{
                                    if (res.data.length<vm.lenArr) vm.flag=true;
                                    vm.closeMsg();
                                    vm.resDeal(res.data);
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
                query.length= vm.lenArr;
                postData('/user/searchMessage',query,function (err,res) {
                    if(errorHandle(err, res, vm)){
                        if (res.data.length ==0){
                            vm.flag=true;
                            msg(vm, '已无更多留言');
                            if(vm.page ==0) vm.tableList =[]; //这个虽然有点不符合语义，但是用来解决删除时的显示bug
                        }else{
                            if (res.data.length<vm.lenArr) vm.flag=true;
                            vm.resDeal(res.data);
                            for(var i=0;i<res.data.length;i++) vm.lists.push(res.data[i]);
                            vm.page = vm.page +1;
                        }
                    }
                });
            },
            resDeal(dataList){
                var uid = getAccount().uid;
                for(var i=0;i<dataList.length;i++){
                    dataList[i].show = false;
                    if(dataList[i].relation[0] == uid ){
                        dataList[i].talkTo = dataList[i].relation[1];
                    }else {
                        dataList[i].talkTo = dataList[i].relation[0];
                    }
                }
            },
            switchMsg(data){
                data.show = !data.show;
            },
            giveMsg(poster){
                vm.req.receiver = poster ;
            },
            closeMsg(){
                for(var i=0; i<vm.tableList.length; i++)
                vm.tableList[i].show = false ;
            }
        },
        watch: {
            'page': function (val, oldVal) {
                if (val == 0) return ;
                var len =vm.lists.length;
                var end = val*10 > len ?len :val*10;
                vm.tableList =[];
                for(var i = (val-1)*10;i < end; i++)
                    vm.tableList.push(vm.lists[i]);
            }
        },
        components:{

        }
    }
</script>