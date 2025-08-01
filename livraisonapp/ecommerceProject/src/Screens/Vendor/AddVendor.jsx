import React, { useState } from "react";
import InputField from "../../components/Input/Input";
import { Col, Container, Row } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import "./Vendor.scss";
import Button from "../../components/Input/Button";
import { useAddData } from "../../api/apiCalls";
import { endPoints } from "../../api/api";
import { useNavigate } from "react-router-dom";
import AddVendorComponent from "./AddVendor.component";
import { useVendor } from "../../api/VendorContext";
import ReactLoading from 'react-loading';
import { useDispatch } from "react-redux";
import { setUserDtails } from "../../redux/reducers/userSlice";
import { setAlertTitle, setErrorAlert, setSuccessAlert } from "../../redux/reducers/patientSlice";

function AddVendor() {
  const methods = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [formDisable, setFormDisable] = useState(false)
  const { setVendorId } = useVendor();
  const addUpdateVendor = useAddData("addUpdateVendor");

  const handleSubmit = methods.handleSubmit(async (sendData) => {
    setFormDisable(true);
    sendData.role = "vendor";
    sendData.IsActive = null;
    setIsLoading(true)
    const response = await addUpdateVendor.mutateAsync({
      sendData: sendData,
      endPoint: endPoints.saveorUpdateVendor,
    });
    if (response?.status === 200) {
      setFormDisable(false);
      // console.log(response?.data._id,'saasdasdasd')
      dispatch(setUserDtails(response?.data?._id));
      // localStorage.setItem("vendorID", response?.data?._id)
      // setVendorId(response?.data?._id);
      navigate("/login");
      setIsLoading(false)
      dispatch(setSuccessAlert(true));
      dispatch(setAlertTitle("Vendor Added Successfully"));
    } else {
      setFormDisable(false);
      setIsLoading(false)
      dispatch(setErrorAlert(true));
      dispatch(setAlertTitle(response?.response?.data?.error));
      // dispatch(setErrorAlert(true));
      // dispatch(setAlertTitle("Something Went Wrong"));
    }
  });
  //disabled={isLoading}
  return (
    <>
      <Container fluid className="vendor-container mt-4 mb-4" style={{ backgroundColor: "white" }}>
        <div style={{ backgroundColor: "white" }}>
          <FormProvider {...methods}>
          <fieldset disabled={formDisable}>
            <h2 className="mt-2 mb-2">Become a Vendor</h2>
              <AddVendorComponent />
            <Row className="mt-4">
              <Button text={"Register"} onClick={handleSubmit} isLoading={isLoading}/> 
            </Row>
            </fieldset>
          </FormProvider>
        </div>
      </Container>
    </>
  );
}

export default AddVendor;
