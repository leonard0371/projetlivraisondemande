import { createSlice } from "@reduxjs/toolkit";

function formatDate(date) {
  var d = new window.Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
const initialState = {
  value: {},
  categoryValue: '',
  roleValue: '',
  productDetail: {
  },
  userData:{},
  alertTitle: false,
  successAlert: false,
  errorAlert: false,
  isAuthenticated:false
};

export const patientSlice = createSlice({
  name: "patientData",
  initialState,
  reducers: {
    savePatientData: (state, actions) => {
      state.value = actions.payload;
    },
    saveProductDetail: (state, actions) => {
      state.productDetail = actions.payload;
    },
    setAlertTitle: (state, actions) => {
      state.alertTitle = actions.payload;
    },
    setSuccessAlert: (state, actions) => {
      state.successAlert = actions.payload;
    },
    setErrorAlert: (state, actions) => {
      state.errorAlert = actions.payload;
    },
    setIsAuthenticated: (state, actions) => {
      state.isAuthenticated = actions.payload;
    },
    saveCategoryValue: (state, actions) => {
      state.categoryValue = actions.payload;
    },
    saveRoleValue: (state, actions) => {
      state.categoryValue = actions.payload;
    },
    saveUserData: (state, action) => {
      state.userData = action.payload;
    },
  },

  // reviewFormNarrative:[],
  // :[],
  // assePlanNarrative:[],
  // physicalExamNarrative:[],
});

export const {
  savePatientData,
  saveProductDetail,
  setAlertTitle,
  setSuccessAlert,
  setErrorAlert,
  saveCategoryValue,
  setIsAuthenticated,
  saveUserData,
  saveRoleValue
} = patientSlice.actions;

export default patientSlice.reducer;
