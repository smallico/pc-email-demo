<template>
  <div>
    <el-table :data="assessList" ref="table" style="width:100%">
      <el-table-column prop="systermNum" label="系统编号"></el-table-column>
      <el-table-column prop="applyUnion" label="申请单位"></el-table-column>
      <el-table-column prop="applicant" label="申请人"></el-table-column>
      <el-table-column prop="applyInstruction" label="申请描述"></el-table-column>
      <el-table-column prop="state" label="审批状态">
        <template slot-scope="scope">
          <span>{{scope.row.state==0?'未审批':'审批通过'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <div v-if="scope.row.state==0">
            <el-button type="text" @click="toCheck(scope.$index)">审批</el-button>
          </div>
          <div v-else>
            <el-button type="text" @click="setConfig(scope.$index)">参数配置</el-button>
            <el-button type="text" v-if="scope.row.isStart==0" @click="switchStart(scope.row,1)">启动</el-button>
            <el-button type="text" v-else @click="switchStart(scope.row,0)">停止</el-button>
            <el-button type="text" @click="statistics(scope.row)">收发统计</el-button>
            <el-button type="text" @click="deleteItem(scope.$index)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-div">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :total="total"
      ></el-pagination>
    </div>
    <!-- <el-dialog title="系统参数配置" :visible.sync="configDialogVisible">
      <el-form :model="configForm" ref="configForm">
        <el-form-item label="IP地址" :label-width="formLabelWidth" prop="ip">
          <el-input v-model="configForm.ip" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="端口" :label-width="formLabelWidth" prop="port">
          <el-input v-model="configForm.port" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="认证口令" :label-width="formLabelWidth" prop="authorToken">
          <el-input v-model="configForm.authorToken" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="接收地址" :label-width="formLabelWidth" prop="address">
          <el-input v-model="configForm.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="接收口令" :label-width="formLabelWidth" prop="receiveToken">
          <el-input v-model="configForm.receiveToken" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('configForm')" size="small">取 消</el-button>
        <el-button type="primary" @click="submitCofig" size="small">保存</el-button>
      </div>
    </el-dialog>-->
    <el-dialog title="审批" :visible.sync="checkDialogVisible">
      <el-form :model="checkForm" ref="checkForm">
        <el-form-item label="审批意见" :label-width="formLabelWidth" prop="checkReason">
          <el-input v-model="checkForm.checkReason" auto-complete="off" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="agreeCheck" size="small">同意</el-button>
        <el-button type="danger" @click="refusCheck" size="small">驳回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { request } from "../../../api/data-api";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      assessList: [],
      total: 100,
      configForm: {
        ip: "10.10.8.10",
        port: "4567",
        authorToken: "afdce009833dss",
        address: "http://10.10.8.100:9808/api/test",
        receiveToken: "aced5433ds30"
      },
      // configDialogVisible: false,
      formLabelWidth: "120px",
      checkDialogVisible: false,
      checkForm: {
        checkReason: ""
      },
      currentIndex: 0
    };
  },
  created() {
    // 获取sessionStorg的值
    let accessList = JSON.parse(sessionStorage.getItem("AssessList"));
    // 如果存在修改后的值，那么就将已修改的内容存放在vuex中，并赋值到当前
    if (accessList) {
      accessList = accessList.list;
      this.$store.commit("updateAssessList", accessList);
      this.assessList = accessList;
      this.total = accessList.length;
    } else {
      this.getList();
    }
  },
  methods: {
    //获取列表
    getList() {
      request("/assessList", data => {
        this.assessList = data.findForPage.result;
        this.total = data.findForPage.total;
        console.log(this.assessList);
      });
    },
    //分页
    handleCurrentChange(val) {},
    //去审核
    toCheck(index) {
      this.checkDialogVisible = true;
      this.currentIndex = index;
      setTimeout(() => {
        this.cancel("checkForm");
      }, 200);
    },
    //参数配置
    setConfig(index) {
      let assessList = this.assessList;
      this.$store.commit("updateAssessList", assessList);
      this.$store.commit("updateAssessIndex", index);
      this.$router.push("/semail/paramConfig");
    },
    //取消
    cancel(formName) {
      this.$refs[formName].resetFields();
      this.configDialogVisible = false;
    },
    //保存配置
    // submitCofig() {
    //   this.$message({
    //     message: "保存成功",
    //     type: "success"
    //   });
    //   this.configDialogVisible = false;
    // },
    //同意
    agreeCheck() {
      this.$message({
        message: "审批通过",
        type: "success"
      });
      this.assessList[this.currentIndex].state = 1;
      this.checkDialogVisible = false;
    },
    //驳回
    refusCheck() {
      this.$message({
        message: "审批被驳回",
        type: "success"
      });
      this.assessList.splice(this.currentIndex, 1);
      this.checkDialogVisible = false;
    },
    //启动，停止
    switchStart(row, type) {
      row.isStart = type;
    },
    //删除
    deleteItem(index) {
      this.$confirm("确认删除吗？", "提示").then(() => {
        this.assessList.splice(index, 1);
      });
    },
    //收发统计
    statistics() {
      this.$router.push("/semail/systermStatistics");
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

