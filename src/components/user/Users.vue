<template>
  <div>
    <!-- 面包屑导航 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
     </el-breadcrumb>
     
     <!-- 卡片视图区 -->
      <el-card class="box-card">
        <!-- 搜索区域 -->
          <el-row :gutter="20">
            <el-col :span="7">
              <el-input  placeholder="请输入内容" v-model="queryInfo.query"  clearable @clear="getUserList">
                <!-- 点击搜素  调用getUserList 渲染列表 -->
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
              </el-input>
            </el-col>
            <!-- 添加区域 -->
            <el-col :span="3">
              <el-button  type="success" @click="dialogVisible=true">添加用户</el-button>
            </el-col>
          </el-row>
          <!-- 用户列表区域 -->
          <el-table :data="userlist" style="width: 100%" border>
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="username" label="姓名" width="180"> </el-table-column>
            <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
            <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
            <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
            <el-table-column prop="mg_state" label="状态" width="180">
              <template slot-scope="scope">
                <!-- {{scope.row}}表示拿到当前用户的数据 -->
                <!-- {{scope.row}} -->
                <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)" ></el-switch>
              </template>
            </el-table-column>
            <el-table-column  label="操作" >
              <template slot-scope="scope">
                <!-- {{scope.row}} -->
                <!-- 修改按钮 -->
                 <el-button type="primary" icon="el-icon-edit" circle @click="showDialog(scope.row.id)"></el-button>
                 <!-- 删除按钮 -->
                 <el-button type="danger" icon="el-icon-delete" circle @click="deleteuser(scope.row.id)"></el-button>
                 <!-- 分配角色按钮 -->
                   <el-button type="warning" icon="el-icon-setting" circle></el-button> 
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页功能 -->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 3, 4]" :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-card>
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addDialogClosed">
        <!-- 内容主体区域 -->
        <span>
         <el-form label-width="80px" :model="addForm" :rules="addFormRules"
         ref="addFormRef">
          <el-form-item label="用户名" prop="username" >
            <el-input v-model="addForm.username" prefix-icon="iconfont icon-user" ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" >
            <el-input v-model="addForm.password" prefix-icon="iconfont icon-3702mima" type="password" ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" >
            <el-input v-model="addForm.email" prefix-icon="el-icon-s-promotion" ></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile" prefix-icon="el-icon-phone" ></el-input>
          </el-form-item>
          </el-form>
        </span>
        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户信息对话框 -->
      <el-dialog title="修改用户信息" :visible.sync="showEditDialog" width="50%" @close="editDialogClosed">
        <!-- 内容主体区域 -->
        <span>
         <el-form label-width="80px" :model="editForm" :rules="addFormRules"
         ref="editFormRef" >
          <el-form-item label="用户名" prop="username" >
            <el-input v-model="editForm.username" prefix-icon="iconfont icon-user" :disabled="true" ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" >
            <el-input v-model="editForm.email" prefix-icon="el-icon-s-promotion" ></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile" prefix-icon="el-icon-phone" ></el-input>
          </el-form-item>
          </el-form>
        </span>
        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editFormChanged(editForm.id)">提交</el-button>
        </span>
      </el-dialog>
  </div>  
</template>

<script>
export default {
    data(){
      //验证手机号规则
        var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
          console.log(reg.test(value));
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
        };
      return {
       //获取用户列表的参数对象
       queryInfo:{
         query:'',
         pagenum:1,//当前页码值
         pagesize:2,//每页显示2条数据
       },
       userlist:[],
       total:0,//总数据条数
       //控制添加用户对话框显示与隐藏
       dialogVisible:false,
      //  控制修改用户信息对话框显示与隐藏
      showEditDialog:false,
       addForm:{
         username:'',
         password:'',
         email:'',
         mobile:''
       },
       editForm:{},
       //验证规则
       addFormRules:{
         	//验证用户名
				username:[
					{ required: true, message: '请输入用户名名称', trigger: 'blur' },
					{ min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
					],
					// 验证密码
					password:[
						{ required: true, message: '密码不能为空', trigger: 'blur' },
						{ min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
          ],
          //验证邮箱
          email:[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
          ],
          //验证手机
          mobile:[
            { required: true, message: '请输入手机号', trigger: 'blur' },
             {validator: checkPhone, trigger: 'blur'}
          ]
       },
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      //发送gei请求获取获取用户数据列表
      async getUserList(){
        //get请求用params 传递参数
     const {data:res} = await this.axios.get('users',{params:this.queryInfo})
      
      if(res.meta.status !== 200) return this.$message.error('获取管理员列表失败');
        this.userlist = res.data.users
        this.total = res.data.total
     
      },
      //监听pagesize改变的事件
      handleSizeChange(newSize){
        // console.log(newSize);
        this.queryInfo.pagesize=newSize;
        //重新渲染列表
        this.getUserList()

        
      },
      //监听页面值改变的事件
      handleCurrentChange(newPage){
        // console.log(newPage);
        this.queryInfo.pagenum =newPage;
        this.getUserList()
        
      },
      //监听switch开关状态的改变
     async userStateChange(userInfo){
        // 发送修改用户状态请求
     const {data :res} = await this.axios.put(`/users/${userInfo.id}/state/${userInfo.mg_state}`)
     if(res.meta.status !== 200){
       userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('设置状态失败')
     }
        this.$message.success(res.meta.msg) ;
          
      },
      // 监听添加用户对话框的关闭事件  重置表单
      addDialogClosed(){
        this.$refs.addFormRef.resetFields()
      },
      // 点击按钮添加新用户
      addUser(){
        this.$refs.addFormRef.validate(async valid =>{
          if(!valid) return
          //可以发起添加用户网络请求
        const {data:res}= await this.axios.post('/users',this.addForm)
          if(res.meta.status !==201) return this.$message.error('创建失败')
          this.$message.success(res.meta.msg)
          //重新渲染列表
          this.getUserList();
          //隐藏对话框
           this.dialogVisible = false
        })
      },
      // 点击修改按钮 显示修改对话框
     async showDialog(userId){
        this.showEditDialog=true
        //拿到用户id 发送请求根据 ID 查询用户信息
      const {data:res}= await this.axios.get(`/users/${userId}`)
      if(res.meta.status !==200) return this.$message.error('获取失败')
      this.editForm=res.data
      },
      //监听修改用户对话框的关闭事件，重置表单
      editDialogClosed(){
        this.$refs.editFormRef.resetFields()
      },      
      //点击提交按钮  发送请求修改用户资料
     editFormChanged(id){
       this.$refs.editFormRef.validate(async valid =>{
         if( !valid) return
       const {data:res}= await this.axios.put(`/users/${id}`,{email:this.editForm.email,mobile:this.editForm.mobile})
        if(res.meta.status !==200) return this.$message.error('修改失败')
        this.$message.success(res.meta.msg)
        this.getUserList();
        this.showEditDialog=false
         }
       )
      },
      //点击删除按钮 发送请求删除用户
     async deleteuser(id){
      const {data:res} =await this.axios.delete(`/users/${id}`)
      if(res.meta.status !==200) return this.$message.error('删除失败')
      this.$message.success(res.meta.msg)
      this.getUserList()
      }
    },
}
</script>

<style scoped>

</style>