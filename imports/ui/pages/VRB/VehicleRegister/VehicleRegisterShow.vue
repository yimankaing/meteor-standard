<template>
    <el-dialog v-draggable
               title="ព័ត៌មានចុះបញ្ជីយានយន្ត"
               :visible.sync="dialogVisible"
               width="50%"
               :before-close="handleClose"
    >
        <description-list title="រាជធានី-ខេត្ត" :value="currentRow.city"/>
        <description-list title="ប្រភេទ" :value="currentRow.type"/>
        <description-list title="ផ្លាកលេខ" :value="currentRow.plateNumber"/>
        <description-list title="ម៉ូដែល" :value="currentRow.model"/>
        <description-list title="ពណ៌" :value="currentRow.color"/>
        <description-list title="កម្លាំងម៉ាស៊ីន" :value="currentRow.power"/>
        <description-list title="លេខម៉ាស៊ីន" :value="currentRow.machineNumber"/>
        <description-list title="លេខតួ" :value="currentRow.bodyNumber"/>
        <description-list title="លេខសាក់ស៊ី" :value="currentRow.shockCode"/>
        <description-list title="ឆ្នាំផលិត" :value="currentRow.manufactureYear"/>
        <description-list title="ចំនួនភ្លៅ" :value="currentRow.thighNumber"/>
        <description-list title="ចំនួនស៊ីឡាំង" :value="currentRow.cylinderNumber"/>
        <description-list title="ទំហំស៊ីឡាំង" :value="currentRow.cylinderSize"/>
        <description-list title="លេខសន្លឹកពន្ធ" :value="currentRow.taxNumber"/>
        <description-list title="ឈ្មោះម្ចាស់កម្មសិទ្ធ" :value="currentRow.ownerKhName"/>
        <description-list title="ឈ្មោះម្ចាស់កម្មសិទ្ធ (EN)" :value="currentRow.ownerEnName"/>
        <description-list title="អាសយដ្ឋាន" :value="currentRow.address"/>
        <description-list title="ថ្ងៃខែឆ្នាំចុះបញ្ជីដំបូង" :value="dateFormatter(currentRow.firstRegisterDate)"/>
        <description-list title="ចាប់ពីថ្ងៃ" :value="dateFormatter(currentRow.fDate)"/>
        <description-list title="ដល់ថ្ងៃ" :value="dateFormatter(currentRow.tDate)"/>
    </el-dialog>
</template>

<script>
  import numeral from 'numeral';
  import moment from 'moment';
  import {toKhDate} from "../../../../libs/toKh";
  import DescriptionList from '../../../components/DescriptionList';

  export default {
    name: "LibraryShow",
    components: {DescriptionList},
    props: ['dialogVisible', 'currentRow'],
    methods: {
      handleClose() {
        this.$emit('close');
        this.$emit('reset');
      },
      dateFormatter(date) {
        return !!date ? toKhDate(moment(date).format('DD/MM/YYYY')) : '';
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>