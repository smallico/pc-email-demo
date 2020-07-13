<template>
    <div class='organ-add-container'>
       <el-card>
            <el-form 
                :mode=form
                style='width:800px;'
                ref='form'>
            <el-form-item 
                label='父级机构名称' 
                label-width='120px'>
                <el-input type='text' :readonly='true' v-model='form.parentName' :disabled='true'></el-input>
            </el-form-item>
            <el-form-item 
                label='组织机构拓扑图' 
                label-width='120px'>
                <el-tree
                    ref="organTree"
                    :data='organData'
                    :props='defaultProps'
                    node-key='id'
                    :default-expand-all='true'
                    :expand-on-click-node='false'
                    :highlight-current='true'
                    @node-click='handleNodeClick'
                    >
                </el-tree>
            </el-form-item>
            <el-form-item 
                label='需新增结构名称'
                label-width='120px'>
                <el-input type='text' v-model='form.organName'></el-input>
            </el-form-item>
        </el-form>
        <el-footer  style='text-align:right'>
            <el-button type='primary' size='small' @click='handleAdd'>添加</el-button>
            <el-button size="small" @click='handleCancel'>取消</el-button>
        </el-footer>
       </el-card>
    </div>
</template>
<script>
import {request} from '../../../api/data-api'
export default {
    data () {
        return {
            organData: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            form: {
                parentId: '',
                parentName: '',
                organName: '',
            }
        }
    },
    created () {
        this.getOrganData();
    },
    methods: {
        //获取组织结构数据
        getOrganData () {
            request ('/organData', data => {
                console.log('data',data);
                this.organData = data.data;
                let id = data.data[0].id;
                let name = data.data[0].name;
                // this.form.parentName = name;
                // this.form.parentId = id;
                if (this.$route.query.id) {
                    console.log("执行力")
                    let {id, name} = this.$route.query;
                    this.form.parentName = name;
                    this.form.parentId = id;
                    this.$nextTick(() => {
                    this.$refs.organTree.setCurrentKey(id);
                    })
                }
               
            })
        },
        //节点点击回调
        handleNodeClick (data) {
            let {id, name} = data;
            this.form.parentId = id;
            this.form.parentName = name;  
        },
        //更新结构拓扑
        updateOrgan () {
            if (this.form.parentId) {

                let array=this.AddOrgan(this.organData, this.form.parentId, this.form.organName);
            } else {
                this.AddRootOrgan(this.form.organName);
            }
            this.organData =[...this.organData]
        },
        //拓扑图中添加数据
        AddOrgan (array,parentId,newOrganName) {
            array.forEach((item, index) => {
                if (item.children &&  item.children.length > 0) {   //有孩子节点
                    let len = item.children.length;
                    if (item.id == parentId) {
                         item.children.push({
                             id: `${item.id}-${len+1}`,
                             name: newOrganName
                         })
                    } else {
                        this.AddOrgan(item.children,parentId,newOrganName);
                    }
                } else {                                   //没有孩子节点
                    if(item.id == parentId) {
                        let newChildren = [];
                        newChildren.push({
                            id: `${item.id}-1`,
                            name: newOrganName
                        });
                        item.children = newChildren;
                    }
                }
            });
        },
        //拓补图添加根机构
        AddRootOrgan (name) {
            let len =  this.organData.length;
            this.organData.push({
                name: name,
                id: `${len + 2}`
            })
        },
        //确认添加回调
        handleAdd () {
            this.updateOrgan();
        },
        //取消回调
        handleCancel () {
            this.$router.push({path: 'organ'});
        }
    }
}
</script>
<style scoped lang="scss">
</style>
