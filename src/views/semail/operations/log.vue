<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="业务日志" name="business">
        <ToolBar>
          <div class="search-top">
            <div>
              <el-button type="primary" icon="el-icon-plus" size="small" @click="handleExport">导出</el-button>
              <el-button type="primary" icon="el-icon-refresh" size="small" @click="handleSync">同步</el-button>
              <el-button type="danger" icon="el-icon-delete" size="small" @click="delMultiple">批量删除</el-button>
            </div>
            <div>
              <el-input
                placeholder="收发件人/终端(单位)"
                size="small"
                style="width: 180px"
                type="text"
                v-model="term.termBusiness"
                clearable
              />
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="handleSearch('business')"
              >查询</el-button>
            </div>
          </div>
        </ToolBar>
        <el-table
          :data="datalist"
          border
          ref="table"
          style="width:100%"
          @selection-change="handleSelect"
          v-loading="loading"
        >
          <el-table-column type="selection" width="50"></el-table-column>
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
          <el-table-column width="180" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="checkDetail(scope.row.logId)">详细信息</el-button>
              <el-button type="text" @click="delLog('single',scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="display: inline-block; float:right;"
          background
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
          :total="totalLog"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="错误日志" name="error">
        <ToolBar>
          <div class="search-top">
            <div>
              <el-button type="primary" icon="el-icon-plus" size="small" @click="handleExport">导出</el-button>
              <el-button type="primary" icon="el-icon-refresh" size="small" @click="handleSync">同步</el-button>
              <el-button type="danger" icon="el-icon-delete" size="small" @click="delMultiple">批量删除</el-button>
              <a
                href="../../../data/selectseviceLog.json"
                download
                ref="download"
                style="display:none"
              >下载</a>
            </div>
            <div>
              <el-input
                placeholder="是否异常"
                size="small"
                style="width: 180px"
                type="text"
                v-model="term.termError"
                clearable
              />
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="handleSearch('error')"
              >查询</el-button>
            </div>
          </div>
        </ToolBar>
        <el-table
          :data="datalist"
          border
          ref="table"
          style="width:100%"
          @selection-change="handleSelect"
          v-loading="loading"
        >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="logId" label="序号"></el-table-column>
          <el-table-column prop="logTime" label="日志时间">
            <template slot-scope="scope">
              <span>{{ timestampFormateDate(scope.row.logTime)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="logNode" label="所在节点"></el-table-column>
          <el-table-column prop="moduleName" label="模块名称"></el-table-column>
          <el-table-column prop="lineNumber" label="行号"></el-table-column>
          <el-table-column prop="runType" label="运行状态">
            <template slot-scope="scope">
              <span>{{scope.row.runType == 0 ? "启动" :scope.row.runType == 1 ? "停止" : "健康监测"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="errCode" label="错误码">
          </el-table-column>
          <el-table-column prop="logContent" label="日志内容"></el-table-column>
          <el-table-column width="180" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="checkDetail(scope.row.logId)">详细信息</el-button>
              <el-button type="text" @click="delLog('single',scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="display: inline-block; float:right;"
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
          :total="totalLog"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="运行日志" name="run">
        <ToolBar>
          <div class="search-top">
            <div>
              <el-button type="primary" icon="el-icon-plus" size="small" @click="handleExport">导出</el-button>
              <el-button type="primary" icon="el-icon-refresh" size="small" @click="handleSync">同步</el-button>
              <el-button type="danger" icon="el-icon-delete" size="small" @click="delMultiple">批量删除</el-button>
              <a
                href="../../../data/selectseviceLog.json"
                download
                ref="download"
                style="display:none"
              >下载</a>
            </div>
            <div>
              <el-input
                placeholder="是否异常"
                size="small"
                style="width: 180px"
                type="text"
                v-model="term.termRun"
                clearable
              />
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="handleSearch('run')"
              >查询</el-button>
            </div>
          </div>
        </ToolBar>
        <el-table
          :data="datalist"
          border
          ref="table"
          style="width:100%"
          @selection-change="handleSelect"
          v-loading="loading"
        >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="logId" label="序号"></el-table-column>
          <el-table-column prop="logTime" label="日志时间">
            <template slot-scope="scope">
              <span>{{ timestampFormateDate(scope.row.logTime)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="logNode" label="所在节点"></el-table-column>
          <el-table-column prop="moduleName" label="模块名称"></el-table-column>
          <el-table-column prop="lineNumber" label="行号"></el-table-column>
          <el-table-column prop="runType" label="运行状态">
            <template slot-scope="scope">
              <span>{{scope.row.runType == 0 ? "启动" :scope.row.runType == 1 ? "停止" : "健康监测"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="iserror" label="是否异常">
            <template slot-scope="scope">
              <span>{{scope.row.iserror == 1 ? "异常" : "正常"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="logContent" label="日志内容"></el-table-column>
          <el-table-column width="180" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="checkDetail(scope.row.logId)">详细信息</el-button>
              <el-button type="text" @click="delLog('single',scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="display: inline-block; float:right;"
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
          :total="totalLog"
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>

    <!-- <el-dialog title="日志详情" :visible.sync="dialogVisible" center>
      <el-form
        label-width="150px"
        size="mini"
        ref="dialogForm"
        style="width:500px;margin:auto;"
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
        size="mini"
        ref="dialogForm"
        style="width:500px;margin:auto;"
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
    </el-dialog>-->
  </div>
</template>
<script>
import ToolBar from "./../../../components/ToolBar";
import { request } from "../../../api/data-api";
import { setTimeout } from "timers";
export default {
  components: {
    ToolBar
  },
  data() {
    return {
      activeName: "business",
      datalist: [],
      term: {
        termBusiness: "",
        termError: "",
        termRun: ""
      },
      currentPage: 1,
      pageSize: 15,
      totalLog: 100,
      // dialogVisible: false,
      detailType: "login",
      selectArr: [],
      delIds: "",
      dialogForm: {},
      loading: false
    };
  },
  created() {
    this.requestData();
  },
  methods: {
    //菜单切换
    handleClick() {
      this.requestData();
    },
    //选择框选中
    handleSelect(val) {
      this.selectArr = val;
    },
    //批量删除
    delMultiple() {
      /*       var ids = "";
      var arr = this.selectArr;
      arr.forEach(function(item, index) {
        if (index == arr.length - 1) {
          ids += item.logId;
        } else {
          ids = ids + item.logId + ",";
        }
      }); */
      this.delLog("mutiple");
    },
    //获取数据
    requestData(isSync) {
      this.loading = true;
      var url = "";
      if (this.activeName == "business") {
        url = "/systermStatstics";
      } else if (this.activeName == "error") {
        url = "/errorLog";
      } else {
        url = "/seviceLog";
      }
      request(url, data => {
        this.datalist = data.findForPage.result;
        this.totalLog = data.findForPage.total;
        if (isSync) {
          this.$message({
            message: "同步成功",
            type: "success"
          });
        }
        setTimeout(() => {
          this.loading = false;
        }, 300);
      });

      /* var obj = {
        type: this.activeName,
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
        term: this.term
      };
      this.$http
        .selectLog(obj)
        .then(data => {
          this.datalist = data.findForPage.result;
          this.totalLog = data.findForPage.total;
          if (isSync) {
            this.$message({
              message: "同步成功",
              type: "success"
            });
          }
        })
        .catch(res => {
          console.log("error", res);
        }); */
    },
    //搜索
    handleSearch(type) {
      this.currentPage = 1;
      let currentDataList = [];
      switch (type) {
        case "business":
          if (this.term.termBusiness) {
            currentDataList = this.datalist.filter(item =>
              item.sender.includes(this.term.termBusiness)
            );
          } else {
            this.requestData();
          }
          break;
        case "error":
          if (this.term.termError) {
            currentDataList = this.searchMap();
          } else {
            this.requestData();
          }
          break;
        case "run":
          if (this.term.termRun) {
            currentDataList = this.searchMap();
          } else {
            this.requestData();
          }
          break;
        default:
          break;
      }
      this.datalist = currentDataList;
    },
    searchMap() {
      let flag = "0";
      if (this.term.termRun == "异常") {
        flag = "1";
      }
      return this.datalist.filter(item => item.iserror == flag);
    },
    //导出
    handleExport() {
      this.$refs.download.click();
      /*       this.activeName == "login"
        ? (window.location.href = `${hostName}/log/downLoginLog`)
        : this.activeName == "action"
        ? (window.location.href = `${hostName}/log/downActionLog`)
        : this.activeName == "record"
        ? (window.location.href = `${hostName}/log/downRecordLog`)
        : (window.location.href = `${hostName}/log/downServiceLog`); */
    },
    //同步
    handleSync() {
      this.currentPage = 1;
      this.requestData(true);
    },
    //分页切换
    handleCurrentChange(val) {
      this.currentPage = val;
      this.requestData();
    },
    //删除日志
    delLog(type, index) {
      /*       if (id == "") {
        this.$message({
          message: "请选择要删除的日志",
          type: "warning"
        });
        return;
      } */
      if (type == "mutiple" && this.selectArr.length == 0) {
        this.$message({
          message: "请选择要删除的日志",
          type: "warning"
        });
        return;
      }
      this.$confirm("确认删除该条日志记录吗？", "提示")
        .then(() => {
          if (type == "single") {
            this.datalist.splice(index, 1);
            this.totalLog--;
          } else {
            for (var i = 0; i < this.datalist.length; i++) {
              for (var j = 0; j < this.selectArr.length; j++) {
                if (this.datalist[i].logId == this.selectArr[j].logId) {
                  this.datalist.splice(i, 1);
                  i--;
                  this.totalLog--;
                  break;
                }
              }
            }
          }
          /*           var obj = {
            type: this.activeName,
            logs: id
          };
          this.$http
            .deleteLog(obj)
            .then(data => {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.requestData();
            })
            .catch(res => {
              console.log("error", res);
            }); */
        })
        .catch(() => {
          this.$message({
            message: "已取消删除",
            type: "info"
          });
        });
    },
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
        this.$store.commit("updateActiveName", this.activeName);
        sessionStorage.setItem("activeName", this.activeName);
        this.$router.push("/semail/logDetail");
        // this.dialogVisible = true;
      });
      /*       var obj = {
        type: this.activeName,
        id: id
      };
      this.$http
        .selectById(obj)
        .then(data => {
          this.dialogForm = data.selectById;
          this.dialogVisible = true;
        })
        .catch(res => {
          console.log("error", res);
        }); */
    }
  }
};
</script>
<style scoped>
.search-top {
  display: flex;
  justify-content: space-between;
}
</style>


