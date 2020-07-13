<template>
    <div class="edit-box-container">
        <el-card>
            <el-form
             label-width="120px"
             style="width:800px;"
             :model=form
             ref="dialogForm"
             :rules="rules"
            >
                <el-form-item label="报箱名称" prop="name">
                    <el-input v-model="form.name" type="text"/>
                </el-form-item>
                <el-form-item label="报箱容量" prop="opacity">
                    <el-input v-model="form.opacity" type="text"/>
                </el-form-item>
                <el-form-item label="报箱类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择报箱类型">
                        <el-option
                            v-for="item in selectData"
                            :key="item.type"
                            :value="item.value"
                            :label="item.label"
                        ></el-option>
                    </el-select>
                </el-form-item >
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

            id: "",
            selectData: [
                { label: "常用报箱", value: "0"}, 
                { label: "专用报箱", value: "1"}
            ],
            boxList: [],
            rules: {
                name: [
                    { required: true, message: '请填写报箱名称', trigger: 'blur'}
                ],
                opacity: [
                    { required: true, message: '请填写报箱容量', trigger: 'blur'}
                ],
                type: [
                    { required: true, message: '选择报箱类型', trigger: 'change'}
                ]

            },
            form: {
                name: "",
                opacity: "",
                type: "",
            }
        }
    },
    created()
    {
        if(this.$route.query)
        {
            this.id = this.$route.query.id;
            console.log("id",this.id);
            this.getData();
        }
    },
    methods:{
        //获取数据
        getData()
        {
           let boxList = this.$store.state.boxList;
           this.boxList = boxList;
           boxList.forEach(item => {
               if(item.id == this.id)
               {
                   this.form = {...this.form,...item};
               }
           })
        },
        //校验函数
        submitForm(formName)
        {
            this.$refs[formName].validate(valid => {
                if (valid)
                {
                    this.enSure();
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请填写完表单的校验项' 

                    })
                }
            })
            
        },
        //确定回调
        enSure()
        {
          let boxList = this.$store.state.boxList;
            for(let i=0; i<boxList.length;i++)
            {
                if(boxList[i].id == this.id)
                {
                    boxList[i] = this.form;
                    break;
                }
            }
            console.log("当前的boxList",boxList,"form",this.form);
            this.$store.commit("updateBoxList",boxList);
            this.$message({
                type: "success",
                message: "修改成功"
            });
            this.$router.go(-1);
        },
        //取消回调
        handlerCancel()
        {
            this.$router.go(-1);
        }
    }
}
</script>
<style lang="scss" scoped>
</style>