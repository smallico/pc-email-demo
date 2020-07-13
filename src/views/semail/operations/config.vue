<template>
  <div>
    <ToolBar>
      <div>
        <el-button type="primary" icon="el-icon-document" size="small" @click="handleBackups">备份</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="small" @click="handleRollback">恢复</el-button>
        <el-button type="primary" icon="el-icon-upload2" size="small" @click="importConfig">导入</el-button>
        <el-button type="primary" icon="el-icon-download" size="small" @click="exportout">导出</el-button>
        <!-- <el-button type="primary" icon="el-icon-download" size="small" @click="exportout">客户端历史版本</el-button> -->
        <a href="../../../data/selectseviceLog.json" download ref="download" style="display:none">下载</a>
        <input
          type="file"
          class="bigfile"
          ref="file"
          name="file"
          style="display:none"
          @change="addFiles"
        >
      </div>
    </ToolBar>
    <el-row :gutter="10" v-loading="loading">
      <el-col :span="24">
        <el-card style="border-radius: 0;" >
          <el-tabs v-model="activeEnvir" tab-position="top" @tab-click="handleEnvirClick">
            <el-tab-pane
              :label="envir.envirName"
              :name="envir.envirId"
              v-for="envir in envirList"
              :key="'envir'+envir.envirId"
            >
              <el-tabs tab-position="left" v-model="activeTypeId" @tab-click="getItem">
                <el-tab-pane
                  :label="item.typeName"
                  :name="item.typeId"
                  v-for="item in typeList"
                  :key="'1'+item.typeId"
                >
                  <el-form label-width="150px" size="mini" ref="dateForm" style="width:700px;">
                    <!-- <el-form-item
                      :label="formItem.valueType"
                      v-for="(formItem,formIndex) in itemList"
                      :key="'1'+item.typeId+formItem.itemId"
                    >
                      <el-input v-model="itemList[formIndex].itemValue"></el-input>
                    </el-form-item> -->
                    <el-form-item
                      :label="formItem.valueType"
                      v-for="(formItem,formIndex) in itemList"
                      :key=formIndex
                    >
                      <el-input v-model="itemList[formIndex].itemValue"></el-input>
                    </el-form-item>
                  </el-form>
                  <el-button
                    type="primary"
                    size="small"
                    @click="saveConfig(itemList)"
                    class="save-btn"
                    v-if="hasItem"
                  >确定</el-button>
                  <div class="no-tips" v-else>暂无配置参数</div>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="恢复" :visible.sync="dialogVisible" center>
      <ul>
        <!-- <li
          :class="choosedBackId==item.fileId?'active-backup':'backup-item'"
          v-for="item in backupList"
          :key="'backup'+item.fileId"
          @click="choosedBackId=item.fileId"
        >
          <span>时间版本：{{item.date}}</span>
        </li> -->
         <li
          :class="index == backupDataIndex ? 'active-backup' : 'backup-item' "
          v-for="(item,index) in backupList"
          :key=index
          @click="startRecover(index)"
        >
          <span>时间版本：{{item.date}}</span>
        </li>
      </ul>
      <div slot="footer">
        <el-button size="small" @click="dialogVisible=false">取消</el-button>
        <el-button size="small" @click="submitRollback" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { request } from "../../../api/data-api";
import ToolBar from "./../../../components/ToolBar";
import { setTimeout } from "timers";
export default {
  components: {
    ToolBar
  },
  data() {
    return {
      dialogVisible: false,
      activeEnvir: "1",  //当前所处环境
      activeTypeId: "",  // 当前配置项
      envirList: [
        {
          envirName: "开发环境",
          envirId: "1"
        },
        {
          envirName: "分布环境",
          envirId: "2"
        },
        {
          envirName: "独立环境",
          envirId: "3"
        }
      ],
      typeList: [],
      itemList: [],
      backupList: [], //历史备份数据
      backupDataIndex:0 , //恢复数据索引
      choosedBackId: "",
      hasItem: true,
      loading: false,
     // CopyDataList:[],   
    };
  },
  created() {
    this.getType();
  },
  methods: {
    //确定恢复
    submitRollback() {
      // if (this.choosedBackId == "") {
      //   this.$message({
      //     message: "请选择要恢复的时间版本",
      //     type: "warning"
      //   });
      //   return;
      // }
      // this.dialogVisible = false;
      // this.$message({
      //   message: "配置已恢复",
      //   type: "success"
      // });
      // this.getItem();
      if(this.backupDataIndex == "0" || this.backupDataIndex)
      {
          let itemData = this.backupList[this.backupDataIndex];
          let currentItemList =[];
          for(let key in itemData)
          {
            if(key != "activeEnvir" && key != "activeTypeId" && key != "date")
            {
              currentItemList.push({"valueType":key,"itemValue":itemData[key]})
            }
          }
          this.itemList = currentItemList;
          this.dialogVisible = false;
          this.dialogVisible = false;

      }else{
         this.$message.warning("请选择一条要恢复的数据")
      }
      /*       var obj = {
        fileId: this.choosedBackId
      };
      this.$http
        .configRecover(obj)
        .then(data => {
          this.dialogVisible = false;
          this.$message({
            message: "配置已恢复",
            type: "success"
          });
          this.getItem();
        })
        .catch(res => {
          console.log("error", res);
        }); */
    },
    //备份
    handleBackups() {
      let copyListDataItem ={
        activeEnvir : this.activeEnvir,
        activeTypeId : this.activeTypeId,
        date: this.timestampFormateDate(new Date().getTime()),
      }
      this.itemList.forEach((item)=>{
        copyListDataItem[item.valueType] = item.itemValue;
      });
      this.backupList.unshift(copyListDataItem);
      this.$message({
        message: "备份成功",
        type: "success"
      });
      /* this.$http
        .configBackup()
        .then(data => {
          this.$message({
            message: "备份成功",
            type: "success"
          });
        })
        .catch(res => {
          console.log("error", res);
        }); */
    },
    //恢复
    handleRollback() {
      this.choosedBackId = "";
      this.dialogVisible = true;
      this.getBackupRecord();
    },
    /**
     * 开始恢复
     */
    startRecover(index)
    {
       
      this.backupDataIndex = index;
     
        
         
    },
    //获取已备份记录
    getBackupRecord() {
      /* this.$http
        .configSelectFile()
        .then(data => {
          this.backupList = data.findForPage;
        })
        .catch(res => {
          console.log("error", res);
        }); */
      // request("/configBackupList", data => {
      //   console.log("已经备份好的数据",data);
      //   this.backupList = data.findForPage;
      // });
      let currentBackUpList = this.backupList.filter(item => item.activeEnvir == this.activeEnvir && item.activeTypeId == this.activeTypeId);
      this.backupList = currentBackUpList;
    },
    //保存配置
    saveConfig(itemList) {
      /*       this.$http
        .configEditItem(itemList)
        .then(data => {
          this.$message({
            message: "配置成功",
            type: "success"
          });
        })
        .catch(res => {
          console.log("error", res);
        }); */
      this.$message({
        message: "配置成功",
        type: "success"
      });
    },

    //环境切换
    handleEnvirClick(tab,event) {
      this.getType();
    },
    //获取某一环境下的配置类
    getType() {
      request("/configType", data => {
        this.typeList = data.findForPage;
        this.activeTypeId = data.findForPage[0].typeId;
        this.getItem();
      });
      /*       var obj = {
        typeEnvir: this.activeEnvir
      };
      this.$http
        .configSelectType(obj)
        .then(data => {
          this.typeList = data.findForPage;
          this.activeTypeId = data.findForPage[0].typeId;
          this.getItem();
        })
        .catch(res => {
          console.log("error", res);
        }); */
    },
    //获取配置项
    getItem() {
      request("/configItem", data => {

        if (data.findForPage) {
          var items = data.findForPage;
          this.itemList = items;
          this.hasItem = true;
        } else {
          this.itemList = [];
          this.hasItem = false;
        }
      });
      /*       var obj = {
        typeId: this.activeTypeId
      };
      this.$http
        .configSelectItem(obj)
        .then(data => {
          if (data.findForPage) {
            var items = data.findForPage;
            this.itemList = items;
            this.hasItem = true;
          } else {
            this.itemList = [];
            this.hasItem = false;
          }
        })
        .catch(res => {
          console.log("error", res);
        }); */
    },
    //导入
    importConfig() {
      this.$refs.file.click();
    },
    //导出
    exportout() {
      this.$refs.download.click();
    },
    //选择文件
    addFiles() {
      this.$message({
        message: "导入成功",
        type: "success"
      });
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.$message({
          message: "配置已更新",
          type: "success"
        });
      }, 1500);
    }
  }
};
</script>
<style scoped>
.save-btn {
  margin: 50px 400px;
}
.backup-item {
  margin: 10px 0;
  padding: 3px;
  cursor: pointer;
}
.backup-item:hover {
  background: rgba(60, 141, 188, 0.1) !important;
}
ul {
  list-style: none;
}
.active-backup {
  margin: 10px 0;
  padding: 3px;
  cursor: pointer;
  background: rgba(60, 141, 188, 0.3);
}
.no-tips {
  text-align: center;
}
</style>


