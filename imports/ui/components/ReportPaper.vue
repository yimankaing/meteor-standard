<template>
    <div class="no-print">
        <div class="center report-header">
            <slot name="header"></slot>
        </div>
        <div class="center report-content">
            <slot name="content"></slot>
        </div>
        <div class="center report-footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
  export default {
    name: "ReportPaper",
  }
</script>

<style lang="scss" scoped>
    .no-print {
        zoom: 130%;
    }
</style>