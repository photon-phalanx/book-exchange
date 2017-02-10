<template>
    <div class="content">
        <p>最新上架</p>
        <li v-for="item in items">
            <div >
                <img :src = "item.path"/>
            </div>
            <p>{{item.title}}</p>

        </li>
    </div>
</template>
<style scoped>
    div.content>p {
        text-align: center;
        font-size: 25px;
        width: 100%;
        font-family:"微软雅黑";
    }

    .content{
        width: 83%;
        margin: auto;
        max-width: 1920px;
        overflow: hidden;
        list-style-type: none;
    }

    li {
        float: left;
        margin-left: 20px;
        margin-bottom: 20px;
        width: 180px;
        height: 280px;
        border: 1px solid rgba(102, 102, 102,0.5);
        overflow: hidden;
    }

    div li>div {
        width: 100%;
        height: 225px;
    }


    div li img {
        width: 100%;
        display: block;
        height: 235px;
    }

    div li p {
        margin-top: 10px;
        border-top: 1px dashed rgba(102, 102, 102,0.5);
        text-align: center;
        line-height: 40px;
        font-size: 15px;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family:"微软雅黑";
    }

</style>
<script type="text/ecmascript-6">
    //TODO items只是测试
    import { getData, host } from '../../methods/http.js'
    import { errorHandleCom } from '../../methods/msgDeal.js'
    export default{
        data(){
            return{
                msg:'hello vue',
                items:[]
            }
        },
        props: ['options'],
        created(){
            var that = this;
            getData('/book/queryByTime', function(err, data){
                if ( errorHandleCom(err, data, that)) {
                    for (var item in data.data)
                        data.data[item].path = host +data.data[item].path;
                    that.items = data.data;
                }
            })
        },
        methods:{
     }
    }
</script>
