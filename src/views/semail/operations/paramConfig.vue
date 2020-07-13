<template>
  <div>
    <el-card style="border-radius: 0">
      <el-form :model="configForm" ref="configForm" style="width: 800px;">
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
      <el-footer style="text-align: right;">
          <el-button @click="cancel('configForm')" size="small">取 消</el-button>
          <el-button type="primary" @click="submitCofig" size="small">保存</el-button>
      </el-footer>
      <!-- <div slot="footer" class="footer">
          <el-button @click="cancel('configForm')" size="small">取 消</el-button>
          <el-button type="primary" @click="submitCofig" size="small">保存</el-button>
      </div> -->
    </el-card>
  </div>
</template>
<script>
import { request } from "../../../api/data-api";
import { setTimeout } from "timers";
import { close } from 'fs';
import { debuglog } from 'util';
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
      formLabelWidth: "120px",
      index: 0
    };
  },
  created() {
    let list = this.$store.state.assessList
    let accessList = JSON.parse(sessionStorage.getItem("AssessList"))
    /**
     * 1. 如果vuex中存在内容，就是用vuex中的内容提要
     * 2. 如果vuex中无数据，但是sessionStorge中有内容，就用其中的信息
     * 3. 如果未作修改，并且vuex中无内容，则不作操作，保持默认
     */
    if(list.length >= 0){
      this.getDetail();
    } else if (accessList) {
      let index = accessList.index
      accessList = accessList.list
      this.$store.commit("updateAssessList", accessList)
      this.$store.commit("updateAssessIndex", index)
      this.assessList = accessList;
      this.index = index
      this.configForm = accessList[index]
    }
  },
  methods: {
    //获取详情
    getDetail() {
      let index = this.$store.state.editAssessIndex
      let list = this.$store.state.assessList
      let configForm = this.configForm
      this.index = index
      this.assessList = list
      if(list[index].ip){
        this.configForm = list[index]
      } else {
        list[index] = {...configForm, ...list[index]}
        this.$store.commit("updateAssessList", list)
      }
    },
    //取消
    cancel(formName) {
      this.$router.go(-1)
    },
    //保存配置
    submitCofig() {
      let index = this.index
      let list = this.assessList
      let configForm = this.configForm
      list[index] = {...list[index], ...configForm}
      this.$store.commit("updateAssessList", list)
      this.$message({
        message: "保存成功",
        type: "success"
      });
      sessionStorage.setItem("AssessList", JSON.stringify({list,index}))
      this.$router.go(-1)
    },
  }
};
</script>
<style lang="scss" scoped>
</style>

