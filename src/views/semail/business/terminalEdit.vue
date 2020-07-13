<template>

    <div class="terminal-edit-container" style="">
      <el-card style=" border-radius:0;">
        <el-form
        label-width="120px"
        ref="dialogForm"
        :rules="rules"
        style="width:800px;"
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
      <el-footer  style="padding-left:54px; text-align:right;">
        <el-button size="small" @click="handlerCancel()">取消</el-button>
        <el-button size="small" @click="submitForm('dialogForm')" type="primary">确定</el-button>
      </el-footer>
  </el-card>    
</div>
</template>
<script>
export default{
   data(){
       return{
           rules:{},
           index:"",
           dialoForm:{
               terminalName:"",
               terminalType:"",
               terminalIp:"",
               terminalContact:"",
               terminalPhone:"",
               terminalDomain:"",
           },

       }

   },
   created(){
       
       if(this.$route.query.index != "undefind")
       {
         this.index=this.$route.query.index;
       }
       if(window.sessionStorage.getItem("terminalItemData"))
       {
           this.dialoForm = JSON.parse(window.sessionStorage.getItem("terminalItemData"));
       }
        
   },
   methods:{
       handlerSubmit()
       {
           let terminalListData=JSON.parse(this.$store.state.terminalListData);
           terminalListData[this.index]={...this.dialoForm};
           let terminalListDataJsonStr=JSON.stringify(terminalListData);
           window.sessionStorage.setItem("terminalListData",terminalListDataJsonStr);
           this.$store.commit("updateTerminalListData",terminalListDataJsonStr);
           window.sessionStorage.setItem("terminalItemData",JSON.stringify(this.dialoForm));
           this.$store.commit("updateTerminalItem",JSON.stringify(this.dialoForm));
           this.$router.go(-1);
          
       },
        submitForm(formName) {
        this.$refs[formName].validate(valid => {
        if (valid) {
        //   this.$http
        //     .mailTerminalEdiorrt(this.dialoForm)
        //     .then(data => {
        //       this.$message({
        //         message: "保存成功",
        //         type: "success"
        //       });
        //       this.dialogVisible = false;
        //       this.getList();
        //     })
        //     .catch(res => {
        //       console.log("error", res);
        //     });
            this.handlerSubmit();
            } else {
            console.log("error submit");
            return false;
            }
        }); 
        //this.list.splice(this.currentIndex, 1, this.dialoForm);
        this.$message({
            message: "保存成功",
            type: "success"
        });
        //this.dialogVisible = false;
        },
       handlerCancel()
       {
           this.$router.go(-1);
       }
   },
}
</script>
<style scoped lang="scss">
</style>
