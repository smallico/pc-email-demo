<template>
    <div class="boxAssign-container">
       <el-row  style="height:100%;">
           <el-col :span="4"  style="height:100%;">
              <el-tree
                :data="treeData"
                :props="defaultProps"
                :accordion="true"
                show-checkbox
                node-key="id"
                ref="tree"
                @check-change="handleCheckChange"
              >
              </el-tree>
           </el-col>
           <el-col :span="20" >
               <el-table border :data="tableData" >
                   <el-table-column label="用户ID" prop="userId"></el-table-column>
                   <el-table-column label="用户名" prop="name"></el-table-column>
                   <el-table-column label="创建/撤销">
                        <template slot-scope="scope">
                            <el-button 
                            v-if="scope.row.isCreated == '0'"
                            @click="handleCreated(scope.$index,1)"
                            type="primary"
                            size="small">
                                创建
                            </el-button>
                            <el-button
                            v-else
                             @click="handleCreated(scope.$index,0)"
                            type="danger"
                            size="small">
                                撤销 
                            </el-button>
                        </template>
                   </el-table-column>
                   <el-table-column label="启用/停用">
                        <template slot-scope="scope">
                            <span v-if="scope.row.isCreated == '0'"></span>
                            <div  v-else >
                                <el-button
                                    v-if="scope.row.isStop == '0'"
                                    type="primary"
                                    @click="handleLaunch(scope.$index,1)"
                                    size="small">
                                    启用
                                </el-button>
                                 <el-button
                                    v-else
                                    @click="handleLaunch(scope.$index,0)"
                                    type="danger"
                                    size="small">
                                    停用
                                </el-button>
                            </div>
                        </template>
                   </el-table-column>
                    <el-table-column label="分配容量">
                       <template slot-scope="scope" >
                           <div class="tableCell-Operation" v-if="scope.row.isCreated != '0'">
                                <span>容量：</span>
                                <el-input type="text" class="El-input" v-model="scope.row.opacity"></el-input>
                           </div>
                       </template>
                   </el-table-column>
                   <el-table-column  label="提醒">
                       <template slot-scope="scope">
                           <span v-if="scope.row.isCreated == '1'">
                               {{scope.row.percent}}
                           </span>
                       </template>
                   </el-table-column>
               </el-table>
           </el-col>
       </el-row>
    </div>
</template>
<script>
import { request } from "../../../api/data-api";
export default{
    data()
    {
        return{
            treeData: [],
            defaultProps: {
                children: "children",
                label: "name"
            },
            tableData:[],
        }
    },
    created()
    {
       this.getOrganData(); 
    },
    beforeRouteLeave(to,from,next)
    {
        console.log(to,from,next);
        this.enSure();
        next();
    },
    methods:{

        //获取组织机构数据
        getOrganData()
        {
            request("/concatOrganData", data => {
            this.treeData = data.data;
            console.log("tree",this.treeData)
            });
        },
        //树节点回调函数
        handleCheckChange(data,checked,indeterminate)
        {
          this.getCheckedNodes();
        },
        //点击回调
        handleClick()
        {
           console.log("click",this.form);
        },
        //选中节点
        getCheckedNodes()
        {
            //console.log("data",this.$refs.tree.getCheckedNodes(true,false));
            this.tableData = this.$refs.tree.getCheckedNodes(true,false);
            //console.log("dfs",this.$refs.tree.getCheckedNodes(false,false));
        },
        //取消回调
        handlerCancel()
        {
            this.$router.go(-1);
        },
        //创建/撤销回调
        handleCreated (index,type) {
            let tableData = this.tableData
            if (type) {
                tableData[index].isCreated = '1';
            } else {
                let tableData = this.tableData;
                tableData[index].isCreated = '0';
            }
             this.tableData=tableData;
        },
        //启用/停用回调
        handleLaunch (index,type) {
            let tableData = this.tableData;
            if (type) {
                tableData[index].isStop = '1';
            } else {             
                tableData[index].isStop = '0';
            }
        },
        //确认提交函数
        enSure () {
            this.updateTreeData(this.treeData)
        },
        //更新数据
        updateTreeData (array) {
           for(let i = 0; i < array.length; i++ )
           {
               if (array[i].children && array[i].children > 0) {
                   this.handleSubmit(arry[i]);
               } else {
                    //console.log("array", array[i]);
                    array[i].children.forEach((item, index) => {
                       this.tableData.forEach((temp, tIndex) => {
                           if(item.userId == temp.userId)
                           {
                               item[index] = temp[tIndex];
                           }
                       })
                   })
               }
           }
        }

    },
    
}
</script>
<style scoped lang="scss">
.boxAssign-container
{
    height: 100%;
    .tableCell-Operation
    {
        display: flex;
        justify-content:space-between;
        span{
            display: flex;
            text-align: center;
            align-items: center;
            width: 50px;
        }
        .El-input
        {
            flex:1;
        }
       
    }
}
</style>