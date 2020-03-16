<template>
  <div>
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <!-- 标签页 -->
    <el-tabs tab-position="left" @tab-click="change" v-model="activeName">
      <el-tab-pane label="基本信息" name="0">
        <!-- 基本信息表单 -->
        <el-form ref="form" :model="addForm" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="addForm.goods_cat"
              :options="options"
              :props="props"
              expand-trigger="hover"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio-group v-model="addForm.is_promote">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="next">下一步</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="1">
        <!-- 照片上传 -->
        <!-- action 指定图片上传地址 -->
        <el-upload
          class="upload-demo"
          action="http://127.0.0.1:8888/api/private/v1/upload"
          list-type="picture"
          :headers="headers"
          :on-success="success"
          :on-remove="remove"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
        <el-button type="primary" @click="next2" class="mg_bottom"
          >下一步</el-button
        >
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="2">
        <quill-editor class="myEditor" v-model="addForm.goods_introduce" />
        <el-button type="primary" @click="addGood">完成</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      addForm: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        is_promote: true,
        goods_cat: [],
        //接收上传成功的图片信息
        pics: [],
        goods_introduce: ""
      },
      options: [],
      props: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      activeName: "0",
      headers: {
        Authorization: sessionStorage.getItem("token")
      }
    };
  },
  methods: {
    change(tab) {
      this.active = Number(tab.index);
    },
    //下一步
    next() {
      this.active = 1;
      this.activeName = "1";
    },
    //文件上传成功 保存路径
    success(res) {
      this.addForm.pics.push({
        pic: res.data.tmp_path
      });
    },
    remove(file) {
      let tempPath = flie.response.tmp_path;
      //在数组中找到tempPath 对应的数组下标
      let idx = this.addForm.pics.findIndex(item => item.pic === tempPath);
      this.addForm.pics.splice(idx, 1);
    },
    //去第三步
    next2() {
      this.active = 2;
      this.activeName = "2";
    },
    //发送请求添加数据
    async addGood() {
      const { data: res } = await this.axios.post("/goods", {
        ...this.addForm,
        goods_cat: this.addForm.goods_cat.join()
      });
      if (res.meta.status !== 201) return;
      this.$message.success(res.meta.msg);
      this.$router.push("/goods");
    }
  },
  async created() {
    //发生请求获取级联数据
    const { data: res } = await this.axios.get("/categories?type=3");
    if (res.meta.status !== 200) return;
    this.options = res.data;
    console.log(res);
  }
};
</script>

<style scoped>
.mg_bottom {
  margin-top: 400px;
}
.myEditor {
  background-color: #fff;
}
.myEditor /deep/.ql-editor {
  height: 300px;
}
</style>
