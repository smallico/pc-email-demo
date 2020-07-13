<template>
  <div>
    <el-card>
      <el-form :model="form" style="width: 800px;">
        <el-form-item label="文件" :label-width="formLabelWidth">
          <input type="file" ref="file">
        </el-form-item>
        <el-form-item label="版本号" :label-width="formLabelWidth">
          <el-input v-model="form.versionId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="版本描述" :label-width="formLabelWidth">
          <el-input v-model="form.versionDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-footer style="text-align: right;">
        <el-button @click="cancel" size="small">取 消</el-button>
        <el-button type="primary" @click="sure" size="small">确定</el-button>
      </el-footer>
    </el-card>
  </div>
</template>
<script>
import { request } from "../../../api/data-api";
export default {
  data() {
    return {
      fileName: "帮助文档.zip",
      updateTime: "2019-09-09 11:03:02",
      url: "/data/acc/test/",
      formLabelWidth: "120px",
      total: 100,
      dataList: [],
      uploadList: {
        terminalId: 1,
        versionId: 1
      },
      form: {
        versionId: "",
        versionDesc: ""
      },
    };
  },
  created() {
    console.log(this.$store.state.menuList)
    },
  methods: {
    //选择文件
    addFiles() {
      this.$message({
        message: "更新成功",
        type: "success"
      });
      console.log(this.$refs.file.files[0]);  
      this.fileName = this.$refs.file.files[0].name;
      this.updateTime = this.timestampFormateDate(new Date());
      this.url = "/hlep/acc/test/";
    },
    cancel() {
      this.$router.go(-1)
    },
    sure() {
      var userId = sessionStorage.getItem("userId");
      if (this.$refs.file.files.length == 0) {
        this.$message({
          message: "请上传文件",
          type: "warning"
        });
        return;
      } else if (this.form.versionId == ""){
        this.$message({
          message: "请填写版本号",
          type: "warning"
        });
        return;
      } else if (this.form.versionDesc == ""){
        this.$message({
          message: "请填写版本描述",
          type: "warning"
        });
        return;
      } else {
        /*console.log(this.$refs.file.files);
        var form = new FormData();
        console.log(this.$refs.file.files[0].name,"filename")
        form.append("file", this.$refs.file.files[0]);
        form.append("versionDesc", this.form.versionDesc);
        form.append("versionId", this.form.versionId);
        form.append("userId", userId); */
        /* this.$http
          .insertAgent(form)
          .then(data => {
            console.log(data);
            this.selectAgent();
          })
          .catch(res => {
            console.log(res);
          }); */
        this.form.uploadTime = new Date().getTime();
        this.form.filePath = "E:/semail/file";
        this.form.uploadUser = "admin";
        this.form.versionMd5 = "7070cc57ec46aba7528972ceaa93cce6";
        this.form.terminalNum = 100;
        this.dataList.unshift(this.form);
        let versionList = sessionStorage.getItem("versionList")
        versionList = JSON.parse(versionList)
        versionList.findForPage.result.unshift(this.form)
        versionList.findForPage.total += 1
        console.log("versionList:", versionList)
        sessionStorage.setItem("versionList", JSON.stringify(versionList))
        this.$router.go(-1)
        // this.dialogFormVisible = false;
      }
    },
  }
};
</script>
<style lang="scss" scoped>

</style>


