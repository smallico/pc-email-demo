<template>
    <div class="terminal-assign-container">
     <el-card>
        <el-tree
        :data="treeData"
        :props="defalutProps"
        show-checkbox
        :accordion="true"
        node-key="orgId"
        ref="orgTree"
        style="padding:30px"
        @check-change="chooseOrg"
      ></el-tree>
      <el-footer style="text-align:right">
        <el-button size="small" @click="handleCancle">取消</el-button>
        <el-button size="small" @click="submitAssign" type="primary">确定分配</el-button>
      </el-footer>
     </el-card>
    </div>
</template>
<script>
import { request } from "../../../api/data-api";
export default{
    data(){
        return {
            defalutProps: {
                children: "children",
                label: "name"
            },
            treeData: [],
            assignParams: {
                orgId: "",
                terminalId: ""
            },
        }
    },
    created(){
        this.getDataList();
    },
    methods: 
    { 
       /**
        * 页面数据
        */
       getDataList()
       {
           request("/organData", data => {
            this.treeData = data.data;
            this.$nextTick(() => this.$refs.orgTree.setCheckedKeys([]));
            });
       },
       /**
        * 选择机构
        */
        chooseOrg(data) {
            console.log("data",data);
            this.assignParams.orgId = data.id;
        },
        /**
         * 提交回调
         */
       submitAssign()
       {
          if(this.assignParams.orgId == "")
          {
              this.$message({
                  type:"warning",
                  message:"请选择一个机构"
              });
              return;
          }else{
              this.$message({
                  type: "success",
                  message: "分配成功"
              });
              this.$router.go(-1);
          }
       },
       /**
        * 取消回调
        */
       handleCancle()
       {
            this.$router.go(-1);
       }
    },

}
</script>
<style scoped lang="scss">
</style>
