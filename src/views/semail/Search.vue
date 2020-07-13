<template>
  <div id="search-box" >
    <div class="search">
      <el-form :model="form" :inline="true" size="small" ref="searchForm">
        <el-form-item :label-width="formLabelWidth" prop="mailSubject">
          <label
            slot="label"
          >主&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题</label>
          <el-input v-model="form.mailSubject" auto-complete="off" class="el-ipt"></el-input>
        </el-form-item>
        <el-form-item label="发 文 编 号" :label-width="formLabelWidth"  prop="fileNumber">
          <label slot="label">发&nbsp;&nbsp;&nbsp;文&nbsp;&nbsp;&nbsp;编&nbsp;&nbsp;&nbsp;号</label>
          <el-input v-model="form.fileNumber" auto-complete="off" class="el-ipt"></el-input>
        </el-form-item>
        <el-form-item label="完 成 状 态" :label-width="formLabelWidth"  prop="isFinished">
          <label slot="label">完&nbsp;&nbsp;&nbsp;成&nbsp;&nbsp;&nbsp;状&nbsp;&nbsp;&nbsp;态</label>
          <el-select v-model="form.isFinished" class="el-ipt">
            <el-option label="已完成" :value="0"></el-option>
            <el-option label="未完成" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发 文 类 型" :label-width="formLabelWidth"  prop="mailType">
          <label slot="label">发&nbsp;&nbsp;&nbsp;文&nbsp;&nbsp;&nbsp;类&nbsp;&nbsp;&nbsp;型</label>
          <el-select v-model="form.mailType" class="el-ipt">
            <el-option label="公文信息" :value="0"></el-option>
            <el-option label="涉密信息" :value="1"></el-option>
            <el-option label="非密信息" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密 级" :label-width="formLabelWidth"  prop="mailSlevel">
          <label
            slot="label"
          >密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级</label>
          <el-select v-model="form.mailSlevel" class="el-ipt">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="等 级" :label-width="formLabelWidth"  prop="level">
          <label
            slot="label"
          >等&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级</label>
          <el-select v-model="form.level" class="el-ipt">
            <el-option label="急" :value="0"></el-option>
            <el-option label="特急" :value="1"></el-option>
            <el-option label="加急" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="收 件 人 / 单 位" :label-width="formLabelWidth"  prop="receiver">
          <el-input v-model="form.receiver" auto-complete="off" class="el-ipt"></el-input>
        </el-form-item>
        <el-form-item label="发 件 人 / 单 位" :label-width="formLabelWidth"  prop="receipt">
          <el-input v-model="form.receipt" auto-complete="off" class="el-ipt"></el-input>
        </el-form-item>
        <el-form-item label="时 间 区 间" :label-width="formLabelWidth"  prop="time">
          <label slot="label">时&nbsp;&nbsp;&nbsp;间&nbsp;&nbsp;&nbsp;区&nbsp;&nbsp;&nbsp;间</label>
          <!-- <el-input v-model="form.receipt" auto-complete="off" class="el-ipt"></el-input> -->
          <div class="block">
            <el-date-picker
              v-model="form.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="search-footer">
        <el-button @click="search_cancel()" class="el-btn" size="small">重 置</el-button>
        <el-button type="primary" @click="search_go()" class="el-btn" size="small">查 询</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        //高级搜索表单控件
        mailSubject: "", //主题
        mailSlevel: "", //密级
        fileNumber: "", //发文编号
        level: "", //等级
        sender: "", //发件人
        receiver: "", //收件人
        delivery: false,
        mailType: "", //发文类型
        status: "", //签收状态
        desc: "",
        time:""
      },
      startTime: "",
      endTime: "",
      formLabelWidth: "110px",
      time: ""
    };
  },
  methods: {
    //搜索
    search_go() {
      this.$router.push("/semail/SearchList");
    },
    //重置
    search_cancel() {
      this.$refs["searchForm"].resetFields();
    }
  },
  computed: {
    options() {
      var option = [
        {
          value: 3,
          label: "明电"
        },
        {
          value: 0,
          label: "秘密"
        },
        {
          value: 1,
          label: "机密"
        },
        {
          value: 2,
          label: "绝密"
        }
      ];
      var option1 = [
        {
          value: 0,
          label: "秘密"
        },
        {
          value: 1,
          label: "机密"
        },
        {
          value: 2,
          label: "绝密"
        }
      ];
      var option2 = [
        {
          value: 4,
          label: "公开发布"
        },
        {
          value: 5,
          label: "内部（受控）"
        }
      ];
      if (this.form.mailType == 0) {
        return option;
      } else if (this.form.mailType == 1) {
        return option1;
      } else {
        return option2;
      }
    }
  }
};
</script>

<style scoped lang='scss'>
#search-box {
  .search {
    .el-table {
      border: 1px solid #ccc;
    }
    .el-ipt {
      width: 350px;
    }
    .search-footer {
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>
