import React, { useState } from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import ContactUsHeader from "./ContactUsHeader";
import { FormProvider, useForm } from "react-hook-form";
import InputField from "../../components/Input/Input";
import Button from "../../components/Input/Button";
import { useAddData } from "../../api/apiCalls";
import { endPoints } from "../../api/api";
import TextArea from "../../components/TextArea/TextArea";
import { useDispatch } from "react-redux";
import {
  setAlertTitle,
  setErrorAlert,
  setSuccessAlert,
} from "../../redux/reducers/patientSlice";
import { Loader2 } from 'lucide-react';
import "./ContactUs.scss";

function ContactUs() {
  const [isLoading, setIsLoading] = useState(false);
  const [inquiryType, setInquiryType] = useState("");
  
  const methods = useForm({
    defaultValues: {
      FirstName: "",
      LastName: "",
      Email: "",
      Phone: "",
      Message: "",
      InquiryType: ""
    }
  });
  
  const dispatch = useDispatch();
  const addUpdateContact = useAddData("addUpdateProduct");

  const inquiryTypes = [
    { 
      value: "product-requests", 
      label: "Product Requests",
      placeholder: "Looking for Something Special? Let Us Know!"
    },
    { 
      value: "freelance-services", 
      label: "Freelance Services",
      placeholder: "Need a Skilled Freelancer? We've Got You Covered — whether it's a Tutor, Plumber, or Landscaper!"
    },
    { 
      value: "custom-online-shops", 
      label: "Custom Online Shops",
      placeholder: "Get a custom online shop for your business!"
    },
    { 
      value: "business-websites", 
      label: "Business Websites",
      placeholder: "Get a Custom Showcasing Website for Your Business!"
    },
    { 
      value: "pos-solutions", 
      label: "POS Solutions",
      placeholder: "Get a POS (Point-of-sale terminal) for your physical store, with the lowest fees in the country!"
    },
    { 
      value: "rental-inquiries", 
      label: "Rental Inquiries",
      placeholder: "Looking for a place to stay in the city—whether as a tourist, student, or long-term resident? Let us help you find the ideal rental that fits your needs and budget!"
    },
    {
      value: "haven-spotlight", 
      label: "Haven Spotlight",
      placeholder: "Want to be featured? Become a Haven Spotlight vendor."
    },
    {
      value: "general", 
      label: "General Inquiry",
      placeholder: "Enter your message here..."
    }
  ];

  const handleInquiryTypeChange = (e) => {
    const selectedType = e.target.value;
    setInquiryType(selectedType);
    methods.setValue("InquiryType", selectedType);
    
    methods.setValue("Message", "");
  };

  const getPlaceholderForInquiryType = () => {
    const selected = inquiryTypes.find(type => type.value === inquiryType);
    return selected ? selected.placeholder : "Enter your message here...";
  };

  const handleSubmit = methods.handleSubmit(async (sendData) => {
    setIsLoading(true);
    try {
      const response = await addUpdateContact.mutateAsync({
        sendData: sendData,
        endPoint: endPoints.saveorUpdateContact,
      });
      
      if (response?.status === 200) {
        methods.reset({});
        setInquiryType("");
        dispatch(setSuccessAlert(true));
        dispatch(setAlertTitle("Message Sent Successfully"));
      } else {
        dispatch(setErrorAlert(true));
        dispatch(setAlertTitle("Something Went Wrong"));
      }
    } catch (error) {
      dispatch(setErrorAlert(true));
      dispatch(setAlertTitle("An error occurred. Please try again."));
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="contact-page">
      <ContactUsHeader />
      
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <div className="contact-form-wrapper bg-white rounded-lg shadow-sm p-4 p-md-5">
              {addUpdateContact?.isLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              ) : (
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit}>
                    <h2 className="fw-bold text-center mb-4 section-heading position-relative">
                      Send Us a Message
                      <span className="heading-underline mx-auto"></span>
                    </h2>
                    
                    <p className="text-center text-muted mb-4">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                    
                    <div className="mb-4">
                      <label className="fw-medium mb-2">How can we help you today?</label>
                      <Form.Select 
                        className="form-control mb-3 border-0 border-bottom border-primary shadow-none rounded-0"
                        value={inquiryType}
                        onChange={handleInquiryTypeChange}
                        required
                      >
                        <option value="" disabled>Select an inquiry type</option>
                        {inquiryTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    
                    <Row className="mb-4">
                      <Col md={6} className="mb-3 mb-md-0">
                        <label className="fw-medium mb-2">First Name</label>
                        <InputField
                          id="FirstName"
                          name="FirstName"
                          placeholder="Enter your first name"
                          className="form-control border-0 border-bottom border-primary shadow-none rounded-0"
                          rules={{
                            required: "First name is required",
                          }}
                        />
                      </Col>
                      <Col md={6}>
                        <label className="fw-medium mb-2">Last Name</label>
                        <InputField
                          id="LastName"
                          name="LastName"
                          placeholder="Enter your last name"
                          className="form-control border-0 border-bottom border-primary shadow-none rounded-0"
                          rules={{
                            required: "Last name is required",
                          }}
                        />
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Col md={6} className="mb-3 mb-md-0">
                        <label className="fw-medium mb-2">Email</label>
                        <InputField
                          id="Email"
                          name="Email"
                          type="email"
                          placeholder="Enter your email address"
                          className="form-control border-0 border-bottom border-primary shadow-none rounded-0"
                          rules={{
                            required: "Email is required",
                            pattern: {
                              value: /\S+@\S+\.\S+/,
                              message: "Please enter a valid email"
                            }
                          }}
                        />
                      </Col>
                      <Col md={6}>
                        <label className="fw-medium mb-2">Phone Number</label>
                        <InputField
                          id="Phone"
                          name="Phone"
                          placeholder="Enter your phone number"
                          maxLength={11}
                          className="form-control border-0 border-bottom border-primary shadow-none rounded-0"
                          rules={{
                            required: "Phone number is required",
                            pattern: {
                              value: /^\d{10,11}$/,
                              message: "Please enter a valid phone number"
                            }
                          }}
                        />
                      </Col>
                    </Row>

                    <div className="mb-4">
                      <label className="fw-medium mb-2">Your Message</label>
                      <TextArea
                        name="Message"
                        id="Message"
                        rows="5"
                        maxLength={500}
                        placeholder={getPlaceholderForInquiryType()}
                        className="form-control border-primary rounded"
                        rules={{
                          required: "Message is required"
                        }}
                      />
                      <div className="text-end text-muted small mt-1">
                        {methods.watch("Message")?.length || 0}/500 characters
                      </div>
                    </div>

                    <div className="text-center mt-4">
                      {/* <Button
                        text={isLoading ? "Sending..." : "Submit Inquiry"}
                        onClick={handleSubmit}
                        isLoading={isLoading}
                        id="submit-button"
                        disabled={isLoading || addUpdateContact?.isLoading}
                      /> */}
                      <button onClick={handleSubmit} isLoading={isLoading} id="submit-button" disabled={isLoading || addUpdateContact?.isLoading}>
                      {isLoading ? "Sending..." : "Submit Inquiry"}
                      </button>
                    </div>
                  </form>
                </FormProvider>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ContactUs;