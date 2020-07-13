<template>
  <div>
    <div class="top-search">
      <el-form ref="searchForm" :model="searchForm" label-width="80px" :inline="true" size="small">
        <el-form-item label="收/发时间">
          <el-date-picker type="date" v-model="searchForm.time"></el-date-picker>
        </el-form-item>
        <el-form-item label="收/发类型">
          <el-select v-model="searchForm.type"  size="small" clearable>
            <el-option label="收文" value="0"></el-option>
            <el-option label="发文" value="1"></el-option>
          </el-select>
          <el-button type="primary" @click="getList" size="small" class="margin-left-20">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="datalist" ref="table" style="width:100%" v-loading="loading">
      <!--  <el-table-column type="selection" width="50"></el-table-column> -->
      <el-table-column prop="logId" label="序号"></el-table-column>
      <el-table-column prop="logTime" label="发文时间/收文时间">
        <template slot-scope="scope">
          <span>{{ timestampFormateDate(scope.row.logTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sender" label="发件人/终端(单位)"></el-table-column>
      <el-table-column prop="receiver" label="收件人/收件单位"></el-table-column>
      <el-table-column prop="ioType" label="收发标识">
        <template slot-scope="scope">
          <span>{{scope.row.ioType === "1" ? "发" : "收"}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fileNumber" label="发文编号"></el-table-column>
      <el-table-column prop="mailType" label="文件类型"></el-table-column>
      <el-table-column prop="mailElevel" label="密级"></el-table-column>
      <el-table-column prop="mailSlevel" label="紧急"></el-table-column>
      <el-table-column prop="mailSubject" label="主题"></el-table-column>
      <!-- <el-table-column width="180" label="操作">
        <template slot-scope="scope">
          <el-tooltip content="详细信息" placement="top">
            <i
              style="color:#67C23A;cursor:pointer;margin-left:5px"
              class="el-icon-document"
              @click="checkDetail(scope.row.logId)"
            />
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <i
              style="color:#F56C6C;cursor:pointer;margin-left:5px"
              class="el-icon-delete"
              @click="delLog(scope.row.logId)"
            />
          </el-tooltip>
        </template>
      </el-table-column>-->
    </el-table>
    <el-pagination
      style="display: inline-block; float:right;"
      layout="prev, pager, next"
      :current-page="currentPage"
      :page-size="pageSize"
      @current-change="handleCurrentChange"
      :total="totalLog"
    ></el-pagination>
  </div>
</template>
<script>
import { request } from "../../../api/data-api";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      datalist: [],
      currentPage: 1,
      pageSize: 10,
      totalLog: 100,
      searchForm: {
        time: "",
        type: ""
      },
      loading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //获取日志
    getList() {
      this.loading = true;
      request("/systermStatstics", data => {
        this.datalist = data.findForPage.result;
        this.totalLog = data.findForPage.total;
        console.log(this.assessList);
        setTimeout(() => {
          this.loading = false;
        }, 400);
      });
    },
    //分页
    handleCurrentChange(val) {}
  }
};
</script>
<style lang="scss" scoped>
.margin-left-20 {
  margin-left: 20px;
}
.top-search {
  float: right;
}
</style>


