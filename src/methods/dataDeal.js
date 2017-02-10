import {host} from './http.js';

export function clearData(obj) { //除了show和options,其他全部清空
    for (var i in obj){
        if (i == 'show' || i == 'options') continue;
        else if (typeof obj[i] == "object"){
            clearData(obj[i]);
        }else obj[i] = '';
    }
}

function timeDeal(date){
    if (date <= 1) return '';
    var a = new Date(date);
    return a.getFullYear()+'年'+(a.getMonth()+1)+'月'+a.getDate()+'日';
}


export function dataDeal(data) {
    for(var i=0;i< data.length;i++){
        if(data[i].type){
            switch(data[i].type){
                case 1 : data[i].type = '教科书';break;
                case 2 : data[i].type = '小说';break;
                case 3 : data[i].type = '科学书';break;
                case 4 : data[i].type = '工具书';break;
                case 5 : data[i].type = '其他书';break;
            }
        }
        if(data[i].flag){
            switch(data[i].flag){
                case 1 : data[i].flag = '免费送出';break;
                case 2 : data[i].flag = '无偿借出';break;
                case 4 : data[i].flag = '送出或借出';break;
            }
        }
        data[i].calculate =data[i].rdate ;
        data[i].stime = timeDeal(data[i].stime);
        if(data[i].ldate)  data[i].ldate = timeDeal(data[i].ldate);
        if(data[i].rdate != -1)  data[i].rdate = timeDeal(data[i].rdate);
        else data[i].flag = '送书处理中';
        data[i].path = host + data[i].path;
        if(data[i].renewflag) data[i].renewflag = '已续借';
        else data[i].renewflag = '未续借';
    }
}

