import {Message} from 'element-ui';

const duration = 4000;
const center = true;
const showClose = false;

const Msg = {
  success(message = 'ជោគជ័យ') {
    Message({
      type: 'success',
      showClose,
      center,
      duration,
      message,
    });
  },
  warning(message = 'ប្រយ័ត្ន') {
    Message({
      type: 'warning',
      showClose,
      center,
      duration,
      message,
    });
  },
  info(message = 'បន្លឺ') {
    Message({
      type: 'info',
      showClose,
      center,
      duration,
      message,
    });
  },
  error(message = 'បរាជ័យ') {
    Message({
      type: 'error',
      showClose,
      center,
      duration,
      message,
    });
  }
};

export default Msg;