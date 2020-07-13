<template>
    <div>
        <!-- <div class="title">个人设置</div> -->
        <!-- <div style="margin-top:20px;"></div> -->
        <a href="../../data/selectseviceLog.json" download ref="download" style="display:none">下载</a>
        <ToolBar v-show="emailType===1">
            <el-button type="primary" size="small" icon="el-icon-download" @click.stop="handleDownLoad"> 代理客户端下载
            </el-button>
            <el-button type="primary" size="small" icon="el-icon-refresh" @click.stop="handleUpdate">更新管理</el-button>
            <a href="d"></a>
        </ToolBar>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="个人设置" name="personalSetting">
                <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
                    <el-form-item label="未读邮件提示：">
                        <el-radio-group v-model="form.resource">
                            <el-radio label="是"></el-radio>
                            <el-radio label="否"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="提示音：" prop="region">
                        <el-select v-model="form.region" placeholder="请选择">
                            <el-option label="提示音一" value="shanghai"></el-option>
                            <el-option label="提示音二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="时间间隔：" prop="time">
                        <el-input v-model.number="form.time" style="width:215px;"></el-input>
                    </el-form-item>

                    <el-form-item label="发文编号：" prop="name">
                        <el-input v-model.number="form.name" style="width:215px;"></el-input>
                        <el-button class="zero-btn" @click.stop="toZero">归 零</el-button>
                    </el-form-item>
                    <el-form-item label="默认主题：">
                        <!-- <el-checkbox-group v-model="form.type">
                          <el-checkbox label="海阔天空" name="type"></el-checkbox>
                          <el-checkbox label="迷彩风" name="type"></el-checkbox>
                          <el-checkbox label="湛蓝" name="type"></el-checkbox>
                        </el-checkbox-group>-->
                        <el-radio-group v-model="form.type">
                            <el-radio label="海阔天空"></el-radio>
                            <el-radio label="迷彩风"></el-radio>
                            <el-radio label="湛蓝"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click.stop="onSubmit('form')">保存</el-button>
                        <el-button @click.stop="resetForm('form')">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="模板设置" name="modelSetting">
                <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                    <el-form-item label="发文概述模板：">
                        <!-- <el-input
                          type="textarea"
                          v-model="form.desc"
                          style="width:400px"
                          :rows="5"
                          :disabled="noEdit"
                          accept=".zip"
                        ></el-input>-->
                        <el-button type="primary" @click.stop="addMb" size="small">新 增</el-button>
                        <el-table
                                ref="multipleTable"
                                :data="tableData"
                                tooltip-effect="dark"
                                style="width:700px"
                                :show-header="false"
                        >
                            <!-- <el-table-column prop="no_reading" label="状态" width="50" height="65" align="left">
                              <template slot-scope="scope">
                                <img :src="scope.row.read_status?read_url:no_read_url" alt @click="f(scope.row.id)">
                              </template>
                            </el-table-column>-->
                            <el-table-column prop="xh" label="发文时间"></el-table-column>
                            <el-table-column prop="name" label="收文时间"></el-table-column>
                            <el-table-column prop="annexoperation" label="操作">
                                <template slot-scope="scope">
                                    <el-button size="small" type="text" @click.stop="look(scope.row,scope.$index)">编辑
                                    </el-button>
                                    <el-button size="small" type="text" @click.stop="tableDel(scope.row,scope.$index)">
                                        删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click.stop="onSubmit('form')">保存</el-button>
                        <el-button @click.stop="resetForm('form')">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="邮箱设置" name="mailSetting">
                <el-form :model="form" :rules="rules" label-width="100px">
                    <el-form-item
                            label="收/发件箱导出策略："
                            prop="a">
                        <div class="ib self-select-box">
                            <span class="font-set">时间&gt;=</span>
                            <!-- <el-input
                              v-model.number="form.c"
                              style="width:100px;"
                              @focus="importTimeOptions=true"
                              @blur="selectBlur"
                            ></el-input>-->
                            <el-select
                                    v-model="form.a"
                                    filterable
                                    allow-create
                                    default-first-option
                                    placeholder
                                    style="width:100px;">
                                <el-option
                                        v-for="item in options5"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                ></el-option>
                            </el-select>
                            <span class="font-set">天</span>
                            <!-- <ul class="select-options" v-if="importTimeOptions">
                              <li @click="chooseItem(10)">10</li>
                              <li @click="chooseItem(20)">20</li>
                              <li @click="chooseItem(30)">30</li>
                            </ul>-->
                        </div>
                        <div class="ib self-select-box">
                            <span class="font-set rl">容量&gt;=</span>
                            <!-- <el-input
                              v-model.number="form.d"
                              style="width:100px;"
                              @focus="importOpacityOptions=true"
                              @blur="importOpacityOptions=false"
                            ></el-input>-->
                            <el-select
                                    v-model="form.b"
                                    filterable
                                    allow-create
                                    default-first-option
                                    placeholder
                                    style="width:100px;">
                                <el-option
                                        v-for="item in options5"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                ></el-option>
                            </el-select>
                            <span class="font-set">%</span>
                            <!-- <ul class="select-options" v-if="importOpacityOptions">
                              <li>10</li>
                              <li>20</li>
                              <li>30</li>
                            </ul>-->
                        </div>
                    </el-form-item>
                    <el-form-item
                            label="垃圾箱自动清除策略："
                            prop="c">
                        <div class="ib self-select-box">
                            <span class="font-set">时间&gt;=</span>
                            <!-- <el-input
                              v-model.number="form.c"
                              style="width:100px;"
                              @focus="clearTimeOptions=true"
                              @blur="clearTimeOptions=false"
                            ></el-input>-->
                            <el-select
                                    v-model="form.c"
                                    filterable
                                    allow-create
                                    default-first-option
                                    placeholder
                                    style="width:100px;">
                                <el-option
                                        v-for="item in options5"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                ></el-option>
                            </el-select>
                            <span class="font-set">天</span>
                            <!--  <ul class="select-options" v-if="clearTimeOptions">
                              <li>10</li>
                              <li>20</li>
                              <li>30</li>
                            </ul>-->
                        </div>
                        <div class="ib self-select-box">
                            <span class="font-set rl">容量&gt;=</span>
                            <!--   <el-input
                              v-model.number="form.d"
                              style="width:100px;"
                              @focus="clearOpacityOptions=true"
                              @blur="clearOpacityOptions=false"
                            ></el-input>-->
                            <el-select
                                    v-model="form.d"
                                    filterable
                                    allow-create
                                    default-first-option
                                    placeholder
                                    style="width:100px;">
                                <el-option
                                        v-for="item in options5"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                ></el-option>
                            </el-select>
                            <span class="font-set">%</span>
                            <!-- <ul class="select-options" v-if="clearOpacityOptions">
                              <li>10</li>
                              <li>20</li>
                              <li>30</li>
                            </ul>-->
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click.stop="onSubmit('form')">保存</el-button>
                        <el-button @click.stop="resetForm('form')">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
        <drawer :isShowDrawer="isShowDrawer" :width="600">
            <div slot="content">
                <div>
                    <div style="width:556px;display:inline-block;margin-bottom:20px;">
                        <quill-editor v-model="form.desc" ref="myTextEditor" :options="editorOption"
                                      size="mini"></quill-editor>
                        <!-- :disabled="noEdit" -->
                    </div>
                    <div style="display:inline-block;position:relative;width:1px;height:20px;">
                        <div style="display:inline-block;position:absolute; top: -268px;left: -69px;">
                            <el-button type="primary" size="small" @click.stop="chooseFile($event)">上 传</el-button>
                            <input
                                    type="file"
                                    class="bigfile"
                                    @change="addFiles"
                                    ref="file"
                                    name="file"
                                    style="display:none"
                            >
                            <!-- <el-button class="zero-btn" @click="noEdit=!noEdit">{{noEdit?'在线编辑':'确定'}}</el-button> -->
                        </div>
                    </div>
                </div>
                <div class="dialog-footer" style="text-align:right;margin-right:2px; ">
                    <el-button @click=" isShowDrawer= false" size="small">取 消</el-button>
                    <el-button type="primary" @click="dialogSave" size="small">确 定</el-button>
                </div>
            </div>
        </drawer>
        <!-- <el-dialog title="提示" :visible.sync="dialogVisible" width="600px" >

            </el-dialog> -->
    </div>
</template>

<script>
    import {quillEditor} from "vue-quill-editor";
    import ToolBar from "../../components/ToolBar";
    import drawer from "../../components/drawer.vue";
    import {mapState} from "vuex";

    export default {
        components: {
            quillEditor,
            ToolBar,
            drawer
        },
        data() {
            return {
                isShowDrawer: false,
                activeName: "personalSetting",
                toggleDrawer: "toggleDrawer",
                tableData: [
                    {
                        xh: "1",
                        name: "模板1"
                    },
                    {
                        xh: "2",
                        name: "模板2"
                    }
                ],
                tableIndex: 0,
                dialogVisible: false,
                file: null,
                blobSlice: null,
                fileReader: null,
                form: {
                    a: [],
                    b: [],
                    c: [],
                    d: [],
                    time: 0,
                    name: 0,
                    region: "",
                    date1: "",
                    date2: "",
                    delivery: false,
                    type: "迷彩风",
                    resource: "是",
                    desc: ""
                },
                content: "",
                editorOption: {
                    placeholder: "请在里输入.....",
                    modules: {
                        toolbar: [
                            [{size: ['10px', '12px', '14px', '16px', '18px', '20px', '22px', '24px']}],
                            ["bold", "italic", "underline"],
                            [{align: []}]
                        ]
                    }
                },
                rules: {
                    region: [
                        {required: true, message: "请选择提示音", trigger: "change"}
                    ],
                    name: [
                        {required: true, message: "编号不能为空"},
                        {type: "number", message: "编号必须为数字值"}
                    ],
                    time: [
                        {required: true, message: "时间间隔不能为空"},
                        {type: "number", message: "时间间隔必须为数字值"}
                    ]
                },
                noEdit: true,
                importTimeOptions: false,
                importOpacityOptions: false,
                clearTimeOptions: false,
                clearOpacityOptions: false,
                options5: [
                    {
                        value: "10",
                        label: "10"
                    },
                    {
                        value: "20",
                        label: "20"
                    },
                    {
                        value: "30",
                        label: "30"
                    }
                ],
                value10: []
            };
        },
        comments: {
            ToolBar
        },
        created() {
            this.blobSlice =
                window.File.prototype.slice ||
                window.File.prototype.mozSlice ||
                window.File.prototype.webkitSlice;
            this.fileReader = new FileReader();
            if (localStorage.getItem("settingForm")) {
                var saveForm = JSON.parse(localStorage.getItem("settingForm"));
                console.log(saveForm);
                this.form = saveForm;
            }
            if (localStorage.getItem("fileTable")) {
                var tableData = JSON.parse(localStorage.getItem("fileTable"));
                console.log(tableData);
                this.tableData = tableData;
            }
        },
        methods: {
            chooseItem(val) {
                console.log("click");
                this.form.a = val;
            },
            selectBlur() {
                console.log("blur");
            },
            //弹出框的保存
            dialogSave() {
                this.isShowDrawer = false;
                this.tableData[this.tableIndex].name = "模板" + (this.tableIndex + 1);
                this.$message({
                    type: "success",
                    message: "保存成功!"
                });
            },
            //新增模板表格
            addMb() {
                var obj = {};
                obj.xh = this.tableData[this.tableData.length - 1].xh - 0 + 1;
                obj.name = "";
                this.tableData.push(obj);
            },
            //编辑模板
            look(row, index) {
                //this.dialogVisible = true;
                this.isShowDrawer = true;
                this.tableIndex = index;
            },
            //删除
            tableDel(row, index) {
                //昨天删除
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
            //保存
            onSubmit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        localStorage.setItem("settingForm", JSON.stringify(this.form));
                        localStorage.setItem("fileTable", JSON.stringify(this.tableData));
                        this.$message({
                            message: "保存成功",
                            type: "success"
                        });
                    } else {
                        return false;
                    }
                });
            },
            //归零
            toZero() {
                this.form.name = 0;
            },
            //选择文件
            chooseFile($event) {
                this.$refs.file.click();
            },
            //添加附件
            addFiles() {
                this.file = this.$refs.file.files[0];
                let file = this.$refs.file.files[0];
                if (file.type != "text/html") {
                    this.$message({
                        message: "只能上传格式为html的文件",
                        type: "error"
                    });
                    return;
                }
                this.fileReader.readAsText(file);
                this.fileReader.onload = result => {
                    var targetName = result.target.result;
                    targetName = targetName.replace(/[\n\r]/g, "");
                    // targetName = targetName.replace(/[ ]/g, "");
                    console.log(targetName);
                    this.form.desc = targetName;
                };
            },
            //取消
            resetForm(formName) {
                if (localStorage.getItem("settingForm")) {
                    var saveForm = JSON.parse(localStorage.getItem("settingForm"));
                    console.log(saveForm);
                    this.form = saveForm;
                } else {
                    this.form = {
                        a: "",
                        b: "",
                        c: "",
                        d: "",
                        name: "",
                        region: "",
                        date1: "",
                        date2: "",
                        delivery: false,
                        type: [],
                        resource: "是",
                        desc: ""
                    };
                }
                //this.$refs[formName].resetFields();
            },
            //代理客户端下载
            handleDownLoad() {

                this.$refs.download.click();
            },
            //  更新管理
            handleUpdate() {

                this.$message({
                    type: "success",
                    message: "更新成功"
                })
            },
            //
            handleClick() {

            }
        },
        computed: mapState({
            emailType: state => state.emailType,//获取EMAIL TYPE
        }),
    };
</script>

<style lang="scss" scoped>
    .title {
        border-bottom: 1px solid #bcbcbc;
        font-size: 16px;
        font-weight: bold;
        line-height: 30px;
        color: #333333;
        padding-bottom: 5px;
        margin-bottom: 50px;
    }

    .zero-btn {
        margin-left: 10px;
    }

    .font-set {
        font-size: 14px;
        color: #606266;
        margin: 0 10px;
    }

    .rl {
        margin-left: 50px;
    }

    .self-select-box {
        position: relative;
    }

    .select-options {
        width: 100px;
        position: absolute;
        right: 34px;
        bottom: -105px;
        list-style: none;
        background: #fff;
        z-index: 10;
        height: 100px;
        box-shadow: 2px 2px 10px #dfdfdf;
        color: #333;

        li {
            padding-left: 5px;
            cursor: pointer;
        }

        li:hover {
            color: #0ba86c;
        }

        li.actived {
            color: #0ba86c;
        }
    }
</style>

