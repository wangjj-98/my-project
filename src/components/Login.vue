<template>
<div class="login_container">
   <div class="login_box">
       <!-- 头像 -->
       <div class="avatr_box">
         <img src="../assets/logo.png" alt="">
       </div>
       <!-- 登录表单 -->
<el-form ref="loginFormRef" :rules="loginRules" :model="loginForm" label-width="100px" class="login_form">
	<!-- 用户名 -->
  <el-form-item label="用户名" prop="username">
    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
  </el-form-item>
	<!-- 密码 -->
  <el-form-item label="密码" prop="password">
    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
  </el-form-item>
  <el-form-item class="btns">
    <el-button type="success" @click="onSubmit">登录</el-button>
    <el-button type="info" @click="onReset">重置</el-button>
  </el-form-item>
</el-form>
   </div>
</div>
  
</template>

<script>
export default {
     data() {
      return {
          //登录表单的数据对象
        loginForm: {
          username:'',
          password:'',
				},
				//表单验证规则对象
				loginRules:{
					//验证用户名
				username:[
					{ required: true, message: '请输入用户名名称', trigger: 'blur' },
					{ min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
					],
					// 验证密码
					password:[
						{ required: true, message: '密码不能为空', trigger: 'blur' },
						{ min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
					]
    		}
      }
     },
       methods: {
				//表单提交方法
      onSubmit() {
        this.$refs.loginFormRef.validate(async (valid)=>{
					//如果valid 不为true
				if(!valid) 	return;
				//{data:res}  结构data属性并重命名为res
			const{data:res }=await	this.axios.post('/login',this.loginForm);
			//如果status 不等于200 弹出一个错误提示框
			if(res.meta.status !== 200) return  this.$message.error('登录失败！');
				this.$message.success('登录成功!')
				//一 登录成功之后将token保存到客户端的sessionStorage中
					//1.项目的其他API接口必须登录成功才能访问
					//2.之所以将token保存在sessipnStorage中，是因为token只应在当前网站打开期间生效
					window.sessionStorage.setItem('token',res.data.token)
				//二.通过编程式导航跳转/home主页
				this.$router.push('/home')
		
			
			
			
			
					
				})
			},
			//点击按钮重置表单
			onReset(){
				// console.log(this.$refs);
				this.$refs.loginFormRef.resetFields();
				
			}
    },
    


}
</script>

<style  scoped>
    .login_container{
        height: 100%;
        background-color: #2b4b6b;
    }
    .login_box {
        width:450px ;
        height: 300px;
        background-color: #fff;
        border-radius: 10px;
        position: absolute;
       left: 50%;
       top: 50%;
       transform: translate(-50%,-50%);

    }
    .avatr_box {
        position: absolute;
        left: 50%;
        top: -75px;
        transform: translateX(-50%);
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background-color:antiquewhite;
        border: 1px solid #ccc;
        text-align: center;
        padding: 2px;

    }
    .avatr_box img {
        width: 80%;
        height: 80%;
        margin-top: 25px;
    }
    .btns{
        display: flex;
        justify-content:center;
    }
    .login_form {
        position: absolute;
        bottom: 0;
        width: 80%;
    }

    
</style>