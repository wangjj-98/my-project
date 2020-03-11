<!--  -->
<template>
  <div>
    <el-button type="danger" round @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    logout() {
      //清除token
      window.sessionStorage.clear();
      //跳转 /login
      this.$router.push("/login");
    }
  }
};
</script>
<style scoped>
</style>