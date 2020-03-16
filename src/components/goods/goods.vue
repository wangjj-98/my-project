<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <!-- 点击搜素  调用getUserList 渲染列表 -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加区域 -->
        <el-col :span="3">
          <el-button type="success" @click="$router.push('/goods-add')"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 商品列表区域 -->
      <el-table :data="goodsList" border style="width: 100%">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="400">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="150">
        </el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="150">
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >修改</el-button
            >
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    //发生请求 获取商品列表
    async getGoodsList() {
      const { data: res } = await this.axios.get("/goods", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) return;
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      console.log(res);
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    //监听页面值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    }
  }
};
</script>

<style></style>
