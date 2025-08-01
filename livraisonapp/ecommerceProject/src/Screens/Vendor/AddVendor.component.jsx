import React from "react";
import { Col, Row } from "react-bootstrap";
import InputField from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import CheckBox from "../../components/Checkbox/Checkbox";

function AddVendorComponent({ setShowPassword, showPassword = true }) {
  return (
    <div style={{ backgroundColor: "white" }}>
      
      <Row>
        {/* <h5 className="mt-4 ms-2">Contact Details</h5> */}
        <Col sm={6} md={6} lg={6} xl={6}>
          <InputField
            id="firstName"
            name="firstName"
            placeholder="Enter First Name"
            defaultValue=""
            required={true}
          />
        </Col>
        <Col sm={6} md={6} lg={6} xl={6} className="mt-2">
          <InputField
            id="lastName"
            name="lastName"
            placeholder="Enter Last Name"
            defaultValue=""
          />
        </Col>
      </Row>
      {/* <Row>
        <InputField
          id="PhoneNo"
          name="PhoneNo"
          type="phone"
          placeholder="Enter Phone No"
          defaultValue=""
          maxLength={11}
        />
      </Row> */}
      <Row>
      <Col md={4} sm={6} lg={6}> {/* Réduction de la largeur */}
        <InputField
          id="PhoneNo"
          name="PhoneNo"
          type="phone"
          placeholder="Enter Phone No"
          defaultValue=""
          maxLength={11}
        />
      </Col>
    </Row>

      <Row>
        <h5 className="mt-4 ms-2">Company Information</h5>
        <Col md={6} sm={6} lg={6}>
          <InputField
            id="companyName"
            name="companyName"
            placeholder="Enter company name"
            defaultValue=""
          />
        </Col>
        <Col md={6} sm={6} lg={6}>
          <InputField
            id="BusinessAddress"
            name="BusinessAddress"
            placeholder="Enter Business Address"
            defaultValue=""
          />
        </Col>
      </Row>
      <Row>
        <Col md={12} sm={12} lg={12}>
          <InputField
            id="descriptionLine1"
            name="descriptionLine1"
            placeholder="Enter Description"
            defaultValue=""
            maxLength={250}
          />
        </Col>
      </Row>
      {/* <Row>
        <Col md={12} sm={12} lg={12}>
          <InputField
            id="DescriptionLine2"
            name="DescriptionLine2"
            placeholder="Enter Description"
            defaultValue=""
          />
        </Col>
      </Row> */}
      {/* <Row>
        <h5 className="mt-4 ms-2">Product Information</h5>
        <Col md={12} sm={12} lg={12}>
          <InputField
            id="productInfoLine1"
            name="productInfoLine1"
            placeholder="Enter Product Info"
            defaultValue=""
            maxLength={150}
          />
        </Col>
      </Row>
      <Row>
        <Col md={12} sm={12} lg={12}>
          <InputField
            id="productInfoLine2"
            name="productInfoLine2"
            placeholder="Enter Product Info"
            defaultValue=""
            maxLength={100}
          />
        </Col>
      </Row> */}

      <Row>
        <h5 className="mt-4 ms-2">Account Details</h5>
        <Col md={6} sm={6} lg={6}>
          <InputField
            id="email"
            name="email"
            required={true}
            type="email"
            placeholder="Enter Email"
            defaultValue=""
          />
        </Col>
        {showPassword && (
          <Col md={6} sm={6} lg={6}>
            <InputField
              id="password"
              name="password"
              required={true}
              type="password"
              placeholder="Enter Password"
              defaultValue=""
            />
          </Col>
        )}
      </Row>
    </div>
  );
}

export default AddVendorComponent;
