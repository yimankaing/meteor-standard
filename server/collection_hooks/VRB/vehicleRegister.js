import {Meteor} from 'meteor/meteor';
import 'meteor/matb33:collection-hooks';
import moment from 'moment';

import {GeneralFunction} from '../../../imports/libs/generalFunction';
// Collection
import {Vehicle_Register} from "../../../imports/collections/VRB/vehicleRegister";

Vehicle_Register.before.insert(function (userId, doc) {
  const year = moment().format('YY');
  !!doc.createdDate ? doc.createdDate = moment(doc.createdDate).toDate() : doc.createdDate = moment().toDate();
  doc.gId = GeneralFunction.generatePrefixId({
    prefix: year,
    length: 6,
    collection: Vehicle_Register,
    field: 'gId'
  });
  doc.userId = userId;
});
