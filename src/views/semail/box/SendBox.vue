<template>
  <div id="sendbox">
    <div class="search">
      <div class="ipt-box">
        <input
          type="text"
          placeholder="请输入主题、收件人等搜索"
          class="search-input"
          size="small"
          @keyup.enter="search"
          v-model="keyWord"
        >
        <div class="search-img-box">
          <img src="./../../../assets/sendbox/search.png" alt>
        </div>
      </div>
      <el-button type="primary" @click="advancedSearch" size="small">高级搜索</el-button>
      <el-dialog :visible.sync="dialogVisible" width="50%">
        <el-form :model="form" :inline="true" size="small" ref="advancedForm">
          <el-form-item label="主题" :label-width="formLabelWidth" prop="mailSubject">
            <el-input v-model="form.mailSubject" auto-complete="off" class="el-ipt"></el-input>
          </el-form-item>
          <el-form-item label="发文类型" :label-width="formLabelWidth" prop="mailType">
            <el-select v-model="form.mailType" class="el-ipt">
              <el-option label="公文信息" :value="0"></el-option>
              <el-option label="涉密信息" :value="1"></el-option>
              <el-option label="非密信息" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="密级" :label-width="formLabelWidth" prop="mailSubject">
            <el-select v-model="form.mailSlevel" class="el-ipt">
              <el-option
                :label="slevel.label"
                :value="slevel.value"
                v-for="slevel in options"
                :key="slevel.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发文编号" :label-width="formLabelWidth" prop="fileNumber">
            <el-input v-model="form.fileNumber" auto-complete="off" class="el-ipt"></el-input>
          </el-form-item>
          <el-form-item label="等级" :label-width="formLabelWidth" prop="level">
            <el-select v-model="form.level" class="el-ipt">
              <el-option label="急" :value="0"></el-option>
              <el-option label="特急" :value="1"></el-option>
              <el-option label="加急" :value="2"></el-option>
            </el-select>
          </el-form-item>

          <!--           <el-form-item label="签收状态" :label-width="formLabelWidth">
            <el-select v-model="form.signing_status" class="el-ipt">
              <el-option label="已签收" value="已签收"></el-option>
              <el-option label="未签收" value="未签收"></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="收件人/单位" :label-width="formLabelWidth" prop="receiver">
            <el-input v-model="form.receiver" auto-complete="off" class="el-ipt"></el-input>
          </el-form-item>
          <el-form-item label="完成状态" :label-width="formLabelWidth" prop="isFinished">
            <el-select v-model="form.isFinished" class="el-ipt">
              <el-option label="未完成" :value="0"></el-option>
              <el-option label="已完成" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false;" size="small">取 消</el-button>
          <el-button type="primary" @click="search_go()" size="small">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="el-table-box">
      <p class="send">
        共{{sendTotal}}封邮件（
        <span>未完成{{unfinish_num}}封）</span>
      </p>
      <div class="table-box">
        <template v-for="(item,index) in sendBoxTableData">
          <p
            class="table-title"
            v-if="item.title!==''&&item.tdata.length>0"
            :key="'title'+index"
          >{{item.title+'('+item.tdata.length+")"}}</p>
          <el-table
            ref="table"
            :data="item.tdata"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            :cell-style="cellStyle"
            @select-all="selectAll"
            size="medium"
            :key="index"
            :show-header="index==0"
            :class="index==0?'headTable':''"
          >
            <el-table-column type="selection" align="left" header-align="left" min-width="40"></el-table-column>
            <!--             <el-table-column
              prop="no_reading"
              label="状态"
              min-width="60"
              align="left"
              header-align="left"
            >
              <template slot-scope="scope">
                <img :src="scope.row.read_status?read_url:no_read_url" alt @click="f(scope.row.id)">
              </template>
            </el-table-column>-->
            <el-table-column
              prop="createdTime"
              label="发文时间"
              align="left"
              header-align="left"
              sortable
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column prop="fileNumber" label="发文编号" align="left" header-align="left"></el-table-column>
            <el-table-column
              prop="mailSubject"
              label="主题"
              align="left"
              header-align="left"
              :show-overflow-tooltip="true"
              min-width="150"
            >
              <template slot-scope="scope">
                <span
                  class="cur-p"
                  @click="checkDetail(scope.row,index,scope.$index)"
                >{{scope.row.mailSubject}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="mailSlevel" label="密级" align="left" header-align="left">
              <template slot-scope="scope">
                <span v-if="scope.row.mailSlevel==0">秘密</span>
                <span v-if="scope.row.mailSlevel==1">机密</span>
                <span v-if="scope.row.mailSlevel==2">绝密</span>
                <span v-if="scope.row.mailSlevel==3">明电</span>
                <span v-if="scope.row.mailSlevel==4">公开发布</span>
                <span v-if="scope.row.mailSlevel==5">内部（受控）</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="level"
              label="等级"
              align="left"
              header-align="left"
              min-width="50"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.level==0">急</span>
                <span v-if="scope.row.level==1">特急</span>
                <span v-if="scope.row.level==2">加急</span>
              </template>
            </el-table-column>
            <el-table-column prop="receiver" label="收件人/终端" align="left" header-align="left"></el-table-column>
            <el-table-column
              prop="annex"
              label="附件"
              align="left"
              header-align="left"
              min-width="50"
            >
              <template slot-scope="scope">
                <el-tooltip placement="bottom" effect="light">
                  <div slot="content">
                    <ul class="flex">
                      <li
                        class="flex"
                        v-for="(file,fileIndex) in scope.row.fileList"
                        :key="'file'+fileIndex"
                      >
                        <div>
                          <img src="./../../../assets/img/word.png" class="wenjian-type" alt>
                          {{file.fileName}}
                        </div>
                        <div style="margin-top:5px;width:100%;height:25px;">
                          <div style="float:right;">
                            <el-button size="mini" type="text" @click="checkFj">预览</el-button>
                          </div>
                        </div>
                      </li>
                      <!--                       <li class="flex">
                        <div>
                          <img src="./../../../assets/img/pdf.png" class="wenjian-type" alt>关于组织召开学习新时代精神
                          的培训时间安排.doc
                        </div>
                        <div style="margin-top:5px;width:100%;height:25px;">
                          <div style="float:right;">
                            <el-button size="mini" @click="checkFj" type="text">预览</el-button>
                          </div>
                        </div>
                      </li>-->
                    </ul>
                  </div>
                  <span
                    style="color:#67C23A;cursor:pointer;margin-left:5px;width:40px;"
                  >{{scope.row.fileList.length}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="isFinished" label="完成状态" align="left" header-align="left">
              <template slot-scope="scope">
                <span v-if="scope.row.isFinished==0">未完成</span>
                <span v-if="scope.row.isFinished==1">已完成</span>
              </template>
            </el-table-column>
            <el-table-column prop label="投递状态" width="82" align="left" header-align="left">
              <template slot-scope="scope">
                <span class="to-hand" @click="look(scope.row)">查看</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="annexoperation"
              label="操作"
              align="left"
              header-align="left"
              width="200"
            >
              <template slot-scope="scope">
                <div class="operation-div">
                  <!--  <el-button type="text" @click="checkDetail">查看</el-button> -->
                  <el-button type="text" @click="deleteRow(scope.row,index,scope.$index)">删除</el-button>
                  <el-button
                    type="text"
                    @click="withdraw(scope.row,index,scope.$index)"
                    v-if="scope.row.isFinished==0"
                  >撤回</el-button>
                  <el-button
                    type="text"
                    @click="manual(scope.row,index,scope.$index)"
                    v-if="scope.row.isFinished==0"
                  >手动操作</el-button>
                </div>

                <el-dialog :visible.sync="manualDialogVisible" width="50%">
                  <el-form :model="manual_form" :inline="true">
                    <el-form-item label="人工干预原因" :label-width="formLabelWidth">
                      <el-input v-model="manual_form.reason" auto-complete="off" class="el-ipt"></el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="manual_cancel()" size="small">取 消</el-button>
                    <el-button type="primary" @click="manual_go(scope.row)" size="small">确 定</el-button>
                  </div>
                </el-dialog>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </div>
    <div class="pagination-box">
      <p>共{{sendTotal}}条记录 当前第1页</p>
      <el-pagination layout="prev, pager, next" :total="Number(sendTotal)"></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { request } from "../../../api/data-api";
export default {
  name: "SendBox",
  components: {},
  data() {
    return {
      dialogVisible: false, //高级搜索弹出框
      manualDialogVisible: false, //手动操作弹出框
      read_url: require("./../../../assets/sendbox/reading.png"),
      no_read_url: require("./../../../assets/sendbox/no-reading.png"),
      form: {
        //高级搜索表单控件
        mailSubject: "", //主题
        mailSlevel: "", //密级
        fileNumber: "", //发文编号
        level: "", //等级
        receiver: "", //收件人
        mailType: "", //发文类型
        isFinished: "" //完成状态
      },
      manual_form: {
        reason: ""
      },
      tIndex: 0,
      manual_index: 0,
      formLabelWidth: "100px",
      keyWord: ""
    };
  },
  created() {
    if (sessionStorage.getItem("sendBoxTableData")) {
      this.updateSendBoxTableData(
        JSON.parse(sessionStorage.getItem("sendBoxTableData"))
      );
      this.computedTotal();
    } else {
      this.getTableData();
    }
  },
  methods: {
    ...mapMutations(["updateSendBoxTableData", "updateSendTotal"]),
    //获取并组装表格数据
    getTableData() {
      request("/sendBox", data => {
        console.log("send", data);
        var tableData = [];
        tableData.push({
          title: "",
          tdata: [
            ...data.data.today,
            ...data.data.yesterday,
            ...data.data.pastDay
          ]
        });
        tableData.push({
          title: "今天",
          tdata: data.data.today
        });
        tableData.push({
          title: "昨天",
          tdata: data.data.yesterday
        });
        tableData.push({
          title: "更早",
          tdata: data.data.pastDay
        });
        this.updateSendBoxTableData(tableData);
        this.updateSendTotal(data.data.total);
      });
    },
    //查看发件详情
    checkDetail() {
      this.$router.push("/semail/SendMailDetail");
    },
    //添加表格样式
    cellStyle(row, column, rowIndex, columnIndex) {
      if (row.row.mailType == 0) {
        if (row.row.mailSlevel == 3) {
          return "color:green";
        } else {
          return "color:red";
        }
      } else if (row.row.mailType == 1) {
        if (row.row.mailSlevel == 2) {
          return "color:red";
        } else {
          return "color:#000";
        }
      } else {
        return "color:green";
      }
    },
    //附件预览
    checkFj() {},
    //搜索
    search() {
      this.updateSendBoxTableData(
        JSON.parse(sessionStorage.getItem("sendBoxTableData"))
      );
      if (this.keyWord.trim() !== "") {
        this.sendBoxTableData.forEach((item, tIndex) => {
          if (tIndex > 0) {
            this.sendBoxTableData[tIndex].tdata = this.sendBoxTableData[
              tIndex
            ].tdata.filter(item => {
              if (
                !(item.receiver.indexOf(this.keyWord) < 0) ||
                !(item.mailSubject.indexOf(this.keyWord) < 0)
              ) {
                return item;
              }
            });
          }
        });
      }
      this.computedTotal();
    },
    //计算总条数
    computedTotal() {
      var totalNum = 0;
      this.sendBoxTableData.forEach((item, tIndex) => {
        if (tIndex > 0) {
          totalNum += this.sendBoxTableData[tIndex].tdata.length;
        }
      });
      this.updateSendTotal(totalNum);
    },
    //高级搜索
    advancedSearch() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.advancedForm.resetFields();
      });
    },
    //高级搜索提交
    search_go() {
      this.updateSendBoxTableData(
        JSON.parse(sessionStorage.getItem("sendBoxTableData"))
      );
      this.sendBoxTableData.forEach((item, tIndex) => {
        if (tIndex > 0) {
          this.sendBoxTableData[tIndex].tdata = this.sendBoxTableData[
            tIndex
          ].tdata.filter(item => {
            var _this = this;
            var isSame = true;
            for (var key in _this.form) {
              if (_this.form[key] !== "") {
                if (_this.form[key] != item[key]) {
                  isSame = false;
                }
              }
            }
            if (isSame) {
              return item;
            }
          });
        }
      });
      this.computedTotal();
      this.dialogVisible = false;
    },
    //手动操作
    manual(row, tIndex, index) {
      this.manual_form.reason = "";
      this.tIndex = tIndex;
      this.manual_index = index;
      this.manualDialogVisible = true;
    },
    //取消手动操作
    manual_cancel() {
      this.manualDialogVisible = false;
    },
    //提交干预原因
    manual_go(row) {
      this.sendBoxTableData[this.tIndex].tdata[
        this.manual_index
      ].isFinished = 1;
      this.sendBoxTableData[this.tIndex].tdata[
        this.manual_index
      ].intervenedReason = this.manual_form.reason;
      this.updateSendBoxTableData(this.sendBoxTableData);
      this.manualDialogVisible = false;
    },
    //查看详情
    look() {
      this.$router.push("/semail/box/Delivery");
    },
    //删除某一行
    deleteRow(row, tIndex, index) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.sendBoxTableData[tIndex].tdata.splice(index, 1);
          this.updateSendBoxTableData(this.sendBoxTableData);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.updateSendTotal(this.sendTotal - 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //撤回
    withdraw(row, tIndex, index) {
      this.$confirm("确定要撤回吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.sendBoxTableData[tIndex].tdata.splice(index, 1);
          this.updateSendBoxTableData(this.sendBoxTableData);
          this.$message({
            type: "success",
            message: "撤回成功!"
          });
          this.updateSendTotal(this.sendTotal - 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤回"
          });
        });
    },

    f() {
      console.log(1);
    },
    handleSelectionChange() {},
    //全选
    selectAll(selection) {
      //同时选中多个table多选框
      //selection代表已选中的数量
      this.sendBoxTableData.forEach((item, index) => {
        if (index > 0) {
          this.$refs.table[index].clearSelection();
        }
      });
      if (selection.length > 0) {
        this.sendBoxTableData.forEach((item, index) => {
          if (index > 0) {
            item.tdata.forEach(row => {
              this.$refs.table[index].toggleRowSelection(row);
            });
          }
        });
      }
    }
  },
  computed: {
    //未完成
    unfinish_num() {
      var num = 0;
      this.sendBoxTableData.forEach((item, tIndex) => {
        if (tIndex > 0) {
          this.sendBoxTableData[tIndex].tdata.forEach(item => {
            if (item.isFinished == 0) {
              num++;
            }
          });
        }
      });
      return num;
    },
    options() {
      var option = [
        {
          value: 3,
          label: "明电"
        },
        {
          value: 0,
          label: "秘密"
        },
        {
          value: 1,
          label: "机密"
        },
        {
          value: 2,
          label: "绝密"
        }
      ];
      var option1 = [
        {
          value: 0,
          label: "秘密"
        },
        {
          value: 1,
          label: "机密"
        },
        {
          value: 2,
          label: "绝密"
        }
      ];
      var option2 = [
        {
          value: 4,
          label: "公开发布"
        },
        {
          value: 5,
          label: "内部（受控）"
        }
      ];
      if (this.form.mailType == 0) {
        return option;
      } else if (this.form.mailType == 1) {
        return option1;
      } else if (this.form.mailType == 2) {
        return option2;
      } else {
        return [];
      }
    },
    ...mapState(["sendBoxTableData", "sendTotal"])
  }
};
</script>

<style scoped lang='scss'>
.wenjian-type {
  height: 30px;
  width: 30px;
  display: inline-block;
}
.flex {
  display: block;
}
#sendbox {
  .search {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .ipt-box {
      background: #fff;
      width: 300px;
      border-radius: 19px;
      border: solid 1px #cdcdcd;
      position: relative;
      margin-right: 20px;
      .search-input {
        margin-left: 30px;
        width: 210px;
        height: 35px;
        border: none;
      }
      .search-img-box {
        background: #fff;
        position: absolute;
        top: 9px;
        right: 29px;
      }
    }
    .el-form-item {
      margin-top: 14px;
    }
    .el-ipt {
      width: 350px;
    }
    .el-btn {
      width: 50px;
      height: 30px;
    }
    .search-btn {
      padding: 9px 15px;
      font-size: 12px;
      background-color: #0ba86c;
      border-radius: 3px;
      border: solid 1px #0ba86c;
      color: #fff;
      margin-left: 35px;
    }
    .search-btn:hover {
      background: #3cb989;
      border-color: #3cb989;
    }
    .alert-img {
      width: 100%;
      height: auto;
    }
  }
  .el-table-box {
    margin-top: 30px;
    .send {
      color: #0c86dc;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .table-operate {
      margin-left: 10px;
    }
    .to-hand {
      cursor: pointer;
      color: #0ba86c;
    }
    .el-form-item {
      margin-top: 14px;
    }
    .el-btn {
      width: 50px;
      height: 30px;
    }
    .el-ipt {
      width: 350px;
    }
    .yesterday {
      color: #383939;
      font-size: 16px;
      margin-top: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ccc;
    }
    .tableCell-operation {
      span {
        margin-right: 15px;
      }
    }
  }
  .pagination-box {
    display: flex;
    justify-content: space-between;
    margin-top: 50px;
  }
}
</style>
