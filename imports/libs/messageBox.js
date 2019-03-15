import {MessageBox} from 'element-ui';

const MsgBox = {
  confirm({message = "message", title = "title", type = "warning", callback, confirmButtonClass = 'el-button--danger'}) {
    MessageBox.confirm(message, title, {type, confirmButtonClass}).then(() => {
      callback();
    }).catch(() => null);
  },
};

export default MsgBox;