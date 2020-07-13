<template>
  <div>
    <ToolBar>
      <el-button type="primary" size="small" @click="addBox">添加专用报箱</el-button>
    </ToolBar>
    <el-table 
      :data="list" 
      border ref="table" 
      style="width:100%" 
      v-loading="loading">
      <el-table-column label="报箱名" prop="name"></el-table-column>
      <el-table-column label="容量" prop="opacity"></el-table-column>
      <el-table-column label = "类型" >
        <template  slot-scope="scope">
          <span>{{scope.row.type == 0 ? '常用报箱' : "专用报箱"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop= "id">
        <template slot-scope="scope">
          <el-button 
            type="text" 
            size="mini" 
            style="margin-right:30px;"
            @click="editBOx(scope.row,scope.$index)"
            >编辑</el-button>
          <el-button
            type="text"
            size="mini"
            style="margin-right:30px;"
            @click="deleteBox(scope.row,scope.$index)"
            >删除</el-button>
            <el-button v-if="scope.row.type == 1"
            type="text"
            size="mini"
            @click="assingBox(scope.row,scope.$index)"
            >分配</el-button>
        </template>
      </el-table-column>

      <!-- <el-table-column prop="terminalId" label="终端ID"></el-table-column> -->
      <!--       <el-table-column prop="terminalName" label="终端名称"></el-table-column>
      <el-table-column prop="terminalType" label="终端类型"></el-table-column>
      <el-table-column prop="terminalIp" label="终端IP"></el-table-column>
      <el-table-column prop="terminalContact" label="联系人"></el-table-column>
      <el-table-column prop="terminalPhone" label="联系电话"></el-table-column>
      <el-table-column prop="terminalDomain" label="终端域名"></el-table-column>
      <el-table-column prop="terminalCode" label="发文编码"></el-table-column>
      <el-table-column width="250" label="操作">
        <template slot-scope="scope">
          <el-tooltip content="升序" placement="top" v-if="total>1&&scope.$index!=0">
            <el-button
              style="transition: .4s;"
              icon="el-icon-sort-up"
              size="mini"
              type="text"
              @click="editSort(scope.row,scope.$index,'last')"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            content="降序"
            placement="top"
            v-if="total>1&&scope.$index!=(
              -1)"
          >
            <el-button
              style="transition: .4s;"
              icon="el-icon-sort-down"
              size="mini"
              type="text"
              @click="editSort(scope.row,scope.$index,'next')"
            ></el-button>
          </el-tooltip>

          <el-button
            size="small"
            type="text"
            @click="toEdit(scope.row.terminalId,scope.row,scope.$index)"
          >编辑</el-button>
          <el-button size="small" type="text" @click="toZero(scope.row)">归零</el-button>
          <el-button size="small" type="text" @click="toAssign(scope.row.terminalId)">分配</el-button>
        </template>
      </el-table-column>-->
    </el-table>
    <el-pagination
      style="background:#fff;padding:20px 10px;text-align:right;"
      layout="prev, pager, next"
      :current-page="params.page"
      :page-size="params.rows"
      @current-change="handleCurrentChange"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import ToolBar from "../../../components/ToolBar";
import { request } from "../../../api/data-api";
export default {
  data() {
    return {
      params: {
        page: 1,
        rows: 10
      },
      total: 100,
      list: [],
      loading: false
    };
  },
  components:{
    ToolBar
  },
  created()
  {
    if(this.$store.state.boxList.length <= 0)
    {
       this.getList();
       console.log("store不存在")
    }else{
      console.log("store存在",this.$store.state.boxList)
      this.list = this.$store.state.boxList;
      
    }
   
  },
  methods: {
    //添加报箱
    addBox() {
      this.$router.push({path : "addBusinessBox"});
    },
    //编辑报箱
    editBOx(row,index)
    {
      console.log("index",index);
      this.$router.push({path: "editBusinessBox",query:{id:row.id}});
    },
    //删除报箱
    deleteBox(row,index)
    {
      this.$confirm("此操作将删除该报箱,是否继续？",'提示',{
        confirmButtonText : "确定",
        cancelButtonText : "取消",
        type : "warning"
      }).then(() => {
        this.list.splice(index,1);
        this.$store.commit("updateBoxList",this.list);
        this.$message({
          type : "sucess",
          message : "删除成功"
        })
      }).catch( () => {
        return;
      })
    },
    //分配报箱
    assingBox()
    {
      this.$router.push({path: "assignBusinessBox",query:{}});
    },
    //分页
    handleCurrentChange(val) {
      this.params.page = val;
      this.getList();
    },
    //获取报箱列
    getList() {
      request("/boxList",data=>{
        
         this.list = data.data;
         this.$store.commit("updateBoxList",data.data);
      })
    }
  }
};
</script>
<style lang="scss" scoped>
</style>


