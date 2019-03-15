import {requiredUserFn} from "./permission";
import VehicleRegister from '../../imports/ui/pages/VRB/VehicleRegister/VehicleRegister';
import VehicleRegisterReport from '../../imports/ui/reports/VRB/VehicleRegister';

export const vehicleRegister = [
  {
    path: "/vehicle_register",
    name: "vehicle_register",
    component: VehicleRegister,
    meta: {
      pageTitle: "ចុះលេខយានយន្ត",
      breadcrumb: {
        title: "ចុះលេខយានយន្ត",
        parent: "app_home"
      }
    },
    beforeEnter: requiredUserFn,
  },
];

export const vehicleRegisterReport = [
  {
    path: "/vehicle_registerReport",
    name: "vehicle_registerReport",
    component: VehicleRegisterReport,
    meta: {
      pageTitle: "សៀវភៅចុះលេខយានយន្ត",
      breadcrumb: {
        title: "សៀវភៅចុះលេខយានយន្ត",
        parent: "app_home"
      }
    },
    beforeEnter: requiredUserFn,
  },
];