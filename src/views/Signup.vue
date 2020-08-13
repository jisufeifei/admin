<template>
    <div id="signup" v-title data-title="注册">
        <div class="signup-warp">
            <ul class="menu-tab" >
                <li  v-for="(item,index) in menuTab" :key="item.id" @click="changeTab(item)" :class='[ currentNum == index + 1  ? "current" : ""]'>{{item.txt}}</li>
            </ul>
            <!-- 表单提交 start -->
            <el-form :model="formSignup" :rules="rules" ref="ruleSignup">
                <el-form-item prop="userName"> 
                    <label class="labelname username">用户名</label>
                    <el-input class="loginInput" type="text" v-model="formSignup.userName" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="email" class="formItem">
                    <label class="labelname email">邮箱</label>
                    <el-input class="loginInput" type="text" v-model="formSignup.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item prop="password" class="formItem">
                    <label class="labelname password">密码</label>
                        <el-input class="loginInput" type="password" v-model="formSignup.password" show-password placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item prop="passwordConfirm" class="formItem">
                    <label class="labelname password">确认密码</label>
                        <el-input class="loginInput" type="password" v-model="formSignup.passwordConfirm" show-password placeholder="请确认密码"></el-input>
                </el-form-item>
                <el-form-item prop="phone" class="formItem">
                    <label class="labelname phone">手机号码</label>
                        <el-input class="loginInput" type="text" v-model="formSignup.phone" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item prop="code" class="formItem">
                    <label class="labelname code">验证码</label>
                    <el-row type="flex" :gutter="2" justify="space-between">
                        <el-col :span="14">
                                <el-input class="loginInput" type="text" v-model="formSignup.code" placeholder="请输入验证码"></el-input>
                        </el-col>
                        <el-col :span="9">
                            <el-button type="success" @click="getCode()" :disabled="codeStatus.status">{{codeStatus.text}}</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item class="submit-btn">
                    <el-button class="btn primary" size="medium" type="primary"  @click="submitForm('ruleSignup')" :disabled="isSignUp">注册</el-button>
                    <el-button class="btn cancel" size="medium" type="info" @click="resetForm('ruleSignup')">取消</el-button>
                </el-form-item>
            </el-form>
            <!-- 表单提交 end -->
        </div>
        <router-view />
    </div>
</template>
<script>
import sha1 from 'js-sha1'
import { getSms, Register } from '@/api/login'
import SignUpComponents from "@/components/login/SignUpComponents"
import { stripUsername, stripscript, stripEmail, stripPassword, stripPhone } from "@/utils/validate"
export default {
    name: "SignUp",
    components: {
        SignUpComponents
    },
    data(){
        /*
        * 验证用户名
        */
        var validateUserName = (rule,value,callback)=>{
            if(value == ""){
                callback(new Error("请输入用户名"))
            }else if(stripUsername(value)){
                callback(new Error("用户名为4-16位(字母，数字，_，-)"))
            }else{
                callback()
            }
        }
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
        var validatePass = (rule,value,callback)=>{
            if( value === "" ){
                callback(new Error("请输入密码"))
            }else if(stripPassword(value)){
                callback(new Error("密码为6-20位数字与字母的组合"))
            } else {
                callback();
            }
        };
        /*
        * 验证密码进行确认，是否两次密码相同
        */
        var validatePassConfirm = (rule,value,callback)=>{
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.formSignup.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        /*
        * 验证手机号码
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
        var updateCodeBtnStatus = (params) => {
            this.codeStatus.status = params.status;
            this.codeStatus.text = params.text;
        }
        return {
            currentNum: 2,
            isSignUp: true,//提交按钮‘禁用’
            timer: null,//倒计时
            menuTab: [
                {id: 1,txt: '登录',current: false},
                {id: 2,txt: '注册',current: true}
            ],
            codeStatus: {
                status: false,//获取验证码时按钮禁用，并显示‘倒计时’
                text: '获取验证码',
            },
            formSignup: {
                userName: "",
                email: "",
                password: "",
                passwordConfirm: "",
                phone: "",
                code: ""
            },
            rules: {
                userName: [
                    { validator: validateUserName, trigger: 'blur' },
                ],
                email: [
                    { validator: validateEmail, trigger: 'blur' }
                ],
                password: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                passwordConfirm: [
                    { validator: validatePassConfirm, trigger: 'blur' }
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
        document.querySelector('body').setAttribute('style', 'background-color:cornflowerblue');
    },
    beforeDestroy(){
        document.querySelector('body').removeAttribute('style')
    },
    methods: {
        changeTab(item){
            this.currentNum = item.id
            if(item.id == 1){
                console.log("跳转到登录页面")
                this.$router.push("./Login")
            }
        },
        // //更新验证码状态
        // updateCodeBtnStatus(params){
        //     this.codeStatus.status = parmas.status;
        //     this.codeStatus.text = parmas.text;
        // },
        getCode(){
            let requestData = {
                username: this.formSignup.email,
                module: 'register'//传递模型，后台验证邮箱是否存在
            };
            //前端验证的步骤
            //验证邮箱不能为空
            if(this.formSignup.email === ''){
                this.$message.error('邮箱不能为空！！')
                return false
            };
            //验证提交时的邮箱格式
            if(stripEmail(this.formSignup.email)){
                console.log(this.formSignup.email)
                this.$message.error('邮箱格式不正确！！')
            }
            
            //请求接口
            //后端返回结果携带验证（防止前端数据没有将邮箱传递到后台）
            updateCodeBtnStatus({
                text: '正在发送中',
                status: true,
            });
            // this.codeStatus.status = true  //更改‘获取验证码’的状态，不可点击
            // this.codeStatus.text = `正在发送中`;
            this.isSignUp = false,
            
            //设置倒计时
            setTimeout(() => {
                getSms(requestData).then( response =>{
                    console.log(response.data)
                    this.$message({
                        message: response.data.message,
                        type: 'success'
                    });
                    this.countDown(10)
                }).catch( error =>{
                    console.log(error)
                })
            }, 1000);
            
        },
        submitForm(ruleName){
            const that = this;
            this.$options.methods.clearCountDown(that);
            this.$refs[ruleName].validate((valid) => {
                if (valid) {
                    let requestData = {
                        username: this.formSignup.email,
                        password: sha1(this.formSignup.password) ,
                        code: this.formSignup.code,
                        module: 'register'
                    };
                    Register(requestData).then(response => {
                        console.log(response.data)
                        this.$message({
                            message: response.data.message,
                            type: 'success'
                        })
                        this.$router.push({path: "/login"})
                    }).catch(error =>{
                        console.log(error)
                        clearInterval(this.timer);
                        this.codeStatus.text = `请重新发送`;
                        this.codeStatus.status = false;
                        //失败时执行的代码
                        // this.$message({
                        //     message: error.data.message,
                        //     type: 'error'
                        // })
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formSignup){
            this.$refs[formSignup].resetFields();
            this.$router.push("./Login")
        },
        /**
         * 倒计时
        */
        countDown(number){
            let time = number;
            this.timer = setInterval(()=>{
                time--;
                if(time === 0){
                    clearInterval(this.timer);
                    updateCodeBtnStatus({
                        text: `请重新发送`,
                        status: false,
                    })
                    // this.codeStatus.text = `请重新发送`;
                    // this.codeStatus.status = false;
                }else{
                    this.codeStatus.text = `倒计时${time}s`;
                }
            },1000)
            
        },
        /**
         * 清除倒计时
        */
        clearCountDown(that){
            //还原验证码框内的内容
            updateCodeBtnStatus({
                text: `获取验证码`,
                status: true,
            })
            // that.codeStatus.text = '获取验证码';
            // that.codeStatus.status = false;
            //清除倒计时
            clearInterval(this.timer)
        }
    }
}
</script>
<style lang="scss" scoped>
    #signup{
        width: 100%;
        min-height: 100%;
        // background-color: cornflowerblue;
        }
    .signup-warp{
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
    .loginInput .el-input__inner:focus{
        border-color:sandybrown;
    }
    .formItem{
        margin-top: 10px;
    }
    .submit-btn{
        margin-top: 20px;
    }
    .btn{
        width: 100%;
    }
    .btn.cancel{
        margin-left: 0;
        margin-top: 10px;
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