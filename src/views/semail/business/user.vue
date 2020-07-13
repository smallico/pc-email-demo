<template>
  <div class="content">
    <div class="left-wrap">
      <div class="left">
            <el-tabs @tab-click="handleClick">
              <el-tab-pane>
                <span slot="label">
                  组织机构
                  <!-- <i class="el-icon-circle-plus-outline" @click="tabFirst"></i> -->
                </span>
                <el-tree
                  :data="data1"
                  :props="defaultProps1"
                  :accordion="true"
                  @node-click="handleNodeClick1"
                  node-key="userId"
                ></el-tree>
              </el-tab-pane>
              <!-- <el-tab-pane>
                <span slot="label">
                  分组
                  <i class="el-icon-circle-plus-outline" @click="dialogVisible=true"></i> 
                </span>
                <el-tree
                  :data="data2"
                  :props="defaultProps2"
                  :accordion="true"
                  @node-click="handleNodeClick2"
                  node-key="userId"
                ></el-tree>
                <el-tree
                  :data="allData"
                  :props="defaultProps2"
                  :accordion="true"
                  @node-click="handleNodeClick2"
                  node-key="userId"
                ></el-tree>
              </el-tab-pane> -->
            </el-tabs>
          </div>
    </div>
    
    <div class="right" v-if="status == 0">
      <div class="rightHead search-top" style="position:relative;">
        <div>
          <el-button type="primary" size="small" @click="dialogFormVisible1=true">新建联系人</el-button>

          <!-- no-select -->
          <!-- <el-button
          style="margin-left:-1px;"
          size="small"
          v-if="selectStatus==0"
          @click="groupsDialog=true"
        >移动</el-button>
          <el-button style="margin-left:-1px;" size="small" @click="write" v-if="selectStatus==0">写信</el-button>-->
          <!-- select -->
          <!-- <el-button style="margin-left:-1px;" size="small" @click="write" v-if="selectStatus==1">发邮件</el-button> -->
          <el-button
            style="margin-left:-1px;"
            size="small"
            @click="groups"
            v-if="selectStatus==1"
          >分组</el-button>

          <el-button style="margin-left:-1px;" size="small" @click="del" v-if="selectStatus==1">删除</el-button>
        </div>
        <div>
          <el-input
            placeholder="搜索所有联系人"
            size="small"
            style="width: 180px;margin-left:10px;"
            type="text"
            v-model="search"
            clearable
            @blur="searchblur"
          />
          <el-button
            v-loading="loading"
            type="primary"
            size="small"
            icon="el-icon-search"
            @click="handleSearch(search,list)"
          >查询</el-button>
        </div>
      </div>
      <div class="rightContent">
        <el-table
          :data="list"
          border
          ref="table"
          style="width:100%"
          :loading="searchloading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column width="70">
            <template slot-scope="scope">
              <!-- <span v-if="isActive" class="el-icon-star-off star" @click="ctog(scope.row.userId)"></span>
              <span v-else class="active el-icon-star-off star" @click="ctog(scope.row.userId)"></span>-->
              <span
                class="el-icon-star-off star"
                :class="{ 'active':scope.row.groupId==2}"
                @click="ctog(scope.row,scope.$index)"
              ></span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮件地址"></el-table-column>
          <el-table-column prop="phone" label="手机号码"></el-table-column>
          <el-table-column label="所在分组">
            <template slot-scope="scope">
              <span v-if="scope.row.groupId==1">常用联系人</span>
              <span v-if="scope.row.groupId==2">星标联系人</span>
              <span v-if="scope.row.groupId==3">自定义分组一</span>
              <span v-if="scope.row.groupId==4">自定义分组二</span>
            </template>
          </el-table-column>
          <el-table-column width="250" label="操作">
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="edit('check',scope.row)">查看</el-button>
              <el-button size="small" type="text" @click="edit('edit',scope.row,scope.$index)">编辑</el-button>
              <!--      <el-button size="small" type="text" @click="write(scope.row)">写信</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-dialog :title="ischeck?'查看信息':'编辑信息'" :visible.sync="dialogFormVisible3">
          <el-form :model="cform">
            <el-form-item label="姓名">
              <el-input v-model="eform.name" auto-complete="off" placeholder="请输入姓名" :disabled="ischeck" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="eform.email" auto-complete="off" placeholder="请输入邮箱" :disabled="ischeck" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="eform.phone" auto-complete="off" placeholder="请输入手机号码" :disabled="ischeck" style="width:400px;"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" v-if="!ischeck">
            <el-button @click="dialogFormVisible3 = false">取 消</el-button>
            <el-button @click="esure" type="primary">确定</el-button>
          </div>
        </el-dialog>-->
        <el-pagination
          style="background:#fff;padding:20px 10px;text-align:right;"
          layout="prev, pager, next"
          :current-page="params.page"
          :page-size="params.size"
          @current-change="handleCurrentChange"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <div class="right" v-if="status == 1">
      <div class="rightHead">
        <el-button type="warning" size="small" @click="tabFirst">保存</el-button>
        <el-button size="small" @click="tabFirst">取消</el-button>
      </div>
      <div class="rightContent">
        <el-form 
          ref="form" 
          :model="form" 
          label-width="120px" 
          size="small" 
          label-position="left"
          style="width:500px;">
          <el-form-item label="姓名">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="form.resource">
              <el-radio label="男"></el-radio>
              <el-radio label="女"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="电子邮箱">
            <el-input v-model="form.name" placeholder="请输入电子邮箱"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="form.name" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="从属单位">
            <el-input v-model="form.name" placeholder="请选择" readonly></el-input>
            <i
              class="el-select__caret el-input__icon el-icon-arrow-up"
              style="transform: rotateZ(180deg); position:absolute;right:6px;top:6px;height:30px;"
            ></i>
            <div
              style="height:160px;border:1px solid #C0C4CC;margin-top:4px;border-radius:2px;overflow:auto;"
            >
              <el-tree
                :data="data3"
                show-checkbox
                node-key="id"
                :default-expanded-keys="[2, 3]"
                :default-checked-keys="[3]"
                :props="defaultProps"
              ></el-tree>
            </div>
          </el-form-item>
          <el-form-item label="从属分组">
            <el-input v-model="form.name" placeholder="请选择" readonly></el-input>
            <i
              class="el-select__caret el-input__icon el-icon-arrow-up"
              style="transform: rotateZ(180deg); position:absolute;right:6px;top:6px;height:30px;"
            ></i>
            <div
              style="height:88px;border:1px solid #C0C4CC;margin-top:4px;border-radius:2px;overflow:auto;"
            >
              <el-checkbox
                style="display:block;margin-left:10px;"
                :label="group.name"
                name="type"
                @change="nearby(group.id)"
                v-for="group in data2"
                :key="'group'+group.id"
              ></el-checkbox>
              <!--     <el-checkbox
                style="display:block;margin-left:10px;"
                label="星标联系人"
                name="type"
                @change="starconcat"
              ></el-checkbox>
              <el-checkbox
                style="display:block;margin-left:10px;"
                label="单位"
                name="type"
                @change="unit"
              ></el-checkbox>-->
            </div>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="form.desc" rows="8"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog title="新建组" :visible.sync="dialogVisible" :modal="false">
      <el-input size="small" type="text" v-model="name" placeholder="请输入分组的名字"/>
      <!--    <el-transfer
        filterable
        :filter-method="filterMethod"
        filter-placeholder="请输入城市拼音"
        v-model="value2"
        :data="data2"
      ></el-transfer>-->
      <div class="box-container">
        <div class="dialog-box">
          <div class="new-box-title">所有联系人</div>
          <div class="c-box">
            <div class="search-concat-box">
              <el-input
                placeholder="过滤tree"
                size="small"
                class="serch-input"
                type="text"
                v-model="term"
                @keyup.native.enter="searchConcat"
              ></el-input>
              <!-- <img src="../../assets/img/search-icon.png" alt class="search-icon"> -->
              <i class="el-icon-search search-icon" @click="searchConcat"></i>
            </div>
            <el-tree
              :data="data2"
              :props="dialogdefaultProps"
              ref="tree2"
              @node-click="handleNodeClick"
              default-expand-all
              :filter-node-method="filterNode"
            ></el-tree>
          </div>
        </div>
        <div class="arrow">=&gt;&gt;</div>
        <div class="dialog-box">
          <div class="new-box-title">
            <span>已有联系人</span>
            <span class="remove-all" @click="moveResult">全部移除</span>
          </div>
          <div class="c-box">
            <ul v-for="(item) in searchResult" :key="item.id">
              <li class="choose-item">
                <span>{{item.name}}</span>
                <!-- <img src="../../assets/img/delete-icon.png" class="remove-icon" alt> -->
                <i class="el-icon-remove-outline remove-icon"></i>
              </li>
              <!-- <li class="choose-item">
                <span>xxx处长</span>
                <i class="el-icon-remove-outline remove-icon"></i>
              </li>
              <li class="choose-item">
                <span>xxx处长</span>

                <i class="el-icon-remove-outline remove-icon"></i>
              </li>-->
            </ul>
          </div>
        </div>
      </div>

      <div slot="footer">
        <el-button size="small" @click="newGroupSure" type="primary">保存</el-button>
        <el-button size="small" @click="dialogVisible=false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新建联系人" :visible.sync="dialogFormVisible1">
      <el-form 
        :model="cform" 
        :rules="rules"
        inline
        size="small"
        label-position="left"
        label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="cform.name" auto-complete="off" placeholder="请输入姓名" ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="cform.email" auto-complete="off" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="cform.phone" auto-complete="off" placeholder="请输入手机号码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false" size="small">取 消</el-button>
        <el-button @click="csure" type="primary" size="small">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分组" :visible.sync="groupsDialog">
      <el-form>
        <el-form-item label="从属分组">
          <!-- <el-input placeholder="请选择123" readonly></el-input> -->
          <!-- <i
                class="el-select__caret el-input__icon el-icon-arrow-up"
                style="transform: rotateZ(180deg); position:absolute;right:6px;top:50px;height:30px;"
          ></i>-->
          <div style="margin-top:4px;border-radius:2px;overflow:auto;">
            <el-radio-group
              size="medium"
              v-for="group in data2"
              :key="group.id"
              @change="nearby(group.id)"
            >
              <el-radio-button
                style="display:inline;margin-left:8px;margin-top:10px;"
                :label="group.name"
                name="type"
                :key="group.id"
              ></el-radio-button>
            </el-radio-group>
            <!-- <el-checkbox style="display:block;margin-left:8px;margin-top:10px;"
                  :label="group.name"
                  name="type"
                  @change="nearby(group.id)"
                  v-for="group in data2"
                  :key="group.id">

            </el-checkbox>-->
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="groupsDialog = false">取 消</el-button>
        <el-button @click="groupsbtn" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisible2">
      <span>确定要删除这一列吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button @click="dsure" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { request } from "../../../api/data-api";
export default {
  data() {
    return {
      currentIndex: 0,
      dialogFormVisible1: false,
      dialogFormVisible3: false,
      dialogVisible2: false,
      cform: {
        name: "",
        phone: "",
        email: ""
      },
      eform: {
        name: "",
        phone: "",
        email: "",
        id: ""
      },
      searchResult: [],
      groupsDialog: false,
      groupform: [],
      isActive: 0,
      loading: false,
      searchloading: false,
      dialogVisible: false,
      multipleSelection: [],
      name: "",
      term: "",
      selectStatus: 0,
      groupsIndex: 3,
      data: [
        // {
        //   groupId: 1,
        //   name: "单位一",
        //   orderNum: 1,
        //   groupDesc: "这是朋友分组",
        //   userId: null,
        //   children: [
        //     {
        //       terminalId: 1,
        //       name: "部门一",
        //       loginAccount: "小小李",
        //       loginPassword: "56df45sgfd15gs4f5g1sf15gsf5",
        //       accountStatus: "1",
        //       orgId: "1",
        //       isedited: "1",
        //       originalId: "123321",
        //       isDeleted: "0",
        //       userCode: "5123",
        //       loginMode: 0,
        //       orderNum: "1"
        //     },
        //     {
        //       terminalId: 2,
        //       name: "部门二",
        //       loginAccount: "小小王",
        //       loginPassword: "56df45sgfd15gs4f5g1sf15gsf5",
        //       accountStatus: "1",
        //       orgId: "1",
        //       isedited: "1",
        //       originalId: "123321",
        //       isDeleted: "0",
        //       userCode: "5123",
        //       loginMode: 0,
        //       orderNum: "1"
        //     }
        //   ]
        // },
        // {
        //   groupId: 2,
        //   name: "单位二",
        //   orderNum: 2,
        //   groupDesc: "这是同事分组",
        //   userId: null,
        //   children: [
        //     {
        //       terminalId: 3,
        //       name: "部门一",
        //       loginAccount: "小小赵",
        //       loginPassword: "56df45sgfd15gs4f5g1sf15gsf5",
        //       accountStatus: "1",
        //       orgId: "1",
        //       isedited: "1",
        //       originalId: "123321",
        //       isDeleted: "0",
        //       userCode: "5123",
        //       loginMode: 0,
        //       orderNum: "1"
        //     },
        //     {
        //       terminalId: 4,
        //       name: "部门二",
        //       loginAccount: "小小肖",
        //       loginPassword: "56df45sgfd15gs4f5g1sf15gsf5",
        //       accountStatus: "1",
        //       orgId: "1",
        //       isedited: "1",
        //       originalId: "123321",
        //       isDeleted: "0",
        //       userCode: "5123",
        //       loginMode: 0,
        //       orderNum: "1"
        //     }
        //   ]
        // }
      ],
      rules: {
        name: [
          { required: true, message: "请输入活动姓名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { trigger: "blur" }
        ]
      },
      dialogdefaultProps: {
        children: "children",
        label: "name"
      },
      choosedArr: [],
      list: [],
      log: [],
      params: {
        page: 1,
        size: 15
      },
      total: 100,
      search: "",
      status: 0,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "男",
        desc: ""
      },
      data1: [],
      defaultProps1: {
        children: "children",
        label: "name"
      },
      data2: [],
      defaultProps2: {
        children: "children",
        label: "name"
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
      data3: [
        {
          id: 1,
          label: "单位 一",
          children: [
            {
              id: 3,
              label: "部门1"
            },
            {
              id: 4,
              label: "部门2"
            },
            {
              id: 5,
              label: "部门3"
            },
            {
              id: 6,
              label: "部门4"
            }
          ]
        },
        {
          id: 2,
          label: "单位 二"
        }
      ],
      defaultProps3: {
        children: "children",
        label: "label"
      },
      allData: [],
      choosedGroupId: "",
      ischeck: true
    };
  },
  created() {
    this.getList();

    request("/concatOrganData", data => {
      this.data1 = data.data;
    });
  },
  methods: {
    /**
     * 获取表格页面数据
     */
    getList() {
      request("/groupData", data => {
        this.data2 = data.data.group;
        this.allData = data.data.allData;
        this.data = this.allData[0].children;
        if (this.allData[0].children && this.allData[0].children.length != 0) {
          if (!this.$store.state.userListData) {
            if (window.sessionStorage.getItem("userListData")) {
              //刷新情况
              console.log("刷新分支");
              this.$store.commit(
                "updateUserListData",
                window.sessionStorage.getItem("userListData")
              );
              // this.$store.commit(
              // //   "updateIsCheck",
              // //   window.sessionStorage.getItem("isCheck") == "true"
              // //     ? true
              // //     : false
              // // );
              // // console.log(
              // //   "dddd",
              // //   window.sessionStorage.getItem("isCheck") == "true"
              // //     ? true
              // //     : false
              // // );
              this.list = JSON.parse(this.$store.state.userListData);
            } else {
              //首次进入

              console.log("首次进入分支");
              this.list = this.allData[0].children;
              let userListDataJsonStr = JSON.stringify(
                this.allData[0].children
              );
              window.sessionStorage.setItem(
                "userListData",
                userListDataJsonStr
              );
              this.$store.commit("updateUserListData", userListDataJsonStr);
            }
          } else {
            this.list = JSON.parse(this.$store.state.userListData);
          }
        }
      });
    },
    newGroupSure() {
      if (name.length > 0) {
        var obj = {};
        obj.name = this.name;
        obj.id = 6;
        // var children=[];
        // children.push(this.searchResult);
        obj.children = this.searchResult;
        this.data2.push(obj);
        this.dialogVisible = false;
      } else {
        this.$message({
          message: "请输入分组名",
          type: "error"
        });
      }
    },
    moveResult() {
      this.searchResult = [];
    },
    searchConcat() {
      this.$refs.tree2.filter(this.term);
      console.log("wnrer");
    },
    filterNode(value, data) {
      console.log("1231123");
      if (!value) return;
      return data.name.indexOf(value) !== -1;
    },
    initlist() {
      request("/groupData", data => {
        // this.data2 = data.data.group;
        // this.allData = data.data.allData;
        this.list = this.allData[0].children;
      });
    },
    initlist2() {
      request("/groupData", data => {
        console.log("group", data);
        this.data2 = data.data.group;
      });
    },
    searchblur() {
      if (this.search.length <= 0) {
        this.initlist();
        console.log("我失去焦点了");
      }
    },
    write() {
      console.log("我要去写信");
      this.$router.push({ path: "./send" });
    },
    nearby(a) {
      console.log("我选择了");
      //this.groupsIndex = 0;
      console.log("a", a);
      this.choosedGroupId = a;
    },
    groups() {
      console.log("我要分组");
      this.groupsDialog = true;
    },
    groupsbtn() {
      console.log("分组确定了");
      console.log(this.$refs.table.selection);
      var selection = this.$refs.table.selection;
      /*       for (var i = 0; i < selection.length; i++) {
        this.groupform.push(selection[i]);
      } */
      var data2 = this.data2;
      for (var g = 0; g < data2.length; g++) {
        var children = data2[g].children;
        for (var c = 0; c < children.length; c++) {
          for (var s = 0; s < selection.length; s++) {
            if (children[c].userId == selection[s].userId) {
              children.splice(c, 1);
              c--;
              break;
            }
          }
        }
      }
      console.log(selection);
      console.log(this.choosedGroupId);
      this.data2.forEach((item, index) => {
        if (item.groupId == this.choosedGroupId) {
          var oldList = this.data2[index].children;
          this.data2[index].children = [...oldList, ...selection];
          // console.log( this.data2[index].children)
        }
      });
      this.data2 = [...this.data2];
      this.groupsDialog = false;
      // if(this.data1.id===1){
      //       console.log(this.data1.children.label)
      // }
    },
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.selectStatus = 1;
      } else {
        this.selectStatus = 0;
      }
    },
    del() {
      if (this.$refs.table.selection.length > 0) {
        this.dialogVisible2 = true;
      } else {
        this.dialogVisible2 = false;
      }
    },
    /**
     * 编辑操作
     */
    edit(type, row, index) {
      if (type == "check") {
        this.ischeck = true;
      } else {
        this.ischeck = false;
      }
      window.sessionStorage.setItem("userItemData", JSON.stringify(row));
      window.sessionStorage.setItem("isCheck", this.ischeck);
      this.$router.push({
        path: "userEdit",
        query: { check: this.ischeck, index }
      });
      //this.dialogFormVisible3 = true;
      this.eform = row;
      this.currentIndex = index;
    },
    toEdit(row) {
      console.log(row);
    },
    dsure() {
      var c = this.list;
      var b = this.$refs.table.selection;
      if (b.length > 0) {
        this.dialogVisible2 = false;
        for (var i = 0; i < c.length; i++) {
          for (var j = 0; j < b.length; j++) {
            if (c[i] == b[j]) {
              c.splice(i, 1);
              i--;
            }
          }
        }
      } else {
        return;
      }
    },
    esure() {
      this.list.splice(this.currentIndex, 1, this.eform);
      this.dialogFormVisible3 = false;
    },
    csure() {
      var addc = this.cform;
      console.log(this.cform);
      this.cform.team = "最近联系人";
      this.list.push(this.cform);
      this.dialogFormVisible1 = false;
    },
    ctog(row,index) {
       var userId = row.userId;
      let len = this.list.length;
      for(let i=0 ; i <= len ; i++ )
      {
        if(this.list[i].userId == userId)
        { 
          if(this.list[i].groupId == "2" )                                       //选中已是星级用户
          { 
            //console.log("进入 星====》普通")  
            let saveUser = null;                                                 //用于保存删除的星标用户
            this.list[i].groupId = this.list[i].originalGroupId;                 //恢复为原来分组 假设为1级用户
            saveUser = this.moveUser(this.list[i].originalGroupId,userId,"2");
            this.addUser(this.list[i].originalGroupId,saveUser);                 //添加到原来分组中
            break;
            
          }else{                                                                 //选中用户不是星级用户  
          //console.log("进入 普通====》星")       
          let saveUser = null;
          let currentGroupId = this.list[i].groupId;
          this.list[i].originalGroupId = currentGroupId ;                       //保留之前的分组                                    
          this.list[i].groupId = "2";                                           //设置为星级用户分组
          saveUser = this.moveUser("2",userId,currentGroupId);                  //将用户从原先的列表中删除
          this.addUser("2",saveUser);                                           //标为星级的用户添加到星级用户列表中
          break;
              }
        }
      }
      // var userId = row.userId;
      // if (this.isActive == row.userId) {
      //   this.isActive = 0;
      //   this.data2 = this.log;
      //   console.log(this.log);
      //   console.log("重新渲染数据了");
      // } else {
      //   this.log = this.data2;
      //   this.isActive = userId;
      //   for (var i = 0; i < this.data2.length; i++) {
      //     var starGroupChildrenList = this.data2[i].children;
      //     // console.log(starGroupChildrenList,"二级菜单")
      //     for (var j = 0; j < starGroupChildrenList.length; j++) {
      //       // console.log(starGroupChildrenList[j],"二级菜单循环出来的每一项");
      //       if (userId == starGroupChildrenList[j].userId) {
      //         starGroupChildrenList.splice(j, 1);
      //       }
      //     }
      //   }
      //   //splice
      //   //concat
      //   this.data2.forEach((item, index) => {
      //     if (item.groupId == 2) {
      //       var oldList = this.data2[index].children;
      //       var arr = [];
      //       arr.push(row);
      //       this.data2[index].children = [...oldList, ...arr];
      //     }
      //   });
      //   this.data2 = [...this.data2];
      // }
    },
     /**
     * 处理用户移除
     * @param  originalGroupId 原来所属分组
     * @param  userId        点击用户id
     * @param  currentGroupId  当前所属分组
     */
    moveUser(originalGroupId,userId,currentGroupId)
    {
       let saveUser=null;
       for(let n=0; n< this.data2.length ; n++)
          {
             if(this.data2[n].groupId == currentGroupId)
             {
                 for(let k =0; k<this.data2[n].children.length; k++)  
                 {
                    if(this.data2[n].children[k].userId == userId )
                    {
                      this.data2[n].children[k].groupId= originalGroupId;
                      saveUser = this.data2[n].children.splice(k,1);
                      let index = this.data2[n].name.toString().indexOf("(");
                      let name=this.data2[n].name.substring(0,index);
                      this.data2[n].name = `${name}(${this.data2[n].children.length})`
                      break;
                    }
                 } 
             }
          }
        return saveUser;
    },
     /**
     * 处理用户的添加
     * @param groupId 要添加的分类id
     * @param saveUser 添加项
     */
    addUser(groupId,saveUser)
    {
       this.data2.forEach(item=>{
            if(item.groupId == groupId)
            { 
              item.children.push(saveUser.pop());
              item.children.sort(function(a,b){
               if(a.userId > b.userId)
               {
                 return 1;
               }else{
                 return -1;
               }
              });
              let index = item.name.toString().indexOf("(");
              let name = item.name.substring(0,index);
              item.name = `${name}(${item.children.length})`;
              this.data2 = [...this.data2]; 
              this.list = [...this.list];
            }
          })
    },
    tabFirst() {
      if (this.status == 0) {
        this.status = 1;
      } else {
        this.status = 0;
      }
    },
    handleClick(tab, event) {
      // console.log(tab, event);
      console.log(tab, event);
    },
    handleNodeClick1(data) {
      console.log(data, "lili");
    },
    handleNodeClick2(data) {
      console.log(data);
    },
    handleSearch(keyword, list) {
      // console.log(list[0]);
      var reg = new RegExp(keyword);
      var arr = [];
      // var list1= this.list;
      if (keyword.length > 0) {
        for (var i = 0; i < list.length; i++) {
          if (reg.test(list[i].name)) {
            arr.push(list[i]);
          }
          this.list = arr;
        }
      } else {
        this.$message("请输入关键词");
      }
    },
    handleNodeClick(data) {
      console.log(data);
      console.log(this.searchResult, "result");
      this.searchResult.push(data);
    },
    handleCurrentChange(val) {}
  }
};
</script>
<style scoped lang="scss">
.remove-icon {
  width: 15px;
  cursor: pointer;
  color: #ffae00;
}
.remove-all {
  color: #ffae00;
  float: right;
  cursor: pointer;
  font-size: 12px;
}
.choose-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin: 10px 0;
}
.box-container {
  display: flex;
  align-items: center;
}
.arrow {
  flex: 1;
  text-align: center;
}
.new-box-title {
  margin-bottom: 10px;
  margin-top: 50px;
}
.dialog-box {
  width: 48%;
}
.c-box {
  width: 100%;
  border: 1px solid #bcbcbc;

  height: 400px;
  display: inline-block;
  background: #fff;
  overflow: auto;
}
.search-concat-box {
  background: #bcbcbc;
  padding: 3px 20px;
  display: flex;
  align-items: center;
}
.search-icon {
  width: 15px;
  margin-left: 10px;
  color: #fff;
}
.main {
  .main-container {
    padding: 0px !important;
    /*     min-height: calc(100vh - 101px); */
  }
}
.content {
  //height: calc(100vh - 151px);
  height: 100%;
  background-color: #ffffff;
  .left-wrap {
    width: 15%;
    height: 100%;
    float: left;
    overflow: hidden;
      .left {
        width: 110%;
        height: 100%;
        border-right: 1px solid #cccccc;
        overflow: auto;
      }
  }
  .right {
    width: 85%;
    float: right;
    height: 100%;
    box-sizing: border-box;
    padding: 15px 15px 0;
    overflow: auto;
    .rightContent {
      box-sizing: border-box;
      padding: 15px 5px 0;
    }
  }
}
#mainContainer {
  background-color: #ffffff;
}
.star {
  font-size: 20px;
}
.active {
  color: #e6a23c;
}
.search-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>
