<template>
  <el-tabs v-model="activeName" @tab-click="tabClick">
    <el-tab-pane label="在线终端" name="show">
      <el-row
        :gutter="10"
        v-loading.fullscreen.lock="fullscreenLoading"
        element-loading-text="服务重启中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="row"
      >
        <el-col :span="12">
          <el-card style="border-radius: 0;">
            <div slot="header">
              <span>服务状态</span>
            </div>
            <div>
              <el-row>
                <el-col :span="6" style="text-align:right;">运行状态：</el-col>
                <el-col :span="18">
                  {{starts}}
                  <span style="margin-left:16px">
                    <span v-if="starts != '停止'">
                      [
                      <a href="#" @click="colsed">停止</a>]
                    </span>
                    <span v-if="starts != '启动'">
                      [
                      <a href="#" @click="start">启动</a>]
                    </span>
                    <span>
                      [
                      <a href="#" @click="startAgain">重启</a>]
                    </span>
                  </span>
                </el-col>
              </el-row>
              <el-row style="margin-top:10px">
                <el-col :span="6" style="text-align:right">服务状态：</el-col>
                <el-col :span="18">
                  {{fwStatusMsg}}
                  <span style="margin-left:16px">
                    [
                    <a href="#" @click="serveSta">测试</a>]
                  </span>
                </el-col>
              </el-row>
              <!-- <el-row style="margin-top:10px">
                        <el-col :span="6" style="text-align:right">在线终端数：</el-col>
                        <el-col :span="18">
                          在线终端 {{onlineNum}} 个
              <span style="margin-left:16px;">-->
              <!-- [
              <a href="#" @click="ccc">详细</a>]-->
              <!-- </span>
                        </el-col>
              </el-row>-->
              <el-row style="margin-top:10px">
                <el-col :span="6" style="text-align:right">最新日志：</el-col>
                <el-col :span="18">
                  <span style="margin-left:16px;" v-if="this.flage != 'log'">
                    [
                    <a href="#" @click="handlerLook">查看</a>]
                  </span>
                  <span style="margin-left:16px;" v-else>
                    [
                    <a href="#" @click="handlerClose">关闭</a>]
                  </span>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!--底部数据展示区--->
      <el-row style="margin-top:25px;">
        <el-card 
          style="border-radius: 0" >
          <!--日志展示区--->
          <div v-if="flage == 'log'">
            <div slot="header">
              <span></span>
            </div>
            <el-table ref="table" :data="datalist" v-if="activeName == 'show'">
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
            </el-table>
          </div>
          <!--数据表格展示区--->
          <div v-show="flage == 'table'">
            <div slot="hander">
              <span></span>
            </div>
            <el-table ref="table" :data="tableTerminalData" v-if="activeName == 'show'"  v-loading="loading">
              <el-table-column prop="id" label="终端ID"></el-table-column>
              <el-table-column prop="name" label="终端名称"></el-table-column>
              <el-table-column prop="type" label="终端类型"></el-table-column>
              <el-table-column prop="ip" label="终端IP"></el-table-column>
              <el-table-column prop="domain" label="终端域名"></el-table-column>
              <el-table-column prop="state" label="终端状态">
                <template slot-scope="scope">
                  <span>{{scope.row.state == '0' ? '正常'  : '异常' }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="user" label="联系人"></el-table-column>
            </el-table>
          </div>
          <!--服务状态展示区-->
          <div v-show="flage == 'status'">
            <div solt="header">
              <span></span>
            </div>
            <el-table
              v-if="activeName == 'show'"
              :data="stalist"
              ref="table4"
              style="width:100%"
              v-loading="loading"
            >
              <el-table-column prop="serviceTime" label="诊断时间">
                <template slot-scope="scope">
                  <span>{{ timestampFormateDate(scope.row.serviceTime)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="serviceAddress" label="接口地址"></el-table-column>
              <el-table-column prop="serviceStatus" label="诊断结果">
                <template slot-scope="scope">
                  <span>{{scope.row.serviceStatus == 1 ? "正常" : scope.row.serviceStatus == 0?"异常":"检测时出错"}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="在线邮箱" name="personalEmail">
      <el-row
        :gutter="10"
        v-loading.fullscreen.lock="fullscreenLoading"
        element-loading-text="服务重启中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="row"
      >
        <el-col :span="12">
          <el-card style="border-radius: 0">
            <div slot="header">
              <span>服务状态</span>
            </div>
            <div>
              <el-row>
                <el-col :span="6" style="text-align:right;">运行状态：</el-col>
                <el-col :span="18">
                  {{starts}}
                  <span style="margin-left:16px">
                    <span v-if="starts != '停止'">
                      [
                      <a href="#" @click="colsed">停止</a>]
                    </span>
                    <span v-if="starts != '启动'">
                      [
                      <a href="#" @click="start">启动</a>]
                    </span>
                    <span>
                      [
                      <a href="#" @click="startAgain">重启</a>]
                    </span>
                  </span>
                </el-col>
              </el-row>
              <el-row style="margin-top:10px">
                <el-col :span="6" style="text-align:right">服务状态：</el-col>
                <el-col :span="18">
                  {{fwStatusMsg}}
                  <span style="margin-left:16px">
                    [
                    <a href="#" @click="serveSta">测试</a>]
                  </span>
                </el-col>
              </el-row>
              <el-row style="margin-top:10px">
                <el-col :span="6" style="text-align:right">最新日志：</el-col>
                <el-col :span="18">
                  <span style="margin-left:16px;" v-if="this.flage != 'log'">
                    [
                    <a href="#" @click="handlerLook">查看</a>]
                  </span>
                  <span style="margin-left:16px;" v-else>
                    [
                    <a href="#" @click="handlerClose">关闭</a>]
                  </span>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :span="0"></el-col>
      </el-row>
      <el-row style="margin-top:25px;">
        <el-card style="border-radius: 0">
          <!--日志展示区--->
          <div v-if="flage == 'log'">
            <div slot="header">
              <span></span>
            </div>
            <el-table ref="table" v-if="activeName == 'personalEmail'" :data="datalist">
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
            </el-table>
          </div>
          <!--数据表格展示区--->
          <div v-show="flage == 'table'">
            <div slot="hander">
              <span></span>
            </div>
            <el-table ref="table" :data="tableEmailData" v-if="this.activeName == 'personalEmail'" v-loading="loading">
              <el-table-column prop="id" label="邮箱ID"></el-table-column>
              <el-table-column prop="name" label="终端名称"></el-table-column>
              <el-table-column prop="type" label="邮箱类型"></el-table-column>
              <el-table-column prop="address" label="邮箱地址"></el-table-column>
              <el-table-column prop="opacity" label="邮箱容量"></el-table-column>
              <el-table-column prop="percent" label="邮箱用比"></el-table-column>
              <el-table-column prop="state" label="邮箱状态">
                <template slot-scope="scope">
                  <span>{{scope.row.state == '0' ? '正常'  : '异常' }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="user" label="联系人"></el-table-column>
            </el-table>
          </div>
          <!--服务状态展示区-->
          <div v-show="flage == 'status'">
            <div solt="header">
              <span></span>
            </div>
            <el-table
              v-if="activeName == 'personalEmail'"
              :data="stalist"
              ref="table4"
              style="width:100%"
              v-loading="loading"
            >
              <el-table-column prop="serviceTime" label="诊断时间">
                <template slot-scope="scope">
                  <span>{{ timestampFormateDate(scope.row.serviceTime)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="serviceAddress" label="接口地址"></el-table-column>
              <el-table-column prop="serviceStatus" label="诊断结果">
                <template slot-scope="scope">
                  <span>{{scope.row.serviceStatus == 1 ? "正常" : scope.row.serviceStatus == 0?"异常":"检测时出错"}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="在线代理客户端" name="agencyClient">
      <el-row
        :gutter="10"
        v-loading.fullscreen.lock="fullscreenLoading"
        element-loading-text="服务重启中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="row"
      >
        <el-col :span="12">
          <el-card style="border-radius: 0">
            <div slot="header">
              <span>服务状态</span>
            </div>
            <div>
              <el-row>
                <el-col :span="6" style="text-align:right;">运行状态：</el-col>
                <el-col :span="18">
                  {{starts}}
                  <span style="margin-left:16px">
                    <span v-if="starts != '停止'">
                      [
                      <a href="#" @click="colsed">停止</a>]
                    </span>
                    <span v-if="starts != '启动'">
                      [
                      <a href="#" @click="start">启动</a>]
                    </span>
                    <span>
                      [
                      <a href="#" @click="startAgain">重启</a>]
                    </span>
                  </span>
                </el-col>
              </el-row>
              <el-row style="margin-top:10px">
                <el-col :span="6" style="text-align:right">服务状态：</el-col>
                <el-col :span="18">
                  {{fwStatusMsg}}
                  <span style="margin-left:16px">
                    [
                    <a href="#" @click="serveSta">测试</a>]
                  </span>
                </el-col>
              </el-row>
              <el-row style="margin-top:10px">
                <el-col :span="6" style="text-align:right">最新日志：</el-col>
                <el-col :span="18">
                  <span style="margin-left:16px;" v-if="this.flage != 'log'">
                    [
                    <a href="#" @click="handlerLook">查看</a>]
                  </span>
                  <span style="margin-left:16px;" v-else>
                    [
                    <a href="#" @click="handlerClose">关闭</a>]
                  </span>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :span="0">
          <!-- <el-pagination
              style="display: inline-block; float:right;"
              background
              layout="prev, pager, next"
              :current-page="page"
              :page-size="size"
              @current-change="handleCurrentChange"
          :total="total"></el-pagination>-->
        </el-col>
      </el-row>
      <el-row style="margin-top:25px;">
        <el-card style="border-radius: 0">
          <!--日志展示区--->
          <div v-if="flage == 'log'">
            <div slot="header">
              <span></span>
            </div>
            <el-table ref="table" v-if="activeName == 'agencyClient'" :data="datalist">
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
            </el-table>
          </div>
          <!--数据表格展示区--->
          <div v-show="flage == 'table'">
            <div slot="hander">
              <span></span>
            </div>
            <el-table ref="table" :data="tableClientData" v-if="this.activeName == 'agencyClient'" v-loading="loading">
              <el-table-column prop="id" label="代理客户端ID"></el-table-column>
              <el-table-column prop="name" label="代理客户端名称"></el-table-column>
              <el-table-column prop="type" label="代理客户端类型"></el-table-column>
              <el-table-column prop="domain" label="代理客户端域名"></el-table-column>
              <el-table-column prop="ip" label="代理客户端IP"></el-table-column>
              <el-table-column prop="decode" label="代理客户端发文编码"></el-table-column>
              <el-table-column prop="state" label="代理客户端状态">
                <template slot-scope="scope">
                  <span>{{scope.row.state == '0' ? '正常' : '异常'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="user" label="联系人"></el-table-column>
            </el-table>
          </div>
          <!--服务状态展示区-->
          <div v-show="flage == 'status'">
            <div solt="header">
              <span></span>
            </div>
            <el-table
              v-if="activeName == 'agencyClient'"
              :data="stalist"
              ref="table4"
              style="width:100%"
              v-loading="loading"
            >
              <el-table-column prop="serviceTime" label="诊断时间">
                <template slot-scope="scope">
                  <span>{{ timestampFormateDate(scope.row.serviceTime)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="serviceAddress" label="接口地址"></el-table-column>
              <el-table-column prop="serviceStatus" label="诊断结果">
                <template slot-scope="scope">
                  <span>{{scope.row.serviceStatus == 1 ? "正常" : scope.row.serviceStatus == 0?"异常":"检测时出错"}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-row>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { request } from "../../../api/data-api";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      //tabs页当前页
      activeName: "show",
      datalist: [],
      //表格中的数据
      tableTerminalData: [],
      tableEmailData: [],
      tableClientData: [],
      //默认底部展示table
      flage: "table",
      stalist: [],
      timer: null,
      sta: false,
      page: 1,
      size: 5,
      total: 100,
      onlineNum: 0,
      fullscreenLoading: false,
      starts: "停止",
      logTextArea: "",

      //     fwStatusMsg: "异常",
      //     msg: "",
      //     ws: null
      //   };
      // },
      // created() {
      //   this.ws = new WebSocket("ws://172.16.8.230:8401/ws/t");
      //   //连接发生错误的回调方法
      //   this.ws.onerror = function() {
      //     console.log("onnerror");
      //   };
      //   //连接成功建立的回调方法
      //   this.ws.onopen = function() {
      //     console.log("onopen");
      //   };
      //   //接收消息的回调方法
      //   this.ws.onmessage = this.receiveMessage;
      //   //连接关闭的回调方法
      //   this.ws.onclose = function() {
      //     console.log("onclose");
      //   };

      fwStatusMsg: "异常",
      loading: false
    };
  },
  created() {
    this.getList();
    this.getData();
    this.timer = null;
    this.setTimer();
    this.getOnline();
    this.getStaList();
    this.getServiceStaTop();
  },

  // //窗口关闭时 主动关闭
  // destroyed() {
  //   this.ws.close();
  // },
  // methods: {
  //   //发送消息
  //   sendMessage() {
  //     console.log(this.msg);
  //     let rt = this.ws.send(JSON.stringify({ aaa: "bbb" }));
  //     //let rt = this.ws.send(this.msg);
  //     console.log(rt);
  //   },
  //   //将消息显示在页面
  //   receiveMessage(e) {
  //     console.log(e.data);
  //     // this.rcvMsg.push(e.data);
  //     this.msg += e.data;

  destroyed: function() {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    //定时器
    setTimer() {
      if (this.timer == null) {
        this.timer = setInterval(this.getList, 5000);
      }
    },
    //获取在线数
    getOnline() {
      this.onlineNum = 3;
      /*       var obj = {
        page: 1,
        rows: 15
      };
      this.$http
        .getServeonline(obj)
        .then(data => {
          this.onlineNum = data.online;
        })
        .catch(res => {
          console.log("error", res);
        }); */
    },
    //获取运行状态
    getServiceStaTop() {
      var start = 1;
      start == 1 ? (this.starts = "启动") : (this.starts = "停止");
      /* var obj = {};
      this.$http
        .getServiceTop(obj)
        .then(data => {
          data.start == 1 ? (this.starts = "启动") : (this.starts = "停止");
        })
        .catch(res => {
          console.log("error", res);
        }); */
    },
    //获取日志
    getList() {
      request("/selectTenServiceLog", data => {
        if (data.ten == null) {
          this.datalist = [];
        } else {
          console.log("datas", data);
          this.datalist = data.ten;
          let logLi = "";
          // this.datalist.forEach(item => {
          //     logLi += `<li style="margin-top:30px;font-size:16px;">序号:${item.logId}&nbsp;&nbsp;&nbsp;&nbsp;日志时间:${item.logTime}&nbsp;&nbsp;&nbsp;&nbsp;所在节点:${item.logNode}&nbsp;&nbsp;&nbsp;&nbsp;模块名称:${item.moduleName}&nbsp;&nbsp;&nbsp;&nbsp;行号:${item.moduleName}&nbsp;&nbsp;&nbsp;&nbsp;是否异常:${item.iserror == '0' ?  '正常' : '异常'}</li>`
          // });
          // this.logTextArea =`<ul style="list-style-type:none;">${logLi}</ul>`
        }
      });
      /*       this.$http
        .getTenServelog(obj)
        .then(data => {
          if (data.ten == null) {
            this.datalist = [];
          } else {
            this.datalist = data.ten;
          }
        })
        .catch(res => {
          console.log("error", res);
        }); */
    },
    //获取表格中数据
    getData() {
      let url = "";
      let name = "";
      switch (this.activeName) {
        case "show":
          url = "/sevicesTerminal";
          name = "tableTerminalData";
          break;
        case "personalEmail":
          url = "/sevicesEmail";
          name = "tableEmailData";
          break;
        case "agencyClient":
          url = "/sevicesClient";
          name = "tableClientData";
          break;
        default:
          url = "";
          break;
      }
      request(url, data => {
        this[name] = data.data;
      });
      this.loading=false;
    },
    //获取服务状态
    getStaList() {
      var obj = {
        page: this.page,
        size: this.size
      };
      request("/servicestatus", data => {
        console.log("servicestatus", data);
        data.status == 1
          ? (this.fwStatusMsg = "部分正常")
          : data.status == 2
          ? (this.fwStatusMsg = "正常")
          : (this.fwStatusMsg = "异常");
        this.stalist = data.findForPage.result;
        this.total = data.findForPage.total;
      });
      /* this.$http
        .getServeStatus(obj)
        .then(data => {
          data.status == 1
            ? (this.fwStatusMsg = "部分正常")
            : data.status == 2
            ? (this.fwStatusMsg = "正常")
            : (this.fwStatusMsg = "异常");
          this.stalist = data.findForPage.result;
          this.total = data.findForPage.total;
        })
        .catch(res => {
          console.log("error", res);
        }); */
    },
    //停止
    colsed() {
      this.$message({
        message: "停止成功",
        type: "success"
      });
      this.starts = "停止";
      /*    var obj = {};
      this.$http
        .serveCease(obj)
        .then(data => {
          this.$message({
            message: "停止成功",
            type: "success"
          });
          this.starts = "停止";
        })
        .catch(res => {
          console.log("error", res);
        }); */
    },
    //启动
    start() {
      this.$message({
        message: "启动成功",
        type: "success"
      });
      this.starts = "启动";
      /*       var obj = {};
      this.$http
        .serveStart(obj)
        .then(data => {
          this.$message({
            message: "启动成功",
            type: "success"
          });
          this.starts = "启动";
        })
        .catch(res => {
          console.log("error", res);
        }); */
    },
    //重启
    startAgain() {
      this.fullscreenLoading = true;
      this.$message({
        message: "重启成功",
        type: "success"
      });
      this.starts = "启动";
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 1500);
      /*       var obj = {};
      this.$http
        .serveAgain(obj)
        .then(data => {
          this.fullscreenLoading = false;
          this.$message({
            message: "重启成功",
            type: "success"
          });
          this.starts = "启动";
        })
        .catch(res => {
          this.fullscreenLoading = false;
          console.log("error", res);
        }); */
    },
    //测试
    serveSta() {
      if (this.flage == 'status') {
        this.flage = 'table';
      } else {
       this.flage = 'status';
        this.getStaList();
      }
     
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getStaList();
    },
    //tab点击回调
    tabClick() {
      this.loading=true;
      this.getData();
      this.flage = "table";
    },
    //点击查看日志
    handlerLook() {
      this.flage = "log";
      console.log("ssss",this.tableTerminalData)
    },
    //关闭查看日志
    handlerClose () {
      this.flage = "table";
      console.log("xxx",this.tableTerminalData)
    }
  },
  components: {
    // ToolBar
  }
};
</script>

<style lang="scss" scoped>
.row {
  width: 100%;

  .logPart {
    ul {
      list-style-type: none;
      font-size: 16px;
      li {
        margin-top: 15px;
      }
    }
  }
}
</style>


