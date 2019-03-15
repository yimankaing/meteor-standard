<template>
    <div v-loading.fullscreen.lock="isUploading">
        <el-alert
                title="មុននឹងដាក់ឯកសារ សូមទាញយកគំរូជាមុនសិន"
                type="warning"
                center
                :closable="false"
                style="margin-bottom: 15px"
                show-icon>
        </el-alert>
        <el-upload
                drag
                action="#"
                :on-change="(file, fileList)=>onUploadChange(file, fileList)"
                :file-list="fileList"
                :auto-upload="false"
        >
            <i class="el-icon-upload"></i>
            <div class="el-upload__tip" slot="tip">ទទួលតែប្រភេទឯកសារ xlsx/xls/csv (ចំនួន១)</div>
            <div class="el-upload__text">ទំលាក់ឯកសារ ឬ <em>ដាក់ឯកសារ</em></div>
        </el-upload>
        <el-button style="margin-top: 10px;" type="success" size="small" icon="el-icon-upload2"
                   @click="submitUpload">
            បញ្ជូន
        </el-button>
    </div>
</template>

<script>
  import XLSX from 'xlsx';
  import Msg from '../../../../libs/message';

  export default {
    name: "VehicleRegisterUploader",
    data() {
      return {
        currentUser: this.$store.state.auth.user,
        currentModule: this.$store.state.module.currentModule,
        fileList: [],
        isUploading: false
      }
    },
    methods: {
      handleRemove() {
        this.fileList = [];
      },
      submitUpload() {
        this.isUploading = true;
        const {fileList} = this;
        this.fileExist(fileList, () => this.readDataFromFile({
            file: fileList[0].raw,
            onFileRead: (docs) => this.uploadData('vehicle_uploadRegister', docs)
          })
        );
      },
      uploadData(methodName, docs) {
        Meteor.call(methodName, {userId: this.currentUser._id, docs: docs, module: this.currentModule}, (err, res) => {
          if (!err) {
            Msg.success('បញ្ជូនរួចរាល់');
            this.isUploading = false;
            this.handleRemove();
          } else {
            Msg.error(err.message);
            this.isUploading = false;
          }
        });
      },
      fixdata(data) {
        let o = "",
          l = 0,
          w = 10240;
        for (l; l < data.byteLength / w; ++l)
          o += String.fromCharCode.apply(
            null,
            new Uint8Array(data.slice(l * w, l * w + w))
          );
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
      },
      readDataFromFile({file, onFileRead}) {
        let reader = new FileReader();
        reader.onload = (val) => {
          let results,
            data = val.target.result,
            fixedData = this.fixdata(data),
            workbook = XLSX.read(btoa(fixedData), {type: "base64"}),
            firstSheetName = workbook.SheetNames[0],
            worksheet = workbook.Sheets[firstSheetName];
          results = XLSX.utils.sheet_to_json(worksheet);
          onFileRead(results);
        };
        reader.readAsArrayBuffer(file);
      },
      fileExist(files, callback) {
        if (files.length > 0) {
          callback()
        } else {
          Msg.error('សូមដាក់ឯកសារ');
          this.isUploading = false;
        }
      },
      onUploadChange(file, fileList) {
        const matchExtension = file.name.match(/xlsx|xls|csv/g);
        if (!matchExtension) {
          Msg.error("ប្រភេទឯកសារត្រូវតែជា xlsx, xls ឬ csv");
          this.fileList = [];
        } else {
          if (fileList.length > 0) {
            this.fileList = fileList.slice(-1);
          } else {
            this.fileList = fileList;
          }
          this.submitUpload();
        }
      },
      get_header_row(sheet) {
        let headers = [], range = XLSX.utils.decode_range(sheet["!ref"]);
        let C, R = range.s.r;
        /* start in the first row */
        for (C = range.s.c; C <= range.e.c; ++C) {
          /* walk every column in the range */
          let cell = sheet[XLSX.utils.encode_cell({c: C, r: R})];
          /* find the cell in the first row */
          let hdr = "UNKNOWN " + C; // <-- replace with your desired default
          if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
          headers.push(hdr);
        }
        return headers;
      },
      workbook_to_json(workbook) {
        let result = {};
        workbook.SheetNames.forEach(function (sheetName) {
          let roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          if (roa.length > 0) {
            result[sheetName] = roa;
          }
        });
        return result;
      },
    }
  }
</script>

<style scoped>

</style>