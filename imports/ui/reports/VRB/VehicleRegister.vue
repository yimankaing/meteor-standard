<template>
    <div v-loading.fullscreen.lock="loading">
        <div style="margin-bottom: 0px">
            <el-form :model="formData" :rules="rules" ref="vehicleRegisterReport" :inline="true" status-icon>
                <el-form-item prop="date">
                    <el-date-picker
                            style="width: 440px"
                            v-model="formData.date"
                            type="daterange"
                            format="dd-MMM-yyyy"
                            range-separator="ដល់"
                            start-placeholder="ចាប់ផ្តើម"
                            end-placeholder="បញ្ចប់">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button @click="submitForm('vehicleRegisterReport')" type="primary" icon="el-icon-document"
                               :loading="loading">បង្ហាញ
                    </el-button>
                    <el-button type="warning" icon="el-icon-printer" @click="handlePrint" v-if="rptData.rptContent.length!==0">
                        បោះពុម្ព
                    </el-button>
                    <!--<el-button @click="handleExportToExcel" type="success" icon="far fa-file-excel"-->
                               <!--v-if="rptData.rptContent.length!==0">-->
                        <!--នាំចេញ-->
                    <!--</el-button>-->
                </el-form-item>
            </el-form>
        </div>
        <el-row :gutter="10" v-if="rptData.rptContent.length!==0" style="margin-bottom: 10px">
            <el-col :span="12">
                <el-alert class="primary">
                    <span slot="title" style="color: #6f7180">កាលបរិច្ឆេទ៖ {{getCurrentDateTime()}}</span>
                </el-alert>
            </el-col>
            <el-col :span="12">
                <el-alert class="primary">
                    <span slot="title"
                          style="color: #6f7180">ចំនួនសរុប៖ {{toKhNumber(rptData.rptContent.length)}}</span>
                </el-alert>
            </el-col>
        </el-row>

        <no-data v-if="rptData.rptContent.length===0"/>
        <report-paper id="print-area" v-else>
            <div slot="header">
                <report-header :ministry="rptData.rptTitle.khMinistry" :institute="rptData.rptTitle.khInstitute"/>
                <div class="report-title-container">
                    <p class="title">សៀវភៅចុះលេខយានយន្ត</p>
                    <p class="subtitle">{{reportSubtitle(rptData.rptHeader)}}</p>
                </div>
            </div>
            <div slot="content">
                <div v-html="rptData.rptContentHtml"></div>
            </div>
        </report-paper>
    </div>
</template>

<script>
  import {Meteor} from 'meteor/meteor';
  import {addPrefix} from "../../../libs/stringFn";
  import moment from 'moment';
  import numeral from 'numeral';
  import Msg from '../../../libs/message';
  import ReportPaper from '../../components/ReportPaper';
  import ReportHeader from '../../components/ReportHeader';
  import NoData from '../../components/NoData';
  import Printd from 'printd';
  import {cssText} from "../../../libs/reportCssText";
  import {toKhDate, toKhMonth, toKhNumber, toKhTime} from "../../../libs/toKh";
  import FileSaver from 'file-saver';

  export default {
    name: "VehicleRegisterReport",
    components: {ReportPaper, ReportHeader, NoData},
    data() {
      return {
        currentUser: this.$store.state.auth.user,
        currentModule: this.$store.state.module.currentModule,
        loading: false,
        printPopover: false,
        rptData: {rptTitle: {}, rptHeader: {}, rptContent: [], rptContentHtml: ''},
        currentRow: {},
        formData: {
          date: '',
        },
        rules: {
          date: [{required: true, message: 'សូមជ្រើសរើស កាលបរិច្ឆេទ', trigger: 'blur'}],
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            setTimeout(() => this.generate(), 500);
          } else {
            return false;
          }
        });
      },
      getCurrentDateTime() {
        const khDate = toKhDate(moment().format('DD/MM/YYYY'));
        const khTime = toKhTime(moment().format('hh:mm:ss:a'));
        return khDate + " " + khTime;
      },
      handlePrint() {
        const d = new Printd();
        const styles = [`${cssText}
        table.rpt-table tbody tr {height: 32px}
        .report-header { display: none; }
        table.rpt-table tbody td { font-size: 11px;}
        table.rpt-table thead th { font-size: 11px;}
        @page {size: A3 landscape; margin: 12mm 22mm 12mm 22mm; }
        `];
        d.print(document.getElementById('print-area'), styles);
      },
      handleExportToExcel() {
        // const fileName = `របាយការណ៍ចុះលេខយានយន្ត ចាប់ពី៖${moment(this.formData.date[0]).format('DD-MM-YYYY')} ដល់ ${moment(this.formData.date[1]).format('DD-MM-YYYY')}`;
        // try {
        //   const isFileSaverSupported = !!new Blob;
        //   if (isFileSaverSupported && !!this.rptData.workbook) {
        //     FileSaver.saveAs(new Blob([this.rptData.workbook], {type: "application/octet-stream"}), `${fileName}` + ".xlsx");
        //   } else {
        //     Msg.error('ការនាំចេញមិនដំណើរការទេ!');
        //   }
        // } catch (e) {
        //   Msg.error('ការនាំចេញមិនដំណើរការទេ! ' + e);
        // }
      },
      reportSubtitle(val) {
        const {date: f_date, months: f_months, years: f_years} = moment(val.fDate).toObject();
        const {date: t_date, months: t_months, years: t_years} = moment(val.tDate).toObject();

        const fDate = `ថ្ងៃទី${toKhNumber(f_date + "")} ខែ${toKhMonth(f_months + 1 + "")} ឆ្នាំ${toKhNumber(f_years + "")}`;
        const tDate = `ថ្ងៃទី${toKhNumber(t_date + "")} ខែ${toKhMonth(t_months + 1 + "")} ឆ្នាំ${toKhNumber(t_years + "")}`;
        return `ពី${fDate} ដល់${tDate}`
      },
      createIndex(index) {
        return toKhNumber(index + 1 + "");
      },
      toKhNumber(num) {
        return !!num || num === 0 ? toKhNumber(num + '') : '';
      },
      dateFormatter(date) {
        return !!date ? toKhDate(moment(date).format('DD/MM/YYYY')) : '';
      },
      generate() {
        Meteor.call('vehicle_registerReport', {
          userId: this.currentUser._id,
          module: this.currentModule,
          params: {
            fDate: this.formData.date[0],
            tDate: this.formData.date[1],
          }
        }, (err, res) => {
          if (!err) {
            this.rptData = res;
          } else {
            Msg.error(err.message);
          }
          this.loading = false;
        });
      },
    }
  }
</script>

<style scoped>

</style>