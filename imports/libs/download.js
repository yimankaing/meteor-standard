export const download = (filename, url) => {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function (event) {
    var blob = xhr.response;
    saveData(blob, filename);
  };
  xhr.open('GET', url);
  xhr.send();
};

const saveData = (data, fileName) => {
  let a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  url = window.URL.createObjectURL(data);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
  return document.body.removeChild(a);
};
