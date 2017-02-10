import Vue from 'vue'
import Vue_Resource from 'vue-resource'

export const host ='http://115.159.5.215:8002';
//export const host ='http://192.168.1.105:8002';

export function getData(url,callback){
    Vue.http.get(host+url,{
        credentials: true
    }).then((response) => {
        // success callback
        callback(null,response);
    }, (response) => {
        // error callback
        callback(response);
    });
}

export function postData(url, body, callback){
    Vue.http.post(host+url,body,  {
        credentials: true
    }).then((response) => {
        // success callback
        callback(null,response);
    }, (response) => {
        // error callback
        callback(response);
    });
}

export function deleteData(callback){
    Vue.http.delete(host + '/user/login/', {
        credentials: true
    }).then((response) => {
        // success callback
        callback(null,response);
    }, (response) => {
        // error callback
        callback(response);
    });
}

