<template>
    <div class="containerbox">
        <div><h1 class="header">我要发布</h1></div>
        <form class="form-horizontal">
            <div class="form-group">
            <div class="col-md-5 col-xs-9 control-label">书名：</div>
                <div class="col-md-5 col-xs-9">
                    <input type="text" id="bname"
                           class="form-control"
                           v-model="book.title"
                           placeholder="请输入书名"/>
                </div>
            </div>
            <div class="form-group">
            <div class="col-md-5 col-xs-9 control-label">分类：</div>
            <div class="col-md-5 col-xs-9">
                <select v-model="book.type" number class="form-control">
                    <option value=1 selected>教科书</option>
                    <option value=2 >小说</option>
                    <option value=3 >科学书</option>
                    <option value=4 >工具书</option>
                    <option value=5 >其他书</option>
                </select>
            </div>
            </div>
            <div class="form-group">
                <div class="col-md-5 col-xs-9 control-label">类别：</div>
                <div class="col-md-5 col-xs-9">
                    <select v-model="book.flag" number class="form-control">
                        <option value=1 >免费送出</option>
                        <option value=2 >无偿借出</option>
                        <option value=4 selected>以上两者均可</option>
                    </select>
                </div>
            </div>
            <div class="form-group ">
                <div class="col-md-5 col-xs-9 control-label">图片：</div>
                <div class="col-md-5 col-xs-9">
                    <input type="file" name="xx"  v-on:change="check()" id="xx" style="display:none" />
                    <input type="button" id="btn" class="btn btn-info" value="点击上传图片" onclick="document.getElementById('xx').click();" />
                </div>
            </div>

            <div v-if="sourceSize" class="col-md-6 col-md-offset-5" id="pic">
                <img :src="book.photo"/>
                <p>源图片:{{sourceSize}}KB</p>
                <p>压缩后图片:<span class="import">{{resultSize}}KB</span></p>
                <p>请使图片在<span class="import">30kb</span>以内，否则服务器会拒收</p>
            </div>
            <div  class="col-md-3"></div>
            <br/>
            <div class="col-md-5 col-md-offset-5">
                <button @click="publish(book)"
                        type="button"
                        class="btn btn-primary">
                    发布
                </button>
            </div>
        </form>

    </div>

</template>
<style scoped>
     .containerbox{
          margin:0px auto;
     }
     .header {
                font-family:"微软雅黑";
                margin-bottom: 30px;
                margin-left: 15px;
                color: $primary-color;
                font-weight: normal;
                font-size: 25px;
                text-align: center;
              }
    .form-horizontal{
                font-family:"微软雅黑";
                margin: auto;
    }
    .form-control{
    margin-top: 4px;
    }
    .box{
        padding-top: 0px;
    }

    img {
        float : right;
    }

    #pic {
        padding-bottom: 0px;
        font-weight: 300;
    }

    .import {
        color: #ee0000;
    }
</style>
<script  type="text/ecmascript-6">
    //accept="image/*"
    import lrz from 'lrz';
    import {postData} from '../methods/http.js';
    import {clearData} from '../methods/dataDeal.js';
    import {errorHandle, msg} from '../methods/msgDeal.js';

    var vm;
    export default{
        data(){
            return{
                book: {
                    title: '',
                    flag: '',
                    photo: '',
                    type: ''
                },
                sourceSize: '',
                resultSize: ''
            }
        },
        components:{
        },
        ready () {
            vm = this;
            console.log('publish', vm);
        },
        methods: {
            publish(book){
                    if(book.title &&book.flag &&book.photo &&book.type){
                        postData('/book/addBook', book, function (err, data) {
                            if(errorHandle(err, data, vm)){
                                msg(vm,'书本添加成功');
                                clearData(vm.book);
                                vm.sourceSize = '';
                                vm.resultSize = '';
                                window.file.value = '';
                            }
                        });
                    }else{
                        msg(vm, '请填写完整');
                    }
            },
            check(){
                var photo = document.getElementById("xx").files[0];
                if(photo){
                    vm.book.photo = '';
                    vm.resultSize = '';
                    lrz(photo, {
                         width: 200,
                        quality: 0.8
                    }).then(function (rst) {
                          var sourceSize = Math.floor(photo.size / 1024 +1);
                         var resultSize = Math.floor(rst.fileLen / 1024 +1);
                         vm.sourceSize = sourceSize;
                         vm.resultSize = resultSize;
                         vm.book.photo = rst.base64;
                    }) .catch(function (err){
                        msg(vm, err);
                    });
                }
            }
        }
    }
</script>
