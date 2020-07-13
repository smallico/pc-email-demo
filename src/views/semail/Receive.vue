<template>
    <div class="recieve-page">
        <div class="progress-box" v-if="showProgress">
            <el-progress :percentage="percent" :stroke-width="6"></el-progress>
        </div>
        <!--     <nav>
          <ul>
            <li class="active">
              <img src="./../../assets/home/MAIL.png" alt>
              <p>未读邮件</p>
              <div class="no-num">15</div>
            </li>
            <li>
              <img src="./../../assets/home/STAR.png" alt>
              <p>星标联系人未读邮件</p>
              <div class="no-num">15</div>
            </li>
            <li>
              <img src="./../../assets/home/custom.png" alt>
              <p>自定义添加</p>
            </li>
          </ul>
        </nav>-->

        <el-tabs tab-position="top" v-model="activeName" @tab-click="tabClick" style="margin-top:5px">
            <el-tab-pane name="unread">
                <div class="active" slot="label">
                             <el-badge :value="unreadTotal" class="item">
                               <p class="tab-label">未读邮件</p>
                             </el-badge>

                    <!-- <p class="send">
                        共{{unreadTotal}}封邮件（
                        <span>未读邮件{{unreadTotal}}封，未签收邮件{{unreadTotal}}封）</span>
                    </p> -->
                </div>
                <div id="sendbox">
                    <div class="el-table-box">
                        <div class="table-box">
                            <template v-for="(item,index) in unreadTableData">
                                <p
                                        class="table-title"
                                        v-if="item.title!==''&&item.tdata.length>0"
                                        :key="'title'+index"
                                >{{item.title+'('+item.tdata.length+")"}}</p>
                                <el-table
                                        ref="table"
                                        :data="item.tdata"
                                        tooltip-effect="dark"
                                        style="width: 100%"
                                        @selection-change="handleSelectionChange"
                                        :cell-style="cellStyle"
                                        @select-all="selectAll"
                                        size="medium"
                                        :key="index"
                                        :show-header="index==0"
                                        :class="index==0?'headTable':''"
                                >

                                    <el-table-column type="selection" align="left" header-align="left"
                                                     min-width="40"></el-table-column>
                                    <el-table-column
                                            prop="isOpened"
                                            label="状态"
                                            min-width="60"
                                            align="left"
                                            header-align="left"
                                    >
                                        <template slot-scope="scope">
                                            <img
                                                    :src="scope.row.isOpened==1 ?read_url:no_read_url"
                                                    alt
                                                    @click="f(scope.row.id)"
                                            >
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="receiveTime"
                                            label="收文时间"
                                            align="left"
                                            header-align="left"
                                            sortable
                                            :show-overflow-tooltip="true"
                                    >
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.receiveTime==''"></span>
                                            <span v-else>{{scope.row.receiveTime}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="fileNumber" label="发文编号" align="left"
                                                     header-align="left"></el-table-column>
                                    <el-table-column
                                            prop="mailSubject"
                                            label="主题"
                                            align="left"
                                            header-align="left"
                                            :show-overflow-tooltip="true"
                                            min-width="150"
                                    >
                                        <template slot-scope="scope">
                                            <span class="cur-p" @click="checkDetail(scope.row,index,scope.$index)">{{scope.row.mailSubject}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="mailSlevel" label="密级" align="left" header-align="left">
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.mailSlevel==0">秘密</span>
                                            <span v-if="scope.row.mailSlevel==1">机密</span>
                                            <span v-if="scope.row.mailSlevel==2">绝密</span>
                                            <span v-if="scope.row.mailSlevel==3">明电</span>
                                            <span v-if="scope.row.mailSlevel==4">公开发布</span>
                                            <span v-if="scope.row.mailSlevel==5">内部（受控）</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="level"
                                            label="等级"
                                            align="left"
                                            header-align="left"
                                            min-width="50"
                                    >
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.level==0">急</span>
                                            <span v-if="scope.row.level==1">特急</span>
                                            <span v-if="scope.row.level==2">加急</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="sender" label="发件人/终端" align="left"
                                                     header-align="left"></el-table-column>
                                    <el-table-column
                                            prop="createdTime"
                                            label="发文时间"
                                            align="left"
                                            header-align="left"
                                            sortable
                                            :show-overflow-tooltip="true"
                                    ></el-table-column>
                                    <el-table-column
                                            prop="annex"
                                            label="附件"
                                            align="left"
                                            header-align="left"
                                            min-width="50"
                                    >
                                        <template slot-scope="scope">
                                            <el-tooltip placement="bottom" effect="light">
                                                <div slot="content">
                                                    <ul class="flex">
                                                        <li
                                                                class="flex"
                                                                v-for="(file,fileIndex) in scope.row.fileList"
                                                                :key="'file'+fileIndex"
                                                        >
                                                            <div>
                                                                <img src="./../../assets/img/word.png"
                                                                     class="wenjian-type" alt>
                                                                {{file.fileName}}
                                                            </div>
                                                            <div style="margin-top:5px;width:100%;height:25px;">
                                                                <div style="float:right;">
                                                                    <el-button size="mini" type="text" @click="checkFj">
                                                                        预览
                                                                    </el-button>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <!--                       <li class="flex">
                                                    <div>
                                                      <img src="./../../../assets/img/pdf.png" class="wenjian-type" alt>关于组织召开学习新时代精神
                                                      的培训时间安排.doc
                                                    </div>
                                                    <div style="margin-top:5px;width:100%;height:25px;">
                                                      <div style="float:right;">
                                                        <el-button size="mini" @click="checkFj" type="text">预览</el-button>
                                                      </div>
                                                    </div>
                                                        </li>-->
                                                    </ul>
                                                </div>
                                                <span
                                                        style="color:#67C23A;cursor:pointer;margin-left:5px;width:40px;"
                                                >{{scope.row.fileList.length}}</span>
                                            </el-tooltip>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="annexoperation"
                                            label="操作"
                                            align="left"
                                            header-align="left"
                                            width="200"
                                    >
                                        <template slot-scope="scope">
                                            <div class="operation-div">
                                                <!-- <el-button type="text" @click="checkDetail(scope.row,index,scope.$index)">查看</el-button> -->
                                                <el-button type="text" @click="deleteRow(scope.row,index,scope.$index)">
                                                    删除
                                                </el-button>
                                                <el-button
                                                        type="text"
                                                        @click="manual(scope.row,index,scope.$index,1)"
                                                        v-if="scope.row.isRecepted==0"
                                                >签收
                                                </el-button>
                                                <el-button
                                                        type="text"
                                                        @click="manual(scope.row,index,scope.$index,2)"
                                                        v-if="scope.row.isRecepted==0"
                                                >拒收
                                                </el-button>
                                                <el-button type="text" v-if="scope.row.isRecepted==1" disabled>已签收
                                                </el-button>
                                                <el-button type="text" v-if="scope.row.isRecepted==2" disabled>已拒收
                                                </el-button>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </div>
                    </div>
                    <div class="pagination-box">
                        <p>共{{unreadTotal}}条记录 当前第1页</p>
                        <el-pagination layout="prev, pager, next" :total="Number(unreadTotal)"></el-pagination>
                    </div>
                </div>
            </el-tab-pane>
                 <el-tab-pane name="star">
                   <div class="active" slot="label">
                     <el-badge :value="unreadStarTotal" class="item">
                       <p class="tab-label">星标联系人未读邮件</p>
                     </el-badge>
                   </div>
                   <div id="sendbox">
                     <div class="el-table-box">
                       <div class="table-box">
                         <template v-for="(item,index) in unreadStarTableData">
                           <p
                             class="table-title"
                             v-if="item.title!==''&&item.tdata.length>0"
                             :key="'title'+index"
                           >{{item.title+'('+item.tdata.length+")"}}</p>
                           <el-table
                             ref="table"
                             :data="item.tdata"
                             tooltip-effect="dark"
                             style="width: 100%;background-color:red;"
                             @selection-change="handleSelectionChange"
                             :cell-style="cellStyle"
                             @select-all="selectAll"
                             size="medium"
                             :key="index"
                             :show-header="index==0"
                             :class="index==0?'headTable':''">
                             <el-table-column type="selection" align="left" header-align="left" min-width="40"></el-table-column>
                             <el-table-column
                               prop="isOpened"
                               label="状态"
                               min-width="60"
                               align="left"
                               header-align="left"
                             >
                               <template slot-scope="scope">
                                 <img
                                   :src="scope.row.isOpened==1?read_url:no_read_url"
                                   alt
                                   @click="f(scope.row.id)"
                                 >
                               </template>
                             </el-table-column>
                             <el-table-column
                               prop="receiveTime"
                               label="收文时间"
                               align="left"
                               header-align="left"
                               sortable
                               :show-overflow-tooltip="true"
                             >
                               <template slot-scope="scope">
                                 <span v-if="scope.row.receiveTime==''">未签收</span>
                                 <span v-else>{{scope.row.receiveTime}}</span>
                               </template>
                             </el-table-column>
                             <el-table-column prop="fileNumber" label="发文编号" align="left" header-align="left"></el-table-column>
                             <el-table-column
                               prop="mailSubject"
                               label="主题"
                               align="left"
                               header-align="left"
                               :show-overflow-tooltip="true"
                               min-width="150"
                             >
                              <template slot-scope ="scope">
                               <span class="cur-p" @click="checkDetail(scope.row,index,scope.$index)">{{scope.row.mailSubject}}</span>
                             </template>
                             </el-table-column>
                             <el-table-column prop="mailSlevel" label="密级" align="left" header-align="left">
                               <template slot-scope="scope">
                                 <span v-if="scope.row.mailSlevel==0">秘密</span>
                                 <span v-if="scope.row.mailSlevel==1">机密</span>
                                 <span v-if="scope.row.mailSlevel==2">绝密</span>
                                 <span v-if="scope.row.mailSlevel==3">明电</span>
                                 <span v-if="scope.row.mailSlevel==4">公开发布</span>
                                 <span v-if="scope.row.mailSlevel==5">内部（受控）</span>
                               </template>
                             </el-table-column>
                             <el-table-column
                               prop="level"
                               label="等级"
                               align="left"
                               header-align="left"
                               min-width="50"
                             >
                               <template slot-scope="scope">
                                 <span v-if="scope.row.level==0">急</span>
                                 <span v-if="scope.row.level==1">特急</span>
                                 <span v-if="scope.row.level==2">加急</span>
                               </template>
                             </el-table-column>
                             <el-table-column prop="sender" label="发件人/终端" align="left" header-align="left"></el-table-column>
                             <el-table-column
                               prop="createdTime"
                               label="发文时间"
                               align="left"
                               header-align="left"
                               sortable
                               :show-overflow-tooltip="true"
                             ></el-table-column>
                             <el-table-column
                               prop="annex"
                               label="附件"
                               align="left"
                               header-align="left"
                               min-width="50"
                             >
                               <template slot-scope="scope">
                                 <el-tooltip placement="bottom" effect="light">
                                   <div slot="content">
                                     <ul class="flex">
                                       <li
                                         class="flex"
                                         v-for="(file,fileIndex) in scope.row.fileList"
                                         :key="'file'+fileIndex"
                                       >
                                         <div>
                                           <img src="./../../assets/img/word.png" class="wenjian-type" alt>
                                           {{file.fileName}}
                                         </div>
                                         <div style="margin-top:5px;width:100%;height:25px;">
                                           <div style="float:right;">
                                             <el-button size="mini" type="text" @click="checkFj">预览</el-button>
                                           </div>
                                         </div>
                                       </li>
                                       &lt;!&ndash;                       <li class="flex">
                                   <div>
                                     <img src="../../assets/img/pdf.png" class="wenjian-type" alt/>关于组织召开学习新时代精神
                                     的培训时间安排.doc
                                   </div>
                                   <div style="margin-top:5px;width:100%;height:25px;">
                                     <div style="float:right;">
                                       <el-button size="mini" @click="checkFj" type="text">预览</el-button>
                                     </div>
                                   </div>
                                       </li>&ndash;&gt;
                                     </ul>
                                   </div>
                                   <span
                                     style="color:#67C23A;cursor:pointer;margin-left:5px;width:40px;"
                                   >{{scope.row.fileList.length}}</span>
                                 </el-tooltip>
                               </template>
                             </el-table-column>
                             <el-table-column
                               prop="annexoperation"
                               label="操作"
                               align="left"
                               header-align="left"
                               width="200"
                             >
                               <template slot-scope="scope">
                                 <div class="operation-div">
                                   &lt;!&ndash; <el-button type="text" @click="checkDetail(scope.row,index,scope.$index)">查看</el-button> &ndash;&gt;
                                   <el-button type="text" @click="deleteRow(scope.row,index,scope.$index)">删除</el-button>
                                   <el-button
                                     type="text"
                                     @click="manual(scope.row,index,scope.$index,1)"
                                     v-if="scope.row.isRecepted==0"
                                   >签收</el-button>
                                   <el-button
                                     type="text"
                                     @click="manual(scope.row,index,scope.$index,2)"
                                     v-if="scope.row.isRecepted==0"
                                   >拒收</el-button>
                                   <el-button type="text" v-if="scope.row.isRecepted==1" disabled>已签收</el-button>
                                   <el-button type="text" v-if="scope.row.isRecepted==2" disabled>已拒收</el-button>
                                 </div>
                               </template>
                             </el-table-column>
                           </el-table>
                         </template>
                       </div>
                     </div>
                     <div class="pagination-box">
                       <p>共{{unreadStarTotal}}条记录 当前第1页</p>
                       <el-pagination layout="prev, pager, next" :total="Number(unreadStarTotal)"></el-pagination>
                     </div>
                   </div>
                 </el-tab-pane>
        </el-tabs>
        <el-dialog :visible.sync="manualDialogVisible" width="50%">
            <el-form :model="manual_form" :inline="true">
                <el-form-item :label="signLabel" label-width="80">
                    <el-input
                            v-model="manual_form.reason"
                            auto-complete="off"
                            class="el-ipt"
                            style="width:500px;"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="manual_cancel()" size="small">取 消</el-button>
                <el-button type="primary" @click="manual_go()" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {mapState, mapMutations} from "vuex";
    import {request} from "../../api/data-api";

    export default {
        name: "Inbox",
        components: {},
        data() {
            return {
                percent: 0,
                timer: null,
                showProgress: false,
                show: false,
                dialogFormVisible: false, //高级搜索弹出框开关
                read_url: require("./../../assets/sendbox/reading.png"), //已读图片路径
                no_read_url: require("./../../assets/sendbox/no-reading.png"), //未读图片路径
                activeName: "unread",
                manualDialogVisible: false, //手动操作弹出框
                form: {
                    //高级搜索表单控件
                    mailSubject: "", //主题
                    mailSlevel: "", //密级
                    fileNumber: "", //发文编号
                    level: "", //等级
                    sender: "", //发件人
                    mailType: "", //发文类型
                    isRecepted: "" //签收状态
                },
                manual_form: {
                    reason: ""
                },
                tIndex: 0,
                manual_index: 0,
                formLabelWidth: "100px",
                keyWord: "",
                signLabel: "签收意见"
            };
        },
        created() {
            if (this.$route.query.activeName) {
                this.activeName = this.$route.query.activeName;
                //this.activeName = "unread";
            } else {
                this.activeName = "unread";
            }
            this.init();
        },
        mounted() {
            this.getProgress();
        },
        methods: {
            ...mapMutations([
                "updateUnreadTableData",
                "updateUnreadTotal",
                "updateUnreadStarTableData",
                "updateUnreadStarTotal"
            ]),
            //设置收件进度条
            getProgress() {
                this.showProgress = true;
                this.setTimer();
                setTimeout(() => {
                    this.$message({
                        message: "已更新最新收件",
                        type: "success"
                    });
                    this.showProgress = false;
                }, 1500);
            },
            //收件进度条定时器
            setTimer() {
                if (this.timer == null) {
                    this.percent = 0;
                    this.timer = setInterval(() => {
                        this.percent += 10;
                        if (this.percent == 100) {
                            clearInterval(this.timer);
                            this.timer = null;
                        }
                    }, 100);
                }
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
            //切换
            tabClick() {
                if (this.activeName == "unread") {
                    if (sessionStorage.getItem("unreadTableData")) {
                        this.updateUnreadTableData(
                            JSON.parse(sessionStorage.getItem("unreadTableData"))
                        );
                        this.computedTotal();
                    } else {
                        this.getTableData();
                    }
                } else {
                    if (sessionStorage.getItem("unreadStarTableData")) {
                        this.updateUnreadStarTableData(
                            JSON.parse(sessionStorage.getItem("unreadStarTableData"))
                        );
                        this.computedTotal();
                    } else {
                        this.getTableData();
                    }
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
            //查看邮件详情
            checkDetail(row, tIndex, index) {
                if (this.activeName == "unread") {
                    this.unreadTableData[tIndex].tdata[index].isOpened = 1;
                    this.unreadTableData[tIndex].tdata.splice(index, 1);
                    this.updateUnreadTableData(this.unreadTableData);
                } else {
                    this.unreadStarTableData[tIndex].tdata[index].isOpened = 1;
                    this.unreadStarTableData[tIndex].tdata.splice(index, 1);
                    this.updateUnreadStarTableData(this.unreadStarTableData);
                }
                this.$router.push("/semail/recieveMailDetail");
            },
            //添加表格样式
            cellStyle(row, column, rowIndex, columnIndex) {
                var str = "";
                var colorRed = "color:red;";
                var colorGreen = "color:green;";
                var colorBlack = "color:#333;";
                if (row.row.isOpened == 0) {
                    str = "font-weight:bolder;";
                }
                if (row.row.mailType == 0) {
                    if (row.row.mailSlevel == 3) {
                        return str + colorGreen;
                    } else {
                        return str + colorRed;
                    }
                } else if (row.row.mailType == 1) {
                    if (row.row.mailSlevel == 2) {
                        return str + colorRed;
                    } else {
                        return str + colorBlack;
                    }
                } else {
                    return str + colorGreen;
                }
            },
            //附件预览
            checkFj() {
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
            },
            //签收拒收
            manual(row, tIndex, index, type) {
                this.manual_form.reason = "";
                this.tIndex = tIndex;
                this.manual_index = index;
                if (type == 1) {
                    this.signLabel = "签收意见";
                } else {
                    this.signLabel = "拒收意见";
                }
                this.manualDialogVisible = true;
            },
            //取消签收拒收
            manual_cancel() {
                this.manualDialogVisible = false;
            },
            //提交签收拒收原因
            manual_go(row) {
                if (this.activeName == "unread") {
                    if (this.signLabel == "签收意见") {
                        //设置文件状态
                        this.unreadTableData[this.tIndex].tdata[
                            this.manual_index
                            ].isRecepted = 1;
                        //设置签收时间     
                        this.unreadTableData[this.tIndex].tdata[
                            this.manual_index
                            ].receiveTime = this.timestampFormateDate(new Date().getTime());
                        //设置签收图标    
                        this.unreadTableData[this.tIndex].tdata[
                            this.manual_index
                            ].isOpened = 1;
                            
                    } else {
                        this.unreadTableData[this.tIndex].tdata[
                            this.manual_index
                            ].isRecepted = 2;
                    }
                    this.unreadTableData[this.tIndex].tdata[
                        this.manual_index
                        ].receptedContent = this.manual_form.reason;
                    this.updateUnreadTableData(this.unreadTableData);
                } else {
                    if (this.signLabel == "签收意见") {
                        this.unreadStarTableData[this.tIndex].tdata[
                            this.manual_index
                            ].isRecepted = 1;
                        this.unreadStarTableData[this.tIndex].tdata[
                            this.manual_index
                            ].receiveTime = this.timestampFormateDate(new Date().getTime());
                    } else {
                        this.unreadStarTableData[this.tIndex].tdata[
                            this.manual_index
                            ].isRecepted = 2;
                    }
                    this.unreadStarTableData[this.tIndex].tdata[
                        this.manual_index
                        ].receptedContent = this.manual_form.reason;
                    this.updateUnreadStarTableData(this.unreadStarTableData);
                }

                this.manualDialogVisible = false;
            },
            //删除某一行
            deleteRow(row, tIndex, index) {
                this.$confirm("确定要删除吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        if (this.activeName == "unread") {
                            this.unreadTableData[tIndex].tdata.splice(index, 1);
                            this.updateUnreadTableData(this.unreadTableData);
                            this.$message({
                                type: "success",
                                message: "删除成功!"
                            });
                            this.updateUnreadTotal(this.unreadTotal - 1);
                        } else {
                            this.unreadStarTableData[tIndex].tdata.splice(index, 1);
                            this.updateUnreadStarTableData(this.unreadStarTableData);
                            this.$message({
                                type: "success",
                                message: "删除成功!"
                            });
                            this.updateUnreadStarTotal(this.unreadStarTotal - 1);
                        }
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        });
                    });
            },
            f() {
                console.log(1);
            },
            handleSelectionChange() {
            },
            //全选
            selectAll(selection) {
                //同时选中多个table多选框
                //selection代表已选中的数量
                if (this.activeName == "unread") {
                    this.unreadTableData.forEach((item, index) => {
                        if (index > 0) {
                            this.$refs.table[index].clearSelection();
                        }
                    });
                    if (selection.length > 0) {
                        this.unreadTableData.forEach((item, index) => {
                            if (index > 0) {
                                item.tdata.forEach(row => {
                                    this.$refs.table[index].toggleRowSelection(row);
                                });
                            }
                        });
                    }
                } else {
                    this.unreadStarTableData.forEach((item, index) => {
                        if (index > 0) {
                            this.$refs.table[4 + index].clearSelection();
                        }
                    });
                    if (selection.length > 0) {
                        this.unreadStarTableData.forEach((item, index) => {
                            if (index > 0) {
                                item.tdata.forEach(row => {
                                    this.$refs.table[4 + index].toggleRowSelection(row);
                                });
                            }
                        });
                    }
                }
            },
            //点击主题格
            SubjectCellClick(row, column, cell) {
                if (column.property == "mailSubject") {
                    console.log("行", row);
                    console.log("列", column);
                    console.log("单元格", cell);
                }

            }
        },
        computed: {
            ...mapState([
                'emailType',//获取邮件类型
                "unreadTableData",
                "unreadTotal",
                "unreadStarTableData",
                "unreadStarTotal"
            ])
        }
    };
</script>

<style scoped lang='scss'>

    .home-box {
        margin-left: 20px;
    }

    /* nav {
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
    } */
    .active {

        .send {
            color: #0c86dc;
            font-size: 16px;
            margin-bottom: 10px;
        }
    }

    .el-table-box {
        margin-top: -10px !important;

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

    .wenjian-type {
        height: 30px;
        width: 30px;
        display: inline-block;
    }

    .flex {
        display: block;
    }

    #sendbox {
        .search {
            display: flex;
            align-items: center;

            .ipt-box {
                background: #fff;
                width: 300px;
                border-radius: 19px;
                border: solid 1px #cdcdcd;
                position: relative;
                margin-right: 20px;

                .search-input {
                    margin-left: 30px;
                    width: 210px;
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

            .el-ipt {
                width: 350px;
            }

            .el-btn {
                width: 50px;
                height: 30px;
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
        }

        .pagination-box {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
        }
    }

    .cur-p {
        cursor: pointer;
    }
</style>

