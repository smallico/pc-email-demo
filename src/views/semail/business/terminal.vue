<template>
  <div>
    <a href="../../../data/selectseviceLog.json"  download  ref="download" style="display:none">下载</a>
    <input 
          type="file" 
          multiple 
          name="file"
          style="display:none"
          ref="templateFile"
          @change="templateChange"
          />
    <ToolBar>
      <el-button type="primary" icon="el-icon-refresh" size="small" @click="refresh">同步终端</el-button>
      <el-button type="primary" icon="el-icon-view" size="small" @click="statisticOnline">在线终端统计</el-button>
      <el-button type="primary" icon="el-icon-download" size="small" @click="handleDownload">下载导入模板</el-button>
      <el-button type="primary" icon="el-icon-upload2" size="small" @click="handleUpload">导入</el-button>
    </ToolBar>
    <el-table :data="list" border ref="table" style="width:100%" v-loading="loading">
      <el-table-column prop="terminalId" label="终端ID" width="80px"></el-table-column>
      <el-table-column prop="terminalName" label="终端名称"></el-table-column>
      <el-table-column prop="terminalType" label="终端类型"></el-table-column>
      <el-table-column prop="terminalIp" label="终端IP" sortable></el-table-column>
      <el-table-column prop="terminalContact" label="联系人"></el-table-column>
      <el-table-column prop="terminalPhone" label="联系电话"></el-table-column>
      <el-table-column prop="terminalDomain" label="终端域名" sortable></el-table-column>
      <el-table-column prop="terminalCode" label="发文编号"></el-table-column>
      <el-table-column label="终端状态">
        <template slot-scope="scope">
          <span>{{scope.row.status == '0' ? '在线' : '离线'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="280px;" label="操作">
        <template slot-scope="scope">
          <el-tooltip content="升序" placement="top" v-if="total>1&&scope.$index!=0">
            <el-button
              style="transition: .4s;"
              icon="el-icon-sort-up"
              size="mini"
              type="text"
              @click="editSort(scope.row,scope.$index,'last')"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            content="降序"
            placement="top"
            v-if="total>1&&scope.$index!=(
              -1)"
          >
            <el-button
              style="transition: .4s;"
              icon="el-icon-sort-down"
              size="mini"
              type="text"
              @click="editSort(scope.row,scope.$index,'next')"
            ></el-button>
          </el-tooltip>

          <el-button
            size="small"
            type="text"
            @click="toEdit(scope.row.terminalId,scope.row,scope.$index)"
          >编辑</el-button>
          <el-button size="small" type="text" @click="toZero(scope.row)">发文编号归零</el-button>
          <el-button size="small" type="text" @click="toAssign(scope.row.terminalId)">分配</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="background:#fff;padding:20px 10px;text-align:right;"
      layout="prev, pager, next"
      :current-page="params.page"
      :page-size="params.rows"
      @current-change="handleCurrentChange"
      :total="total"
    ></el-pagination>

    <!-- <el-dialog title="编辑终端" :visible.sync="dialogVisible" center>
      <el-form
        label-width="120px"
        size="mini"
        ref="dialogForm"
        :rules="rules"
        style="width:500px;margin:auto;"
        :model="dialoForm"
      >
        <el-form-item label="终端名称" prop="terminalName">
          <el-input v-model="dialoForm.terminalName"></el-input>
        </el-form-item>
        <el-form-item label="终端类型" prop="terminalType">
          <el-input v-model="dialoForm.terminalType"></el-input>
        </el-form-item>
        <el-form-item label="终端IP" prop="terminalIp">
          <el-input v-model="dialoForm.terminalIp"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="terminalContact">
          <el-input v-model="dialoForm.terminalContact"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="terminalPhone">
          <el-input v-model="dialoForm.terminalPhone"></el-input>
        </el-form-item>
        <el-form-item label="终端域名" prop="terminalDomain">
          <el-input v-model="dialoForm.terminalDomain"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="dialogVisible=false">取消</el-button>
        <el-button size="small" @click="submitForm('dialogForm')" type="primary">确定</el-button>
      </div>
    </el-dialog>-->
    <!-- <el-dialog title="分配组织机构终端" :visible.sync="assignVisible" center>
      <el-tree
        :data="treeData"
        :props="defalutProps"
        node-key="orgId"
        ref="orgTree"
        @node-click="chooseOrg"
      ></el-tree>
      <div slot="footer">
        <el-button size="small" @click="assignVisible=false">取消</el-button>
        <el-button size="small" @click="submitAssign" type="primary">确定分配</el-button>
      </div>
    </el-dialog>-->
    <el-dialog title="在线终端统计" :visible.sync="onlineVisible" center>
      <div class="onlinenumbox">当前在线终端 {{onlineNum}} 个</div>
      <!-- <el-table
        :data="onlineList"
        border
        ref="onlineTable"
        style="width:100%"
        :loading="onlineLoading"
      >
        <el-table-column prop="loginname" label="序号"></el-table-column>
        <el-table-column prop="nickname" label="终端名称"></el-table-column>
        <el-table-column prop="email" label="在线时长"></el-table-column>
      </el-table>
      <el-pagination
        style="background:#fff;padding:20px 10px;text-align:right;"
        background
        layout="prev, pager, next"
        :current-page="onlineParams.page"
        :page-size="onlineParams.size"
        @current-change="onlineCurrentChange"
        :total="onlineTotal"
      ></el-pagination>-->
    </el-dialog>
  </div>
</template>
 <script>
import ToolBar from "../../../components/ToolBar";
import { request } from "../../../api/data-api";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      list: [],
      onlineList: [],
      onlineParams: {
        page: 1,
        rows: 10
      },
      params: {
        page: 1,
        rows: 10
      },
      total: 100,
      onlineTotal: 100,
      loading: false,
      onlineLoading: false,
      dialogVisible: false,
      dialoForm: {
        isDeleted: "",
        isEdited: "",
        orgId: "",
        originalId: "",
        sortId: "",
        terminalCode: "",
        terminalContact: "",
        terminalDomain: "",
        terminalId: "",
        terminalIp: "",
        terminalName: "",
        terminalPhone: "",
        terminalType: ""
      },
      rules: {},
      assignVisible: false,
      defalutProps: {
        children: "children",
        label: "name"
      },
      treeData: [],
      onlineVisible: false,
      assignParams: {
        orgId: "",
        terminalId: ""
      },
      onlineNum: 0,
      currentIndex: 0,
      //默认降序排列
      //defaultSort: {prop: 'terminalIp', order: 'descending'}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //同步终端
    refresh() {
      /*   this.$http
        .mailTerminalSynct()
        .then(data => {
          this.$message({
            message: `已同步${data.count}条数据`,
            type: "success"
          });
          this.params.page = 1;
          this.getList();
        })
        .catch(res => {
          console.log("error", res);
        }); */
      this.$message({
        message: "已同步3条数据",
        type: "success"
      });
      this.params.page = 1;
      this.getList();
    },
    //终端列表分页
    handleCurrentChange(val) {
      this.params.page = val;
      this.getList();
    },
    //获取终端列表
    getList() {
      /* this.$http
        .mailTerminalQuery(this.params)
        .then(data => {
          console.log(data)
          this.total = data.findForPage.total;
          if (data.findForPage.result == null) {
            this.list = [];
          } else {
            this.list = data.findForPage.result;
          }
        })
        .catch(res => {
          console.log("error", res);
        }); */
      this.loading = true;
      request("/terminalList", data => {
        this.total = data.findForPage.total;
        if (data.findForPage.result == null) {
          this.list = [];
        } else {
          if (!this.$store.state.terminalListData) {
            if (window.sessionStorage.getItem("terminalListData")) {
              //刷新分支
              this.$store.commit(
                "updateTerminalListData",
                window.sessionStorage.getItem("terminalListData")
              );
              this.list = JSON.parse(this.$store.state.terminalListData);
            } else {
              //首次进入分支

              this.list = data.findForPage.result;
              let listJsonStr = JSON.stringify(data.findForPage.result);
              window.sessionStorage.setItem("terminalListData", listJsonStr); //缓存到本地
              this.$store.commit("updateTerminalListData", listJsonStr); //缓存到Store
            }
          } else {
            this.list = JSON.parse(this.$store.state.terminalListData);
          }
        }
        setTimeout(() => {
          this.loading = false;
        }, 400);
      });
    },
    //获取在线终端列表
    getOnlieList() {
      /* this.$http
        .mailTerminalOnline(this.onlineParams)
        .then(data => {
          this.onlineNum = data.online;
          this.onlineTotal = data.online;
        })
        .catch(res => {
          console.log("error", res);
        }); */
      this.onlineNum = 1;
      this.onlineTotal = 1;
    },
    //在线终端列表分页
    onlineCurrentChange(val) {
      this.onlineParams.page = val;
      this.getOnlieList();
    },
    //在线终端统计
    statisticOnline() {
      this.onlineParams.page = 1;
      this.onlineVisible = true;
      this.getOnlieList();
    },
    //编辑
    toEdit(id, row, index) {
      window.sessionStorage.setItem("terminalItemData", JSON.stringify(row)); // 缓存到sessionStore;
      this.$store.commit("updateTerminalItem", JSON.stringify(row)); //缓存到store中
      this.$router.push({ path: "terminalEdit", query: { index } });

      /* var obj = {
        terminalId: id
      };
      this.$http
        .mailTerminalQueryId(obj)
        .then(data => {
          this.dialoForm.isDeleted = data.mailTerminal.isDeleted;
          this.dialoForm.isEdited = data.mailTerminal.isEdited;
          this.dialoForm.orgId = data.mailTerminal.orgId;
          this.dialoForm.originalId = data.mailTerminal.originalId;
          this.dialoForm.sortId = data.mailTerminal.sortId;
          this.dialoForm.terminalCode = data.mailTerminal.terminalCode;
          this.dialoForm.terminalContact = data.mailTerminal.terminalContact;
          this.dialoForm.terminalDomain = data.mailTerminal.terminalDomain;
          this.dialoForm.terminalId = data.mailTerminal.terminalId;
          this.dialoForm.terminalIp = data.mailTerminal.terminalIp;
          this.dialoForm.terminalName = data.mailTerminal.terminalName;
          this.dialoForm.terminalPhone = data.mailTerminal.terminalPhone;
          this.dialoForm.terminalType = data.mailTerminal.terminalType;
          this.dialogVisible = true;
        })
        .catch(res => {
          console.log("error", res);
        }); */
      /*       request("/terminalDetail", data => {
        this.dialoForm.isDeleted = data.mailTerminal.isDeleted;
        this.dialoForm.isEdited = data.mailTerminal.isEdited;
        this.dialoForm.orgId = data.mailTerminal.orgId;
        this.dialoForm.originalId = data.mailTerminal.originalId;
        this.dialoForm.sortId = data.mailTerminal.sortId;
        this.dialoForm.terminalCode = data.mailTerminal.terminalCode;
        this.dialoForm.terminalContact = data.mailTerminal.terminalContact;
        this.dialoForm.terminalDomain = data.mailTerminal.terminalDomain;
        this.dialoForm.terminalId = data.mailTerminal.terminalId;
        this.dialoForm.terminalIp = data.mailTerminal.terminalIp;
        this.dialoForm.terminalName = data.mailTerminal.terminalName;
        this.dialoForm.terminalPhone = data.mailTerminal.terminalPhone;
        this.dialoForm.terminalType = data.mailTerminal.terminalType;
        this.dialogVisible = true;
      }); */
      this.dialoForm = row;
      this.dialogVisible = true;
      this.currentIndex = index;
    },
    //编辑保存提交
    submitForm(formName) {
      /*   this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .mailTerminalEdiorrt(this.dialoForm)
            .then(data => {
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.dialogVisible = false;
              this.getList();
            })
            .catch(res => {
              console.log("error", res);
            });
        } else {
          console.log("error submit");
          return false;
        }
      }); */
      this.list.splice(this.currentIndex, 1, this.dialoForm);
      this.$message({
        message: "保存成功",
        type: "success"
      });
      this.dialogVisible = false;
    },
    //归零
    toZero(row) {
      /*       var obj = {
        terminalId: id
      };
      this.$http
        .mailTerminalPerish(obj)
        .then(data => {
          this.$message({
            message: "归零成功",
            type: "success"
          });
          this.getList();
        })
        .catch(res => {
          console.log("error", res);
        }); */
      this.$message({
        message: "归零成功",
        type: "success"
      });
      row.terminalCode = "000000";
    },
    //排序
    editSort(row, index, type) {
      var list = [];
      list.push(row);
      var row1 = {};
      var index1 = 0;
      if (type == "last") {
        list.push(this.list[index - 1]);
        row1 = this.list[index - 1];
        index1 = index - 1;
      } else {
        list.push(this.list[index + 1]);
        row1 = this.list[index + 1];
        index1 = index + 1;
      }
      this.$message({
        message: "排序已更新",
        type: "success"
      });
      this.list.splice(index, 1, row1);
      this.list.splice(index1, 1, row);
      console.log("list", list);
      /* fetch(`${hostName}/mailTerminal/sort`, {
        headers: {
          "content-type": "application/json"
        },
        method: "post",
        body: JSON.stringify({ terminalId: row.terminalId,sortId:row.sortId })
      }) 
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data.code == "000") {
            this.$message({
              message: "排序已更新",
              type: "success"
            });
            this.getList();
          } else {
            this.$message({
              message: data.msg,
              type: "warning"
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        }); */
    },
    //分配
    toAssign(id) {
      this.$router.push({ path: "terminalAssign" });
      //return;
     /*  this.assignVisible = true; */
      /*       this.assignParams.terminalId = id;
      this.$http
        .orgQuery()
        .then(data => {
          this.treeData = data.data;
        })
        .catch(res => {
          console.log("error", res);
        }); */
      /* request("/organData", data => {
        this.treeData = data.data;
        this.$nextTick(() => this.$refs.orgTree.setCheckedKeys([]));
      }); */
    },
    //选择组织机构
    chooseOrg(data) {
      this.assignParams.orgId = data.originalId;
    },
    //提交分配
    submitAssign() {
      if (this.assignParams.orgId == "") {
        this.$message({
          message: "请选择一个组织机构",
          type: "warning"
        });
        return;
      }
      this.$message({
        message: "分配成功",
        type: "success"
      });
      this.assignVisible = false;
      /*  this.$http
        .mailTerminalOrgan(this.assignParams)
        .then(data => {
          this.$message({
            message: "分配成功",
            type: "success"
          });
          this.assignVisible = false;
        })
        .catch(res => {
          console.log("error", res);
        }); */
    },
     //下载
    handleDownload () {
      this.$refs.download.click();
    },
    //导入
    handleUpload () {
      this.$refs.templateFile.click();
    },
     //导入回调
    templateChange () {
      this.$message({
        type: "success",
        message: "导入成功"
      })
    }
  },
  components: {
    ToolBar
  }
};
</script>
 <style  scoped>
.onlinenumbox {
  margin-bottom: 10px;
}
</style>
 
 
 