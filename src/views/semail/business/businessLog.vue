<template>
  <div>
    <a href="../../../data/selectseviceLog.json" download ref="download" style="display:none">下载</a>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="登录日志" name="login">
        <ToolBar>
          <div class="search-top">
            <div>
              <el-button type="primary" icon="el-icon-plus" size="small" @click="handleExport">导出</el-button>
              <el-button type="primary" icon="el-icon-refresh" size="small" @click="handleSync">同步</el-button>
              <!-- <el-button type="danger" icon="el-icon-delete" size="small" @click="delMultiple">批量删除</el-button> -->
            </div>
            <div>
              <el-input
                placeholder="登录账户"
                size="small"
                style="width: 180px"
                type="text"
                v-model="term"
                clearable
              />
              <el-button type="primary" icon="el-icon-search" size="small" @click="handleSearch">查询</el-button>
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
          <el-table-column prop="userId" label="用户ID"></el-table-column>
          <el-table-column prop="accountId" label="登录账号"></el-table-column>
          <el-table-column prop="loginTime" label="登录时间">
            <template slot-scope="scope">
              <span>{{ timestampFormateDate(scope.row.loginTime)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="terminalId" label="终端ID"></el-table-column>
          <el-table-column prop="issuccess" label="登录结果">
            <template slot-scope="scope">
              <span>{{scope.row.issuccess == 0 ? "成功" : "失败"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="loginTime" label="注销时间">
            <template slot-scope="scope">
              <span>{{ timestampFormateDate(scope.row.logoutTime)}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="checkDetail(scope.row.logId)">详细信息</el-button>
              <!-- <el-button type="text" @click="delLog('single',scope.$index)">删除</el-button> -->
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
      <el-tab-pane label="操作日志" name="action">
        <ToolBar>
          <div class="search-top">
            <div>
              <el-button type="primary" icon="el-icon-plus" size="small" @click="handleExport">导出</el-button>
              <el-button type="primary" icon="el-icon-refresh" size="small" @click="handleSync">同步</el-button>
              <!-- <el-button type="danger" icon="el-icon-delete" size="small" @click="delMultiple">批量删除</el-button> -->
            </div>
            <div>
              <el-input
                placeholder="操作用户ID"
                size="small"
                style="width: 180px"
                type="text"
                v-model="term"
                clearable
              />
              <el-button type="primary" icon="el-icon-search" size="small" @click="handleSearch">查询</el-button>
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
          <el-table-column prop="userId" label="用户ID"></el-table-column>
          <el-table-column prop="actionId" label="操作类型"></el-table-column>
          <el-table-column prop="logTime" label="操作时间">
            <template slot-scope="scope">
              <span>{{ timestampFormateDate(scope.row.logTime)}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="checkDetail(scope.row.logId)">详细信息</el-button>
              <!-- <el-button type="text" @click="delLog('single',scope.$index)">删除</el-button> -->
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
      <el-tab-pane label="收发日志" name="record">
        <ToolBar>
          <div class="search-top">
            <div>
              <el-button type="primary" icon="el-icon-plus" size="small" @click="handleExport">导出</el-button>
              <el-button type="primary" icon="el-icon-refresh" size="small" @click="handleSync">同步</el-button>
              <!-- <el-button type="danger" icon="el-icon-delete" size="small" @click="delMultiple">批量删除</el-button>-->
            </div>
            <div>
              <el-input
                placeholder="发件人/终端(单位)"
                size="small"
                style="width: 180px"
                type="text"
                v-model="term"
                clearable
              />
              <el-button type="primary" icon="el-icon-search" size="small" @click="handleSearch">查询</el-button>
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
          <el-table-column prop="fileNumber" label="发文编号">
          </el-table-column>
          <el-table-column prop="mailType" label="文件类型">
            <template slot-scope="scope">
              <span>{{scope.row.mailType === "0" ? "pdf" : "word"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="handleMailElevel" label="密级"></el-table-column>
          <el-table-column prop="handleMailSlevel" label="紧急"></el-table-column>
          <el-table-column prop="mailSubject" label="主题"></el-table-column>
          <el-table-column width="180" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="checkDetail(scope.row.logId)">详细信息</el-button>
              <!-- <el-button type="text" @click="delLog('single',scope.$index)">删除</el-button> -->
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
      <el-tab-pane label="运行日志" name="service">
        <ToolBar>
          <div class="search-top">
            <div>
              <el-button type="primary" icon="el-icon-plus" size="small" @click="handleExport">导出</el-button>
              <el-button type="primary" icon="el-icon-refresh" size="small" @click="handleSync">同步</el-button>
              <!-- <el-button type="danger" icon="el-icon-delete" size="small" @click="delMultiple">批量删除</el-button> -->
            </div>
            <div>
              <el-input
                placeholder="是否异常"
                size="small"
                style="width: 180px"
                type="text"
                v-model="term"
                clearable
              />
              <el-button type="primary" icon="el-icon-search" size="small" @click="handleSearch">查询</el-button>
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
          <el-table-column prop="iserror" label="是否异常">
            <template slot-scope="scope">
              <span>{{scope.row.iserror == 1 ? "异常" : "正常"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="logContent" label="日志内容"></el-table-column>
          <el-table-column width="180" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="checkDetail(scope.row.logId)">详细信息</el-button>
              <!-- <el-button type="text" @click="delLog('single',scope.$index)">删除</el-button> -->
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
    </el-tabs>

    <!-- <el-dialog title="日志详情" :visible.sync="dialogVisible" center>
      <el-form
        label-width="120px"
        size="mini"
        ref="dialogForm"
        style="width:500px;margin:auto;"
        v-if="activeName=='login'"
      >
        <el-form-item label="序号">
          <el-input :value="dialogForm.logId" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input :value="dialogForm.userId" disabled></el-input>
        </el-form-item>
        <el-form-item label="登录账号">
          <el-input :value="dialogForm.accountId" disabled></el-input>
        </el-form-item>
        <el-form-item label="登录时间">
          <el-input :value="timestampFormateDate(dialogForm.loginTime)" disabled></el-input>
        </el-form-item>
        <el-form-item label="终端ID">
          <el-input :value="dialogForm.terminalId" disabled></el-input>
        </el-form-item>
        <el-form-item label="登录结果">
          <el-input :value="dialogForm.issuccess == 0 ? '成功' : '失败'" disabled></el-input>
        </el-form-item>
        <el-form-item label="注销时间">
          <el-input :value="timestampFormateDate(dialogForm.logoutTime)" disabled></el-input>
        </el-form-item>
      </el-form>
      <el-form
        label-width="120px"
        size="mini"
        ref="dialogForm"
        style="width:500px;margin:auto;"
        v-if="activeName=='action'"
      >
        <el-form-item label="序号">
          <el-input :value="dialogForm.logId" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input :value="dialogForm.userId" disabled></el-input>
        </el-form-item>
        <el-form-item label="操作类型">
          <el-input :value="dialogForm.actionId" disabled></el-input>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-input :value="timestampFormateDate(dialogForm.logTime)" disabled></el-input>
        </el-form-item>
      </el-form>
      <el-form
        label-width="150px"
        size="mini"
        ref="dialogForm"
        style="width:500px;margin:auto;"
        v-if="activeName=='record'"
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
        v-if="activeName=='service'"
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
export default {
  components: {
    ToolBar
  },
  data() {
    return {
      activeName: "login",
      datalist: [],
      term: "",
      currentPage: 1,
      pageSize: 15,
      totalLog: 100,
      dialogVisible: false,
      detailType: "login",
      selectArr: [],
      delIds: "",
      dialogForm: {},
      loading: false
    };
  },
  created() {

    if(this.$store.state.activeName)
    {
      this.activeName = this.$store.state.activeName;
    }
    this.requestData();
  },
  methods: {
    //选择框选中
    handleSelect(val) {
      this.selectArr = val;
    },
    //批量删除
    delMultiple() {
      /* var ids = "";
      var arr = this.selectArr;
      arr.forEach(function(item, index) {
        if (index == arr.length - 1) {
          ids += item.logId;
        } else {
          ids = ids + item.logId + ",";
        }
      });
      this.delLog(ids); */
      this.delLog("mutiple");
    },
    //获取数据
    requestData(isSync) {
      /*       var obj = {
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
      this.loading = true;
      var url = "";
      if (this.activeName == "login") {
        url = "/loginLog";
      } else if (this.activeName == "action") {
        url = "/operationLog";
      } else if (this.activeName == "record") {
        url = "/systermStatstics";
      } else {
        url = "/seviceLog";
      }
      request(url, data => {
        if (this.activeName == 'record') {
          data.findForPage.result.forEach(item => {
            let handleMailElevel = '';
            let handleMailSlevel = '';
            switch (item.mailElevel) {
                case '0' :
                  handleMailElevel = '秘密';
                  break;
                case '1' :
                  handleMailElevel = '机密';
                  break;
                case '2' :
                  handleMailElevel = '绝密';
                  break;
                default :
                  handleMailElevel = '明文';
                  break;
              
          }
          switch (item.mailSlevel) {
                case '0' :
                  handleMailSlevel = '急';
                  break;
                case '1' :
                  handleMailSlevel = '特急';
                  break;
                default :
                  handleMailSlevel = '加急';
                  break;
              }
              item.handleMailElevel = handleMailElevel;
              item.handleMailSlevel = handleMailSlevel;
          })
        }
        //console.log("sds", data);
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
    },
    //tab切换
    handleClick(tab, e) {
      // 登录日志
      this.term = "";
      this.currentPage = 1;
      this.requestData();
      this.$store.commit("updateActiveName",this.activeName)
    },
    //搜索
    handleSearch() {
      this.currentPage = 1;
      this.requestData();
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
      }
      this.$confirm("确认删除该条日志记录吗？", "提示")
        .then(() => {
          var obj = {
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
            });
        })
        .catch(() => {
          this.$message({
            message: "已取消删除",
            type: "info"
          });
        }); */
      if (type == "mutiple" && this.selectArr.length == 0) {
        this.$message({
          message: "请选择要删除的日志",
          type: "warning"
        });
        return;
      }
      this.$confirm("确认删除该条日志记录吗？", "提示").then(() => {
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
      });
    },
    //查看日志详细信息
    checkDetail(id) {
      /* var obj = {
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
      var url = "";
      if (this.activeName == "login") {

        url = "/loginLogDetail";
        sessionStorage.setItem("logName", "登录日志");

      } else if (this.activeName == "action") {

        url = "/operationLogDetail";
        sessionStorage.setItem("logName", "操作日志");

      } else if (this.activeName == "record") {

        url = "/recordLogDetail";
        sessionStorage.setItem("logName", "收发日志");

      } else {

        url = "/seviceLogDetail";
        sessionStorage.setItem("logName", "运行日志");

      }
      this.$store.commit("updateActiveName",this.activeName);
      this.$router.push({
        path: "businessLogDetails",
        query: { activeName: this.activeName, id}
      });
     
      // request(url, data => {
      //   this.dialogForm = data.selectById;

      //   //this.dialogVisible = true;
      // });
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


