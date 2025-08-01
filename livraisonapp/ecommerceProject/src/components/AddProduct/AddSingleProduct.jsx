import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import InputField from "../Input/Input";
import { FormProvider, useForm } from "react-hook-form";
import Button from "../Input/Button";
import { endPoints } from "../../api/api";
import { useAddData } from "../../api/apiCalls";
import TextArea from "../TextArea/TextArea";
import Select from "../Select/Select";

const AddSingleProduct = () => {
  const [formDisable, setFormDisable] = useState(false)
  const methods = useForm();
  const addUpdateProduct = useAddData("addUpdateProduct");
  const handleSubmit = methods.handleSubmit(async (sendData) => {
    const response = await addUpdateProduct.mutateAsync({
      sendData: sendData,
      endPoint: endPoints.saveorUpdateProducts,
    });
    if (response?.status === 200) {
      setFormDisable(true)

    } else {
      setFormDisable(true)
      // dispatch(setErrorAlert(true));
      // dispatch(setAlertTitle("Something Went Wrong"));
    }
  });
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    //console.log(event.target.files[0],"daw65da4daw56d")
    // setSelectedFile(file);
    const response = await uploadFile.mutateAsync(file);
    if (response) {
      // setDeletePicture(false);
      // setUploadedFileName(response);
      // dispatch(setNavbarPic(response));
      // dispatch(setProfilePic(!profilePicture));
    } else {
      // dispatch(setNavbarPic(""))
    }
  };

  return (
    <>
      <Container fluid className="product-form mt-4 mb-4">
      
        <FormProvider {...methods}>
          <fieldset disabled={formDisable}>
          <h4 className="mb-2">Add a Product</h4>
          
          <Row>
            <input
              id="fileUpload"
              type="file"
              name="images"
              className="file-input"
              onChange={handleFileUpload}
              accept=".png,.jpg,.jpeg"
              maxLength={4}
            />
            <Col sm={6} md={6} lg={6} xl={6}>
              <InputField
                id="name"
                name="name"
                placeholder="Enter Product Name"
                defaultValue=""
              />
            </Col>
            <Col sm={6} md={6} lg={6} xl={6}>
              <InputField
                id="price"
                name="price"
                placeholder="Enter Price of Product"
                defaultValue=""
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={12} lg={12} xl={12}>
              <TextArea
                id="description"
                rows="3"
                name="description"
                placeholder="Enter Product Description"
                maxLength={400}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={12} lg={12} xl={12}>
              <TextArea
                id="msgtextArea"
                rows="3"
                name="features"
                placeholder="Enter Product Features"
                maxLength={300}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={6} md={6} lg={6} xl={6}>
              <Select
                name={"categoryLookupID"}
                id={"categoryLookupID"}
                placeholder={"Categories"}
                label={"Catgeory"}
                required
              />
            </Col>
          </Row>

          <Row>
            <Button text={"Create"} onClick={handleSubmit} />
          </Row>
          </fieldset>
        </FormProvider>
      </Container>
    </>
  );
};

export default AddSingleProduct;
