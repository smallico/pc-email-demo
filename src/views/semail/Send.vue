<template>
    <div>
        <!--这是人到人模式-->
        <div
                class="sendmail"
                v-loading="loading"
                :element-loading-text="loadingText"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                @click="isShowDrawer=false;"
                v-if="this.$store.state.emailType == '0'">
            <div class="left-part">
                <div class="progress-box" v-if="showProgress">
                    <el-progress :percentage="percent" :stroke-width="6"></el-progress>
                </div>
                <!--<img src="../../assets/img/add-person.png" class="add-person-icon" alt> -->
                <div class="operation-btns">
                    <el-button type="primary" size="small" v-if="isDraft" @click="save">保存</el-button>
                    <el-button type="primary" size="small" @click="sendEmail">发送</el-button>
                    <el-button size="small" @click="saveDraft" v-if="!isDraft">暂存</el-button>
                    <el-button size="small" @click="cancelFun">取 消</el-button>
                </div>
                <div class="oprate">
                    <!-- <div class="code-box inb mar-r20">
                    邮件编码：
                    <el-input size="small" type="text" v-model="mailcode" style="width:80px;"/>
                    </div>-->
                    <div class="inb">
                        <span>报文类型：</span>
                        <div class="mail-code">
                            <el-radio-group v-model="mailType" @change="value=''">
                                <!-- <el-radio :label="0" size="small">公文信息</el-radio> -->
                                <el-radio :label="1" size="small">涉密信息</el-radio>
                                <el-radio :label="2" size="small">非密信息</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="inb mar-r20">
                        <span>密级：</span>
                        <el-select v-model="mailSlevel" placeholder="选择密级" size="mini" @change="handleSelect">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="inb">
                        <span>等级：</span>
                        <el-select v-model="level" placeholder="选择等级" size="mini">
                            <el-option
                                    v-for="item in levelOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
                    </div>

                    <div class="itemboxs">
                        <!-- <div class="flex flex-ac item">
                            <span>发&nbsp;&nbsp;件&nbsp;&nbsp;人：</span>
                            <div class="item-right">
                                <span class="send-person">{{sender}}</span>
                                <span class="color email-address">&lt;xxx_xxx@youxiang.com&gt;</span>
                            </div>
                        </div> -->
                        <div class="flex item reciev-box">
                            <span class="color">收&nbsp;&nbsp;件&nbsp;&nbsp;人：</span>
                            <div
                                    class="item-right"
                            >
                                <el-input
                                        size="small"
                                        type="textarea"
                                        :style="overReceive&&!showAllReceive ? 'max-height:45px;overflow:hidden;' : 'max-height:85px;overflow:auto;'"
                                        v-model="receiver"
                                        placeholder="请输入收件人邮箱"
                                        :autosize="{ minRows: 1}"
                                        @keyup.native="searchFilterReceive"
                                        id="receiveInput"
                                />
                                <el-button
                                        type="text"
                                        class="receiver-show-btn color"
                                        v-if="overReceive&&!showAllReceive"
                                        @click="showAllReceive=true"
                                >显示全部
                                </el-button>
                                <el-button
                                        type="text"
                                        class="receiver-show-btn color"
                                        v-if="overReceive&&showAllReceive"
                                        @click="showAllReceive=false"
                                >收起
                                </el-button>
                            </div>
                            <div class="receive-find-result-box" v-if="receiveFilterList.length>0">
                                <ul>
                                    <li
                                            v-for="item in receiveFilterList"
                                            :key="item.email"
                                            class="filter-item cur-p"
                                            @click="chooseReceive(item)"
                                    >{{item.name+'&lt;'+item.email+'&gt;;'}}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="flex flex-ac item">
                            <span>主&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题 ：</span>
                            <div class="item-right">
                                <el-input size="small" type="text" v-model="mailSubject"/>
                            </div>
                        </div>
                        <div class="mail-code mar-t20 cur-p oper-btn" @click="chooseFile(0)">
                            <img src="../../assets/img/fujian.png" alt class="fujian">
                            <!-- <span class="color">{{mailType==1?'添加主件':"添加附件"}}</span> -->
                            <span class="color">添加附件</span>
                        </div>
                        <el-button class="color" type="text" @click="deleteAllFile(0)">全部删除</el-button>
                        <!-- <el-button class="color" v-if="mailType==0" type="text" @click.stop="setPrintNum">打印份数</el-button> -->
                        <!--  <el-input
                        size="small"
                        type="text"
                        v-if="mailType==0"
                        v-model="printNum"
                        style="width:60px;margin-right:28px;"
                        @blur="setPrintNumTogether"
                        />-->
                        <span class="notice">（支持格式：jpg、bpm、doc（x）、xls（x）、wps）</span>

                        <input
                                type="file"
                                class="bigfile"
                                @change="addFiles"
                                ref="file"
                                name="file"
                                multiple
                                style="display:none"
                                accept="image/jpeg, image/x-ms-bmp, application/msword, application/vnd.ms-excel, application/wnd.ms-works"
                        >


                        <ul class="flex wenjian-list mar-b20" style="border:1px solid #ccc;" v-if="fileList.length>0">
                            <li
                                    class="flex"
                                    v-for="(file,index) in fileList"
                                    :key="file.fileName+'-'+file.fileSize"
                            >
                                <div>
                                    <img
                                            src="../../assets/img/word.png"
                                            class="wenjian-type mar-r20"
                                            alt
                                            v-if="file.fileType=='application/msword'"
                                    >
                                    <img src="../../assets/img/pdf.png" class="wenjian-type mar-r20" alt v-else>
                                </div>
                                <div class="flex1">
                                    <div class="mar-b10">{{file.fileName}} （{{file.fileSize|calculate}} ）</div>
                                    <el-progress :percentage="filePercent" color="#33abff"
                                                 class="progress"></el-progress>
                                    <span
                                            class="color cur-p mar-r10"
                                            @click="pauseFile"
                                            v-if="filePercent<100"
                                    >{{isPaused?'继续':'暂停'}}</span>
                                    <span class="color cur-p mar-r10" v-else @click="dialogVisible=true">预览</span>
                                    <span class="color cur-p mar-r10">        <a
                                            href="../../data/selectseviceLog.json" download ref="download"
                                    >下载</a></span>
                                    <span class="color cur-p" @click="deleteFile(index,0)">删除</span>
                                    <!--                 <div class="print-div" v-if="mailType==0">
                                    <span>打印份数：</span>
                                    <el-input
                                        size="mini"
                                        type="text"
                                        v-model="file.printNum"
                                        style="width:60px;margin-right:28px;"
                                    />
                                    </div>-->
                                </div>
                            </li>
                            <!--             <li class="flex">
                            <div>
                                <img src="../../assets/img/pdf.png" class="wenjian-type mar-r20" alt>
                            </div>
                            <div>
                                <div class="mar-b10">
                                关于组织召开学习新时代精神
                                的培训时间安排 .doc （14.01 k）
                                </div>
                                <el-progress :percentage="70" color="#33abff" class="progress"></el-progress>
                                <span class="color cur-p mar-r10">暂停</span>
                                <span class="color cur-p">删除</span>
                            </div>
                            </li>-->
                        </ul>
                        <div class="editor-box">
                            <quill-editor v-model="mailSummary" ref="myTextEditor"
                                          :options="editorOption"></quill-editor>
                            <div class="editor-upbtn">
                                <el-select
                                        v-model="template"
                                        placeholder="选择模板"
                                        size="mini"
                                        clearable
                                        @change="chooseTemplate"
                                >
                                    <el-option label="模板1" :value="0"></el-option>
                                    <el-option label="模板2" :value="1"></el-option>
                                    <el-option label="模板3" :value="2"></el-option>
                                </el-select>
                                <!--               <el-button type="primary" size="small" @click="importTemplate">导入模板</el-button>
                                <input
                                type="file"
                                class="bigfile"
                                @change="templateChange"
                                ref="templateFile"
                                name="file"
                                style="display:none"
                                >-->
                                <!-- <el-button class="zero-btn" @click="noEdit=!noEdit">{{noEdit?'在线编辑':'确定'}}</el-button> -->
                            </div>
                        </div>
                        <div class="mar-t20">
                            <el-button type="primary" size="small" v-if="isDraft" @click="save">保存</el-button>
                            <el-button type="primary" size="small" @click="sendEmail">发送</el-button>
                            <el-button size="small" @click="cancelFun">取 消</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-part">
                <div class="search-box flex flex-ac">
                    <el-input
                            placeholder="查找联系人"
                            size="mini"
                            class="serch-input"
                            type="text"
                            v-model="cancatTerm"
                            @keyup.native="searchConcat"
                    ></el-input>
                    <img src="../../assets/img/search-icon.png" alt class="search-icon">
                </div>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="组织结构" name="first">
                        <el-tree
                                ref="organTree"
                                :data="organData"
                                :props="defaultProps"
                                :accordion="true"
                                :render-after-expand="false"
                                show-checkbox
                                :filter-node-method="filterNode"
                                @check-change="handleCheckChange"
                                node-key="userId"
                                :default-checked-keys="chekedConcatIds"
                        ></el-tree>
                    </el-tab-pane>
                    <el-tab-pane label="分组" name="second">
                        <el-tree
                                ref="groupTree"
                                :data="grupData"
                                :props="defaultProps"
                                @node-click="handleNodeClick"
                                :accordion="true"
                                :render-after-expand="false"
                                class="group-tree"
                                show-checkbox
                                :filter-node-method="filterNode"
                                @check-change="handleCheckChange"
                                node-key="userId"
                                :default-checked-keys="chekedConcatIds"
                        ></el-tree>
                        <el-tree
                                ref="allGroupTree"
                                :data="allData"
                                :props="defaultProps"
                                @node-click="handleNodeClick"
                                :accordion="true"
                                :render-after-expand="false"
                                class="all-group-tree"
                                show-checkbox
                                :filter-node-method="filterNode"
                                @check-change="handleCheckChange"
                                node-key="userId"
                                :default-checked-keys="chekedConcatIds"
                        ></el-tree>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <el-dialog :visible.sync="dialogVisible" width="50%">
                <img src="../../assets/img/preview-eg.jpg" alt class="alert-img">
            </el-dialog>
            <!-- <div class="drawer" :class="{show:isShowDrawer}">
            <div>标题</div>
            <div>
            <el-button type="danger" @click="isShowDrawer=false">关闭</el-button>
            </div>
            </div>-->
            <drawer :isShowDrawer="isShowDrawer" :width="350">
                <div slot="content">
                    <div style="font-size:16px;font-weight:bold;margin-bottom:30px;"><i class="el-icon-printer"
                                                                                        style="color:#333;margin-right:15px;font-size:18px;"></i>设置打印份数
                    </div>
                    <ul class="user-ul">
                        <li v-for="(item,index) in printNumForm" :key="index">
                            <div>{{item.user}}</div>
                            <div>
                                <ul class="file-ul">
                                    <li v-for="(file,fileIndex) in item.fileList" :key="'file'+fileIndex"
                                        class="file-ul-li">
                                        <span class="ul-li-fileName">{{file.fileName}}</span>
                                        <el-input size="small"
                                                  v-model="printNumForm[index].fileList[fileIndex].printNum"
                                                  style="flex:1"></el-input>
                                        <span>&nbsp;&nbsp;&nbsp;/&nbsp;份</span>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                    <div class="save-footer">
                        <el-button type="primary" @click="isShowDrawer=false" size="small">保存</el-button>
                        <el-button @click="isShowDrawer=false" size="small">取消</el-button>
                    </div>
                </div>
            </drawer>
        </div>
        <!--这是端到端模式-->
        <div
                class="sendmail"
                v-loading="loading"
                :element-loading-text="loadingText"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                @click="isShowDrawer=false;"
                v-else>
            <div class="left-part">
                <div class="progress-box" v-if="showProgress">
                    <el-progress :percentage="percent" :stroke-width="6"></el-progress>
                </div>
                <!--<img src="../../assets/img/add-person.png" class="add-person-icon" alt> -->
                <div class="operation-btns">
                    <el-button type="primary" size="small" v-if="isDraft" @click="save">保存</el-button>
                    <el-button type="primary" size="small" @click="sendEmail">发送</el-button>
                    <el-button size="small" @click="saveDraft" v-if="!isDraft">暂存</el-button>
                    <el-button size="small" @click="cancelFun">取 消</el-button>
                </div>
                <div class="oprate">
                    <!-- <div class="code-box inb mar-r20">
                    邮件编码：
                    <el-input size="small" type="text" v-model="mailcode" style="width:80px;"/>
                    </div>-->
                    <div class="inb">
                        <span>报文类型：</span>
                        <div class="mail-code">
                            <el-radio-group v-model="mailType" @change="value=''">
                                <el-radio :label="0" size="small">公文信息</el-radio>
                                <!-- <el-radio :label="1" size="small">涉密信息</el-radio>
                                <el-radio :label="2" size="small">非密信息</el-radio> -->
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="inb mar-r20">
                        <span>密级：</span>
                        <el-select v-model="mailSlevel" placeholder="选择密级" size="mini" @change="handleSelect">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
                    </div>
                    <div class="inb">
                        <span>等级：</span>
                        <el-select v-model="level" placeholder="选择等级" size="mini">
                            <el-option
                                    v-for="item in levelOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
                    </div>

                    <div class="itemboxs">
                        <!-- <div class="flex flex-ac item">
                            <span>发&nbsp;&nbsp;件&nbsp;&nbsp;人：</span>
                            <div class="item-right">
                                <span class="send-person">{{sender}}</span>
                                <span class="color email-address">&lt;xxx_xxx@youxiang.com&gt;</span>
                            </div>
                        </div> -->
                        <div class="flex item reciev-box">
                            <span class="color">收&nbsp;&nbsp;件&nbsp;&nbsp;人：</span>
                            <div
                                    class="item-right"
                            >
                                <el-input
                                        size="small"
                                        type="textarea"
                                        :style="overReceive&&!showAllReceive ? 'max-height:45px;overflow:hidden;' : 'max-height:85px;overflow:auto;'"
                                        v-model="receiver"
                                        placeholder="请输入收件人邮箱"
                                        :autosize="{ minRows: 1}"
                                        @keyup.native="searchFilterReceive"
                                        id="receiveInput"
                                />
                                <el-button
                                        type="text"
                                        class="receiver-show-btn color"
                                        v-if="overReceive&&!showAllReceive"
                                        @click="showAllReceive=true"
                                >显示全部
                                </el-button>
                                <el-button
                                        type="text"
                                        class="receiver-show-btn color"
                                        v-if="overReceive&&showAllReceive"
                                        @click="showAllReceive=false"
                                >收起
                                </el-button>
                            </div>
                            <div class="receive-find-result-box" v-if="receiveFilterList.length>0">
                                <ul>
                                    <li
                                            v-for="item in receiveFilterList"
                                            :key="item.email"
                                            class="filter-item cur-p"
                                            @click="chooseReceive(item)"
                                    >{{item.name+'&lt;'+item.email+'&gt;;'}}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="flex flex-ac item">
                            <span>主&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题 ：</span>
                            <div class="item-right">
                                <el-input size="small" type="text" v-model="mailSubject"/>
                            </div>
                        </div>
                        <div class="mail-code mar-t20 cur-p oper-btn" style="display:flex;align-items:center;">
                            <div style="display:flex;margin-right:15px;align-items:center;" @click="chooseFile(0)">
                                <img src="../../assets/img/fujian.png" alt class="zhujian">
                                <!-- <span class="color">{{mailType==1?'添加主件':"添加附件"}}</span> -->
                                <span class="color">添加主件</span>
                            </div>
                            <div style="display:flex;margin-right:15px;align-items:center;" @click="chooseFile(1)">
                                <img src="../../assets/img/fujian.png" alt class="fujian">
                                <!-- <span class="color">{{mailType==1?'添加主件':"添加附件"}}</span> -->
                                <span class="color">添加附件</span>
                            </div>
                            <!-- <el-button class="color" type="text" @click="deleteAllFile">全部删除</el-button> -->
                            <el-button class="color" v-if="mailType==0" type="text" @click.stop="setPrintNum">打印份数
                            </el-button>
                            <span class="notice">（支持格式：jpg、bpm、doc（x）、xls（x）、wps）</span>
                        </div>

                        <!--  <el-input
                        size="small"
                        type="text"
                        v-if="mailType==0"
                        v-model="printNum"
                        style="width:60px;margin-right:28px;"
                        @blur="setPrintNumTogether"
                        />-->
                        <input
                                type="file"
                                class="bigfile"
                                @change="addFiles"
                                ref="file"
                                name="file"
                                multiple
                                style="display:none"
                                accept="image/jpeg, image/x-ms-bmp, application/msword, application/vnd.ms-excel, application/wnd.ms-works"
                        >
                        <input
                                type="file"
                                class="bigfile"
                                @change="addAccessoryFiles"
                                ref="fileAccessory"
                                name="file"
                                multiple
                                style="display:none"
                                accept="image/jpeg, image/x-ms-bmp, application/msword, application/vnd.ms-excel, application/wnd.ms-works"

                        >
                        <!---上传文件展示区---->
                        <div class="mar-b20 mar-t-20 " v-if="fileList.length > 0 || fileAccessoryList.length > 0">
                            <!--主件展示区-->
                            <div v-if="fileList.length>0">
                                <span style="font-size:14px;color:#333">
                                    已上传主件
                                    <el-button type="text" style="margin-left:15px;color:#409eff;"
                                               @click="deleteAllFile(0)">全部删除</el-button>
                                </span>
                                <ul class="flex wenjian-list" style="border:1px solid #ccc;">
                                    <li
                                            class="flex"
                                            v-for="(file,index) in fileList"
                                            :key="file.fileName+'-'+file.fileSize">
                                        <div>
                                            <img
                                                    src="../../assets/img/word.png"
                                                    class="wenjian-type mar-r20"
                                                    alt
                                                    v-if="file.fileType=='application/msword'"
                                            >
                                            <img src="../../assets/img/pdf.png" class="wenjian-type mar-r20" alt v-else>
                                        </div>
                                        <div class="flex1">
                                            <div class="mar-b10">{{file.fileName}} （{{file.fileSize|calculate}} ）</div>
                                            <el-progress :percentage="filePercent" color="#33abff"
                                                         class="progress"></el-progress>
                                            <span
                                                    class="color cur-p mar-r10"
                                                    @click="pauseFile"
                                                    v-if="filePercent<100"
                                            >{{isPaused?'继续':'暂停'}}</span>
                                            <span class="color cur-p mar-r10" v-else
                                                  @click="dialogVisible=true">预览</span>
                                            <span class="color cur-p" @click="deleteFile(index,0)">删除</span>
                                            <!--                 <div class="print-div" v-if="mailType==0">
                                            <span>打印份数：</span>
                                            <el-input
                                                size="mini"
                                                type="text"
                                                v-model="file.printNum"
                                                style="width:60px;margin-right:28px;"
                                            />
                                            </div>-->
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <!--附件展示区--->
                            <div v-if="fileAccessoryList.length>0">
                                <span style="font-size:14px;color:#333;">
                                    已上传附件
                                    <el-button type="text" style="margin-left:15px;color:#409eff;"
                                               @click="deleteAllFile(1)">全部删除</el-button>
                                </span>
                                <ul class="flex wenjian-list" style="border:1px solid #ccc;">
                                    <li
                                            class="flex"
                                            v-for="(file,index) in fileAccessoryList"
                                            :key="file.fileName+'-'+file.fileSize"
                                    >
                                        <div>
                                            <img
                                                    src="../../assets/img/word.png"
                                                    class="wenjian-type mar-r20"
                                                    alt
                                                    v-if="file.fileType=='application/msword'"
                                            >
                                            <img src="../../assets/img/pdf.png" class="wenjian-type mar-r20" alt v-else>
                                        </div>
                                        <div class="flex1">
                                            <div class="mar-b10">{{file.fileName}} （{{file.fileSize|calculate}} ）</div>
                                            <el-progress :percentage="filePercent" color="#33abff"
                                                         class="progress"></el-progress>
                                            <span
                                                    class="color cur-p mar-r10"
                                                    @click="pauseFile"
                                                    v-if="filePercent<100"
                                            >{{isPaused?'继续':'暂停'}}</span>
                                            <span class="color cur-p mar-r10" v-else
                                                  @click="dialogVisible=true">预览</span>
                                            <span class="color cur-p mar-r10">        <a
                                                    href="../../data/selectseviceLog.json" download ref="download"
                                                    >下载</a></span>
                                            <span class="color cur-p" @click="deleteFile(index,1)">删除</span>
                                            <!--                 <div class="print-div" v-if="mailType==0">
                                            <span>打印份数：</span>
                                            <el-input
                                                size="mini"
                                                type="text"
                                                v-model="file.printNum"
                                                style="width:60px;margin-right:28px;"
                                            />
                                            </div>-->
                                        </div>
                                    </li>
                                    <!--             <li class="flex">
                                    <div>
                                        <img src="../../assets/img/pdf.png" class="wenjian-type mar-r20" alt>
                                    </div>
                                    <div>
                                        <div class="mar-b10">
                                        关于组织召开学习新时代精神
                                        的培训时间安排 .doc （14.01 k）
                                        </div>
                                        <el-progress :percentage="70" color="#33abff" class="progress"></el-progress>
                                        <span class="color cur-p mar-r10">暂停</span>
                                        <span class="color cur-p">删除</span>
                                    </div>
                                    </li>-->
                                </ul>
                            </div>
                        </div>
                        <div class="editor-box">
                            <quill-editor v-model="mailSummary" ref="myTextEditor"
                                          :options="editorOption"></quill-editor>
                            <div class="editor-upbtn">
                                <el-select
                                        v-model="template"
                                        placeholder="选择模板"
                                        size="mini"
                                        clearable
                                        @change="chooseTemplate"
                                >
                                    <el-option label="模板1" :value="0"></el-option>
                                    <el-option label="模板2" :value="1"></el-option>
                                    <el-option label="模板3" :value="2"></el-option>
                                </el-select>
                                <!--               <el-button type="primary" size="small" @click="importTemplate">导入模板</el-button>
                                <input
                                type="file"
                                class="bigfile"
                                @change="templateChange"
                                ref="templateFile"
                                name="file"
                                style="display:none"
                                >-->
                                <!-- <el-button class="zero-btn" @click="noEdit=!noEdit">{{noEdit?'在线编辑':'确定'}}</el-button> -->
                            </div>
                        </div>
                        <div class="mar-t20">
                            <el-button type="primary" size="small" v-if="isDraft" @click="save">保存</el-button>
                            <el-button type="primary" size="small" @click="sendEmail">发送</el-button>
                            <el-button size="small" @click="cancelFun">取 消</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-part">
                <div class="search-box flex flex-ac">
                    <el-input
                            placeholder="查找联系人"
                            size="mini"
                            class="serch-input"
                            type="text"
                            v-model="cancatTerm"
                            @keyup.native="searchConcat"
                    ></el-input>
                    <img src="../../assets/img/search-icon.png" alt class="search-icon">
                </div>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="组织结构" name="first">
                        <el-tree
                                ref="organTree"
                                :data="clientOrganData"
                                :props="defaultProps"
                                :accordion="true"
                                :render-after-expand="false"
                                show-checkbox
                                :filter-node-method="filterNode"
                                @check-change="handleCheckChange"
                                node-key="userId"
                                :default-checked-keys="chekedConcatIds"
                        ></el-tree>
                    </el-tab-pane>
                    <el-tab-pane label="分组" name="second">
                        <el-tree
                                ref="groupTree"
                                :data="clientGroupData"
                                :props="defaultProps"
                                @node-click="handleNodeClick"
                                :accordion="true"
                                :render-after-expand="false"
                                class="group-tree"
                                show-checkbox
                                :filter-node-method="filterNode"
                                @check-change="handleCheckChange"
                                node-key="userId"
                                :default-checked-keys="chekedConcatIds"
                        ></el-tree>
                        <el-tree
                                ref="allGroupTree"
                                :data="clientAllData"
                                :props="defaultProps"
                                @node-click="handleNodeClick"
                                :accordion="true"
                                :render-after-expand="false"
                                class="all-group-tree"
                                show-checkbox
                                :filter-node-method="filterNode"
                                @check-change="handleCheckChange"
                                node-key="userId"
                                :default-checked-keys="chekedConcatIds"
                        ></el-tree>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <el-dialog :visible.sync="dialogVisible" width="50%">
                <img src="../../assets/img/preview-eg.jpg" alt class="alert-img">
            </el-dialog>
            <!-- <div class="drawer" :class="{show:isShowDrawer}">
            <div>标题</div>
            <div>
            <el-button type="danger" @click="isShowDrawer=false">关闭</el-button>
            </div>
            </div>-->
            <drawer :isShowDrawer="isShowDrawer" :width="350">
                <div slot="content">
                    <div style="font-size:16px;font-weight:bold;margin-bottom:30px;"><i class="el-icon-printer"
                                                                                        style="color:#333;margin-right:15px;font-size:18px;"></i>设置打印份数
                    </div>
                    <ul class="user-ul">
                        <li v-for="(item,index) in printNumForm" :key="index">
                            <div>{{item.user}}</div>
                            <div>
                                <ul class="file-ul">
                                    <li v-for="(file,fileIndex) in item.fileList" :key="'file'+fileIndex"
                                        class="file-ul-li">
                                        <span class="ul-li-fileName">{{file.fileName}}</span>
                                        <el-input size="small"
                                                  v-model="printNumForm[index].fileList[fileIndex].printNum"
                                                  style="flex:1"></el-input>
                                        <span>&nbsp;&nbsp;&nbsp;/&nbsp;份</span>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                    <div class="save-footer">
                        <el-button type="primary" @click="isShowDrawer=false" size="small">保存</el-button>
                        <el-button @click="isShowDrawer=false" size="small">取消</el-button>
                    </div>
                </div>
            </drawer>
        </div>
    </div>
</template>
<script>
    import generateFileMd5 from "../../utils/generateFileMd5";
    import {request} from "../../api/data-api";
    import {quillEditor} from "vue-quill-editor";
    import {setTimeout, setInterval, clearInterval} from "timers";
    import drawer from "../../components/drawer.vue";
    import qs from "qs";

    export default {
        components: {
            quillEditor,
            drawer
        },
        data() {
            return {
                isShowDrawer: false,
                dialogVisible: false,
                cancatTerm: "",
                activeName: "first",

                levelOptions: [
                    {
                        value: 0,
                        label: "急"
                    },
                    {
                        value: 1,
                        label: "特急"
                    },
                    {
                        value: 2,
                        label: "加急"
                    }
                ],
                options: [
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
                ],
                mailcode: "",
                mailType: 1,
                receiver: "",
                sender: "admin",
                mailSlevel: "",
                level: "",
                mailSubject: "",
                mailSummary: "",
                editorOption: {
                    placeholder: "请在这里输入.....",
                    modules: {
                        toolbar: [
                            [
                                {
                                    size: [
                                        "10px",
                                        "12px",
                                        "14px",
                                        "16px",
                                        "18px",
                                        "20px",
                                        "22px",
                                        "24px"
                                    ]
                                }
                            ],
                            ["bold", "italic", "underline"],
                            [{align: []}]
                        ]
                    }
                },
                defaultProps: {
                    children: "children",
                    label: "name"
                },
                organData: [],
                clientOrganData: [], //端到端模式的组织结构
                grupData: [],
                clientGroupData: [], //端到端模式的分组数据
                allData: [],
                clientAllData: [], //端到端模式的全部数据
                fileList: [],   //已上传主件
                fileAccessoryList: [], //已上传的附件
                loading: false,
                loadingText: "保存草稿成功",
                percent: 0,
                timer: null,
                showProgress: false,
                filePercent: 0,
                fileTimer: null,
                isPaused: false,
                receiversList: [],
                chekedConcatIds: [],
                printNum: "1",
                receiveFilterList: [],
                isDraft: false,
                template: "",
                printNumForm: [],
                overReceive: false,
                showAllReceive: false,
            };
        },
        created() {

            this.getOrganData();
            this.getClientOrganData();
            this.getGroupData();
            this.getClientGroupData();
            this.setDefault();
            this.getEmail();
        },
        methods: {
            // 跳转页面获得click收件人email
            getEmail() {
                let params = this.$route.params;
                if (params.name || params.email) {
                    this.receiver = params.name + "<" + params.email + ">; ";
                }
            },
            setDefault() {

                var row;
                if (this.$route.query.type == "trans") {
                    row = JSON.parse(sessionStorage.getItem("transMailDetail"));
                    this.mailType = row.mailType;
                    this.mailSlevel = row.mailSlevel;
                    this.level = row.level;
                    this.mailSubject = row.mailSubject;
                    this.mailSummary = row.mailSummary;
                    this.fileList = row.fileList;
                    this.filePercent = 100;
                } else if (this.$route.query.type == "reply") {
                    row = JSON.parse(sessionStorage.getItem("replyMailDetail"));
                    this.mailType = row.mailType;
                    this.mailSlevel = row.mailSlevel;
                    this.level = row.level;
                    this.mailSubject = 'Re: ' + row.mailSubject;
                    this.receiver = row.sender + ';';
                } else if (this.$route.query.type == "draft") {
                    this.isDraft = true;
                    row = {
                        mailId: "32343f308a68a6a854905a1e5a912fc4", //邮件ID
                        sender: "刘大伟", //发件人
                        receiver: "张小利", //收件
                        mailSlevel: 0, //密级,0秘密,1机密,2绝密,3明电,4公开发布,5内部（受控）
                        level: 0, //等级，0急,1特急2加急
                        mailType: 1, //文件类型0公文信息，1//涉密信息，2//非密信息
                        isFinished: 0, //是否已完成，0未完成，1已完成
                        intervenedReason: "", //人工干预原因
                        mailDirect: 1, //收发标识：0发/1收
                        fileNumber: "001010", //发文编号
                        createdTime: "2019年04月19日 16：32（星期五）", //发文时间
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
                    };
                    this.mailType = row.mailType;
                    this.mailSlevel = row.mailSlevel;
                    this.level = row.level;
                    this.mailSubject = row.mailSubject;
                    this.mailSummary = row.mailSummary;
                    this.fileList = row.fileList;
                    this.filePercent = 100;
                    this.receiver = row.receiver;
                } else {
                    this.mailType = 0;
                    this.mailSlevel = this.options[1].value;
                    this.level = this.levelOptions[1].value;
                    this.mailSubject = "";
                    this.mailSummary = "";
                    this.fileList = [];
                    this.filePercent = 0;
                    this.receiver = "";
                }
            },

            //获取组织机构
            getOrganData() {
                request("/concatOrganData", data => {
                    this.organData = data.data;
                });
            },
            //获取端到端织结构获
            getClientOrganData() {
                request("/conOrganClientData", data => {
                    this.clientOrganData = data.data;

                });
            },
            //获取端到端分组
            getClientGroupData() {

                request("/groupClientData", data => {
                    this.clientGroupData = data.data.group;
                    this.clientAllData = data.data.allData;
                });

            },

            //获取分组
            getGroupData() {
                request("/groupData", data => {
                    console.log("group", data);
                    this.grupData = data.data.group;
                    this.allData = data.data.allData;
                });
            },
            //搜索收件人
            searchFilterReceive() {
                if (this.receiver != "") {
                    var allData = this.allData[0].children;
                    var splitArr = this.receiver.split("; ");
                    var query = splitArr[splitArr.length - 1];
                    this.receiveFilterList = allData.filter(item => {
                        return (
                            item.email.indexOf(query) > -1 || item.name.indexOf(query) > -1
                        );
                    });
                } else {
                    this.receiveFilterList = [];
                }
            },
            //选择收件人
            chooseReceive(item) {
                if (!(this.receiver.indexOf(item.email) > -1)) {
                    this.receiver += item.name + "<" + item.email + ">; ";
                    this.receiversList.push(item);
                }
                this.receiveFilterList = [];
            },
            //搜索联系人
            searchConcat() {
                this.$refs.organTree.filter(this.cancatTerm);
                this.$refs.groupTree.filter(this.cancatTerm);
                this.$refs.allGroupTree.filter(this.cancatTerm);
            },
            /*     //查找联系人过滤
            filterNode(value, data) {
              if (!value) return true;
              return data.name.indexOf(value) !== -1;
            }, */
            //查找联系人过滤
            filterNode(value, data, node) {
                if (!value) return true;
                if (data.name.indexOf(value) !== -1) {
                    return true;
                }
                return this.checkBelongToChooseNode(value, data, node);
            },
            checkBelongToChooseNode(value, data, node) {
                const level = node.level;
                if (level === 1) {
                    return false;
                }
                let parentData = node.parent;
                let index = 0;
                while (index < level - 1) {
                    if (parentData.data.name.indexOf(value) !== -1) {
                        return true;
                    }
                    parentData = parentData.parent;
                    index++;
                }
                return false;
            },
            //选择联系人树节点
            handleCheckChange(data, checked, indeterminate) {
                console.log("checkchange", data);
                if (!data.children) {
                    if (checked) {

                        var a = this.receiversList.find(e => e.userId == data.userId);
                        if (!a) {
                            this.receiversList.push(data);
                            this.receiver += data.name + "<" + data.email + ">; ";
                            this.chekedConcatIds.push(data.userId);
                        }
                    } else {

                        var arr = [];
                        var arrName = "";
                        var arrIds = [];
                        this.receiversList.forEach(function (item) {
                            if (item.userId != data.userId) {
                                arr.push(item);
                                arrName += item.name + "<" + item.email + ">; ";
                                arrIds.push(item.userId);
                            }
                        });
                        this.receiversList = arr;
                        this.receiver = arrName;
                        this.chekedConcatIds = arrIds;
                    }
                    this.receiversList

                    if (this.activeName == "second") {
                        this.$refs.groupTree.setCheckedKeys(this.chekedConcatIds);
                        this.$refs.allGroupTree.setCheckedKeys(this.chekedConcatIds);
                    }
                }
            },
            //tab切换
            handleClick() {
                console.log("chekedConcatIds", this.chekedConcatIds);
                if (this.activeName == "first") {
                    this.$refs.organTree.setCheckedKeys(this.chekedConcatIds);
                } else {
                    this.$refs.groupTree.setCheckedKeys(this.chekedConcatIds);
                    this.$refs.allGroupTree.setCheckedKeys(this.chekedConcatIds);
                }
            },
            //统一设置打印份数
            /*     setPrintNumTogether() {
              if (this.printNum) {
                this.fileList.forEach(file => {
                  file.printNum = this.printNum;
                });
              }
            }, */
            //设置打印份数
            setPrintNum() {
                console.log("receiversList", this.receiversList);
                console.log("fileList", this.fileList);
                if (this.receiversList.length == 0) {
                    this.$message({
                        message: "请选择收件人",
                        type: "warning"
                    });
                    return;
                }
                if (this.fileList.length == 0) {
                    this.$message({
                        message: "请添加文件",
                        type: "warning"
                    });
                    return;
                }
                this.isShowDrawer = true;
                this.setPrintNumForm();
            },
            //设置打印份数
            setPrintNumForm() {
                if (this.printNumForm.length == 0) {
                    this.receiversList.forEach(item => {
                        var obj = {};
                        obj.user = item.name;
                        obj.userId = item.id;
                        obj.fileList = JSON.parse(JSON.stringify(this.fileList));
                        this.printNumForm.push(obj);
                    });
                    console.log("ffff", this.printNumForm);
                } else {
                    var arr = [];
                    this.receiversList.forEach(item => {
                        var obj = {};
                        obj.user = item.name;
                        obj.userId = item.id;
                        obj.fileList = JSON.parse(JSON.stringify(this.fileList));
                        arr.push(obj);
                    });
                    arr.forEach((aItem, aIndex) => {
                        this.printNumForm.forEach((pItem, pIndex) => {
                            if (aItem.userId == pItem.userId) {
                                aItem.fileList.forEach((aFile, aFileIndex) => {
                                    pItem.fileList.forEach((pFile, pFileIndex) => {
                                        if (aFile.fileMd5 == pFile.fileMd5) {
                                            arr[aIndex].fileList[aFileIndex].printNum = pFile.printNum;
                                        }
                                    });
                                });
                            }
                        });
                    });
                    this.printNumForm = JSON.parse(JSON.stringify(arr));
                }
            },

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
            setFileTimer(initPersent) {
                if (this.fileTimer == null) {
                    this.filePercent = Number(initPersent);
                    this.fileTimer = setInterval(() => {
                        this.filePercent += 10;
                        if (this.filePercent == 100) {
                            clearInterval(this.fileTimer);
                            this.fileTimer = null;
                        }
                    }, 100);
                }
            },
            //发送
            sendEmail() {
                /*       if (this.receiver == "") {
                  this.$message({
                    message: "请填写收件人",
                    type: "warning"
                  });
                  return;
                }
                this.showProgress = true;
                this.setTimer();
                setTimeout(() => {
                  this.$message({
                    message: "发送成功",
                    type: "success"
                  });
                  this.$router.push("/semail/box/sendBox");
                }, 1500); */
                this.$store.commit("updateShowNotify", 1);
                this.$store.commit("setPercentTimer");
                /*       const h = this.$createElement;
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
                }, 3000); */
                // this.$store.dispatch('percentAction',100)
            },
            //存草稿箱
            saveDraft(type) {
                /*  this.showProgress = true;
                this.setTimer();
                setTimeout(() => {
                  this.$message({
                    message: "已保存到草稿箱",
                    type: "success"
                  });
                  this.showProgress = false;
                  this.percent = 0;
                }, 1500); */
                this.$message({
                    message: "已保存到草稿箱",
                    type: "success"
                });
            },
            //草稿箱详情保存
            save() {
                this.$message({
                    message: "保存成功",
                    type: "success"
                });
            },
            //选择文件
            chooseFile(flage) {
                if (flage) {
                    this.$refs.fileAccessory.click();
                } else {
                    this.$refs.file.click();
                }

            },
            //选择模板
            chooseTemplate() {
                this.mailSummary =
                    '<div style="line-height:36px;">尊敬的各同事,下午好：</div><div style="text-indent:2em;line-height:36px;">关于组织召开学习新时代精神的培训时间安排通知,已经通过邮件系统发送到各位同事们的邮箱，请注意查收。这次培训很重要，要求全体员工都要参加，如有特殊情况不能按时入会，请提前说明情况。</div><div style="text-align:right;padding-left:30px;margin-top:80px;margin-bottom:15px;">刘大伟</div><div style="text-align:right;">2019年04月19日 16：28</div>';
            },
            //导入模板成功
            /*     templateChange() {
              this.$message({
                message: "导入成功",
                type: "success"
              });
              this.mailSummary =
                '<div style="line-height:36px;">尊敬的各同事,下午好：</div><div style="text-indent:2em;line-height:36px;">关于组织召开学习新时代精神的培训时间安排通知,已经通过邮件系统发送到各位同事们的邮箱，请注意查收。这次培训很重要，要求全体员工都要参加，如有特殊情况不能按时入会，请提前说明情况。</div><div style="text-align:right;padding-left:30px;margin-top:80px;margin-bottom:15px;">刘大伟</div><div style="text-align:right;">2019年04月19日 16：28</div>';
            }, */
            // 判断是否超出限制
            isExceed(num) {
                return num >= 10 ? false : true
            },
            //添加主件
            addFiles(event) {
                console.log("this.fileList", this.fileList);
                let file = this.$refs.file.files;
                console.log("file", file);
                let arr = [];
                for (let i = 0; i < file.length; i++) {
                    var el = file[i];
                    var obj = {
                        fileName: "",
                        fileSize: "",
                        fileType: "",
                        fileMd5: ""
                    };
                    obj.fileName = el.name;
                    obj.fileSize = el.size;
                    obj.fileType = el.type;
                    if (this.mailType == 0) { //相当于端到端
                        obj.printNum = 0;
                        if (this.printNum != "") {
                            obj.printNum = this.printNum;
                        }
                    }
                    generateFileMd5(el).then(md5 => {
                        console.log("file" + i + ":" + arr[i].fileName, md5);
                        arr[i].fileMd5 = md5;
                        //所有新上传的文件放入arr中后，把arr中跟你已上传的Md5值重复的去掉
                        if (i == file.length - 1) {
                            for (var a = 0; a < arr.length; a++) {
                                for (var f = 0; f < this.fileList.length; f++) {
                                    if (arr[a].fileMd5 == this.fileList[f].fileMd5) {
                                        arr.splice(a, 1);
                                        a--;
                                        break;
                                    }
                                }
                            }
                            this.fileList = [...this.fileList, ...arr];

                            if (this.isExceed(this.fileList.length) === false) {
                                this.$message({
                                    message: "上传文件不可超过10个",
                                    type: "warning"
                                });

                                return this.fileList = [];
                            }


                            console.log(this.fileList)

                            this.setFileTimer(0);
                        }
                    });
                    arr.push(obj);
                }
            },
            //添加附件
            addAccessoryFiles(event) {
                console.log("this.fileList", this.fileList);
                let file = this.$refs.fileAccessory.files;
                console.log("file", file);
                let arr = [];
                for (let i = 0; i < file.length; i++) {
                    var el = file[i];
                    var obj = {
                        fileName: "",
                        fileSize: "",
                        fileType: "",
                        fileMd5: ""
                    };
                    obj.fileName = el.name;
                    obj.fileSize = el.size;
                    obj.fileType = el.type;
                    if (this.mailType == 0) { //相当于端到端
                        obj.printNum = 0;
                        if (this.printNum != "") {
                            obj.printNum = this.printNum;
                        }
                    }
                    generateFileMd5(el).then(md5 => {
                        console.log("file" + i + ":" + arr[i].fileName, md5);
                        arr[i].fileMd5 = md5;
                        //所有新上传的文件放入arr中后，把arr中跟你已上传的Md5值重复的去掉
                        if (i == file.length - 1) {
                            for (var a = 0; a < arr.length; a++) {
                                for (var f = 0; f < this.fileAccessoryList.length; f++) {
                                    if (arr[a].fileMd5 == this.fileAccessoryList[f].fileMd5) {
                                        arr.splice(a, 1);
                                        a--;
                                        break;
                                    }
                                }
                            }
                            this.fileAccessoryList = [...this.fileAccessoryList, ...arr];

                            if (this.isExceed(this.fileAccessoryList.length) === false) {
                                this.$message({
                                    message: "上传文件不可超过10个",
                                    type: "warning"
                                });

                                return this.fileAccessoryList = [];
                            }


                            console.log(this.fileAccessoryList)

                            this.setFileTimer(0);
                        }
                    });
                    arr.push(obj);
                }
            },
            //暂停上传
            pauseFile() {
                this.isPaused = !this.isPaused;
                if (this.isPaused) {
                    clearInterval(this.fileTimer);
                    this.fileTimer = null;
                } else {
                    this.setFileTimer(this.filePercent);
                }
            },
            //删除附件
            deleteFile(index, flage) {
                /*       console.log("this.$refs.file.files", this.$refs.file.files);
                console.log("this.$refs.file.value",this.$refs.file.value);
                console.log("this.$refs.file",this.$refs.file); */
                this.$confirm("确认删除该文件吗？", "提示")
                    .then(() => {
                        if (flage) {
                            this.fileAccessoryList.splice(index, 1);
                            this.$refs.fileAccessory.value = "";
                        } else {
                            this.fileList.splice(index, 1);
                            this.$refs.file.value = "";
                        }

                    })
                    .catch(() => {
                    });
            },
            //全部删除
            deleteAllFile(flage) {
                this.$confirm("确认要全部删除吗？", "提示")
                    .then(() => {
                        if (flage) {

                            this.fileAccessoryList = [...[]];
                            this.$refs.fileAccessory = "";
                        } else {
                            this.fileList = [...[]];
                            this.$refs.file.value = "";
                        }
                    })
                    .catch(() => {
                    });
            },
            cancelFun() {
                this.$confirm("要保存到草稿箱吗？", "提示")
                    .then(() => {
                        this.$message({
                            message: "已保存到草稿箱",
                            type: "success"
                        });
                        this.$router.push("/semail");
                    })
                    .catch(() => {
                        this.$router.push("/semail");
                    });
            },
            handleNodeClick(data) {
                console.log(data);
            },
            //密级select发生变化 
            handleSelect() {
                this.fileList = [...[]];
                this.fileAccessoryList = [...[]];
            }
        },
        watch: {
            $route(n) {
                if (n.query.type) {
                    if (n.query.type == "draft") {
                        this.$route.meta.title = "草稿箱详情";
                    } else if (n.query.type == "trans") {
                        this.$route.meta.title = "转发";
                    } else if (n.query.type == "reply") {
                        this.$route.meta.title = "回复";
                    }
                } else {
                    this.$route.meta.title = "发件";
                }
                this.setDefault();
            },
            '$store.state.emailType'(newValue, oldValue) {
                this.fileList = [...[]];
                this.fileAccessoryList = [...[]];
                this.receiver = "";
                if (newValue) {
                    this.mailType = 0;
                } else {
                    this.mailType = 1;
                }
            },
            mailType(n) {
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
                if (this.mailType == 0) {
                    this.mailSlevel = option[1].value;
                    this.options = option;
                } else if (this.mailType == 1) {
                    this.mailSlevel = option1[1].value;
                    this.options = option1;
                } else {
                    this.mailSlevel = option2[1].value;
                    this.options = option2;
                }
            },
            fileList() {
                console.log("fileListChange");
                this.setPrintNumForm();
            },
            receiversList() {
                this.setPrintNumForm();
            },
            receiver() {
                setTimeout(() => {
                    var height = document.getElementById("receiveInput").offsetHeight;
                    console.log("receiveInput", height);
                    if (height > 45) {
                        this.overReceive = true;
                    } else {
                        this.overReceive = false;
                    }
                }, 100);

                /* var textarea=receiveInput.getElementsByClassName('el-textarea__inner')[0];
                console.log('textarea',textarea) */
                /* var height=this.$refs.receiverInput.offsetHeight;
                console.log('height',height) */
            }
        },
        filters: {
            // 文件大小换算 B=>M
            calculate(val) {
                let defNum = 1024.00;
                let result = (multiples) => {
                    return Math.pow(defNum, multiples)
                }
                if (val < result(1)) {
                    return (val / result(1)).toFixed(2) + 'KB'
                } else if (val < result(2)) {
                    return (val / result(2)).toFixed(2) + 'MB'
                } else if (val < result(3)) {
                    return (val / result(3)).toFixed(2) + 'GB'
                }
            }
        },
        beforeRouteEnter(to, from, next) {
            console.log("enter===");
            console.log("to", to.query.type);
            if (to.query.type) {
                if (to.query.type == "draft") {
                    to.meta.title = "草稿箱详情";
                } else if (to.query.type == "trans") {
                    to.meta.title = "转发";
                } else if (to.query.type == "reply") {
                    to.meta.title = "回复";
                }
            } else {
                to.meta.title = "发件";
            }

            next();
        },
        beforeRouteLeave(to, from, next) {
            console.log("sssleave");
            from.meta.title = "发件";
            next();
        }
    };
</script>
<style lang="scss" scoped>
    .alert-img {
        width: 100%;
    }

    .print-div {
        margin-top: 10px;
    }

    .send-person {
        margin-left: 15px;
        line-height: 21px;
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

    .mar-t-20 {
        margin-top: -20px;
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

    .sendmail {
        display: flex;
        height: 700px;
        padding: 10px;
        overflow: hidden;
    }

    .add-person-icon {
        position: absolute;
        right: 50px;
        top: 20px;
        width: 20px;
    }

    .left-part {
        flex: 1;
        height: 100%;
        position: relative;
        border-right: 1px solid #bcbcbc;
        min-height: 100%;
        box-sizing: border-box;
        padding-right: 20px;
        overflow: auto;
        //border:1px solid red;
    }

    .right-part {
        width: 200px;
        height: 100%;
        padding: 0 15px;
        min-height: 100%;
        //border:1px solid green;
    }

    .inb {
        display: inline-block;
    }

    .search-box {
        border: 1px solid #bcbcbc;
        border-radius: 20px;
        padding: 0 20px;
        margin-bottom: 3px;
        margin-top: 10px;
    }

    .search-icon {
        width: 15px;
    }

    .flex1 {
        flex: 1;
    }

    .progress-box {
        margin-bottom: 10px;
    }

    .notice {
        font-size: 12px;
        color: #bcbcbc;
    }

    .wenjian-list {
        //background-color: #e8f6fe;
        padding: 10px;
        flex-wrap: wrap;

        li {
            width: 350px;
            font-size: 12px;
            margin: 10px 50px 10px 0;

            .wenjian-type {
                width: 50px;
            }
        }
    }

    .oprate {
        margin-top: 20px;
        color: #333333;

        .mail-code {
            font-size: 14px;
            color: #333333;
            border-radius: 17px;
            display: inline-block;
            padding: 5px 10px;
            margin-top: 10px;
        }

        .oper-btn {
            margin: 20px 0;
        }

        .ji1 {
            margin-left: 28px;
        }

        .itemboxs {
            font-size: 14px;

            .item {
                margin-top: 20px;

                white-space: nowrap;

                .item-right {
                    display: inline-block;
                    border-bottom: 1px solid #cdcdcd;
                    flex: 1;
                }

                .email-address {
                    margin-right: 50px;
                    margin-left: 5px;
                    line-height: 21px;


                }
            }

            .fujian {
                width: 10px;
                vertical-align: middle;
                margin-right: 5px;
            }
        }
    }

    .reciev-box {
        position: relative;
    }

    .receive-find-result-box {
        position: absolute;
        width: 100%;
        padding-left: 72px;
        left: 0;
        bottom: -200px;
        z-index: 1000;

        ul {
            height: 200px;
            border: 1px solid #cdcdcd;
            border-right: 0;
            list-style: none;
            z-index: 1000;
            background: #fff;

            overflow: auto;

            .filter-item {
                margin: 10px 0;
                border-bottom: 1px dashed #cdcdcd;
                padding: 5px 9px;
            }

            .filter-item:hover {
                background-color: rgba(11, 168, 108, 0.1);
            }
        }
    }

    .editor-box {
        position: relative;

        .editor-upbtn {
            position: absolute;
            right: 10px;
            top: 8px;
        }
    }

    .user-ul {
        list-style: none;

        li {
            margin: 10px 0;
        }
    }

    .file-ul {
        list-style: none;
        padding-left: 30px;

        .file-ul-li {
            display: flex;
            align-items: center;

            .ul-li-fileName {
                display: inlineblock;
                width: 70%;
                white-space: nowrap;
                line-clamp: 1;
                text-overflow: ellipsis;
                overflow: hidden
            }
        }
    }

    .save-footer {
        text-align: center;
        margin: 40px 0 0 0;
    }

    .receiver-show-btn {
        position: absolute;
        right: 0;
        bottom: -12px;
        background: #fff;
    }

</style>

