<template>
    <div class="user-edit-container">
      <el-card >
        <el-form 
          :model="eform" 
          style="padding:0 15px;width:800px;" 
          ref="ruleForm"
          label-position="left"
          label-width="80px"
          :rules="rules"> 
            <el-form-item label="姓名"  prop="name">
              <el-input v-model="eform.name" auto-complete="off" placeholder="请输入姓名" :disabled="ischeck" ></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="eform.email" auto-complete="off" placeholder="请输入邮箱" :disabled="ischeck" ></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input v-model="eform.phone" auto-complete="off" placeholder="请输入手机号码" :disabled="ischeck" ></el-input>
            </el-form-item>
        </el-form>
        <el-footer  class="dialog-footer" v-if="!ischeck" style="text-align:right"> 
            <el-button size="small" @click="handlerCancel()">取 消</el-button>
            <el-button size="small" @click="esure('ruleForm')" type="primary">确定</el-button>
        </el-footer >
      </el-card>
    </div>
</template>
<script>
export default{
    data(){
        return {
    rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
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
    cform: {
        name: "",
        phone: "",
        email: ""
      },
    eform:{
          name:"",
          email:"",
          phone:"",
        },    
    ischeck: false,    //控制编辑与显示
    index:""           //索引值
        }
    },
    created(){
        if(this.$route.query)
        {
           let query = this.$route.query;
           this.ischeck = query.check == true ? true : false;
           console.log("收到的isCheck",this.ischeck,"参数中", query.check,"ff",typeof query.check );
           this.index = query.index;
        }
        if(window.sessionStorage.getItem("userItemData"))
        {
          let userItemData=JSON.parse(window.sessionStorage.getItem("userItemData"));
          this.eform = {...userItemData};
        }
    },
    methods:{
        /**
         * 提交验证
         */
        esure(formName)
        {
           this.$refs[formName].validate((valid)=>{
             if(valid)
             {
              this.handSubmit();
             }else{
               this.$message.warn("表单验证失败");
               return false;
             }
           })
        },
        /**
         * 提交函数
         */
        handSubmit()
        {
           if(! this.ischeck)
          {
            let userListData = JSON.parse(this.$store.state.userListData);
            userListData[this.index] = { ...this.eform};
            let userListDataJsonStr = JSON.stringify(userListData);
            window.sessionStorage.setItem("userListData",userListDataJsonStr);
            this.$store.commit("updateUserListData",userListDataJsonStr);
            this.$message.success("保存成功")
          }
          this.$router.go(-1); 
        },
        /**
         * 取消回调
         */
        handlerCancel()
        {
          this.$route.go(-1);
        }

    }
}
</script>
<style scoped lang="scss">
</style>
