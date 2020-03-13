<template>
  <div>
     <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
   <!-- 卡片视图 -->
  <el-card >
    <el-button type="primary" @click="rolesVisible=true">添加角色</el-button>
      <el-table :data=" rolesList" style="width: 100%" border >
        <!-- 展开列 -->
         <el-table-column type="expand">
           <template slot-scope="scope">
             <!-- 栅格系统的布局 渲染 -->
             <el-row :class="['bdbottom',index1 ===0 ? 'bdtop':'', 'vcenter']" v-for="(item1 , index1) in scope.row.children" :key="item1.id">
               <!-- 渲染一级权限 -->
               <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)"> {{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
               </el-col>
               <!-- 渲染二级和三级权限 -->
               <el-col :span="19">
              <!-- 通过for循环 嵌套渲染二级权限 -->
                  <el-row :class="[index2 ===0 ? '':'bdtop', 'vcenter']"  v-for="(item2,index2) in item1.children" :key="item2.id">
                    <!-- 渲染二级权限 -->
                     <el-col :span="6">
                       <el-tag  type="success" closable @close="removeRightById(scope.row,item2.id)"> {{item2.authName}}</el-tag>
                       <i class="el-icon-caret-right"></i>
                     </el-col>
                     <!-- 渲染三级权限 -->
                     <el-col :span="18">
                            <el-tag  closable v-for="(item3) in item2.children" :key="item3.id" type="warning" @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                     </el-col>
                  </el-row>
               </el-col>
             </el-row>
           </template>
         </el-table-column>
        <!-- 索引列 -->
       <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
      <el-table-column  label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="editDialog(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row)">删除</el-button>
          <el-button size="mini" type="warning" icon="el-icon-s-tools" @click="showSetRightDialog(scope.row)">权限分配</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
     <!-- 添加角色对话框 -->
      <el-dialog title="添加角色" :visible.sync="rolesVisible" width="50%" @close="rolesDialogClosed">
        <!-- 内容主体区域 -->
        <span>
         <el-form label-width="80px" :model="rolesForm"
         ref="roleFormRef">
          <el-form-item label="角色名称" >
            <el-input v-model="rolesForm.roleName" ></el-input>
          </el-form-item>
          <el-form-item label="角色描述" >
            <el-input v-model="rolesForm.roleDesc" ></el-input>
          </el-form-item>
          </el-form>
        </span>
        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
        <el-button @click="rolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑角色对话框 -->
      <el-dialog title="编辑角色" :visible.sync="editRoleVisible" width="50%" @close="editRoleDialogClosed">
        <!-- 内容主体区域 -->
        <span>
         <el-form label-width="80px" :model="editForm"
         ref="editRoleFormRef">
          <el-form-item label="角色名称" >
            <el-input v-model=" editForm.roleName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" >
            <el-input v-model=" editForm.roleDesc" ></el-input>
          </el-form-item>
          </el-form>
        </span>
        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole(editForm.roleId)">提交</el-button>
        </span>
      </el-dialog>
      <!-- 展示分配权限的对话框 -->
      <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
        <!-- 树型控件 -->
        <el-tree show-checkbox :data="rightsTree" :props="treeProps" node-key="id" default-expand-all
         :default-checked-keys="defkeys" ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
  </div>  
</template>

<script>
export default {
  data() {
    return {
      rolesList:[],
      rolesForm:{
        roleName:'',
        roleDesc:'',
      },
      //控制 添加角色对话框显示与隐藏
      rolesVisible:false,
      editForm:{},
      // 控制 编辑角色对话框显示与隐藏
      editRoleVisible:false,
      //控制 分配权限对话框显示与隐藏
      setRightDialogVisible:false,
      //权限 树状数组
      rightsTree:[],
      //树型控件的属性绑定对象
      treeProps:{
        children: 'children',
          label: 'authName'
      },
      //默认选中的权限id值
      defkeys:[],
      //拿到当前角色的id
      roleID:''
    }
  },
  created() {
    this.getRolesList()
  },
  methods:{
    //获取角色列表
   async getRolesList(){
    const {data:res}= await this.axios.get('/roles')
    if(res.meta.status !== 200) return this.$message.error('获取失败')
    this.rolesList = res.data
    this.$message.success('获取角色列表成功')
    },
    
    // 监听添加角色对话框 关闭 ，重置表单
  rolesDialogClosed(){
    this.$refs.roleFormRef.resetFields();
      },
      // 添加角色 对话框显示
    addRole(){
     this.$refs.roleFormRef.validate(async valid =>{
       //表单预验证
       if( !valid) return
       //发送添加角色请求
     const {data:res}= await this.axios.post('/roles',this.rolesForm)
      if(res.meta.status !==201) return this.$message.error('创建失败')
      this.rolesVisible =false
      this.$message.success(res.meta.msg)
      this.getRolesList();
     }) 
    },
    //编辑 角色功能
   async editDialog(id){
    this.editRoleVisible=true
     //根据id查询角色
    const {data:res}= await this.axios.get(`/roles/${id}`)
    if(res.meta.status !==200 ) return this.$message.error('获取失败')
      this.editForm =res.data
      this.$message.success(res.meta.msg)
      
    },
     // 监听编辑角色对话框 关闭 ，重置表单
    editRoleDialogClosed(){
      this.$refs.editRoleFormRef.resetFields();
    },
    //编辑用户角色 提交功能
   async editRole(id){
  const {data:res} = await this.axios.put(`/roles/${id}`,{roleName:this.editForm.roleName,roleDesc:this.editForm.roleDesc})
      if(res.meta.status !== 200) return
      this.$message.success('修改成功')
      this.editRoleVisible=false
      this.getRolesList()
    },
    //删除用户功能
    removeRoleById(id){
     //跳出弹框询问是否删除
      //弹框询问用户是否删除
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data:res} =await this.axios.delete(`/roles/${id}`)
          if(res.meta.status !==200) return this.$message.error('删除失败')
            this.getRolesList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        }); 
    },
    // 根据id删除角色权限
    removeRightById(role,gid){ 
      //弹框提示用户是否删除
     this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
        const {data:res} = await this.axios.delete(`roles/${role.id}/rights/${gid}`)
          if(res.meta.status !== 200) return
         role.children =res.data
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        }); 
    },
    //展示分配权限的对话框
   async showSetRightDialog(role){
     this.roleID=role.id
      //获取所有权限的数据
    const {data:res} = await this.axios.get('rights/tree')
    if(res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightsTree = res.data
      this.$message.success(res.meta.msg)
    console.log(res);
    //遍历循环获取三级节点的id
    this.getLeafKeys(role,this.defkeys)
    
        this.setRightDialogVisible = true
    },
    //通过递归的形式获取角色下三级权限的id 并保存到defkeys数组中
    getLeafKeys(node,arr){
      //如果当前节点没有包含children属性  那它就是三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      //如果当前不是三级节点  那就使用forEach遍历 拿到item继续调用getLeafKeys()
      node.children.forEach(item =>{
        this.getLeafKeys(item,arr)
      })
    },
    //监听分配权限对话框的关闭事件
    setRightDialogClosed(){
      this.defkeys=[]
    },
    //点击为角色分配权限
   async allotRights(){
      const keys=[
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr =keys.join(',')
    const {data:res}= await this.axios.post(`roles/${this.roleID}/rights`,{rids:idStr})
    if(res.meta.status !==200) return 
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }

  }
}
</script>

<style scoped>
  .el-tag {
    margin: 5px;
  }
  .bdtop {
    border-top: 1px solid #ccc;
  }
  .bdbottom {
    border-bottom: 1px solid #ccc;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>