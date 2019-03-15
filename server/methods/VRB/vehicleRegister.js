import {Meteor} from 'meteor/meteor';
import _ from 'lodash';
import moment from 'moment';
import ValidateUser from '../../../imports/libs/validate-user';
import {CheckRoles} from "../../../imports/libs/checkRoles";
import {collectionHelper} from "../../../imports/libs/collectionHelper";
import {Vehicle_Register, Vehicle_RegisterHelper} from "../../../imports/collections/VRB/vehicleRegister";

Meteor.methods({
  vehicle_findRegister({userId, q = "", selector = {}, filter = "", options = {limit: 10, skip: 0}, module}) {
    ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to query vehicleRegister'});
    let roles = CheckRoles({userId, roles: ["super", "admin", "read"], module});
    if (!roles) {
      throw new Meteor.Error('អ្នកពុំមានសិទ្ធិទេ! សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង');
    }

    //sort
    let sort = {gId: -1};
    if (!!selector.sort && selector.sort.length > 0) {
      sort = {[selector.sort[1]]: selector.sort[0] === 'descending' ? -1 : 1}
    }

    let text = '';
    if (!!q) {
      text = q.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
    let reg = new RegExp(text, 'i');

    let data = {
      content: [],
      count: 0,
    };

    let qSelector = {};
    //date range
    if (!!selector.dateRange) {
      const fDate = moment(selector.dateRange[0]).startOf('day').toDate();
      const tDate = moment(selector.dateRange[1]).endOf('day').toDate();

      qSelector['fDate'] = {$gte: fDate, $lte: tDate};
      qSelector['tDate'] = {$gte: fDate, $lte: tDate};
    }

    //filtering
    if (!!filter) {
      qSelector[filter] = {$regex: reg};
    } else {
      qSelector.$or = [
        {city: {$regex: reg}},
        {type: {$regex: reg}},
        {plateNumber: {$regex: reg}},
        {model: {$regex: reg}},
        {color: {$regex: reg}},
        {power: {$regex: reg}},
        {machineNumber: {$regex: reg}},
        {bodyNumber: {$regex: reg}},
        {shockCode: {$regex: reg}},
        {manufactureYear: {$regex: reg}},
        {thighNumber: {$regex: reg}},
        {cylinderNumber: {$regex: reg}},
        {cylinderSize: {$regex: reg}},
        {taxNumber: {$regex: reg}},
        {ownerKhName: {$regex: reg}},
        {ownerEnName: {$regex: reg}},
        {address: {$regex: reg}},
        {firstRegisterDateStr: {$regex: reg}},
      ];
    }

    const $project = {
      _id: 1,
      city: 1,
      type: 1,
      plateNumber: 1,
      model: 1,
      color: 1,
      power: 1,
      machineNumber: 1,
      bodyNumber: 1,
      shockCode: 1,
      manufactureYear: 1,
      thighNumber: 1,
      cylinderNumber: 1,
      cylinderSize: 1,
      taxNumber: 1,
      ownerKhName: 1,
      ownerEnName: 1,
      address: 1,
      firstRegisterDate: 1,
      firstRegisterDateStr: {$dateToString: {format: '%d/%m/%Y', date: "$firstRegisterDate", timezone: "+07:00"}},
      fDate: 1,
      tDate: 1
    };

    let vehicleRegisters = Vehicle_Register.aggregate([
      {$project},
      {$match: qSelector},
      {$sort: sort},
      {$skip: options.skip},
      {$limit: options.limit},
    ]);

    if (vehicleRegisters.length > 0) {
      data.content = vehicleRegisters;
      data.count = Vehicle_Register.aggregate([{$project}, {$match: qSelector}, {$count: 'total'}])[0].total;
    }
    return data;
  },
  vehicle_findOneRegister({userId, selector = {}, module}) {
    ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to query vehicleRegister'});
    let roles = CheckRoles({userId, roles: ["super", "admin", "read"], module});
    if (!roles) {
      throw new Meteor.Error('អ្នកពុំមានសិទ្ធិទេ! សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង');
    }

    return Vehicle_Register.findOne(selector);
  },
  vehicle_insertRegister({userId, doc = {}, module}) {
    ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to insert vehicleRegister'});
    let roles = CheckRoles({userId, roles: ["super", "admin"], module});
    if (!roles) {
      throw new Meteor.Error('អ្នកពុំមានសិទ្ធិទេ! សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង');
    }
    return Vehicle_Register.insert(doc, (err, res) => !err ? collectionHelper(Vehicle_RegisterHelper, res) : console.log(err.message));
  },
  vehicle_updateRegister({userId, selector = {}, updateDoc = {}, module}) {
    ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to update vehicleRegister'});
    let roles = CheckRoles({userId, roles: ["super", "admin"], module});
    if (!roles) {
      throw new Meteor.Error('អ្នកពុំមានសិទ្ធិទេ! សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង');
    }
    return Vehicle_Register.update(selector, {$set: updateDoc}, {}, (err, res) => !err ? collectionHelper(Vehicle_RegisterHelper, selector._id) : console.log(err.message));
  },
  vehicle_removeRegister({userId, selector, module}) {
    ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to remove vehicleRegister'});
    let roles = CheckRoles({userId, roles: ["super", "admin"], module});
    if (!roles) {
      throw new Meteor.Error('អ្នកពុំមានសិទ្ធិទេ! សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង');
    }
    return Vehicle_Register.remove(selector, (err, res) => !err ? collectionHelper(Vehicle_RegisterHelper, selector._id) : console.log(err.message));
  },
  vehicle_uploadRegister({userId, docs = {}, module}) {
    ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to insert vehicleRegister'});
    let roles = CheckRoles({userId, roles: ["super", "admin", "create"], module});
    if (!roles) {
      throw new Meteor.Error('អ្នកពុំមានសិទ្ធិទេ! សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង');
    }
    let errMsg = 'ទិន្នន័យមិនត្រឹមត្រូវ';
    //check object key exist and has value
    docs.forEach((o, i) => {
      if (
        !o.city ||
        !o.type ||
        !o.plateNumber ||
        !o.model ||
        !o.color ||
        !o.power ||
        !o.machineNumber ||
        !o.bodyNumber ||
        // shockCode||
        // !o.manufactureYear ||
        !o.thighNumber ||
        !o.cylinderNumber ||
        // !o.cylinderSize ||
        // !o.taxNumber ||
        !o.ownerKhName ||
        !o.ownerEnName ||
        !o.address ||
        !o.fDate ||
        !o.tDate ||
        !o.firstRegisterDate
      )
        throw new Meteor.Error(errMsg)
    });

    try {
      if (Array.isArray(docs)) {
        docs.map(o => {
          let dateArr = !!o.firstRegisterDate ? o.firstRegisterDate.trim().split('-') : null;
          let fDateArr = !!o.fDate ? o.fDate.trim().split('-') : null;
          let tDateArr = !!o.tDate ? o.tDate.trim().split('-') : null;
          let {
            city,
            type,
            plateNumber,
            model,
            color,
            power,
            machineNumber,
            bodyNumber,
            shockCode,
            manufactureYear,
            thighNumber,
            cylinderNumber,
            cylinderSize,
            taxNumber,
            ownerKhName,
            ownerEnName,
            address,
          } = o;
          let doc = {
            _id: !!o._id ? o._id + "" : undefined,
            city,
            type,
            plateNumber,
            model,
            color,
            power,
            machineNumber,
            bodyNumber,
            shockCode,
            manufactureYear,
            thighNumber,
            cylinderNumber,
            cylinderSize,
            taxNumber,
            ownerKhName,
            ownerEnName,
            address: address.replace('បន្ទាយមានជ័យ', ' បជ'),
            firstRegisterDate: moment(`${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`).toDate(), //YYYY-MM-DD
            fDate: moment(`${fDateArr[2]}-${fDateArr[1]}-${fDateArr[0]}`).toDate(), //YYYY-MM-DD
            tDate: moment(`${tDateArr[2]}-${tDateArr[1]}-${tDateArr[0]}`).toDate(), //YYYY-MM-DD
            userId
          };

          Vehicle_Register.insert(doc);
        });
        collectionHelper(Vehicle_RegisterHelper, docs.length + "");
        return docs.length;
      }
    }
    catch (e) {
      console.log(e);
      throw new Meteor.Error(e.message);
    }
    // throw new Meteor.Error('ទិន្នន័យមិនត្រឹមត្រូវ');
  },
});