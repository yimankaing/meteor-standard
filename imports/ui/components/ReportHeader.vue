<template>
    <div class="header-container">
        <div class="institute">
            <img src="/images/logo.png" width="80" height="80">
            <p class="title">{{ministry}}</p>
            <p class="subtitle" style="font-size: 9px">{{institute}}</p>
            <p class="symbol">4</p>
        </div>
        <div class="country">
            <p class="title">ព្រះរាជាណាចក្រកម្ពុជា</p>
            <p class="subtitle">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
            <p class="symbol">4</p>
        </div>

    </div>
</template>

<script>
  export default {
    name: "ReportHeader",
    props: ["ministry", 'institute', ]
  }
</script>

<style scoped>

</style>