import axios from 'axios';


export function uploadFile(inputFile: File, callback: Function, onError: Function) {
  var formData = new FormData();
  const file = Object.assign(inputFile);
  formData.append('file', file);

  return axios.post(
    process.env.REACT_APP_BACKEND_HOST + '/fileUpload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      }
  ).then(res => {
    callback(res);
  }).catch(error => {
    onError(error);
  });
}
