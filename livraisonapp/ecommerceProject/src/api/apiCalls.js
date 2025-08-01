import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { store } from "../redux/store";
import { setAlertTitle, setErrorAlert } from "../redux/reducers/patientSlice";
import config from "../config";

const API_URL = import.meta.env.VITE_APP_API_URL
console.log('API_URL ', API_URL)
export const defaultAPi = axios.create({
  // baseURL: 'https://2051-103-217-176-141.ngrok-free.app',
  baseURL: API_URL
});
let axiosConfig = {
  headers: {
    "Content-Type": "multipart/form-data;",
  },
};
export const postData = async ({ sendData, endPoint, api = defaultAPi }) => {

  try {
    const data = await api.post(`${endPoint}`, sendData);

    return data;
  } catch (err) {
    // // console.log(err, 'fadsaffa')
    if (err?.response?.status === 500) {
      // alert('hehhe')
      store.dispatch(setErrorAlert(true))
      store.dispatch(setAlertTitle(err?.response?.data?.error))
    }
    if (err?.response?.status === 401) {
      // alert('hehhe')
      store.dispatch(setErrorAlert(true))
      store.dispatch(setAlertTitle(err?.response?.data?.error))
    }
    return err;
  }
};

export const useAddData = (key) => {
  return useMutation(key, postData);
};
export const getAllData = async (endPoint, api = defaultAPi) => {
  try {
    const response = await api.get(`${endPoint}`);
    return response.data;

  } catch (error) {
    if (error?.code === 'ERR_NETWORK') {
      store.dispatch(setErrorAlert(true))
      store.dispatch(setAlertTitle(error?.message))

    } else if (error?.response?.status === 401) {
      store.dispatch(setErrorAlert(true))
      store.dispatch(setAlertTitle('Unauthorized'))
      store.dispatch(setUnAuthorizeModal(true))
    } else {
      return [];
    }
  }
};
export const useGetAllData = (key, endPoint, isEnabled = true, api = defaultAPi) => {
  return useQuery(key, () => getAllData(endPoint, api), {
    cacheTime: 3600,
    refetchOnWindowFocus: false,
    enabled: isEnabled,
  });
};
export const useGetByMultiParams = (multiParams, key, endPoint, isEnabled = true, api = defaultAPi) => {
  // const { loggedInUserInfo } =
  //   useContext(UserContext);

  return useQuery(key, () => getByMultiParams(multiParams, endPoint, api), {
    cacheTime: 3600,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: isEnabled,
  });
};
export const deleteData = async (multiParams, endPoint, api) => {
  var params = '';
  multiParams.forEach((param, index) => {
    if (index === 0) {
      params += `?${param.paramName}=${param.paramValue}`;
    } else {
      params += `&${param.paramName}=${param.paramValue}`;
    }
  })
  try {
    const response = await api.delete(`${endPoint}${params}`);
    return response;
  } catch (err) {
    if (err?.code === 'ERR_NETWORK') {
      // store.dispatch(setErrorAlert(true))
      // store.dispatch(setAlertTitle(err?.message))

    } else {
      if (err?.response?.status === 401) {
        // store.dispatch(setErrorAlert(true))
        // store.dispatch(setAlertTitle('Unauthorized'))
        // store.dispatch(setUnAuthorizeModal(true))
      } else if (err?.response?.status === 400) {
        // store.dispatch(setErrorAlert(true))
        // store.dispatch(setAlertTitle('Something Went Wrong'))
      } else if (err?.response?.status === 405) {
        // store.dispatch(setErrorAlert(true))
        // store.dispatch(setAlertTitle(err.message))
      } else if (err?.code === 'ERR_NETWORK') {
        // store.dispatch(setErrorAlert(true))
        // store.dispatch(setAlertTitle(err?.message))
      } else {
        // store.dispatch(setErrorAlert(true))
        // store.dispatch(setAlertTitle(err?.response?.data?.error_description))
      }

      return err;
    }
  }
};
export const getData = async (id, endPoint, api) => {
  try {
    const response = await api.get(`${endPoint}${id}`);
    return response.data;
  } catch (error) {
    if (error?.code === 'ERR_NETWORK') {
      store.dispatch(setErrorAlert(true))
      store.dispatch(setAlertTitle(error?.message))

    } else if (error?.response?.status === 401) {
      store.dispatch(setErrorAlert(true))
      store.dispatch(setAlertTitle('Unauthorized'))
      store.dispatch(setUnAuthorizeModal(true))
    } else {
      return [];
    }

  }
};
export const useGetDataByID = (id, key, endPoint, isEnabled = true, api = defaultAPi) => {
  return useQuery(key, () => getData(id, endPoint, api), {
    cacheTime: 3600,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: isEnabled,
  });
};
export const useDeleteData = (multiParams, key, endPoint, isEnabled = true, api = defaultAPi) => {
  return useQuery(key, () => deleteData(multiParams, endPoint, api), {
    cacheTime: 3600,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: isEnabled,
  });
};

export const fileUpload = async ({ file, endPoint, api = defaultAPi }) => {
  try {
    const data = await api.post(`${endPoint}`, { file }, axiosConfig);
    return data;
  } catch (err) {
    if (err?.response?.status === 401) {
      // store.dispatch(setErrorAlert(true))
      // store.dispatch(setAlertTitle('Unauthorized'))
      // store.dispatch(setUnAuthorizeModal(true))
    }
    // else if(err?.response?.status===500){
    //   store.dispatch(setErrorAlert(true))
    //   store.dispatch(setAlertTitle('Exception Occured'))
    // }
    else if (err?.response?.status === 400) {
      // store.dispatch(setErrorAlert(true))
      // store.dispatch(setAlertTitle('Something Went Wrong'))
    } else if (err?.code === 'ERR_NETWORK') {
      // store.dispatch(setErrorAlert(true))
      // store.dispatch(setAlertTitle(err?.message))

    }
    else {
      // store.dispatch(setErrorAlert(true))
      // store.dispatch(setAlertTitle(err?.response?.data?.error_description))
    }

    return err;
  }
};

export const useFileUploadData = (key) => {
  return useMutation(key, fileUpload);
};

export const patchData = async ({ sendData, endPoint, api = defaultAPi }) => {
  try {
    const { data } = await api.patch(`${endPoint}`, sendData);
    return data;
  } catch (err) {
    if (err?.response?.status === 500) {
      store.dispatch(setErrorAlert(true));
      store.dispatch(setAlertTitle(err?.response?.data?.error));
    }
    if (err?.response?.status === 401) {
      store.dispatch(setErrorAlert(true));
      store.dispatch(setAlertTitle(err?.response?.data?.error));
    }
    return err;
  }
};

export const usePatchData = (key) => {
  return useMutation(key, patchData);
};