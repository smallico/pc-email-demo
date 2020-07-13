<template>
    <div class="drawer" :class="{showDrawer:isShowDrawer}" :style="layout.switchTabBar?'width:'+width+'px;top:115px':'width:'+width+'px;top:68px'">
        <slot name="content">
        </slot>
    </div>
</template>
<script>
    import { mapState } from "vuex";
    export default {
        props: {
            isShowDrawer:{
                default:false
            },
            width:{
                default:350
            }
        },
        data() {
            return {

            };
        },
        computed:{
            ...mapState(["layout"])
        }
    };
</script>
<style lang="scss" scoped>
    .drawer {
        position: fixed;
        z-index: 1000;
        top: 115px;
        bottom: 0px;
        background: #fff;
        border-left: 1px solid #e5e5e5;
        box-shadow: -10px 10px 12px rgba(220, 230, 230, 12);
        transition: all 0.3s ease;
        right: -2000px;
        padding: 20px;
        overflow: auto;
    }
    .showDrawer {
        right: 0!important;
    }
    .drawer-footer {
        padding: 10px;
    }
    .drawer-header{
        padding:20px 10px;

    }
</style>


