<template>
  <div>
    <el-tabs v-model="activeName" tab-position="top" @tab-click="handleTab">
      <el-tab-pane label="帮助文档管理" name="help">
        <ul class="current-help">
          <li>当前文档: {{fileName}}</li>
          <li>保存路径:{{url}}</li>
          <li>上传时间:{{updateTime}}</li>
          <li>上传人:admin</li>
          <li>
            <el-button size="small" type="primary" @click="upload">更新帮助文档</el-button>
            <el-button size="small" type="primary" @click="dialogVisible=true">在线预览</el-button>
            <el-button size="small" type="primary" @click="download">下载</el-button>
            <a
              href="../../../data/selectseviceLog.json"
              download
              ref="download"
              style="display:none"
            >下载</a>
            <input
              type="file"
              class="bigfile"
              ref="file"
              name="file"
              style="display:none"
              @change="addFiles"
              accept="application/x-zip-compressed"
            >
          </li>
          <li>只能上传zip文件，且不超过1Gb</li>
        </ul>
      </el-tab-pane>
      <el-tab-pane label="第三方系统代理客户端管理" name="program">
        <el-tabs v-model="programActiveName" tab-position="bottom">
          <el-tab-pane label="版本记录" name="versionList">
            <div class="version">
              <div class="btn-box">
                <el-button @click="newVersion" type="primary" size="small">新增版本</el-button>
              </div>
              <el-table :data="dataList"  ref="table" style="width:100%">
                <el-table-column prop="versionId" label="版本编号"></el-table-column>
                <el-table-column label="上传时间">
                  <template slot-scope="scope">
                    <span>{{timestampFormateDate(scope.row.uploadTime)}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="uploadUser" label="上传人"></el-table-column>
                <el-table-column prop="versionDesc" label="版本描述"></el-table-column>
                <el-table-column prop="terminalNum" label="安装终端数"></el-table-column>
              </el-table>
              <div class="pagination-div">
                <el-pagination
                  layout="prev, pager, next"
                  @current-change="handleCurrentChange"
                  :total="total"
                ></el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="终端分布" name="terminalState">
            <el-table :data="terminalList"  ref="table" style="width:100%">
              <el-table-column prop="orgName" label="组织机构"></el-table-column>
              <el-table-column prop="terminalName" label="终端名称"></el-table-column>
              <el-table-column prop="terminalIP" label="终端IP"></el-table-column>
              <el-table-column prop="currentVersion" label="当前版本"></el-table-column>
              <el-table-column prop="setupTime" label="安装时间"></el-table-column>
              <el-table-column prop="setupType" label="安装方式"></el-table-column>
            </el-table>
            <div class="pagination-div">
              <el-pagination
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :total="total"
              ></el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
    <!-- <el-dialog title="新版本" :visible.sync="dialogFormVisible">
      <el-form :model="form">
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="sure">确定</el-button>
      </div>
    </el-dialog> -->
    <el-dialog :visible.sync="dialogVisible" width="50%">
      <img src="../../../assets/img/preview-eg.jpg" alt class="alert-img">
    </el-dialog>
  </div>
</template>
<script>
import { request } from "../../../api/data-api";
export default {
  data() {
    return {
      activeName: "program",
      programActiveName: "versionList",
      fileName: "帮助文档.zip",
      updateTime: "2019-09-09 11:03:02",
      url: "/data/acc/test/",
      dialogVisible: false,
      // dialogFormVisible: false,
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
      pageObj: {
        page: 1,
        rows: 3
      },
      terminalList: []
    };
  },
  created() {
    // 版本管理
    this.selectAgentTerminal();
    /*      this.updateOrgAdmin(); */
    this.selectAgent();
  },
  methods: {
    //切换tab
    handleTab() {},
    //更新帮助文档
    upload() {
      this.$refs.file.click();
    },
    //导出
    download() {
      this.$refs.download.click();
    },
    //选择文件
    addFiles() {
      this.$message({
        message: "更新成功",
        type: "success"
      });
      // console.log(this.$refs.file.files[0]);
      this.fileName = this.$refs.file.files[0].name;
      this.updateTime = this.timestampFormateDate(new Date());
      this.url = "/hlep/acc/test/";
    },
    // cancel() {
    //   this.dialogFormVisible = false;
    // },
    //新增版本
    newVersion() {
      this.form.versionId == "";
      this.form.versionDesc == "";
      this.$router.push("/semail/addVersion")
      // this.dialogFormVisible = true;
    },
    sure() {
      var userId = sessionStorage.getItem("userId");
      if (this.$refs.file.files.length == 0) {
        this.$message({
          message: "请上传文件",
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
            this.dialogFormVisible = false;
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
        // this.dialogFormVisible = false;
      }
    },
    //查询所有的表格信息
    selectAgent() {
      /* var obj = this.pageObj;
      this.$http.selectAgent(obj).then(data => {
        console.log(data);
        if (!data.findForPage) {
          this.dataList = [];
        } else {
          this.dataList = data.findForPage.result;
        }
      }); */
      let versionList = sessionStorage.getItem("versionList")
      if(versionList){
        versionList = JSON.parse(versionList)
        this.dataList = versionList.findForPage.result;
        this.total = versionList.findForPage.total;
      } else {
        request("/programVersion", data => {
          this.dataList = data.findForPage.result;
          this.total = data.findForPage.total;
          sessionStorage.setItem("versionList", JSON.stringify(data))
          console.log("this.total", this.total);
        });
      }
    },
    //查询信息
    selectAgentTerminal() {
      /* this.$http
        .selectAgentTerminal()
        .then(data => {
          console.log(data + "查询信息");
        })
        .catch(res => {
          console.log(error + "error");
        }); */
      request("/terminalVersion", data => {
        this.terminalList = data.findForPage.result;
        this.total = data.findForPage.total;
        console.log("this.total", this.total);
      });
    },

    //软件版本管理分页
    handleCurrentChange(val) {
      this.pageObj.page = val;
      this.selectAgent();
    }
  }
};
</script>
<style lang="scss" scoped>
.current-help {
  padding-left: 50px;
  color: #606266;
  list-style: none;
  li {
    margin: 15px 0;
  }
}
.pagination-div,
.btn-box {
  margin: 10px 0;
}
</style>


