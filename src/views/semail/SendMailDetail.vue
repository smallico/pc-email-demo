<template>
  <div>
    <el-tabs tab-position="bottom">
      <el-tab-pane label="发送信息">
        <div class="receive">
          <div class="switch-box">
            <span @click="changePage(0)">上一封&nbsp;&nbsp;</span>
            <span>|</span>
            <span @click="changePage(2)">&nbsp;&nbsp;下一封</span>
          </div>
          <el-button size="small" @click="back">&lt;&lt;返回</el-button>
          <el-button size="small" @click="withdrawMail">撤 回</el-button>
          <el-button size="small" @click="sendAgin">重 发</el-button>
          <el-button size="small" @click="trans">转 发</el-button>
          <el-button size="small" @click="tofinish" v-if="row.isFinished==0">完 成</el-button>
          <el-button size="small" @click="deleteMail">删 除</el-button>

          <div class="box">
            <div class="title">{{row.mailSubject}}</div>
            <ul class="ul msg-list">
              <li>
                <span>发 件 人 ：{{row.sender}}</span>
              </li>
              <li>
                <span v-if="row.mailSlevel==0">密 级 ：秘密</span>
                <span v-else-if="row.mailSlevel==1">密 级 ：机密</span>
                <span v-else-if="row.mailSlevel==2">密 级 ：绝密</span>
                <span v-else-if="row.mailSlevel==3">密 级 ：明电</span>
                <span v-else-if="row.mailSlevel==4">密 级 ：公开发布</span>
                <span v-else-if="row.mailSlevel==5">密 级 ：内部（受控）</span>
              </li>

              <li>
                <span>收 件 人 ：{{row.receiver}}</span>
              </li>
              <li>
                <span v-if="row.level==0">等 级 ：急</span>
                <span v-if="row.level==1">等 级 ：特急</span>
                <span v-if="row.level==2">等 级 ：加急</span>
              </li>
              <li>
                <span>发文编号 ：{{row.fileNumber}}</span>
              </li>
              <li>
                <span>发文类型 ：{{row.mailType==0?"公文信息":row.mailType==1?"涉密信息":"非密信息"}}</span>
              </li>

              <li>
                <span>完成状态 ：{{row.isFinished=="0"?"未完成":"已完成"}}</span>
              </li>
              <li>
                <span>发文时间 ：{{row.createdTime}}</span>
              </li>
            </ul>
          </div>
          <div class="content-box" v-html="row.mailSummary">
            <!-- <div class="ch">尊敬的各同事,下午好：</div>
      <div class="content-word">
        关于组织召开学习新时代精神的培训时间安排通知,已经通过邮件系统发送到各位同事们的邮箱，请注意查收。
        这次培训很重要，要求全体员工都要参加，如有特殊情况不能按时入会，请提前说明情况。
      </div>
      <div class="user">刘大伟</div>
            <div class="time">2019年04月19日 16：28</div>-->
          </div>
          <div class="fujian-box">
            <img src="../../assets/img/fujian.png" alt class="fujian-icon">
            <span>附件（2）</span>
          </div>
          <ul class="flex wenjian-list mar-t20 mar-b20">
            <li class="flex" v-for="(item,index) in row.fileList" :key="item.fileId">
              <div>
                <img
                  src="../../assets/img/word.png"
                  class="wenjian-type mar-r20"
                  alt
                  v-if="item.fileType=='application/msword'"
                >
                <img src="../../assets/img/pdf.png" class="wenjian-type mar-r20" alt v-else>
              </div>
              <div>
                <div class="mar-b10">{{item.fileName}} （14.01 k）</div>
                <div>
                  <el-button size="mini" @click="download" v-if="row.mailType!=0">下载</el-button>
                  <el-button size="mini" @click="dialogVisible=true">预览</el-button>
                  <el-button
                    size="mini"
                    @click="print(index)"
                    v-if="row.mailType==0"
                  >打印（{{item.hasPrintNum}}/{{item.printNum}}）</el-button>
                </div>
              </div>
            </li>
            <!--       <li class="flex">
        <div>
          <img src="../../assets/img/pdf.png" class="wenjian-type mar-r20" alt>
        </div>
        <div>
          <div class="mar-b10">
            关于组织召开学习新时代精神
            的培训时间安排 .doc （{{item.fileSize}} k）
          </div>
          <el-button size="mini" @click="download">下载</el-button>
          <el-button size="mini" @click="dialogVisible=true">预览</el-button>
          <el-button size="mini" @click="print">打印（0/4）</el-button>
        </div>
            </li>-->
          </ul>
          <a href="../../assets/img/preview.bmp" download ref="download" style="display:none">下载</a>
          <el-dialog :visible.sync="dialogVisible" width="50%">
            <img src="../../assets/img/preview-eg.jpg" alt class="alert-img">
          </el-dialog>
        </div>
      </el-tab-pane>
      <el-tab-pane label="发送状态">
        <img src="./../../assets/sendbox/alert.png" class="send-state-img" alt>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="finishReasonDialog">
      <el-form>
        <el-form-item label="人工干预原因" :label-width="80">
          <el-input
            v-model="row.intervenedReason"
            auto-complete="off"
            class="el-ipt"
            style="width:500px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="finishReasonDialog=false" class="el-btn">取 消</el-button>
        <el-button type="primary" @click="submitReason" class="el-btn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { setTimeout, setInterval } from "timers";
export default {
  data() {
    return {
      current: 1,
      row: {
        mailId: "32343f308a68a6a854905a1e5a912fc4", //邮件ID
        sender: "刘大伟", //发件人
        receiver: "张小利", //收件
        mailSlevel: 0, //密级,0秘密,1机密,2绝密,3明电,4公开发布,5内部（受控）
        level: 0, //等级，0急,1特急2加急
        mailType: 0, //文件类型0公文信息，1//涉密信息，2//非密信息
        isFinished: 0, //是否已完成，0未完成，1已完成
        intervenedReason: "", //人工干预原因
        mailDirect: 1, //收发标识：0发/1收
        fileNumber: "001010", //发文编号
        createdTime: "2019-04-19 16:32:00", //发文时间
        mailSubject: "关于组织召开学习新时代精神的培训时间安排", //邮件主题
        mailSummary:
          '<div style="line-height:36px;">尊敬的各同事,下午好：</div><div style="text-indent:2em;line-height:36px;">关于组织召开学习新时代精神的培训时间安排通知,已经通过邮件系统发送到各位同事们的邮箱，请注意查收。这次培训很重要，要求全体员工都要参加，如有特殊情况不能按时入会，请提前说明情况。</div><div style="text-align:right;padding-left:30px;margin-top:80px;margin-bottom:15px;">刘大伟</div><div style="text-align:right;">2019年04月19日 16：28</div>', //邮件概要
        fileList: [
          {
            fileId: "4568fdfsddfweg5gad5f65fgad4", //文件ID
            fileName: "本周工作总结.pdf", //文件名字
            filePath: "C://mailFile/file", //文件路径
            fileSize: 2048, //文件大小
            printNum: 2, //打印份数
            mailId: "32343f308a68a6a854905a1e5a912fc4", //从属邮件ID
            fileMd5: "8f8dgfdgsfg4fh4sfgdsgs41", //文件检验码
            fileType: "pdf",
            hasPrintNum: 0 //已打印份数
          },
          {
            fileId: "4568fdfsddfweg5gad5f65fgad5", //文件ID
            fileName: "下周工作计划.doc", //文件名字
            filePath: "C://mailFile/file", //文件路径
            fileSize: 2048, //文件大小
            printNum: 3, //打印份数
            mailId: "32343f308a68a6a854905a1e5a912fc4", //从属邮件ID
            fileMd5: "8f8dgfdgsfg4fh4sfgdsgs41", //文件检验码
            fileType: "application/msword", //文件类型
            hasPrintNum: 0 //已打印份数
          }
        ]
      },
      dialogVisible: false,
      finishReasonDialog: false, //人工干预弹窗
      intervenedReason: "" //人工干预原因
    };
  },
  methods: {
    //打印
    print(index) {
      if (
        this.row.fileList[index].hasPrintNum < this.row.fileList[index].printNum
      ) {
        this.$message({
          message: "正在打印中...",
          type: "success"
        });
        this.row.fileList[index].hasPrintNum += 1;
      } else {
        this.$message({
          message: "打印已完成",
          type: "warning"
        });
      }
    },
    //下载
    download() {
      this.$refs.download.click();
    },
    //换页
    changePage(val) {
      if (this.current < val) {
        this.row.mailSubject = "关于安全邮件系统优化性能总结";
        this.row.mailType = 1;
        this.row.sender = "李伟伟";
        this.row.receiver = "王晓更";
        this.row.mailSummary =
          '<div style="line-height:36px;">尊敬的各同事,上午好：</div><div style="text-indent:2em;line-height:36px;">关于安全邮件系统优化性能的总结,已经通过邮件系统发送到各位同事们的邮箱，请注意查收。这次培训很重要，要求全体员工都要参加，如有特殊情况不能按时入会，请提前说明情况。</div><div style="text-align:right;padding-left:30px;margin-top:80px;margin-bottom:15px;">刘大伟</div><div style="text-align:right;">2019年04月19日 16：28</div>';
      } else if (this.current == val) {
        this.row.mailSubject = "关于组织召开学习新时代精神的培训时间安排";
        this.row.mailType = 0;
        this.row.sender = "杨光";
        this.row.receiver = "陈诚";

        this.row.mailSummary =
          '<div style="line-height:36px;">尊敬的各同事,下午好：</div><div style="text-indent:2em;line-height:36px;">关于组织召开学习新时代精神的培训时间安排通知,已经通过邮件系统发送到各位同事们的邮箱，请注意查收。这次培训很重要，要求全体员工都要参加，如有特殊情况不能按时入会，请提前说明情况。</div><div style="text-align:right;padding-left:30px;margin-top:80px;margin-bottom:15px;">杨光</div><div style="text-align:right;">2019年04月19日 16：28</div>';
      } else {
        this.row.mailSubject = "信息安全性保障的重要要求";
        this.row.mailType = 2;
        this.row.sender = "张赫";
        this.row.receiver = "刘陈诚";
        this.row.mailSummary =
          '<div style="line-height:36px;">尊敬的各同事,中午好：</div><div style="text-indent:2em;line-height:36px;">关于信息安全性保障的重要要求,已经通过邮件系统发送到各位同事们的邮箱，请注意查收。这次培训很重要，要求全体员工都要参加，如有特殊情况不能按时入会，请提前说明情况。</div><div style="text-align:right;padding-left:30px;margin-top:80px;margin-bottom:15px;">张赫</div><div style="text-align:right;">2019年04月19日 16：28</div>';
      }
      this.current = val;
    },
    //返回
    back() {
      this.$router.go(-1);
    },
    //删除邮件
    deleteMail() {
      this.$confirm("确定要删除邮件吗？", "提示")
        .then(() => {
          this.changePage(2);
        })
        .catch(() => {});
    },
    //转发
    trans() {
      sessionStorage.setItem("transMailDetail", JSON.stringify(this.row));
      this.$router.push("/semail/send?type=trans");
    },
    //回复
    reply() {
      sessionStorage.setItem("replyMailDetail", JSON.stringify(this.row));
      this.$router.push("/semail/send?type=reply");
    },
    //重发
    sendAgin() {
      const h = this.$createElement;
      this.$notify({
        title: "系统提示",
        duration: 0,
        position: "bottom-right",
        message: h(
          "div",
          {
            style: {
              display: "block"
            }
          },
          [
            h("elProgress", {
              style: {
                display: "block"
              },
              props: {
                percentage: this.$store.state.sendPercent,
                strokeWidth: 6
              }
            }),
            h(
              "div",
              {
                style: {
                  textAligin: "center",
                  marginTop: "10px"
                }
              },
              "邮件正在发送.."
            )
          ]
        )
      });
      setTimeout(() => {
        this.$notify.closeAll();
        const h = this.$createElement;
        this.$notify({
          title: "系统提示",
          duration: 0,
          type: "success",
          position: "bottom-right",
          message: h(
            "div",
            {
              style: {
                display: "block"
              }
            },
            [
              h(
                "div",
                {
                  style: {
                    textAligin: "center",
                    marginTop: "10px"
                  }
                },
                "邮件发送成功"
              )
            ]
          )
        });
      }, 3000);
    },
    //完成
    tofinish() {
      this.intervenedReason = "";
      this.finishReasonDialog = true;
    },
    //提交人工干预原因
    submitReason() {
      this.row.isFinished = 1;
      this.finishReasonDialog = false;
    },
    //撤回邮件
    withdrawMail() {
      this.$confirm("确定要撤回邮件吗？", "提示")
        .then(() => {
          this.changePage(2);
        })
        .catch(() => {});
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.query.type == "trans") {
      console.log("ddd");
      to.meta.title = "转发";
    } 
    next();
  }
};
</script>
<style lang="scss" scoped>
/* ================== */
.send-state-img {
  width: 80%;
  display: block;
  margin: auto;
}
.receive {
  position: relative;
}
.switch-box {
  border: 1px solid #bcbcbc;
  font-size: 14px;
  color: #333;
  padding: 5px 10px;
  border-radius: 20px;
  display: inline-block;
  position: absolute;
  right: 20px;
  cursor: pointer;
}
.box {
  background-color: #f4f4f4;
  border: solid 1px #cdcdcd;
  padding: 20px;
  margin-top: 20px;
}
.title {
  font-size: 20px;
  color: #000000;
  font-weight: bold;
}
.ul {
  list-style: none;
  margin-top: 20px;
}
.ul li {
  display: inline-block;
  font-size: 12px;
  color: #333333;
  margin: 10px 5px;
}
.msg-list{
  font-size: 0;
  li{
    font-size: 12px;
  }
}
.content-box {
  background: #fff;
  padding: 20px;
  font-size: 16px;
}
.ch {
  line-height: 36px;
}
.content-word {
  text-indent: 2em;
  line-height: 36px;
}
.user {
  text-align: right;
  padding-right: 30px;
  margin-top: 80px;
  margin-bottom: 15px;
}
.time {
  text-align: right;
}
.fujian-box {
  border-top: solid 1px #cdcdcd;
  border-bottom: solid 1px #cdcdcd;
  font-size: 16px;
  color: #000;
  padding: 10px;
  margin-top: 40px;
}
.fujian-icon {
  width: 12px;
  vertical-align: middle;
  margin-right: 10px;
}
.mar-t20 {
  margin-top: 20px;
}
.mar-r10 {
  margin-right: 10px;
}
.mar-r20 {
  margin-right: 20px;
}
.mar-b10 {
  margin-bottom: 10px;
}
.mar-b20 {
  margin-bottom: 20px;
}
.color {
  color: #008bff;
}
.cur-p {
  cursor: pointer;
}
.flex {
  display: flex;
}
.flex-ac {
  align-items: center;
}
.progress {
  display: inline-block;
  width: 60%;
}
.wenjian-list {
  background-color: #e8f6fe;
  padding: 20px;
  li {
    width: 300px;
    margin-right: 50px;
    font-size: 12px;
    .wenjian-type {
      width: 40px;
      height: auto;
    }
  }
}
.alert-img {
  width: 100%;
}
</style>

