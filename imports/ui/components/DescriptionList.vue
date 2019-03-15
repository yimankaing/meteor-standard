<template>
    <el-row :gutter="20">
        <el-col :span="12" style="text-align: right;">
            <h4 style="font-weight: bold" class="dl-text">{{title}}</h4>
        </el-col>
        <el-col :span="12">
            <h4 v-if="!!value" class="dl-text">{{value}}</h4>
            <h4 v-if="!!extra" class="dl-text">{{extra}}</h4>
            <slot name="value"></slot>
        </el-col>
    </el-row>
</template>

<script>
  export default {
    name: "DescriptionList",
    props: ["title", "value", "extra"]
  }
</script>

<style lang="scss" scoped>
    .el-row {
        margin-bottom: 15px;
        &:last-child {
            margin-bottom: 0;
        }
    }

</style>