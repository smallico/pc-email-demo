<template>
  <div>
    <el-card>
      <el-form
        label-width="150px"
        ref="dialogForm"
        style="width:500px;"
        v-if="activeName=='business'"
      >
        <el-form-item label="序号">
          <el-input :value="dialogForm.logId" disabled></el-input>
        </el-form-item>
        <el-form-item label="发文时间/收文时间">
          <el-input :value="timestampFormateDate(dialogForm.logTime)" disabled></el-input>
        </el-form-item>

        <el-form-item label="发件人/终端(单位)">
          <el-input :value="dialogForm.sender" disabled></el-input>
        </el-form-item>

        <el-form-item label="收件人/收件单位">
          <el-input :value="dialogForm.receiver" disabled></el-input>
        </el-form-item>
        <el-form-item label="收发标识">
          <el-input :value="dialogForm.ioType === '1' ? '发' : '收'" disabled></el-input>
        </el-form-item>
        <el-form-item label="发文编号">
          <el-input :value="dialogForm.fileNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="文件类型">
          <el-input :value="dialogForm.mailType" disabled></el-input>
        </el-form-item>
        <el-form-item label="密级">
          <el-input :value="dialogForm.mailElevel" disabled></el-input>
        </el-form-item>
        <el-form-item label="紧急">
          <el-input :value="dialogForm.mailSlevel" disabled></el-input>
        </el-form-item>
        <el-form-item label="主题">
          <el-input :value="dialogForm.mailSubject" disabled></el-input>
        </el-form-item>
      </el-form>
      <el-form
        label-width="120px"
        ref="dialogForm"
        style="width:800px;"
        v-if="activeName=='run'||activeName=='error'"
      >
        <el-form-item label="序号">
          <el-input :value="dialogForm.logId" disabled></el-input>
        </el-form-item>
        <el-form-item label="日志时间">
          <el-input :value="timestampFormateDate(dialogForm.logTime)" disabled></el-input>
        </el-form-item>
        <el-form-item label="所在节点">
          <el-input :value="dialogForm.logNode" disabled></el-input>
        </el-form-item>
        <el-form-item label="模块名称">
          <el-input :value="dialogForm.moduleName" disabled></el-input>
        </el-form-item>

        <el-form-item label="行号">
          <el-input :value="dialogForm.lineNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="运行状态">
          <el-input
            :value="dialogForm.runType == 0 ? '启动' : dialogForm.runType == 1 ? '停止' : '健康监测'"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="是否异常">
          <el-input :value="dialogForm.iserror == 1 ? '异常' : '正常'" disabled></el-input>
        </el-form-item>
        <el-form-item label="日志内容">
          <el-input :value="dialogForm.logContent" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { request } from "../../../api/data-api";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      activeName: "business",
      datalist: [],
      dialogForm: {},
      loading: false
    };
  },
  created() {
    let activeName = this.$store.state.activeName
    console.log("activeName:",activeName)
    if(activeName){
      this.activeName = activeName
    } else {
      this.activeName = sessionStorage.getItem("activeName")
    }
    this.checkDetail(1);
  },
  methods: {
    //查看日志详细信息
    checkDetail(row) {
      var url = "";
      if (this.activeName == "business") {
        url = "/recordLogDetail";
      } else if (this.activeName == "error") {
        url = "/seviceLogDetail";
      } else {
        url = "/seviceLogDetail";
      }
      request(url, data => {
        this.dialogForm = data.selectById;
      });
    }
  }
};
</script>
<style scoped>
</style>


