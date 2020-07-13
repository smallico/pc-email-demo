<template>
    <div>

           <el-form-item label="从属分组">
            <el-input v-model="form.name" placeholder="请选择" readonly></el-input>
            <i
              class="el-select__caret el-input__icon el-icon-arrow-up"
              style="transform: rotateZ(180deg); position:absolute;right:6px;top:6px;height:30px;"
            ></i>
            <div
              style="height:88px;border:1px solid #C0C4CC;margin-top:4px;border-radius:2px;overflow:auto;"
            >
              <el-checkbox style="display:block;margin-left:10px;" label="最近联系人" name="type"></el-checkbox>
              <el-checkbox style="display:block;margin-left:10px;" label="星标联系人" name="type"></el-checkbox>
              <el-checkbox style="display:block;margin-left:10px;" label="单位" name="type"></el-checkbox>
            </div>
          </el-form-item>
    </div>
</template>
<script>
export default {
    data(){

    }
}
</script>
<style>

</style>
