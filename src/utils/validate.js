/*
*过滤特殊字符串
*/
export function stripscript(str) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{ }【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < str.length; i++) {
        rs = rs + str.substr(i, 1).replace(pattern, '');
    }
    return rs;
}
/*
    * 验证密码(密码是由6-21位数字与字母（不分大小写）组合而成)
*/
export function stripPassword(value){
    let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,21}$/;
    return !reg.test(value)
}

/*
    * 验证手机
*/
export function stripPhone(value){
    let reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
    return !reg.test(value)
}


/*
    * 验证用户名4-16位(字母，数字，_，-)
*/
export function stripUsername(value){
    let reg = /^[a-zA-Z0-9_-]{4,16}$/;
    return !reg.test(value)
}
/*
    * 验证邮箱
*/
export function stripEmail(value){
    let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    return !reg.test(value)
}

