<template>
  <div id="cachebox">
    <div class="num-box">
      <p class="trashbox-num">缓存邮件（共8封）</p>
    </div>
    <div class="search">
      <!-- <div class="ipt-box">
        <input type="text" placeholder="请输入文件名、收件人等搜索" class="search-input">
        <div class="search-img-box">
          <img src="./../../../assets/sendbox/search.png" alt>
        </div>
      </div>-->
      <!-- <button class="search-btn" @click="pushToReceive">推送邮件</button> -->
      <el-button class="search-btn" @click="pushToReceive">推送邮件</el-button>
    </div>

    <div class="el-table-box">
      <!-- <p class="send">缓存邮件（共6封）</p> -->
      <p class="today">今天（4）</p>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :cell-style="cellStyle"
      >
        <!-- <el-table-column type="selection" width="50" height="65" align="left"></el-table-column> -->
        <el-table-column prop="no_reading" label="状态" width="50" height="65" align="left">
          <template slot-scope="scope">
            <img :src="scope.row.read_status?read_url:no_read_url" alt @click="f(scope.row.id)">
          </template>
        </el-table-column>
        <el-table-column prop="fa_time" label="发文时间" width="246" height="65" align="left" sortable></el-table-column>
        <el-table-column prop="shou_time" label="收文时间" width="240" height="65" align="left"></el-table-column>
        <el-table-column prop="num" label="发文编号" width="150" height="65" align="left"></el-table-column>
        <el-table-column prop="name" label="主题" width="430" height="65" align="left"></el-table-column>
        <el-table-column prop="region" label="密级" width="100" height="65" align="left"></el-table-column>
        <el-table-column prop="lv" label="等级" width="100" height="65" align="left"></el-table-column>
        <el-table-column prop="receipt" label="收件人/终端" width="200" height="65" align="left"></el-table-column>
        <el-table-column prop="annex" label="附件" width="80" height="65" align="left">
          <!-- <template slot-scope="scope">
            <img src="./../../../assets/sendbox/fujian.png" alt @click="a(scope.row.id)">
          </template>-->
        </el-table-column>
        <!-- <el-table-column
          prop="annexoperation"
          label="操作"
          width="246"
          height="65"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">
            <span class="to-hand" @click="look">查看</span>
            <span class="table-operate to-hand" v-if="scope.row.read_status==false">签收</span>
            <span class="table-operate to-hand" v-if="scope.row.read_status==false">拒收</span>
            <span class="table-operate to-hand" @click="today_del(scope.row,scope.$index)">删除</span>
          </template>
        </el-table-column>-->
      </el-table>

      <p class="yesterday">昨天（2）</p>
      <el-table
        ref="multipleTable"
        :data="tableData1"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :show-header="false"
        :cell-style="cellStyle"
      >
        <el-table-column prop="no_reading" label="状态" width="50" height="65" align="left">
          <template slot-scope="scope">
            <img :src="scope.row.read_status?read_url:no_read_url" alt @click="f(scope.row.id)">
          </template>
        </el-table-column>
        <el-table-column prop="fa_time" label="发文时间" width="246" height="65" align="left"></el-table-column>
        <el-table-column prop="shou_time" label="收文时间" width="240" height="65" align="left"></el-table-column>
        <el-table-column prop="num" label="发文编号" width="150" height="65" align="left"></el-table-column>
        <el-table-column prop="name" label="主题" width="430" height="65" align="left"></el-table-column>
        <el-table-column prop="region" label="密级" width="100" height="65" align="left"></el-table-column>
        <el-table-column prop="lv" label="等级" width="100" height="65" align="left"></el-table-column>
        <el-table-column prop="receipt" label="收件人/终端" width="200" height="65" align="left"></el-table-column>
        <el-table-column prop="annex" label="附件" width="80" height="65" align="left">
          <!-- <template slot-scope="scope">
            <img src="./../../../assets/sendbox/fujian.png" alt @click="a(scope.row.id)">
          </template>-->
        </el-table-column>
        <!-- <el-table-column
          prop="annexoperation"
          label="操作"
          width="246"
          height="65"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">
            <span class="to-hand" @click="look">查看</span>
            <span class="table-operate to-hand" v-if="scope.row.read_status==false">签收</span>
            <span class="table-operate to-hand" v-if="scope.row.read_status==false">拒收</span>
            <span class="table-operate to-hand" @click="yesterday_del(scope.row,scope.$index)">删除</span>
          </template>
        </el-table-column>-->
      </el-table>

      <p class="yesterday">更早（2）</p>
      <el-table
        ref="multipleTable"
        :data="tableData2"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :show-header="false"
        :cell-style="cellStyle"
      >
        <el-table-column prop="no_reading" label="状态" width="50" height="65" align="left">
          <template slot-scope="scope">
            <img :src="scope.row.read_status?read_url:no_read_url" alt @click="f(scope.row.id)">
          </template>
        </el-table-column>
        <el-table-column prop="fa_time" label="发文时间" width="246" height="65" align="left"></el-table-column>
        <el-table-column prop="shou_time" label="收文时间" width="240" height="65" align="left"></el-table-column>
        <el-table-column prop="num" label="发文编号" width="150" height="65" align="left"></el-table-column>
        <el-table-column prop="name" label="主题" width="430" height="65" align="left"></el-table-column>
        <el-table-column prop="region" label="密级" width="100" height="65" align="left"></el-table-column>
        <el-table-column prop="lv" label="等级" width="100" height="65" align="left"></el-table-column>
        <el-table-column prop="receipt" label="收件人/终端" width="200" height="65" align="left"></el-table-column>
        <el-table-column prop="annex" label="附件" width="80" height="65" align="left">
          <!-- <template slot-scope="scope">
            <img src="./../../../assets/sendbox/fujian.png" alt @click="a(scope.row.id)">
          </template>-->
        </el-table-column>
        <!-- <el-table-column
          prop="annexoperation"
          label="操作"
          width="246"
          height="65"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">
            <span class="to-hand" @click="look">查看</span>
            <span class="table-operate to-hand" v-if="scope.row.read_status==false">签收</span>
            <span class="table-operate to-hand" v-if="scope.row.read_status==false">拒收</span>
            <span class="table-operate to-hand" @click="more_del(scope.row,scope.$index)">删除</span>
          </template>
        </el-table-column>-->
      </el-table>
    </div>

    <div class="pagination-box">
      <p>共315条记录 当前第1页</p>
      <el-pagination layout="prev, pager, next" :total="1000"></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "CacheBox",
  components: {},
  data() {
    return {
      read_url: require("./../../../assets/sendbox/reading.png"),
      no_read_url: require("./../../../assets/sendbox/no-reading.png"),
      formLabelWidth: "100px",
      tableData: [
        {
          no_reading: "未读",
          fa_time: "2019-6-12 15:23:02",
          shou_time: "2019-6-12 16:23:02",
          num: "00010",
          name: "关于组织召开学习新时代精神的培训时间...",
          region: "秘密",
          lv: "加急",
          receipt: "刘大伟",
          annex: "4",
          annexoperation: "操作",
          read_status: false
        },
        {
          no_reading: "未读",
          fa_time: "2019-6-12 15:23:02",
          shou_time: "2019-6-12 16:23:02",
          num: "00010",
          name: "关于组织召开学习新时代精神的培训时间...",
          region: "秘密",
          lv: "加急",
          receipt: "刘大伟",
          annex: "2",
          annexoperation: "操作",
          read_status: false
        },
        {
          no_reading: "未读",
          fa_time: "2019-6-12 15:23:02",
          shou_time: "2019-6-12 16:23:02",
          num: "00010",
          name: "关于组织召开学习新时代精神的培训时间...",
          region: "秘密",
          lv: "加急",
          receipt: "刘大伟",
          annex: "3",
          annexoperation: "操作",
          read_status: false
        },
        {
          no_reading: "未读",
          fa_time: "2019-6-12 15:23:02",
          shou_time: "2019-6-12 16:23:02",
          num: "00010",
          name: "关于组织召开学习新时代精神的培训时间...",
          region: "秘密",
          lv: "加急",
          receipt: "刘大伟",
          annex: "5",
          annexoperation: "操作",
          read_status: true
        }
      ],
      tableData1: [
        {
          no_reading: "未读",
          fa_time: "2019-6-12 15:23:02",
          shou_time: "2019-6-12 16:23:02",
          num: "00010",
          name: "关于组织召开学习新时代精神的培训时间...",
          region: "秘密",
          lv: "加急",
          receipt: "刘大伟",
          annex: "1",
          annexoperation: "操作",
          read_status: false
        },
        {
          no_reading: "未读",
          fa_time: "2019-6-12 15:23:02",
          shou_time: "2019-6-12 16:23:02",
          num: "00010",
          name: "关于组织召开学习新时代精神的培训时间...",
          region: "秘密",
          lv: "加急",
          receipt: "刘大伟",
          annex: "3",
          annexoperation: "操作",
          read_status: true
        }
      ],
      tableData2: [
        {
          no_reading: "未读",
          fa_time: "2019-6-12 15:23:02",
          shou_time: "2019-6-12 16:23:02",
          num: "00010",
          name: "关于组织召开学习新时代精神的培训时间...",
          region: "秘密",
          lv: "加急",
          receipt: "刘大伟",
          annex: "2",
          annexoperation: "操作",
          read_status: false
        },
        {
          no_reading: "未读",
          fa_time: "2019-6-12 15:23:02",
          shou_time: "2019-6-12 16:23:02",
          num: "00010",
          name: "关于组织召开学习新时代精神的培训时间...",
          region: "秘密",
          lv: "加急",
          receipt: "刘大伟",
          annex: "4",
          annexoperation: "操作",
          read_status: true
        }
      ]
    };
  },
  methods: {
    //添加表格样式
    cellStyle(row,column,rowIndex,columnIndex){
      if( row.row.region == '明电'){
        return 'font-weight: 300;color:green';
      }else if(row.row.region == '绝密' || row.row.region =='机密' || row.row.region =='秘密'){
        return 'font-weight: 300;color:red';
      }
    },
    a() {
      console.log(1);
    },
    look() {
      this.$router.push("/semail/mailDetail");
    },
    today_del(row, index) {
      //今天删除
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableData.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    yesterday_del(row, index) {
      //昨天删除
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableData1.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    more_del(row, index) {
      //更早删除
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableData2.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    e() {
      console.log(1);
    },
    f() {
      console.log(1);
    },
    handleSelectionChange() {},
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    pushToReceive() {
      // alert("推送成功！");
      this.$message({
        message: "推送成功！",
        type: "success"
      });
    }
  }
};
</script>

<style scoped lang='scss'>
* {
  margin: 0;
  padding: 0;
}
#cachebox {
  margin-left: 18px;
  margin-top: 19px;
  .num-box {
    .trashbox-num {
      color: #0c86dc;
      font-size: 17px;
    }
  }
  .search {
    display: flex;
    align-items: center;
    margin-top: 20px;
    .ipt-box {
      background: #fff;
      width: 369px;
      height: 40px;
      border-radius: 19px;
      border: solid 1px #cdcdcd;
      position: relative;
      .search-input {
        margin-left: 30px;
        width: 270px;
        height: 35px;
        border: none;
      }
      .search-img-box {
        background: #fff;
        position: absolute;
        top: 9px;
        right: 29px;
      }
    }
   .search-btn {
      padding:9px 15px;
      font-size:12px;
      border-radius: 3px;
      background: #FFFFFF;
      border: 1px solid #DCDFE6;
      color: #606266;
      cursor:pointer;
    }
    .search-btn:hover
    {
      color: #0ba86c;
      border-color: #b6e5d3;
      background-color: #e7f6f0;
    }
    .alert-img {
      width: 100%;
      height: auto;
    }
  }
  .el-table-box {
    margin-top: 30px;
    .send {
      color: #0c86dc;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .today {
      color: #383939;
      font-size: 16px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ccc;
    }
    .table-operate {
      margin-left: 10px;
    }
    .to-hand {
      cursor: pointer;
      color: #0ba86c;
    }
    .el-form-item {
      margin-top: 14px;
    }
    .el-btn {
      width: 50px;
      height: 30px;
    }
    .el-ipt {
      width: 350px;
    }
    .yesterday {
      color: #383939;
      font-size: 16px;
      padding-bottom: 10px;
      margin-top: 20px;
      border-bottom: 1px solid #ccc;
    }
  }
  .pagination-box {
    display: flex;
    justify-content: space-between;
    margin-top: 50px;
  }
}
</style>
