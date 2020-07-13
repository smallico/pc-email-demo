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
      <div class="search-top">
        <div>
          <el-button type="primary" icon="el-icon-refresh" size="small" @click="handleSync">同步</el-button>
          <!-- <el-button type="primary" icon="el-icon-upload2" size="small" @click="handleUpload">导入</el-button> -->
          <!-- <el-button type="primary" icon="el-icon-download" size="small" @click="handleDownload">下载导入模板</el-button> -->
          <el-button type="primary" size="small" @click="handleAdd">新建</el-button>
        </div>
        <div>
          <el-input
            placeholder="请输入机构名称"
            size="small"
            style="width: 140px"
            type="text"
            v-model="term"
            clearable
          />
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleSearch">查询</el-button>
        </div>
      </div>
      <div style="float: right">
        <!--    <el-button type="primary" icon="el-icon-plus" size="small" @click="editFunc">编辑</el-button> -->
        <!-- <el-button type="primary" icon="el-icon-setting" size="small" @click="toAssign">设置管理员</el-button> -->
      </div>
    </ToolBar>
    <div>
      <div style="float:left;width:20%;" v-loading="loading">
        <el-tree
          ref="viewTree"
          :data="treeLists"
          :props="defaultProps"
          node-key="id"
          @node-click="handleNodeClick"
          :default-expand-all="true"
          :highlight-current="true"
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
        ></el-tree>
      </div>
      <div style="float:right;width:80%;background-color:#fff;">
        <el-form
          label-width="120px"
          size="mini"
          ref="ruleForm"
          :rules="rules"
          style="width:500px;"
          :model="ruleForm"
        >
          <el-form-item label="组织机构名称" prop="orgName">
            <el-input v-model="ruleForm.orgName"></el-input>
          </el-form-item>
          <el-form-item label="设置管理员" prop="orgName">
            <el-checkbox-group v-model="ruleForm.manager">
              <el-checkbox
                :label="item.id"
                name="type"
                v-for="item in managerList"
                :key="item.id"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- <el-form-item label="是否被修改" prop="isEdited">
            <el-radio-group v-model="ruleForm.isEdited">
              <el-radio label="是" :disabled="formStatus"/>
              <el-radio label="否" :disabled="formStatus"/>
            </el-radio-group>
          </el-form-item>-->
          <el-form-item prop="terminalType">
            <el-button size="small" @click="onSubmit('ruleForm')" type="primary">保存</el-button>
            <el-button size="small" @click="onQx">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog title="分配管理员" :visible.sync="assignVisible" center>
      <el-tree
        :data="adminData"
        :props="defaultProps1"
        node-key="terminalId"
        ref="adminTree"
        @node-click="chooseOrg"
        :highlight-current="true"
      ></el-tree>
      <div slot="footer">
        <el-button size="small" @click="assignVisible=false">取消</el-button>
        <el-button size="small" @click="submitAssign" type="primary">确定设置</el-button>
      </div>
    </el-dialog>
    <div class="right">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import ToolBar from "../../../components/ToolBar";
import { request } from "../../../api/data-api";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      userid: "",
      treeLists: [],
      adminData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      defaultProps1: {
        children: "children",
        label: "userName"
      },
      formStatus: true,
      ruleForm: {
        orgName: "",
        orgId: "",
        isEdited: "",
        originalId: "",
        isDeleted: "",
        fatherId: "",
        manager: []
        //  isEdited: "是"
      },
      rules: {
        orgName: [
          { required: true, message: "请输入组织机构名称", trigger: "blur" }
        ]
      },
      assignVisible: false,
      treeId: "",
      assignParams: {
        orgId: "",
        userId: ""
      },
      managerList: [],
      term: "",
      loading: false,
      routeParamOrganId: '',
      routeParamOrganName: ''
    };
  },
  created() {
    this.getTreeList();
    this.getManagers();
  },
  methods: {
    //获取组织机构
    getTreeList(isSync) {
      /*       this.$http
        .getOrgTreelist()
        .then(data => {
          this.treeLists = data.data;
          console.log(data.data)
        })
        .catch(res => {
          console.log("error", res);
        }); */

      if (isSync) {
        this.loading = true;
      }
      request("/organData", data => {
        console.log("data",data);
        this.treeLists = data.data;
        var id = data.data[0].id;
        var name = data.data[0].name;
        this.ruleForm.orgName = name;
        this.ruleForm.orgId = id;
        this.ruleForm.manager = [];
        this.$nextTick(() => {
          this.$refs.viewTree.setCurrentKey(id);
        });
        setTimeout(() => {
          this.loading = false;
        }, 300);
      });
    },
    //获取管理员
    getManagers() {
      request("/groupData", data => {
        this.managerList = data.data.allData[0].children;
      });
    },
    //搜索联系人
    searchConcat() {
      console.log("enter");
    },
    //查找联系人过滤
    filterNode(value, data) {
     // console.loh("dsdsfds","value",value,"data",data)
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleSearch() {
      this.$refs.viewTree.filter(this.term);
    },
    handleNodeClick(data) {
      console.log("click", data);
      this.ruleForm.orgName = data.name;
      this.ruleForm.orgId = data.id;
      this.routeParamOrganId = data.id;
      this.routeParamOrganName = data.name
      if (data.manager) {
        this.ruleForm.manager = data.manager;
      } else {
        this.ruleForm.manager = [];
      }
      /* this.formStatus = true;
      this.treeId = data.orgId;
      this.assignParams.orgId = data.orgId;
      var obj = {
        orgId: data.orgId
      };
      this.$http
        .getOrgcheck(obj)
        .then(data => {
          console.log(data);
          this.ruleForm.orgName = data.data.orgName;
          this.ruleForm.orgId = data.data.orgId;
          this.ruleForm.fatherId = data.data.fatherId;
          this.ruleForm.isEdited = data.data.isEdited;
          this.ruleForm.originalId = data.data.originalId;
          this.ruleForm.isDeleted = data.data.isDeleted;
        })
        .catch(res => {
          console.log("error", res);
        }); */
    },
    editFunc() {
      //this.formStatus = false;
      this.treeId == "" ? (this.formStatus = true) : (this.formStatus = false);
    },
    onQx() {
      this.formStatus = true;
      var obj = {
        orgId: this.treeId
      };
      this.$http
        .getOrgcheck(obj)
        .then(data => {
          this.ruleForm.orgName = data.data.orgName;
          this.ruleForm.orgId = data.data.orgId;
          this.ruleForm.fatherId = data.data.fatherId;
          this.ruleForm.isEdited = data.data.isEdited;
          this.ruleForm.originalId = data.data.originalId;
          this.ruleForm.isDeleted = data.data.isDeleted;
        })
        .catch(res => {
          console.log("error", res);
        });
    },
    //同步
    handleSync() {
      this.getTreeList("true");
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.checkTree(this.treeLists);

          this.$message({
            message: "保存成功",
            type: "success"
          });
        } else {
          console.log("error submit");
          return false;
        }
      });
      // let datas = { ...this.ruleForm, orgId: this.treeId };
      /*       this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .getOrgEdit(this.ruleForm)
            .then(data => {
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.formStatus = true;
              this.getTreeList();
            })
            .catch(res => {
              console.log("error", res);
            });
        } else {
          console.log("error submit");
          return false;
        }
      }); */
    },
    //分配
    toAssign() {
      if (this.assignParams.orgId == "") {
        this.$message({
          message: "请选择一个组织机构",
          type: "warning"
        });
        return;
      }
      this.assignVisible = true;
      this.assignParams.orgId = this.treeId;
      var obj = {
        orgId: this.treeId
      };
      this.$http
        .getOrgAdmin(obj)
        .then(data => {
          this.adminData = data.data;
          console.log(data.data);
        })
        .catch(res => {
          console.log("error", res);
        });
      this.$nextTick(() => this.$refs.adminTree.setCheckedKeys([]));
    },
    checkTree(arr) {
      var result;
      console.log("111", arr);
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        console.log("222", item.id, this.ruleForm.orgId);
        if (item.id == this.ruleForm.orgId) {
          result = item;
          item.name = this.ruleForm.orgName;
          item.manager = this.ruleForm.manager;
          console.log("===", result);
          break;
        } else {
          if (item.children) {
            this.checkTree(item.children);
          }
        }
      }
      return result;
    },
    //选择管理员
    chooseOrg(data) {
      console.log(data);
      this.assignParams.userId = data.userId;
    },
    //提交分配
    submitAssign() {
      // var assignedIds = this.$refs.orgTree.getCheckedKeys();
      if (this.assignParams.userId == "") {
        this.$message({
          message: "请选择一个管理员",
          type: "warning"
        });
        return;
      }
      var obj = {
        orgId: this.assignParams.orgId,
        userId: this.assignParams.userId
      };
      this.$http
        .updateOrgAdmin(obj)
        .then(data => {
          this.assignVisible = false;
          this.$message({
            message: "设置成功",
            type: "success"
          });
          this.assignParams.userId = "";
        })
        .catch(res => {
          console.log("error", res);
        });
    },
    //添加组织机构
    handleAdd () {

      if(this.routeParamOrganId && this.routeParamOrganName) {
        this.$router.push({path: "organAdd",query: {id: this.routeParamOrganId, name: this.routeParamOrganName}});
      } else {
        this.$router.push({path: "organAdd"});
      }
      
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
  mounted() {},
  components: {
    ToolBar
  }
};
</script>

<style>
/* .admin {
  text-align: center;
  font-weight: 400;
  font-size: 16px;
} */
.search-top {
  display: flex;
  justify-content: space-between;
  margin-bottom:10px;
}
</style>
