<template>
    <el-pagination
            width="100%"
            align="center"
            background
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 50,100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
    </el-pagination>
</template>

<script>
  export default {
    name: "Pagination",
    props: ["total", "pageSize", "currentPage"],
    methods:{
      currentChange(){
        this.$emit('current-change');
      },
      sizeChange(){
        this.$emit('size-change')
      }
    }
  }
</script>

<style scoped>

</style>