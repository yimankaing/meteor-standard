<template>
    <div>
        <div style="display: flex;">
            <!--<div>-->
            <!--<el-button type="primary" icon="el-icon-plus" @click="vehicleRegisterInsertVisible=true">បន្ថែម-->
            <!--</el-button>-->
            <!--</div>-->
            <div>
                <el-date-picker
                        style="width: 440px"
                        v-model="dateRange"
                        type="daterange"
                        :clearable="false"
                        format="dd-MMM-yyyy"
                        range-separator="ដល់"
                        start-placeholder="ចាប់ផ្តើម"
                        end-placeholder="បញ្ចប់"
                        :picker-options="datePickerOptions"
                >
                </el-date-picker>
            </div>
            <div style="max-width: 360px; padding-left: 10px">
                <el-input placeholder="ស្វែងរក..." v-model="searchVehicleRegister" clearable>
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-select v-model="filter" slot="prepend" placeholder="ជ្រើសរើស" style="width: 200px">
                        <el-option :label="filter.label"
                                   :value="filter.value"
                                   v-for="(filter, index) in filterOptions"
                                   :key="index"></el-option>
                    </el-select>
                </el-input>
            </div>
            <div style="padding-left: 10px;">
                <el-button type="info" icon="el-icon-download" @click="downloadTemplate">ទាញយកគំរូ</el-button>
            </div>
            <div style="padding-left: 10px">
                <el-popover placement="bottom" trigger="click">
                    <vehicle-register-uploader></vehicle-register-uploader>
                    <el-button type="success" icon="el-icon-upload2" slot="reference">បញ្ចូលតាមរយៈ Excel</el-button>
                </el-popover>
            </div>
        </div>
        <br/>
        <!--table-->
        <el-col :span="24">
            <el-table
                    border
                    stripe
                    :header-cell-style="{color:'#000000', backgroundColor:'#eef1f6'}"
                    v-loading="isLoading"
                    element-loading-text="កំពុងដំណើរការ..."
                    :data="vehicleRegisterData"
                    highlight-current-row
                    @sort-change="handleRemoteSort"
            >
                <el-table-column
                        sortable="custom"
                        property="city"
                        label="រាជធានី-ខេត្ត"
                        min-width="160">
                </el-table-column>
                <el-table-column
                        sortable="custom"
                        property="type"
                        label="ប្រភេទ"
                        min-width="160">
                </el-table-column>
                <el-table-column
                        sortable="custom"
                        property="plateNumber"
                        label="ផ្លាកលេខ"
                        min-width="90">
                </el-table-column>
                <el-table-column
                        sortable="custom"
                        property="model"
                        label="ម៉ូដែល"
                        min-width="160">
                </el-table-column>
                <el-table-column
                        sortable="custom"
                        property="color"
                        label="ពណ៌"
                        min-width="70">
                </el-table-column>
                <el-table-column
                        sortable="custom"
                        property="power"
                        label="កម្លាំងម៉ាស៊ីន"
                        min-width="110">
                </el-table-column>
                <el-table-column
                        sortable="custom"
                        property="machineNumber"
                        label="លេខម៉ាស៊ីន"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        sortable="custom"
                        property="bodyNumber"
                        label="លេខតួ"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        sortable="custom"
                        property="shockCode"
                        label="លេខសាក់ស៊ី"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        sortable="custom"
                        property="manufactureYear"
                        label="ឆ្នាំផលិត"
                        min-width="85">
                </el-table-column>
                <el-table-column
                        sortable="custom"
                        property="thighNumber"
                        label="ចំនួនភ្លៅ"
                        min-width="85">
                </el-table-column>
                <el-table-column
                        sortable="custom"
                        property="cylinderNumber"
                        label="ចំនួនស៊ីឡាំង"
                        min-width="110">
                </el-table-column>
                <el-table-column
                        sortable="custom"
                        property="cylinderSize"
                        label="ទំហំស៊ីឡាំង"
                        min-width="100">
                </el-table-column>
                <el-table-column
                        sortable="custom"
                        property="taxNumber"
                        label="លេខសន្លឹកពន្ធ"
                        min-width="160">
                </el-table-column>
                <el-table-column
                        sortable="custom"
                        property="ownerKhName"
                        label="ឈ្មោះម្ចាស់កម្មសិទ្ធ"
                        min-width="160">
                </el-table-column>
                <el-table-column
                        sortable="custom"
                        property="ownerEnName"
                        label="ឈ្មោះម្ចាស់កម្មសិទ្ធ (EN)"
                        min-width="160">
                </el-table-column>
                <el-table-column
                        sortable="custom"
                        property="address"
                        label="អាសយដ្ឋាន"
                        min-width="160">
                </el-table-column>
                <el-table-column
                        sortable="custom"
                        property="firstRegisterDate"
                        label="ថ្ងៃខែឆ្នាំចុះបញ្ជីដំបូង"
                        :formatter="(row)=>dateFormatter(row.firstRegisterDate)"
                        min-width="160">
                </el-table-column>
                <el-table-column
                        min-width="135"
                        fixed="right"
                        label="សកម្មភាព"
                >
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click.native="handleUpdate(scope.row)"
                        ></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                   @click.native="handleRemove(scope.$index, scope.row, vehicleRegisterData)"></el-button>
                        <el-button type="warning" icon="el-icon-view" size="mini"
                                   @click.native="handleShow(scope.row)"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--Pagination-->
            <br/>
            <el-pagination
                    :pager-count="11"
                    width="100%"
                    align="center"
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage1"
                    :page-sizes="[10, 20, 30, 50,100]"
                    :page-size="currentPageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
            <!--End Pagination-->
        </el-col>
        <br>
        <!--vehicleRegister insert-->
        <vehicle-register-insert :dialog-visible="vehicleRegisterInsertVisible"
                                 @close="vehicleRegisterInsertVisible=false"/>
        <!--vehicleRegister update-->
        <vehicle-register-update :dialog-visible="vehicleRegisterUpdateVisible"
                                 :current-row="currentRow"
                                 @reset="currentRow={}"
                                 @close="vehicleRegisterUpdateVisible=false"/>
        <vehicle-register-show :dialog-visible="vehicleRegisterShowVisible"
                               :current-row="currentRow"
                               @close="vehicleRegisterShowVisible=false"
                               @reset="currentRow={}"/>
    </div>
</template>

<script>
  import {Vehicle_RegisterHelper} from "../../../../collections/VRB/vehicleRegister";
  import MsgBox from '../../../../libs/messageBox';
  import Msg from '../../../../libs/message';
  import VehicleRegisterInsert from './VehicleRegisterInsert';
  import VehicleRegisterUpdate from './VehicleRegisterUpdate';
  import VehicleRegisterShow from './VehicleRegisterShow';
  import VehicleRegisterUploader from './VehicleRegisterUploader';
  import _ from 'lodash';
  import moment from 'moment';

  export default {
    name: "VehicleRegister",
    components: {
      VehicleRegisterInsert,
      VehicleRegisterUpdate,
      VehicleRegisterShow,
      VehicleRegisterUploader,
    },
    data() {
      return {
        currentUser: this.$store.state.auth.user,
        currentModule: this.$store.state.module.currentModule,
        dateRange: [
          moment().startOf('month').toDate(), moment().endOf('month').toDate()
        ],
        datePickerOptions: {
          shortcuts: [{
            text: 'ខែនេះ',
            onClick(picker) {
              const start = moment().startOf('month').toDate();
              const end = moment().endOf('month').toDate();
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'ឆ្នាំនេះ',
            onClick(picker) {
              const start = moment().startOf('year').toDate();
              const end = moment().endOf('year').toDate();
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '៦ខែមុន',
            onClick(picker) {
              const start = moment().subtract(6, "months").startOf('month').toDate();
              const end = moment().endOf('month').toDate();
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        sort: [],
        filter: '',
        filterOptions: [
          {label: 'ទាំងអស់', value: ''},
          {label: 'រាជធានី-ខេត្ត', value: 'city'},
          {label: 'ប្រភេទ', value: 'type'},
          {label: 'ផ្លាកលេខ', value: 'plateNumber'},
          {label: 'ម៉ូដែល', value: 'model'},
          {label: 'ពណ៌', value: 'color'},
          {label: 'កម្លាំងម៉ាស៊ីន', value: 'power'},
          {label: 'លេខម៉ាស៊ីន', value: 'machineNumber'},
          {label: 'លេខតួ', value: 'bodyNumber'},
          {label: 'លេខសាក់ស៊ី', value: 'shockCode'},
          {label: 'ឆ្នាំផលិត', value: 'manufactureYear'},
          {label: 'ចំនួនភ្លៅ', value: 'thighNumber'},
          {label: 'ចំនួនស៊ីឡាំង', value: 'cylinderNumber'},
          {label: 'ទំហំស៊ីឡាំង', value: 'cylinderSize'},
          {label: 'លេខសន្លឹកពន្ធ', value: 'taxNumber'},
          {label: 'ឈ្មោះម្ចាស់កម្មសិទ្ធ', value: 'ownerKhName'},
          {label: 'ឈ្មោះម្ចាស់កម្មសិទ្ធ (EN)', value: 'ownerEnName'},
          {label: 'អាសយដ្ឋាន', value: 'address'},
          {label: 'ថ្ងៃខែឆ្នាំចុះបញ្ជីដំបូង', value: 'firstRegisterDateStr'},
        ],
        skip: 0,
        currentPage1: 1,
        searchVehicleRegister: '',
        selector: {},
        currentPageSize: 10,
        isLoading: true,
        total: 0,
        vehicleRegisterData: [],

        vehicleRegisterInsertVisible: false,
        vehicleRegisterUpdateVisible: false,
        vehicleRegisterShowVisible: false,
        currentRow: {}
      }
    },
    watch: {
      searchVehicleRegister(val) {
        this.isLoading = true;
        this.skip = 0;
        this.currentPage1 = 1;
        this.search();
      },
      filter(val) {
        this.isLoading = true;
        this.skip = 0;
        this.currentPage1 = 1;
        this.search();
      },
      dateRange(val) {
        this.isLoading = true;
        this.skip = 0;
        this.currentPage1 = 1;
        if (val) {
          const start = moment(val[0]).startOf("day").toDate();
          const end = moment(val[1]).endOf("day").toDate();
          this.selector.dateRange = [
            start, end
          ];
        } else {
          this.selector = {};
        }
        setTimeout(() => this.findVehicleRegister(), 500);
      },
    },
    methods: {
      handleRemoteSort({column, prop, order}) {
        this.isLoading = true;
        this.selector.sort = [order, prop];
        this.search();
      },
      search: _.debounce(function () {
        this.findVehicleRegister();
      }, 200),
      findVehicleRegister() {
        Meteor.call('vehicle_findRegister', {
          userId: this.currentUser._id,
          module: this.currentModule,
          q: this.searchVehicleRegister,
          selector: {...this.selector, dateRange: this.dateRange},
          filter: this.filter,
          options: {
            limit: this.currentPageSize,
            skip: this.skip
          }
        }, (err, result) => {
          if (!err) {
            this.vehicleRegisterData = result.content;
            this.total = result.count;
          } else {
            Msg.error(err.message);
          }
          this.isLoading = false;
        });
      },
      handleSizeChange(val) {
        this.currentPageSize = val;
        this.currentPage1 = (val + this.skip) / val;
        this.isLoading = true;
        this.findVehicleRegister();
      },
      handleCurrentChange(val) {
        this.skip = (this.currentPageSize * val) - this.currentPageSize;
        this.isLoading = true;
        this.findVehicleRegister();
      },
      dateFormatter(date) {
        return !!date ? moment(date).format('DD/MM/YYYY') : '';
      },
      handleUpdate(row) {
        Meteor.call('vehicle_findOneRegister', {
          userId: this.currentUser._id,
          selector: {_id: row._id},
          module: this.currentModule
        }, (err, res) => {
          if (!err) {
            this.currentRow = Object.assign({}, res);
            this.vehicleRegisterUpdateVisible = true;
          } else {
            Msg.error(err.message);
          }
        });
      },
      handleRemove(index, row, rows) {
        MsgBox.confirm({
          title: 'បញ្ជាក់',
          message: `តើអ្នកចង់លុប លេខយានយន្ត ${row.plateNumber}?`,
          callback: () => {
            this.removeVehicleRegister(index, row, rows);
          }
        });
      },
      handleShow(row) {
        this.currentRow = row;
        this.vehicleRegisterShowVisible = true;
      },
      removeVehicleRegister(index, row, rows) {
        //meteor method
        Meteor.call('vehicle_removeRegister', {
          userId: this.currentUser._id,
          module: this.currentModule,
          selector: {_id: row._id}
        }, (err, result) => {
          if (!err) {
            Msg.success(`លុប ${row.plateNumber} បានជោគជ័យ`)
          } else {
            Msg.error(err.message);
          }
        })
      },
      downloadTemplate() {
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = '/template/vehicle_registration_template.xlsx';
        a.click();
        document.body.removeChild(a);
      },
    },
    created() {
      this.findVehicleRegister();
    },
    meteor: {
      $subscribe: {
        'vehicle_registerHelper': []
      },
      helper() {
        if (Meteor.userId()) {
          Vehicle_RegisterHelper.find({}).fetch();
          this.findVehicleRegister();
        }
      }
    },
  };

</script>
<style lang="scss" scoped>
</style>