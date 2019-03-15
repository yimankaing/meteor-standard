<template>
    <!--<div @click="action"-->
         <!--class="refresher">-->
        <!--<i class="el-icon-refresh refresher-icon"></i>-->
    <!--</div>-->
    <div style="display: flex; flex-direction: row-reverse" class="refresher" @click="action">
        <el-button size="mini" icon="el-icon-refresh" type="info" plain class="btn-style">
            <span>ផ្ទុកឡើងវិញ</span>
        </el-button>
    </div>
</template>

<script>
  export default {
    name: "Refresher",
    methods:{
      action(){
        this.$emit('action');
      }
    }
  }
</script>

<style lang="scss" scoped>
    .btn-style {
        border-top: none;
        border-top-right-radius: 0px;
        border-top-left-radius: 0px;
    }
    .refresher {
        /*cursor: pointer;*/
        /*text-align: center;*/
        /*height: 25px;*/
        /*background-color: #ffffff;*/
        /*width: 25px;*/
        margin-top: -25px;
        /*margin-left: 99%;*/
        /*border-radius: 4px;*/
        margin-bottom: -5px;
        /*z-index: 1000;*/
        /*transition: .3s ease-out;*/
    }
    /*.refresher-icon {*/
        /*font-size: 18px;*/
        /*line-height: 22px;*/
        /*color: #409eff;*/
    /*}*/
    /*.refresher:hover {*/
        /*background-color: white;*/
        /*transform: scale(1.5);*/
        /*box-shadow: 0 0 6px rgba(0, 0, 0, .05);*/
        /*.refresher-icon {*/
            /*color: #409eff;*/
        /*}*/
        /*-o-transition:.3s;*/
        /*-moz-transition:.3s;*/
        /*-webkit-transition:.3s;*/
        /*transition: .3s ease-in;*/
    /*}*/
    /*.refresher:active {*/
        /*-webkit-animation-duration: .3s;*/
        /*animation-duration: .3s;*/
        /*-webkit-animation-fill-mode: both;*/
        /*animation-fill-mode: both;*/
        /*-webkit-animation-name: hvr-pulse-grow;*/
        /*animation-name: hvr-pulse-grow;*/
    /*}*/
</style>