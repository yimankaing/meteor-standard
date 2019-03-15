export const addPrefix = ({str, prefix, separator = ""}) => {
  if (!!str) {
    return prefix + separator + str + "";
  }
  return '';
};