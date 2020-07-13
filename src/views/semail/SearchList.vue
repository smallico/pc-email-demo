<template>
  <div id="sendbox">
<!--     <div class="search">
      <div class="ipt-box">
        <input
          type="text"
          placeholder="请输入主题、发件人等搜索"
          class="search-input"
          size="small"
          @keyup.enter="search"
          v-model="keyWord"
        >
        <div class="search-img-box">
          <img src="./../../assets/sendbox/search.png" alt>
        </div>
      </div>
      <el-button type="primary" @click="advancedSearch" size="small">高级搜索</el-button>
      <el-button type="primary" size="small">清除邮件</el-button>
      <el-button type="primary"  size="small">还原邮件</el-button>
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
          <el-form-item label="收件人/终端" :label-width="formLabelWidth" prop="receiver">
            <el-input v-model="form.receiver" auto-complete="off" class="el-ipt"></el-input>
          </el-form-item>
          <el-form-item label="签收状态" :label-width="formLabelWidth" prop="isRecepted">
            <el-select v-model="form.isRecepted" class="el-ipt">
              <el-option label="未签收" :value="0"></el-option>
              <el-option label="签收" :value="1"></el-option>
              <el-option label="拒收" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false;" size="small">取 消</el-button>
          <el-button type="primary" @click="search_go()" size="small">确 定</el-button>
        </div>
      </el-dialog>
    </div> -->

    <div class="el-table-box">
      <p class="send">
        共{{searchListTotal}}封邮件
      </p>
      <div class="table-box">
        <template v-for="(item,index) in searchListTableData">
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
            <el-table-column prop="type" label="类型" min-width="60" align="left" header-align="left">
              <template slot-scope="scope">
                <span v-if="scope.row.type==0">发件</span>
                <span v-if="scope.row.type==1">收件</span>
                <span v-if="scope.row.type==2">草稿</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createdTime"
              label="发文时间"
              align="left"
              header-align="left"
              sortable
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="receiveTime"
              label="收文时间"
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
            ></el-table-column>
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
                          <img src="./../../assets/img/word.png" class="wenjian-type" alt>
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
                          <img src="./../../assets/img/pdf.png" class="wenjian-type" alt>关于组织召开学习新时代精神
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
            <el-table-column
              prop="annexoperation"
              label="操作"
              align="left"
              header-align="left"
              width="200"
            >
              <template slot-scope="scope">
                <div class="operation-div">
                  <el-button type="text" @click="checkDetail(scope.row,index,scope.$index)">查看</el-button>
                  <el-button type="text" @click="deleteRow(scope.row,index,scope.$index)">删除</el-button>
           <!--        <el-button type="text" @click="restoreRow(scope.row,index,scope.$index)">还原</el-button> -->
                  <el-button
                    type="text"
                    @click="manual(scope.row,index,scope.$index,1)"
                    v-if="scope.row.isRecepted==0"
                  >签收</el-button>
                  <el-button
                    type="text"
                    @click="manual(scope.row,index,scope.$index,2)"
                    v-if="scope.row.isRecepted==0"
                  >拒收</el-button>
                  <el-button type="text" v-if="scope.row.isRecepted==1" disabled>已签收</el-button>
                  <el-button type="text" v-if="scope.row.isRecepted==2" disabled>已拒收</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </div>
    <div class="pagination-box">
      <p>共{{searchListTotal}}条记录 当前第1页</p>
      <el-pagination layout="prev, pager, next" :total="Number(searchListTotal)"></el-pagination>
    </div>
    <el-dialog :visible.sync="manualDialogVisible" width="50%">
      <el-form :model="manual_form" :inline="true">
        <el-form-item :label="signLabel" label-width="80">
          <el-input
            v-model="manual_form.reason"
            auto-complete="off"
            class="el-ipt"
            style="width:500px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="manual_cancel()" size="small">取 消</el-button>
        <el-button type="primary" @click="manual_go()" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { request } from "../../api/data-api";
export default {
  name: "SendBox",
  components: {},
  data() {
    return {
      dialogVisible: false, //高级搜索弹出框
      manualDialogVisible: false, //手动操作弹出框
      read_url: require("./../../assets/sendbox/reading.png"),
      no_read_url: require("./../../assets/sendbox/no-reading.png"),
      form: {
        //高级搜索表单控件
        mailSubject: "", //主题
        mailSlevel: "", //密级
        fileNumber: "", //发文编号
        level: "", //等级
        receiver: "", //收件人
        mailType: "", //发文类型
        isRecepted: "" //签收状态
      },
      manual_form: {
        reason: ""
      },
      tIndex: 0,
      manual_index: 0,
      formLabelWidth: "100px",
      keyWord: "",
      signLabel: "签收意见"
    };
  },
  created() {
    if (sessionStorage.getItem("searchListTableData")) {
      this.updateSearchListTableData(
        JSON.parse(sessionStorage.getItem("searchListTableData"))
      );
      this.computedTotal();
    } else {
      this.getTableData();
    }
  },
  methods: {
    ...mapMutations(["updateSearchListTableData", "updateSearchListTotal"]),
    //获取并组装表格数据
    getTableData() {
      request("/searchList", data => {
        console.log("", data);
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
        this.updateSearchListTableData(tableData);
        this.updateSearchListTotal(data.data.total);
      });
    },
    //查看邮件详情
    checkDetail(row, tIndex, index) {
      if (row.type == 0) {
        this.$router.push("/semail/SendMailDetail");
      } else if (row.type == 1) {
        this.$router.push("/semail/recieveMailDetail");
      } else {
        this.$router.push("/semail/send?type=draft");
      }
    },
    //添加表格样式
    cellStyle(row, column, rowIndex, columnIndex) {
      var str = "";
      var colorRed = "color:red;";
      var colorGreen = "color:green;";
      var colorBlack = "color:#333;";
      if (row.row.isOpened == 0) {
        str = "font-weight:bolder;";
      }
      if (row.row.mailType == 0) {
        if (row.row.mailSlevel == 3) {
          return str + colorGreen;
        } else {
          return str + colorRed;
        }
      } else if (row.row.mailType == 1) {
        if (row.row.mailSlevel == 2) {
          return str + colorRed;
        } else {
          return str + colorBlack;
        }
      } else {
        return str + colorGreen;
      }
    },
    //附件预览
    checkFj() {},
    //搜索
    search() {
      this.updateSearchListTableData(
        JSON.parse(sessionStorage.getItem("searchListTableData"))
      );
      if (this.keyWord.trim() !== "") {
        this.searchListTableData.forEach((item, tIndex) => {
          if (tIndex > 0) {
            this.searchListTableData[tIndex].tdata = this.searchListTableData[
              tIndex
            ].tdata.filter(item => {
              if (
                !(item.sender.indexOf(this.keyWord) < 0) ||
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
      this.searchListTableData.forEach((item, tIndex) => {
        if (tIndex > 0) {
          totalNum += this.searchListTableData[tIndex].tdata.length;
        }
      });
      this.updateSearchListTotal(totalNum);
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
      this.updateSearchListTableData(
        JSON.parse(sessionStorage.getItem("searchListTableData"))
      );
      this.searchListTableData.forEach((item, tIndex) => {
        if (tIndex > 0) {
          this.searchListTableData[tIndex].tdata = this.searchListTableData[
            tIndex
          ].tdata.filter(item => {
            var _this = this;
            var isSame = true;
            for (var key in _this.form) {
              console.log("key", key);
              if (_this.form[key] !== "") {
                console.log("nonekey", key);
                if (_this.form[key] != item[key]) {
                  isSame = false;
                  console.log("555", _this.form[key], item[key]);
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
    //签收拒收
    manual(row, tIndex, index, type) {
      this.manual_form.reason = "";
      this.tIndex = tIndex;
      this.manual_index = index;
      if (type == 1) {
        this.signLabel = "签收意见";
      } else {
        this.signLabel = "拒收意见";
      }
      this.manualDialogVisible = true;
    },
    //取消签收拒收
    manual_cancel() {
      this.manualDialogVisible = false;
    },
    //提交签收拒收原因
    manual_go(row) {
      if (this.signLabel == "签收意见") {
        this.searchListTableData[this.tIndex].tdata[
          this.manual_index
        ].isRecepted = 1;
        this.searchListTableData[this.tIndex].tdata[
          this.manual_index
        ].receiveTime = this.timestampFormateDate(new Date().getTime());
      } else {
        this.searchListTableData[this.tIndex].tdata[
          this.manual_index
        ].isRecepted = 2;
      }
      this.searchListTableData[this.tIndex].tdata[
        this.manual_index
      ].receptedContent = this.manual_form.reason;
      this.updateSearchListTableData(this.searchListTableData);
      this.manualDialogVisible = false;
    },
    //删除某一行
    deleteRow(row, tIndex, index) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.searchListTableData[tIndex].tdata.splice(index, 1);
          this.updateSearchListTableData(this.searchListTableData);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.updateSearchListTotal(this.searchListTotal - 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //还原
    restoreRow(row, tIndex, index) {
      this.$confirm("确定要还原吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.searchListTableData[tIndex].tdata.splice(index, 1);
          this.updateSearchListTableData(this.searchListTableData);
          this.$message({
            type: "success",
            message: "还原成功!"
          });
          this.updateSearchListTotal(this.searchListTotal - 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消还原"
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
      this.searchListTableData.forEach((item, index) => {
        if (index > 0) {
          this.$refs.table[index].clearSelection();
        }
      });
      if (selection.length > 0) {
        this.searchListTableData.forEach((item, index) => {
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
    //未读
    unread_num() {
      var num = 0;
      this.searchListTableData.forEach((item, tIndex) => {
        if (tIndex > 0) {
          this.searchListTableData[tIndex].tdata.forEach(item => {
            if (item.isOpened == 0) {
              num++;
            }
          });
        }
      });
      return num;
    },
    //未签收
    unsign_num() {
      var num = 0;
      this.searchListTableData.forEach((item, tIndex) => {
        if (tIndex > 0) {
          this.searchListTableData[tIndex].tdata.forEach(item => {
            if (item.isRecepted == 0) {
              num++;
            }
          });
        }
      });
      return num;
    },
    //密级下拉
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
    ...mapState(["searchListTableData", "searchListTotal"])
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
    .el-btn {
      width: 50px;
      height: 30px;
    }

    .el-ipt {
      width: 350px;
      .alert-img {
        width: 100%;
        height: auto;
      }
    }
  }
  .el-table-box {
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
  }
  .pagination-box {
    display: flex;
    justify-content: space-between;
    margin-top: 50px;
  }
}
</style>
