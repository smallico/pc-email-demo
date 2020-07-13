<template>
    <div class="add-box-container">
        <el-card>
            <el-form 
                label-width="120px"
                ref="dialogForm"
                style="width:800px;"
                :model="form"
                :rules="rules"
                >
                <el-form-item label="报箱名称" prop="name">
                    <el-input v-model="form.name" type="text"></el-input>
                </el-form-item>
                <el-form-item label="容量" prop="opacity">
                    <el-input v-model="form.opacity" type="text"></el-input>
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
import { request } from "../../../api/data-api";
export default{
    data()
    {
        return{
          len: 0,   //获取报箱中已有报箱 
          rules: {
              name: [
                  { required: true, message: '请输入报箱的名称', trigger: 'blur'}
                  ],
              opacity: [
                 { required: true, message: '请填写报箱的容量', trigger: 'blur'}
             ]
            
          },
          form: {
              name: "",
              opacity: "10GB"
          }
        }
    },
    created()
    {
        this.getBoxList();
    },
    methods:{
        //获取报箱数据
        getBoxList()
        {
            request("/boxList",data => {
               this.len = data.data.length;
            })
        },
        //取消回调
        handlerCancel()
        {
             this.$router.push({path: "businessBox"});
        },
        //确认回调
        submitForm(formName)
        {
            this.$refs[formName].validate(valid => {
                if(valid)
                {
                    let that =this;
                    let param = {
                        id:`${parseInt(this.len)+1}`,
                        usedOpacity: "0GB",
                        type: "1" ,      //type = 1专用报箱
                        ...this.form
                    }
                    let currentBoxList = this.$store.state.boxList;
                    currentBoxList.push(param)
                    this.$store.commit("updateBoxList",currentBoxList);
                    this.$router.push({path: "businessBox"});
                    
                }else{
                    this.$message({
                        type: "warning",
                        message: "填写完表单项,才能提交"
                    })
                    return false;
                }   
            })
        }
    }
}
</script>
<style scoped lang="scss">
</style>
