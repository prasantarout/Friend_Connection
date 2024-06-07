import axios from 'axios';
import constants from './constants';

export async function getApi(url, header) {
  // console.log("GetApi: ", `${constants.BASE_URL}/${url}`);
  console.log('GetApi: ', url);

  return await axios.get(`${constants.BASE_URL}/${url}`, {
    headers: {
      Accept: header.Accept,
      'Content-type': header.contenttype,
      'x-access-token': header.accesstoken,
      // Authorization: 'Bearer' + ' ' + header.accesstoken,
    },
  });
}

export async function getApiWithParam(url, param, header) {
  // console.log("getApiWithParam: ", `${constants.BASE_URL}/${url}`);
  // console.log('getApiWithParam: ', url);

  return await axios({
    method: 'GET',
    baseURL: constants.BASE_URL,
    url: url,
    params: param,
    headers: {
      Accept: header.Accept,
      'Content-type': header.contenttype,
    },
  });
}

export async function postApi(url, payload, header) {
  // console.log('PostApi: ', `${constants.BASE_URL}/${url}`);
  // console.log("PostApi: ", url);

  return await axios.post(`${constants.BASE_URL}/${url}`, payload, {
    headers: {
      Accept: header.Accept,
      'Content-Type': header.contenttype,
      'x-access-token': header.accesstoken,
      // Authorization: 'Bearer' + ' ' + header.accesstoken,
    },
  });
}

export async function deleteApi(url, payload, header) {
  // console.log("DeleteApi: ", `${constants.BASE_URL}/${url}`);
  // console.log('DeleteApi: ', url);

  return await axios.delete(`${constants.BASE_URL}/${url}`, {
    headers: {
      Accept: header.Accept,
      'Content-type': header.contenttype,
      'x-access-token': header.accesstoken,
      // Authorization: 'Bearer' + ' ' + header.accesstoken,
    },
    data: payload,
  });
}

export async function putApi(url, payload, header) {
  // console.log("PutApi: ", `${constants.BASE_URL}/${url}`);
  // console.log('PutApi: ', url);

  // let data={
  //   method: "PUT",
  //   url:`${constants.BASE_URL}/${url}`,
  //   headers:{
  //     'Accept': header.Accept,
  //     'x-access-token':header.accesstoken,
  //     "Content-Type": header.contenttype,
  //       },
  //   data:payload
  // }

  // return axios.request(data)

  return await axios.put(`${constants.BASE_URL}/${url}`, payload, {
    headers: {
      Accept: header.Accept,
      'Content-Type': header.contenttype,
      'x-access-token': header.accesstoken,
      // Authorization: 'Bearer' + ' ' + header.accesstoken,
    },
  });
  // return await fetch(`${constants.BASE_URL}/${url}`,{
  //   method:'PUT',
  //   body:payload,
  //   headers:{
  //     "Content-type": "application/json",
  //   }
  // })
}




// utils/api.js
// import apiService from './apiService';

// export async function getApi(url, header) {
//   console.log('GetApi: ', url);
//   return await apiService.get(url, {
//     headers: {
//       Accept: header.Accept,
//       'Content-type': header.contenttype,
//     },
//   });
// }

// export async function getApiWithParam(url, param, header) {
//   console.log('getApiWithParam: ', url);
//   return await apiService.get(url, {
//     params: param,
//     headers: {
//       Accept: header.Accept,
//       'Content-type': header.contenttype,
//     },
//   });
// }

// export async function postApi(url, payload, header) {
//   console.log('PostApi: ', url);
//   return await apiService.post(url, payload, {
//     headers: {
//       Accept: header.Accept,
//       'Content-Type': header.contenttype,
//     },
//   });
// }

// export async function deleteApi(url, payload, header) {
//   console.log('DeleteApi: ', url);
//   return await apiService.delete(url, {
//     headers: {
//       Accept: header.Accept,
//       'Content-type': header.contenttype,
//     },
//     data: payload,
//   });
// }

// export async function putApi(url, payload, header) {
//   console.log('PutApi: ', url);
//   return await apiService.put(url, payload, {
//     headers: {
//       Accept: header.Accept,
//       'Content-Type': header.contenttype,
//     },
//   });
// }





