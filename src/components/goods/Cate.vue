<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        border
      >
        <!-- 是否有效模板 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:green"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序模板 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作模板 -->
        <template slot="edit" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit"
            >操作</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteCate(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="parameterInfo.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="parameterInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        label-width="100px"
        ref="addCateFormRef"
        :model="addCateForm"
        :rules="addCateFormRules"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            expand-trigger="hover"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //获取商品分类列表的参数对象
      parameterInfo: {
        type: "",
        pagenum: 1,
        pagesize: 5
      },
      //商品分类 数组
      cateList: [],
      //总数据条数
      total: 0,
      //为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          // 表示将当前列定义为模板列
          type: "template",
          //使用的模板名称
          template: "isok"
        },
        {
          label: "排序",
          // 表示将当前列定义为模板列
          type: "template",
          //使用的模板名称
          template: "order"
        },
        {
          label: "操作",
          // 表示将当前列定义为模板列
          type: "template",
          //使用的模板名称
          template: "edit"
        }
      ],
      //控制添加分类对话框显示与隐藏
      addCateDialogVisible: false,
      //添加分类 表单对象
      addCateForm: {
        //父级分类id
        cat_pid: 0,
        cat_name: "",
        //分类的等级 默认一级分类
        cat_level: 0
      },
      //添加分类 表单验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      //父级分类数据列表
      parentCateList: [],
      //指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //选中的父级分类的id数组
      selectedKeys: []
    };
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    //获取商品分类数据列表
    async getCategoryList() {
      const { data: res } = await this.axios.get("/categories", {
        params: this.parameterInfo
      });
      if (res.meta.status !== 200) return;
      this.$message.success(res.meta.msg);
      this.cateList = res.data.result;
      this.total = res.data.total;
      console.log(res.data);
    },
    //监听pagesize改变事件
    handleSizeChange(newSize) {
      this.parameterInfo.pagesize = newSize;
      this.getCategoryList();
    },
    //监听pagenum改变事件
    handleCurrentChange(newPage) {
      this.parameterInfo.pagenum = newPage;
      this.getCategoryList();
    },
    //显示添加分类对话框
    showAddCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    //获取分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.axios.get("/categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类数据失败");
      }
      this.parentCateList = res.data;
      console.log(res.data);
    },
    //级联选择器选择项发生变化触发该函数
    parentCateChange() {
      console.log(this.selectedKeys);
      //如果selectedKeys 数组中的length 大于0，证明选中了父级分类
      //反正就没有选中
      if (this.selectedKeys.length > 0) {
        //为父级分类id赋值
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        //为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        //为当前分类的等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    //点击按钮 添加新版分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.axios.post(
          "/categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败");
        }
        this.getCategoryList();
        this.addCateDialogVisible = false;
      });
    },
    //监听对话框的关闭事件 ，重置表单
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
      this.addCateDialogVisible = false;
    },
    //点击按钮 删除分类
    async deleteCate(row) {
      const { data: res } = await this.axios.delete(
        `/categories/${row.cat_id}`
      );
      if (res.meta.status !== 200) return;
      this.getCategoryList();
      this.$message.success(res.meta.msg);
    }
  }
};
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
