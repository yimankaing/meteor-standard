const roleLbl = {
  admin: 'គ្រប់គ្រង',
  report: 'របាយការណ៍',
  read: 'អាន',
  create: 'កត់ត្រា',
  update: 'កែប្រែ',
  delete: 'លុប',
  setting: 'ការកំណត់',
};
const roles = [
  {label: roleLbl.admin, value: 'admin'},
  {label: roleLbl.report, value: 'report'},
  {label: roleLbl.read, value: 'read'},
  {label: roleLbl.create, value: 'create'},
  {label: roleLbl.update, value: 'update'},
  {label: roleLbl.delete, value: 'delete'},
  {label: roleLbl.setting, value: 'setting'},
];

export const toKhRole = (enRole) => {
  return !!roleLbl[enRole] ? roleLbl[enRole] : enRole === 'super' ? 'super' : 'n/a';
};

const moduleLbl = {
  VehicleRegisterBook: 'សៀវភៅចុះលេខយានយន្ត'
};
export const toKhModule = (enModule) => {
  return !!moduleLbl[enModule] ? moduleLbl[enModule] : 'n/a';
};

const Constants = {
  lang: [{label: "EN", value: "en"}, {label: "KH", value: "kh"}],
  status: [
    {label: "Active", value: "active"},
    {label: "Inactive", value: "inactive"},
  ],
  currency: [
    {label: "KHR", value: "KHR"},
    {label: "USD", value: "USD"},
    {label: "THB", value: "THB"}
  ],
  gender: [
    {label: "Male", value: "male"},
    {label: "Female", value: "female"}
  ],
  rolesOptions: {
    VehicleRegisterBook: roles,
  },
  modulesOptions: [
    {label: moduleLbl.VehicleRegisterBook, value: 'VehicleRegisterBook'}
  ]
};

export default Constants;
