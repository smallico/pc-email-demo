<template>
  <div class="home-box" id="home-page" :style="layout.switchTabBar?'height:calc(100vh - 162px)':'height:calc(100vh - 115px)'">
    <div class="home-text">
      <span class="cur-p link-text" @click="goList('unread')">未读邮件</span>
      {{unreadTotal}}封
      <span class="cur-p link-text star-text" @click="goList('star')">星标联系人</span>
      未读邮件{{unreadStarTotal}}封
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { request } from "../../api/data-api";
export default {
  name: "Inbox",
  components: {},
  data() {
    return {};
  },
  created() {
    this.init();
  },
  methods: {
    ...mapMutations([
      "updateUnreadTableData",
      "updateUnreadTotal",
      "updateUnreadStarTableData",
      "updateUnreadStarTotal",
      "updateUnreadActiveName"
    ]),
    //查看邮件列表
    goList(activeName) {
      this.updateUnreadActiveName(activeName);
      this.$router.push({path:"unread"});
    },
    //初始化
    init() {
      if (sessionStorage.getItem("unreadTableData")) {
        this.updateUnreadTableData(
          JSON.parse(sessionStorage.getItem("unreadTableData"))
        );
        this.computedTotal();
      } else {
        this.getTableData();
      }
      if (sessionStorage.getItem("unreadStarTableData")) {
        this.updateUnreadStarTableData(
          JSON.parse(sessionStorage.getItem("unreadStarTableData"))
        );
        this.computedTotal();
      } else {
        this.getStarTableData();
      }
    },
    //获取未读并组装表格数据
    getTableData() {
      request("/unread", data => {
        console.log("", data);
        var tableData = [];
        tableData.push({
          title: "",
          tdata: [
            ...data.data.today,
            ...data.data.yesterday,
            ...data.data.pastDay
          ]
        });
        tableData.push({
          title: "今天",
          tdata: data.data.today
        });
        tableData.push({
          title: "昨天",
          tdata: data.data.yesterday
        });
        tableData.push({
          title: "更早",
          tdata: data.data.pastDay
        });
        this.updateUnreadTableData(tableData);
        this.updateUnreadTotal(data.data.total);
      });
    },
    //获取星标未读
    getStarTableData() {
      request("/unreadStar", data => {
        console.log("", data);
        var tableData = [];
        tableData.push({
          title: "",
          tdata: [
            ...data.data.today,
            ...data.data.yesterday,
            ...data.data.pastDay
          ]
        });
        tableData.push({
          title: "今天",
          tdata: data.data.today
        });
        tableData.push({
          title: "昨天",
          tdata: data.data.yesterday
        });
        tableData.push({
          title: "更早",
          tdata: data.data.pastDay
        });
        this.updateUnreadStarTableData(tableData);
        this.updateUnreadStarTotal(data.data.total);
      });
    },
    //计算总条数
    computedTotal() {
      var totalNum = 0;
      this.unreadTableData.forEach((item, tIndex) => {
        if (tIndex > 0) {
          totalNum += this.unreadTableData[tIndex].tdata.length;
        }
      });
      this.updateUnreadTotal(totalNum);
      var total = 0;
      this.unreadStarTableData.forEach((item, tIndex) => {
        if (tIndex > 0) {
          total += this.unreadStarTableData[tIndex].tdata.length;
        }
      });
      this.updateUnreadStarTotal(total);
    }
  },
  computed: {
    ...mapState([
      "unreadTableData",
      "unreadTotal",
      "unreadStarTableData",
      "unreadStarTotal",
      "layout"
    ])
  }
};
</script>

<style scoped lang='scss'>
* {
  margin: 0;
  padding: 0;
}
.home-box {
  width: 100%;
  //min-height: calc(100vh - 162px);
  background-image: url("../../assets/img/home_bg.png") !important;
  background-size: cover;
  .home-text {
    padding: 20px;
    font-size: 16px;
    .link-text {
      color: #0ba86c;
      text-decoration: underline;
    }
    .star-text {
      margin-left: 15px;
    }
  }
}
nav {
  height: 100px;
  background: #f6fbff;
  ul {
    display: flex;
    height: 100%;
    li {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #666666;
      font-size: 16px;
      width: 200px;
      border-left: 1px solid #dadada;
      position: relative;
      p {
        margin-top: 10px;
      }
      .no-num {
        position: absolute;
        top: 6px;
        right: 46px;
        background: red;
        color: #fff;
        padding: 0 10px;
        border-radius: 10px;
      }
    }
    .active {
      color: #008cff;
    }
  }
}
.el-table-box {
  .table-img {
    margin-left: 10px;
  }
}
.progress-box {
  margin-bottom: 20px;
}
.tab-label {
  line-height: normal;
}
* {
  margin: 0;
  padding: 0;
}
#sendbox {
  margin-left: 18px;
  .send-num {
    .send {
      color: #0c86dc;
      font-size: 16px;
      margin-bottom: 10px;
    }
  }
  .search {
    display: flex;
    align-items: center;
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
    .el-form-item {
      margin-top: 14px;
    }
    .search-btn {
      width: 119px;
      height: 35px;
      background-color: #ffae00;
      border-radius: 3px;
      border: solid 1px #ba5801;
      color: #fff;
      margin-left: 35px;
    }
    .el-btn {
      width: 50px;
      height: 30px;
    }

    .el-ipt {
      width: 350px;
    }
  }
  .el-table-box {
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
      margin-bottom: 10px;
      margin-top: 20px;
    }
  }
  .pagination-box {
    display: flex;
    justify-content: space-between;
    margin-top: 50px;
  }
}
</style>

