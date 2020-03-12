<!--  -->
<template>
 
    
    <el-container class="home_container">
        <!-- 头部区域 -->
        <el-header>
          <div>
            <img src="../assets/heima.png" alt="">
            <span>电商后台管理系统</span>
          </div>
          
          <el-button type="danger" round @click="logout">退出</el-button>
        </el-header>
        <!-- 内容主体区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isFlag ? '65px' : '200px' ">
          <!-- 收缩侧边栏 -->
          <div class="toggle-button" @click="toggle">| | |</div>
          <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b"
           :unique-opened="true" :collapse="isFlag" :collapse-transition="false" :router="true"
           :default-active="activePath" >
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 一级菜单中的二级菜单 -->
              <el-menu-item-group v-for="subitem in item.children" :key='subitem.id' >
                  <el-menu-item :index="'/'+subitem.path" class="el-icon-menu" @click="saveNavState('/'+subitem.path)">  {{subitem.authName}}</el-menu-item>
              </el-menu-item-group>
          </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧主体内容 -->
        <el-main>
          <!-- home子组件出口 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

  
</template>

<script>
export default {
  data() {
    return {
      //左侧菜单数据
      menulist:[],
      //字体图标对象
      iconObj:{
        '125':'el-icon-user-solid',
        '103':'el-icon-more',
        '101':'el-icon-s-goods',
        '102':'el-icon-s-order',
        '145':'el-icon-s-data'
      },
      isFlag:false,
      // 被激活的链接地址
      activePath:''
    };
  },
  // 组件被创建的时候
  created() {
    //获取所有的左侧菜单
    this.getMenuList(),
    //拿到 activePath 去渲染二级菜单
    this.activePath=window.sessionStorage.getItem('activePath')
    
  },
  methods: {
    logout() {
      //清除token
      window.sessionStorage.clear();
      //跳转 /login
      this.$router.push("/login");
    },
    //获取所有的左侧列表菜单
   async getMenuList(){
     //解构赋值 data并重命名为res
    const {data:res} = await this.axios.get('/menus')
   //如果请求失败
    if(res.meta.status !==200){
    return  this.$message.error('获取菜单列表失败')
    } else{
    //请求成功
    this.menulist=res.data
      }
    },
    //点击按钮菜单栏折叠或展开
    toggle(){
      this.isFlag = !this.isFlag
    },
    //保存链接的激活状态  点击二级菜单的时候把路径(比如 /users)存在sessionStorage中 
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath
    }
  }
};
</script>
<style scoped>
.home_container {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-header div  {
  display: flex;
  align-items: center;
  font-size: 24px;
  color:beige;
}
.el-header div  span {
  margin-left: 15px;
}

.el-aside {
  background-color: #333744;
}
.el-aside .el-menu {
  border-right: none;
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button {
  text-align: center;
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  cursor: pointer;
}
</style>