import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import contactUsBg from "../../assets/contactUs.png";
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import "./ContactUs.scss";

function ContactUsHeader() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="contact-header-wrapper">
      <div 
        className="contact-banner"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${contactUsBg})` 
        }}
      >
        <Container>
          <div className="banner-content text-center">
            <h1 className="display-4 fw-bold text-white mb-4">Service Hub </h1>
            <p className="lead text-white mb-0">
              Have questions or need assistance? We're here to help! Reach out to us for business inquiries, 
              service requests, or any other information you need.
            </p>
          </div>
        </Container>
      </div>
      
      {/* This is a separate section for contact information */}
      <div className="contact-info-section py-4">
        <Container>
          <Row className="justify-content-center">
            <Col lg={4} md={4} sm={12} className="contact-info-col mb-3 mb-md-0">
              <div className="contact-info-item d-flex align-items-center">
                <div className="icon-wrapper">
                  <FaPhoneAlt className="contact-icon" />
                </div>
                <div className="info-content">
                  <h5 className="mb-1">+1 (438) 773-8232</h5>
                  <p className="text-muted small mb-0">Monday to Saturday, 8am-8pm EDT</p>
                </div>
              </div>
            </Col>
            
            <Col lg={4} md={4} sm={12} className="contact-info-col mb-3 mb-md-0">
              <div className="contact-info-item d-flex align-items-center">
                <div className="icon-wrapper">
                  <MdEmail className="contact-icon" />
                </div>
                <div className="info-content">
                  <h5 className="mb-1">info@montrealhaven.com</h5>
                  <p className="text-muted small mb-0">We'll respond within 24 hours</p>
                </div>
              </div>
            </Col>
            
            <Col lg={4} md={4} sm={12} className="contact-info-col">
              <div className="contact-info-item d-flex align-items-center">
                <div className="icon-wrapper">
                  <FaMapMarkerAlt className="contact-icon" />
                </div>
                <div className="info-content">
                  <h5 className="mb-1">Montreal Metropolitan Area</h5>
                  <p className="text-muted small mb-0">Greater Montreal, Quebec</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default ContactUsHeader;
