import React from "react";
import NavBar from "../../components/Navbar/Navbar";
import { Col, Container, Row } from "react-bootstrap";
import "./About.scss";
import about1 from "../../assets/aboutus1.png";

function AboutUs({ data }) {
  // console.log(data.direction, "data.direction");
  return (
    <div>
      <Container fluid>
        {/* <NavBar /> */}
        <Row
          className="mt-4"
          style={{ marginTop: "100px", direction: `${data?.direction}` }}
        >
          <Col className="text-column" md={6} sm={6}>
            <div className="p-4">
              <h4
                className={`${
                  data?.direction === "rtl" ? "text-right" : "text-left"
                }`}
              >
                {data?.heading}
              </h4>
              <p
                className={`${
                  data?.direction === "rtl" ? "text-right" : "text-left"
                }`}
              >
                {data?.detail}
              </p>
            </div>
          </Col>
          <Col md={6} sm={6}>
            <img
              src={data?.image}
              className="image-column"
              alt="Company Overview"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AboutUs;
