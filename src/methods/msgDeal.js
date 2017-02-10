
//在没有子组建的独立页面中，比如publish,login,register等时，用这个
//因为这个直接与app联系
export function errorHandle(err, data, that){
    var option = {
        autoClose: true,
        showTime: 2000,
        backgroundColor: '#fc5050',
        textColor: '#fff',
        content: '网络异常，请重试.'
    };
    if (err) {
        console.log(err);
        that.$router.app.$emit('msg',option);
        return false;
    }else if(data.data.r) {
        option.content = data.data.r; //r为服务器返回的有提示的err
        that.$router.app.$emit('msg',option);
        return false;
    }
    else return true;
}
//在有子组件的独立页面中，比如index,user等时，用这个
//因为这个与它的父组件联系,由父组件向app发送消息
//在写有父组件的页面时,子组件通过props向父组件传递消息，父组件监听options的改变,来向app发送消息
//而_topnav很特殊,因为他和app直接是父子组件关系,所以直接通讯,不通过这些
export function errorHandleCom(err, data, that){
    var option = {
        autoClose: true,
        showTime: 2000,
        backgroundColor: '#fc5050',
        textColor: '#fff',
        content: '网络异常，请重试.'
    };
    if (err) {
        console.log(err);
        that.options = option;
        return false;
    }else if(data.data.r) {
        option.content = data.data.r; //r为服务器返回的有提示的err
        that.options = option;
        return false;
    }
    else return true;
}

//这个是app里用的,其他地方不用
export function dealMsg(that, option) {
    that.options = option;
    that.show = true;
}

//这个为手动提示消息,只能是没有子组件的组件用
//或父组件传option也可以……
export function msg(that, content, option = {
    autoClose: true,
    showTime: 2000,
    backgroundColor: '#fbff7c',
    textColor: '#92253f',
    content: '网络异常，请重试.'}) {
    if (content) option.content = content;
    that.$router.app.$emit('msg',option);
}

//这个为手动提示消息,只能是有子组件的组件用
export function msgCom(that, content, option = {
    autoClose: true,
    showTime: 2000,
    backgroundColor: '#fbff7c',
    textColor: '#92253f',
    content: '网络异常，请重试.'}) {
    if (content) option.content = content;
    that.options = option;
}

//这个为有子组件的父组件watch变化后向app发送消息用
//p.s. 也可以不用
export function passMsg(that, option){
        that.$router.app.$emit('msg',option);
}