import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.scss';

const Footer = () => {
  const getToKnowUs = [
    { text: 'Careers', link: '#' },
    { text: 'Blogs', link: '#' },
    { text: 'About us', link: '#' }
  ];

  const makeMoneyWithUs = [
    { text: 'Sell products', link: '#' },
    { text: 'Become a Vendor', link: '#' },
    { text: 'Advertise your products', link: '#' }
  ];

  const paymentsAndShipping = [
    { text: 'Balance Account', link: '#' },
    { text: 'Shop with points', link: '#' },
    { text: 'Balance recharge', link: '#' },
    { text: 'Shipping Rates', link: '#' },
    { text: 'Returns & Replacements', link: '#' }
  ];

  const helpInfo = {
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    phone: 'XX-XXX-XXXX'
  };

  return (
    <div className="footer">
      <Container>
        <Row>
          <Col md={3} className="footer-column">
            <h5>Get to Know Us</h5>
            <ul>
              {getToKnowUs.map((item, index) => (
                <li key={index}>
                  <a href={item.link}>{item.text}</a>
                </li>
              ))}
            </ul>
          </Col>
          <Col md={3} className="footer-column">
            <h5>Make Money with Us</h5>
            <ul>
              {makeMoneyWithUs.map((item, index) => (
                <li key={index}>
                  <a href={item.link}>{item.text}</a>
                </li>
              ))}
            </ul>
          </Col>
          <Col md={3} className="footer-column">
            <h5>Payments and Shipping</h5>
            <ul>
              {paymentsAndShipping.map((item, index) => (
                <li key={index}>
                  <a href={item.link}>{item.text}</a>
                </li>
              ))}
            </ul>
          </Col>
          <Col md={3} className="footer-column">
            <h5>Let Us Help You</h5>
            <address>
              <p>{helpInfo.address}</p>
              <p>Call us: {helpInfo.phone}</p>
            </address>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Footer;
