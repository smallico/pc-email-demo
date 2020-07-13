<template>
    <div class="businessLog-details">
      <el-card>
        <el-form
        label-width="120px"
        ref="dialogForm"
        style="width:800px;"
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
        <el-form-item>
          <el-button size="small" @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
      <el-form
        label-width="120px"
        ref="dialogForm"
         style="width:800px;"
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
        <el-form-item>
          <el-button size="small" @click="goBack" >返回</el-button>
        </el-form-item>
      </el-form>
      <el-form
        label-width="150px"
        ref="dialogForm"
        style="width:800px;"
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
          <el-input :value="dialogForm.mailType === '0' ? 'pdf' : 'word'" disabled></el-input>
        </el-form-item>
        <el-form-item label="密级">
          <el-input :value="dialogForm.handleMailElevel" disabled></el-input>
        </el-form-item>
        <el-form-item label="紧急">
          <el-input :value="dialogForm.handleMailSlevel" disabled></el-input>
        </el-form-item>
        <el-form-item label="主题">
          <el-input :value="dialogForm.mailSubject" disabled></el-input>
        </el-form-item>
        <el-form-item>
           <el-button size="small" @click="goBack" >返回</el-button>
        </el-form-item>
      </el-form>
      <el-form
        label-width="120px"
        ref="dialogForm"
        style="width:800px;"
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
        <el-form-item>
           <el-button size="small" @click="goBack" >返回</el-button>
        </el-form-item>
      </el-form>
      </el-card>  
    </div>
</template>
<script>
import { request } from "../../../api/data-api";
export default {

    data()
    {
        return{
              dialogForm: {},
              activeName:"login",
              id:'',
        }
    },
    
    created()
    {
       if(this.$route.query)
       {
         this.activeName = this.$route.query.activeName;
         this.id =this.$route.query.id;
         this.getDataList()
       }
       
    },
    beforeRouteEnter(to,from,next){
      to.meta.title = sessionStorage.getItem("logName");
      next();
    },
    methods:{
      /**
       * 获取数据
       */
      getDataList()
      {
          var url = "";
          // if (this.activeName == "login") {
          //   url = "/loginLogDetail";
          // } else if (this.activeName == "action") {
          //   url = "/operationLogDetail";
          // } else if (this.activeName == "record") {
          //   url = "/recordLogDetail";
          // } else {
          //   url = "/seviceLogDetail";
          // }
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
              
            let handleData = data.findForPage.result.filter(item => {
              if (item.logId == this.id) {
                 return item;
              }
            });
           
            if (this.activeName == 'record') {
              
              handleData.forEach(item => {
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
            this.dialogForm = handleData[0];
          });
      },
      /**
       * 返回回调
       */
      goBack()
      {
        this.$router.go(-1);
      }
    }
}
</script>
<style scoped lang="scss">
</style>