<template>
    <div id="login" v-title data-title="登录">
        <div class="login-warp">
            <ul class="menu-tab" >
                <li  v-for="(item,index) in menuTab" :key="item.id" @click="changeTab(item)" :class='[ currentNum == index + 1  ? "current" : ""]'>{{item.txt}}</li>
            </ul>
            <!-- 表单提交 start -->
            <el-form :model="formLogin" :rules="rules" ref="ruleLogin">
                <el-form-item prop="email">
                    <label for='userName' class="labelname eamil">邮箱</label>
                    <el-input id="userName" class="loginInput" type="text" v-model="formLogin.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item prop="password" class="formItem">
                    <label for='password' class="labelname password">密码</label>
                        <el-input id="password" class="loginInput" type="password" v-model="formLogin.password" show-password placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item prop="phone" class="formItem">
                    <label for="phone" class="labelname password">手机号</label>
                        <el-input id="phone" class="loginInput" type="text" v-model="formLogin.phone" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item prop="code" class="formItem">
                    <label for="code" class="labelname code">验证码</label>
                    <el-row type="flex" :gutter="2" justify="space-between">
                        <el-col :span="14">
                                <el-input id="code" class="loginInput" type="text" v-model="formLogin.code" placeholder="请输入验证码"></el-input>
                        </el-col>
                        <el-col :span="9">
                            <el-button type="success" @click="getCode()" :disabled="codeStatus.status">{{codeStatus.text}}</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item class="submit-btn">
                    <el-button class="btn primary" size="medium" type="primary"  @click="submitForm('ruleLogin')" :disabled="isLogin">登录</el-button>
                </el-form-item>
            </el-form>
            <!-- 表单提交 end -->
        </div>
        <router-view />
    </div>
</template>
<script>
import sha1 from 'js-sha1'
import { getSms, Login} from '@/api/login'
import LoginComponents from "@/components/login/LoginComponents.vue"
import {stripscript,stripPassword,stripEmail,stripPhone} from "@/utils/validate"
export default {
    name: 'Login',
    components: {
        LoginComponents
    },
    data(){
        /*
        * 验证邮箱规则
        */
        var validateEmail = ( rule,value,callback )=>{
            if( value == "" ){
                callback(new Error("请输入邮箱"))
            }else if(stripEmail(value)){
                callback(new Error("请输入正确的邮箱"))
            }else{
                callback()
            }
        };
        /*
        * 验证密码
        */
        var validatePassword = (rule,value,callback)=>{
            if( value === "" ){
                callback(new Error("请输入密码"))
            }else if(stripPassword(value)){
                console.log(value)
                callback(new Error("密码为6-21位数字与字母的组合"))
            } else {
                callback();
            }
        };
        /*
        * 验证手机
        */
        var validatePhone = (rule,value,callback)=>{
            if(value === ""){
                callback(new Error("请输入手机号码"))
            }else if(stripPhone(value)){
                callback(new Error("请输入正确的手机号码"))
            }else{
                callback()
            }
        };
        /*
        * 验证验证码
        */
        var validateCode = (rule,value,callback)=>{
            if( value === "" ){
                callback(new Error("请输入验证码"))
            } else {
                callback();
            }
        };
        return {
            currentNum: 1,
            isLogin: true,
            timer: null,//定时器清零
            codeStatus: {
                status: false,//获取验证码时按钮禁用，并显示‘倒计时’
                text: '获取验证码',
            },
            menuTab: [
                {id: 1,txt: '登录',current: true},
                {id: 2,txt: '注册',current: false}
            ],
            formLogin: {
                email: "",
                password: "",
                phone: "",
                code: ""
            },
            rules: {
                email: [
                    { validator: validateEmail, trigger: 'blur' },
                ],
                password: [
                    { validator: validatePassword, trigger: 'blur' }
                ],
                phone: [
                    { validator: validatePhone, trigger: 'blur' }
                ],
                code: [
                    { validator: validateCode, trigger: 'blur' }
                ]
            }    
        };
        

    },
    beforeCreate(){
        
    },
    created(){
    },
    mounted(){
        document.querySelector('body').setAttribute('style', 'background-color:cornflowerblue')
    },
    beforeDestroy(){
        document.querySelector('body').removeAttribute('style')
    },
    methods: {
        //切换tab改变页面
        changeTab(item){
            this.currentNum = item.id
            if(item.id == 2){
                console.log("跳转到注册页面")
                this.$router.push("./SignUp")
            }
        },
        //更新验证码状态
        // updateCodeBtnStatus(params){
        //     this.codeStatus.status = parmas.status;
        //     this.codeStatus.text = parmas.text;
        // },
        //获取验证码
        getCode(){
            let requestData = {
                username: this.formLogin.email,
                module: 'login'//传递模型，后台验证邮箱是否存在
            };
            //前端验证的步骤
            //验证邮箱不能为空
            if(this.formLogin.email === ''){
                this.$message.error('邮箱不能为空！！')
                return false
            };
            //验证提交时的邮箱格式
            if(stripEmail(this.formLogin.email)){
                console.log(this.formLogin.email)
                this.$message.error('邮箱格式不正确！！')
            }
            // this.$options.updateCodeBtnStatus({
            //             status: true,
            //             text: '正在发送中'
            //         })
            this.codeStatus.status = true,
            this.codeStatus.text = '正在发送中',
            this.isLogin = false,
            //请求接口
            //后端返回结果携带验证（防止前端数据没有将邮箱传递到后台）
            setTimeout(() => {
                //延长时间
                    getSms(requestData).then( response =>{
                    console.log(response.data)
                    this.$message({
                        message: response.data.message,
                        type: 'success'
                    });
                    //启用登录或者注册按钮
                    //设置定时器，获取验证码倒计时60s
                    this.countDown(60)
                }).catch( error =>{
                    console.log(error)
                })
            }, 1000);
        },
        
        //提交信息
        submitForm(ruleName){
            alert('点击了提交按钮');
            this.$options.methods.clearCountDown();
            this.$refs[ruleName].validate((valid) => {
                if (valid) {
                    let requestData = {
                        username: this.formLogin.email,
                        password: sha1(this.formLogin.password),
                        code: this.formLogin.code,
                    }
                    Login(requestData).then(response=>{
                        this.$message({
                            message: response.data.message,
                            type: 'success'
                        });
                    }).catch(error=>{
                        console.log(error)
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //重置清空数据
        // resetForm(formLogin){
        //     this.$refs[formLogin].resetFields();
        // },
        /**
         * 倒计时
        */
        countDown(number){
            //判断定时器是否存在，存在就清除；
            if(this.timer){
                clearInterval(this.timer);
            }
            let time = number;
            this.timer = setInterval(()=>{
                time--;
                if(time === 0){
                    //清除倒计时
                    clearInterval(this.timer);
                    // this.$options.updateCodeBtnStatus({
                    //     status: false,
                    //     text: '请重新发送'
                    // })
                    this.codeStatus.text = `请重新发送`;
                    this.codeStatus.status = false;
                }else{
                    this.codeStatus.text = `倒计时${time}s`;
                }
            },1000)
        },
        /**
         * 清除倒计时
        */
        clearCountDown(){
            //还原验证码框内的内容
            // this.$options.updateCodeBtnStatus({
            //     status: true,
            //     text: '获取验证码'
            // })
            this.codeStatus.text = '获取验证码';
            this.codeStatus.status = true;
            //清除倒计时
            clearInterval(this.timer)
        }
    }
}
</script>
<style lang="scss" scoped>
    #login{
        width: 100%;
        min-height: 100%;
        // background-color: cornflowerblue;
        }
    .login-warp{
        width: 300px;
        position: relative;
        margin: 0 auto;
        padding: 100px 35px 0;
    }
    .menu-tab{
        text-align: center;
        li{
            display: inline-block;
            width: 88px;
            line-height: 36px;
            font-size: 14px;
            color: #fff;
            border-radius: 3px;
            cursor: pointer;
        }
        .current{
            background-color: rgba(0, 0, 0, 0.4);
        }
    }
    .formItem{
        margin-top: 10px;
    }
    .loginInput .el-input__inner:focus{
        border-color:sandybrown;
    }
    .submit-btn{
        margin-top: 20px;
    }
    .btn{
        width: 100%;
        margin: 0 auto;
    }
    .labelname{
        color: #fff;
    }
    .el-row {
        &:last-child {
            margin-bottom: 0;
        }
    }
    .el-col {
        border-radius: 4px;
    }
    
</style>