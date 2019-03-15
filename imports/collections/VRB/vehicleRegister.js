import SimpleSchema from 'simpl-schema';
import moment from 'moment';

export const Vehicle_Register = new Mongo.Collection('vehicle_register');

Vehicle_Register.schema = new SimpleSchema({
  city: String,
  type: String,
  plateNumber: {
    type: String,
    unique: true,
  },
  model: String,
  color: String,
  power: String,
  machineNumber: String,
  bodyNumber: String,
  shockCode: {
    type: String,
    optional: true
  },
  manufactureYear: {type: String, optional: true},
  thighNumber: String,
  cylinderNumber: String,
  cylinderSize: {type: String, optional: true},
  taxNumber: {type: String, optional: true},
  ownerKhName: String,
  ownerEnName: String,
  address: String,
  firstRegisterDate: Date,
  userId: {
    type: String,
  },
  createdDate: {
    type: Date,
    optional: true
  },
  fDate: Date,
  tDate: Date,
});

Vehicle_Register.attachSchema(Vehicle_Register.schema);

//helper
export const Vehicle_RegisterHelper = new Mongo.Collection('vehicle_registerHelper');
Vehicle_RegisterHelper.schema = new SimpleSchema({
  createdAt: {
    type: Date,
    optional: true,
    autoValue() {
      if (this.isInsert) {
        return moment().toDate();
      }
    }
  },
  updatedAt: {
    type: Date,
    optional: true,
    autoValue() {
      if (this.isUpdate) {
        return moment().toDate();
      }
    }
  },
  createdUser: {
    type: String,
    optional: true,
    autoValue() {
      if (this.isInsert) {
        return Meteor.userId();
      }
    }
  },
  updatedUser: {
    type: String,
    optional: true,
    autoValue() {
      if (this.isUpdate) {
        return Meteor.userId();
      }
    }
  },
  id: {
    type: String
  }
});

Vehicle_RegisterHelper.attachSchema(Vehicle_RegisterHelper.schema);