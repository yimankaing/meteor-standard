import {Notification} from "element-ui";

const Notify = {
  success({message = "ប្រតិបត្តិការជោគជ័យ", title = "ជោគជ័យ", position= "bottom-right"} = {}) {
    Notification({
      type: "success",
      position,
      title,
      message
    });
  },
  warning({message = "Warning message", title = "ប្រយ័ត្ន", position= "bottom-right"} = {}) {
    Notification({
      type: "warning",
      position,
      title,
      message
    });
  },
  info({message = "Info message", title = "បន្លឺ", position= "bottom-right"} = {}) {
    Notification({
      type: "info",
      position,
      title,
      message
    });
  },
  error({message = "ប្រតិបត្តិការបរាជ័យ", title = "កំហុស", position= "bottom-right"} = {}) {
    Notification({
      type: "error",
      position,
      title,
      message
    });
  }
};

export default Notify;
