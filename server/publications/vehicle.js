import {Vehicle_RegisterHelper} from "../../imports/collections/VRB/vehicleRegister";

Meteor.publish('vehicle_registerHelper', function () {
  if (this.userId) {
    return Vehicle_RegisterHelper.find({});
  }
  return this.ready();
});
