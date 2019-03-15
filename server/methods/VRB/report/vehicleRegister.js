import {Meteor} from 'meteor/meteor';
import _ from 'lodash';
import moment from 'moment';
import ValidateUser from '../../../../imports/libs/validate-user';
import {CheckRoles} from "../../../../imports/libs/checkRoles";
import excel from "node-excel-export";
import {xlsxStyle as styles} from "../../../../imports/libs/xlsxStyle";

import {Vehicle_Register} from "../../../../imports/collections/VRB/vehicleRegister";
import {App_setup} from '../../../../imports/collections/setup';
import {toKhNumber, toKhMonth} from "../../../../imports/libs/toKh";

Meteor.methods({
  vehicle_registerReport({userId, params = {}, module}) {
    ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to view report'});
    let roles = CheckRoles({userId, roles: ["super", "admin", "report"], module});
    if (!roles) {
      throw new Meteor.Error('អ្នកពុំមានសិទ្ធិទេ! សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង');
    }

    let rptTitle, rptHeader, rptContent, rptFooter, rptContentHtml;
    rptTitle = App_setup.findOne({});
    rptHeader = params;

    let selector = {};
    const fDate = moment(params.fDate).startOf('day').toDate();
    const tDate = moment(params.tDate).endOf('day').toDate();

    selector['fDate'] = {$gte: fDate, $lte: tDate};
    selector['tDate'] = {$gte: fDate, $lte: tDate};
    // const $project = {
    //   dateStr: {$dateToString: {format: '%d-%m-%Y', date: "$date", timezone: "+07:00"}},
    // };

    rptContent = Vehicle_Register.aggregate([
      {
        $match: selector
      },
      // {$project},
      {
        $sort: {
          plateNumber: 1,
        }
      }
    ]);

    //export to excel
    let workbook;
    let dataset = [];
    // if (rptContent.length > 0) {
    //   let columns = [
    //     {displayName: "លេខរៀង", key: "index"},
    //     {displayName: "កាលបរិច្ឆេទ", key: "date"},
    //     {displayName: "ផ្លាកលេខយានយន្ត", key: "plateNumber"},
    //     {displayName: "ម្ចាស់កម្មសិទ្ធិ", key: "ownerKhName"},
    //     {displayName: "ម៉ាក", key: "model"},
    //     {displayName: "ពណ៌", key: "color"},
    //     {displayName: "លេខម៉ាស៊ីន", key: "machineNumber"},
    //     {displayName: "លេខតួ", key: "bodyNumber"},
    //     // {displayName: "លេខសៀវភៅពន្ធ", key: "taxbook"},
    //     // {displayName: "លេខបង្កាន់ដៃពន្ធ", key: "otherStr"},
    //     {displayName: "ប្រភេទ", key: "type"},
    //     {displayName: "កំលាំងសេះ", key: "power"},
    //     {displayName: "ផ្សេងៗ", key: "other"},
    //   ];
    //
    //   let specification = {};
    //   const heading = [
    //     [{value: 'របាយការណ៍ចុះលេខយានយន្ត', style: styles.mainHeader}],
    //     [{value: reportSubtitle(params), style: styles.mainHeader}],
    //     []
    //   ];
    //   const merges = [
    //     {start: {row: 1, column: 1}, end: {row: 1, column: 7}},
    //     {start: {row: 2, column: 1}, end: {row: 2, column: 7}},
    //   ];
    //   dataset = rptContent;
    //
    //   columns.forEach(function (o) {
    //     specification[o.key] = {
    //       displayName: o.displayName,
    //       headerStyle: styles.header,
    //       cellStyle: styles.cell,
    //       width: o.key === 'index' ? 55 : 100
    //     };
    //   });
    //
    //   workbook = excel.buildExport(
    //     [
    //       {
    //         name: `របាយការណ៍ចុះលេខយានយន្ត`,
    //         heading: heading,
    //         merges: merges,
    //         specification: specification,
    //         data: dataset
    //       }
    //     ]
    //   );
    // }

    //html
    let html = `<table class="rpt-table">
                    <thead style="display: table-header-group;">
                    <tr>
                        <th>លេខរៀង</th>
                        <th>កាលបរិច្ឆេទ</th>
                        <th>ផ្លាកលេខ<br/>យានយន្ត</th>
                        <th>ម្ចាស់កម្មសិទ្ធិ</th>
                        <th>ម៉ាក</th>
                        <th>ពណ៌</th>
                        <th>លេខម៉ាស៊ីន</th>
                        <th>លេខតួ</th>
                        <th>លេខ<br/>សៀវភៅពន្ធ</th>
                        <th>លេខ<br/>បង្កាន់ដៃពន្ធ</th>
                        <th>ប្រភេទ</th>
                        <th>កំលាំងសេះ</th>
                        <th>ផ្សេងៗ</th>
                    </tr>
                    </thead>
                    <tbody>`;

    rptContent.map((o, i) => {
      html += `<tr>
                 <td width="45px" class="center middle" style="border-left: 1px solid #606266; border-left: 2px solid #606266" rowspan="3">${i + 1}</td>
                 <td width="60px" class="center middle" style="border-bottom: 1px dotted #606266; border-left: 1px solid #606266">08-01-2011</td>
                 <td width="45px" class="center middle" style="border-bottom: 1px dotted #606266; border-left: 1px solid #606266">${o.plateNumber}</td>
                 <td class="start middle" style="border-bottom: 1px dotted #606266; border-left: 1px solid #606266">${o.ownerKhName} ${o.address}</td>
                 <td width="90px" class="center middle" style="border-bottom: 1px dotted #606266; border-left: 1px solid #606266">${o.model}</td>
                 <td width="38px" class="center middle" style="border-bottom: 1px dotted #606266; border-left: 1px solid #606266">${o.color}</td>
                 <td class="center middle" style="border-bottom: 1px dotted #606266; border-left: 1px solid #606266">${o.machineNumber}</td>
                 <td width="70px" class="center middle" style="border-bottom: 1px dotted #606266; border-left: 1px solid #606266">${o.bodyNumber}</td>
                 <td width="80px" class="center middle" style="border-bottom: 1px dotted #606266; border-left: 1px solid #606266">លេខសៀវភៅពន្ធ</td>
                 <td width="80px" class="center middle" style="border-bottom: 1px dotted #606266; border-left: 1px solid #606266">លេខបង្កាន់ដៃពន្ធ</td>
                 <td width="100px" class="center middle" style="border-bottom: 1px dotted #606266; border-left: 1px solid #606266">${o.type}</td>
                 <td width="50px" class="center middle" style="border-bottom: 1px dotted #606266; border-left: 1px solid #606266">${o.power}</td>
                 <td class="center middle" style="border-bottom: 1px dotted #606266; border-left: 1px solid #606266">ផ្សេងៗផ្សេងៗៗ</td>
              </tr>`;
      html += `<tr>`;
      for (let i = 1; i <= 12; i++) {
        html += `<td style="border-left: 1px solid #606266; border-bottom: 1px dotted #606266;"></td>`;
      }
      html += `</tr>`;

      html += `<tr>`;
      for (let i = 1; i <= 12; i++) {
        html += `<td style="border-left: 1px solid #606266; border-bottom: 1px solid #606266;"></td>`;
      }
      html += `</tr>`;
    });

    html += `</tbody></table>`;

    return {rptTitle, rptHeader, rptContent, workbook, rptContentHtml: html};
  }
});

const reportSubtitle = (val) => {
  const {date: f_date, months: f_months, years: f_years} = moment(val.fDate).toObject();
  const {date: t_date, months: t_months, years: t_years} = moment(val.tDate).toObject();

  const fDate = `ថ្ងៃទី${toKhNumber(f_date + "")} ខែ${toKhMonth(f_months + 1 + "")} ឆ្នាំ${toKhNumber(f_years + "")}`;
  const tDate = `ថ្ងៃទី${toKhNumber(t_date + "")} ខែ${toKhMonth(t_months + 1 + "")} ឆ្នាំ${toKhNumber(t_years + "")}`;
  return `ពី${fDate} ដល់${tDate}`
};