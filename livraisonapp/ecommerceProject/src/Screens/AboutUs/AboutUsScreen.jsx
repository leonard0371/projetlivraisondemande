// import React from "react";
// import { Container, Row, Col, Card, Accordion } from "react-bootstrap";
// import "./About.scss";
// import aboutUs1 from "../../assets/aboutus1.png";
// import aboutUs2 from "../../assets/aboutus2.png";
// import aboutUs3 from "../../assets/aboutus3.png";
// import aboutUs4 from "../../assets/aboutus3.png";
// import { useNavigate } from 'react-router-dom';

// function AboutUsSection({ heading, detail, image, direction, bgColor = "bg-white" }) {
//   const formattedDetail = detail.includes("•") ? (
//     <>
//       {detail.split("•")[0]}
//       <ul className="mt-3">
//         {detail
//           .split("•")
//           .slice(1)
//           .map((item, index) => (
//             <li key={index} className="mb-2">{item.trim()}</li>
//           ))}
//       </ul>
//     </>
//   ) : (
//     detail
//   );

//   return (
//     <section className={`py-5 ${bgColor}`}>
//       <Container>
//         <Row className={`align-items-center ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
//           <Col lg={6} md={12} className="px-4 mb-4 mb-lg-0">
//             <div className="pe-lg-4">
//               <h2 className="fw-bold mb-4 position-relative section-heading">
//                 {heading}
//                 <span className="heading-underline"></span>
//               </h2>
//               <div className="text-muted section-text">{formattedDetail}</div>
//             </div>
//           </Col>
//           <Col lg={6} md={12} className="text-center">
//             <div className="image-wrapper">
//               <img 
//                 src={image} 
//                 alt={heading} 
//                 className="img-fluid rounded-lg section-image" 
//               />
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </section>
//   );
// }

// function ServiceCard({ icon, title, description }) {
//   return (
//     <Col lg={4} md={6} sm={12} className="mb-4">
//       <Card className="service-card h-100 border-0 shadow-sm">
//         <Card.Body className="p-4 text-center">
//           <div className="service-icon mb-3">
//             <i className={`bi ${icon} fs-1 text-primary`}></i>
//           </div>
//           <Card.Title className="fw-bold mb-3">{title}</Card.Title>
//           <Card.Text className="text-muted">{description}</Card.Text>
//         </Card.Body>
//       </Card>
//     </Col>
//   );
// }

// function CustomAccordionItem({ data, eventKey }) {
//   const formattedBody = data.body.includes("•") ? (
//     <>
//       {data.body.split("•")[0].trim()}
//       <ul className="faq-list mt-3">
//         {data.body
//           .split("•")
//           .slice(1)
//           .map((item, idx) => (
//             <li key={idx} className="mb-2">{item.trim()}</li>
//           ))}
//       </ul>
//     </>
//   ) : (
//     data.body
//   );
  
//   return (
//     <Accordion.Item eventKey={eventKey} className="mb-3 border-0 rounded shadow-sm faq-item">
//       <Accordion.Header>{data.header}</Accordion.Header>
//       <Accordion.Body>{formattedBody}</Accordion.Body>
//     </Accordion.Item>
//   );
// }

// function CompanyAssuranceSection() {
//   return (
//     <section className="py-5 bg-light">
//       <Container>
//         <Row className="justify-content-center">
//           <Col lg={8}>
//             <h3 className="fw-bold mb-4">Company Assurance</h3>
//             <p>
//               At Montreal Haven, we are committed to providing our clients with the highest level of service and assurance. In the unlikely event that a client does not receive their product, we guarantee full reimbursement, ensuring that our customers are never left without a solution.
//             </p>
//             <p>
//               Furthermore, all our listed products adhere to the highest safety standards and comply with city regulations, ensuring that every item meets the legal and regulatory requirements for quality and safety. We are also deeply focused on ethical business practices, ensuring that every product and service we offer is designed to positively impact our clients—whether in terms of well-being, style, or usefulness.
//             </p>
//             <p>
//               Our commitment to ethics drives us to provide products that not only meet the highest standards of quality but also contribute to the betterment of our customers' lives, both personally and in their communities.
//             </p>
//           </Col>
//         </Row>
//       </Container>
//     </section>
//   );
// }

// function AboutUsScreen() {
//   const navigate = useNavigate();
  
//   const sectionData = [
//     {
//       heading: "Our Mission",
//       detail:
//         "The Greater Montreal economy is increasingly dependent on monopolies that prioritize low prices and quantity over quality. This leaves small businesses, with great potential, struggling to compete. Moreover, with foreign corporations controlling the market, local businesses lose opportunities to grow, innovate, and provide consumers with higher-quality products and services.\n\nAt Montreal Haven, we believe in shifting power back to our community. We exist to create a marketplace where local businesses, vendors, and skilled freelancers can thrive and concretize their passion. By prioritizing quality over mass production and novelty over price wars, we empower entrepreneurs to showcase their craft while ensuring locals have access to top-tier goods and services.",
//       image: aboutUs1,
//       direction: "ltr",
//       bgColor: "bg-light"
//     },
//     {
//       heading: "Who We Are",
//       detail:
//         "Montreal Haven is a localized marketplace designed to empower reputable vendors and freelancers in the Montreal Metropolitan Area by providing them with a platform to reach Montrealers. We prioritize authenticity among our carefully vetted providers, ensuring a high standard of service.\n\nSince June 2024, our collective has been committed to building a thriving, quality-focused community. Centered in the Greater Montreal Area, we aim to redefine the local shopping experience by making it more seamless, localized, and customer-centric.",
//       image: aboutUs2,
//       direction: "rtl",
//       bgColor: "bg-white"
//     },
//     {
//       heading: "Our Values",
//       detail:
//         "At Montreal Haven, we stand for authenticity, originality, and top-tier quality—values that surpass a company's size or reputation. Our approach encourages innovation, ensuring that every vendor, manufacturer, or freelancer can showcase their uniqueness. By prioritizing novelty and excellence, only the best stands out—not the biggest.\n\nWe're also committed to ethical business practices, ensuring every product and service we offer is designed to positively impact our clients—whether in terms of well-being, style, or usefulness. Our commitment to ethics drives us to provide products that not only meet the highest standards of quality but also contribute to the betterment of our customers' lives.",
//       image: aboutUs4,
//       direction: "ltr",
//       bgColor: "bg-light"
//     }
//   ];

//   const serviceCards = [
//     {
//       icon: "bi-basket",
//       title: "Product Requests",
//       description: "Looking for a specific product that isn't available on our marketplace? Let us know, and we'll help you find it."
//     },
//     {
//       icon: "bi-people",
//       title: "Freelance Services",
//       description: "Access top vetted professionals for tutoring, landscaping, carpentry, web development, and more."
//     },
//     {
//       icon: "bi-shop",
//       title: "Custom Online Shops",
//       description: "Get a fully customized online store with innovative features, owned and managed by you."
//     },
//     {
//       icon: "bi-laptop",
//       title: "Business Websites",
//       description: "Need a professional showcase website for your business? We've got you covered."
//     },
//     {
//       icon: "bi-credit-card",
//       title: "POS Solutions",
//       description: "Get a POS machine for your physical store with competitive transaction fees."
//     },
//     {
//       icon: "bi-house",
//       title: "Rental Inquiries",
//       description: "If you're a tourist or tenant, we can help you find a rental that fits your needs and budget."
//     }
//   ];

//   const accordionData = [
//     {
//       header: "What do you do?",
//       body:
//         "At Montreal Haven, we're more than just a marketplace—we're a thriving hub for quality, convenience, and community. We connect trusted vendors, skilled artisans, and top freelancers with customers across Greater Montreal.\n\nBeyond shopping, we provide a range of tailored solutions for both individuals and businesses, helping you find everything from freelance expertise to customized online stores, rental opportunities, and cutting-edge POS systems.",
//     },
//     {
//       header: "How do you vet vendors and service providers?",
//       body:
//         "At Montreal Haven, we take the time to carefully vet each vendor and service provider to ensure they meet our quality standards. Our process includes:\n• Quality Assessment: We review the products and services offered to ensure they meet our expectations for reliability and excellence.\n• Verification: Vendors and service providers must provide relevant credentials, experience, and, when applicable, customer reviews or references.\n• Ongoing Monitoring: We continuously assess performance and customer feedback to maintain high standards across our marketplace.\n\nOur goal is to connect customers with trusted vendors and service providers who offer high-quality products and services.",
//     },
//     {
//       header: "What is your company assurance?",
//       body:
//         "At Montreal Haven, we are committed to providing our clients with the highest level of service and assurance. In the unlikely event that a client does not receive their product, we guarantee full reimbursement, ensuring that our customers are never left without a solution.\n\nFurthermore, all our listed products adhere to the highest safety standards and comply with city regulations, ensuring that every item meets the legal and regulatory requirements for quality and safety.",
//     },
//     {
//       header: "What is your refund policy?",
//       body:
//         "At Montreal Haven, we strive to ensure a smooth shopping experience. However, if an order is placed from outside the Montreal Metropolitan Area, the following refund policy applies:\n• Customers who place an order from outside our service area (Greater Montreal) will be eligible for a refund.\n• Transaction fees incurred during the payment process are non-refundable and will be deducted from the total refund amount.\n• Refunds will be processed using the original payment method. Processing times may vary depending on your financial institution.\n\nFor any questions or assistance, please contact our support team via our Contact Us page."
//     }
//   ];

//   return (
//     <div className="about-page">
//       <section className="hero-section text-center py-5 bg-[#0e3e75] text-white">
//         <Container>
//           <h1 className="display-4 fw-bold mb-4">About Montreal Haven</h1>
//           <p className="lead mb-0">Empowering local businesses and connecting Montrealers with high-quality products and services</p>
//         </Container>
//       </section>

//       {sectionData.map((item, index) => (
//         <AboutUsSection key={index} {...item} />
//       ))}

//       <section className="py-5 bg-light">
//         <Container>
//           <h2 className="text-center fw-bold mb-5 position-relative section-heading">
//             Our Services
//             <span className="heading-underline mx-auto"></span>
//           </h2>
//           <Row>
//             {serviceCards.map((card, index) => (
//               <ServiceCard key={index} {...card} />
//             ))}
//           </Row>
//         </Container>
//       </section>

//       <section className="py-5 bg-white">
//         <Container>
//           <h2 className="text-center fw-bold mb-5 position-relative section-heading">
//             Frequently Asked Questions
//             <span className="heading-underline mx-auto"></span>
//           </h2>
//           <Row className="justify-content-center">
//             <Col lg={8}>
//               <Accordion defaultActiveKey="0" className="faq-accordion">
//                 {accordionData.map((item, index) => (
//                   <CustomAccordionItem key={index} data={item} eventKey={index.toString()} />
//                 ))}
//               </Accordion>
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       <CompanyAssuranceSection />

//       <section className="py-5 bg-[#0e3e75] text-white text-center">
//         <Container>
//           <h3 className="mb-4">Ready to join the Montreal Haven community?</h3>
//           <p className="mb-4">Discover authentic local products and services or showcase your business to Montrealers.</p>
//           <button className="btn btn-light btn-lg px-4" onClick={() => navigate('/Products')}>Visit Marketplace</button>
//         </Container>
//       </section>
//     </div>
//   );
// }

// export default AboutUsScreen;

import React from "react";
import { Container, Row, Col, Card, Accordion } from "react-bootstrap";
import "./About.scss";
import aboutUs1 from "../../assets/aboutusflowers.jpg";
import aboutUs2 from "../../assets/aboutus2mhaven.jpg";
import aboutUs3 from "../../assets/aboutus3mhaven.jpg";
import aboutUs4 from "../../assets/aboutus3mhaven.jpg";
import { useNavigate } from 'react-router-dom';

function AboutUsSection({ heading, detail, image, direction, bgColor = "bg-white" }) {
  const formattedDetail = detail.includes("•") ? (
    <>
      {detail.split("•")[0]}
      <ul className="mt-3">
        {detail
          .split("•")
          .slice(1)
          .map((item, index) => (
            <li key={index} className="mb-2">{item.trim()}</li>
          ))}
      </ul>
    </>
  ) : (
    detail
  );

  return (
    <section className={`py-5 ${bgColor}`}>
      <Container>
        <Row className={`align-items-stretch ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
          <Col lg={6} md={12} className="d-flex flex-column justify-content-center px-4 mb-4 mb-lg-0">
            <div className="pe-lg-4">
              <h2 className="fw-bold mb-4 position-relative section-heading">
                {heading}
                <span className="heading-underline"></span>
              </h2>
              <div className="text-muted section-text">{formattedDetail}</div>
            </div>
          </Col>
          <Col lg={6} md={12} className="text-center d-flex align-items-stretch">
            <div className="image-wrapper w-100">
              <img
                src={image}
                alt={heading}
                className="img-fluid rounded-lg h-100 object-fit-cover section-image"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

function ServiceCard({ icon, title, description }) {
  return (
    <Col lg={4} md={6} sm={12} className="mb-4">
      <Card className="service-card h-100 border-0 shadow-sm">
        <Card.Body className="p-4 text-center">
          <div className="service-icon mb-3">
            <i className={`bi ${icon} fs-1 text-primary`}></i>
          </div>
          <Card.Title className="fw-bold mb-3">{title}</Card.Title>
          <Card.Text className="text-muted">{description}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}

function CustomAccordionItem({ data, eventKey }) {
  const formattedBody = data.body.includes("•") ? (
    <>
      {data.body.split("•")[0].trim()}
      <ul className="faq-list mt-3">
        {data.body
          .split("•")
          .slice(1)
          .map((item, idx) => (
            <li key={idx} className="mb-2">{item.trim()}</li>
          ))}
      </ul>
    </>
  ) : (
    data.body
  );

  return (
    <Accordion.Item eventKey={eventKey} className="mb-3 border-0 rounded shadow-sm faq-item">
      <Accordion.Header>{data.header}</Accordion.Header>
      <Accordion.Body>{formattedBody}</Accordion.Body>
    </Accordion.Item>
  );
}

function CompanyAssuranceSection() {
  return (
    <section className="py-5 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <h3 className="fw-bold mb-4">Company Assurance</h3>
            <p>
              At Montreal Haven, we are committed to providing our clients with the highest level of service and assurance.
            </p>
            <br/>
            <p>
              In the unlikely event that a client does not receive their product, we guarantee full reimbursement, ensuring that our customers are never left without a solution.
            </p>
            <br/>
            <p>
              Furthermore, all our listed products adhere to the highest safety standards and comply with city regulations, ensuring that every item meets the legal and regulatory requirements for quality and safety.
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

function AboutUsScreen() {
  const navigate = useNavigate();

  const sectionData = [
    {
      heading: "Our Mission",
      detail:
        "The Greater Montreal economy is increasingly dependent on monopolies that prioritize low prices and quantity over quality. This leaves small businesses, with great potential, struggling to compete. Moreover, with foreign corporations controlling the market, local businesses lose opportunities to grow, innovate, and provide consumers with higher-quality products and services.\n\nAt Montreal Haven, we believe in shifting power back to our community. We exist to create a marketplace where local businesses, vendors, and skilled freelancers can thrive and concretize their passion. By prioritizing quality over mass production and novelty over price wars, we empower entrepreneurs to showcase their craft while ensuring locals have access to top-tier goods and services.",
      image: aboutUs1,
      direction: "ltr",
      bgColor: "bg-light"
    },
    {
      heading: "Who We Are",
      detail:
        "Montreal Haven is a localized marketplace created to empower reputable vendors and freelancers across the Montreal Metropolitan Area by giving them a trusted platform to reach local customers. We prioritize authenticity through a careful vetting process, ensuring consistently high-quality service. Since launching in June 2024, our collective has been dedicated to building a thriving, quality-driven community. Based in the heart of Greater Montreal, we aim to redefine the local shopping experience—making it more seamless, community-rooted, and focused on what truly matters to Montrealers.",
      image: aboutUs2,
      direction: "rtl",
      bgColor: "bg-white"
    },
    {
      heading: "Our Values",
      detail:
        "At Montreal Haven, we stand for authenticity, originality, and top-tier quality—values that surpass a company's size or reputation. Our approach encourages innovation, ensuring that every vendor or freelancer can showcase their uniqueness. By prioritizing novelty and excellence, only the best stands out—not the biggest.\n\nWe're also committed to ethical business practices, ensuring every product and service we offer is designed to positively impact our clients—whether in terms of well-being, style, or usefulness. Our commitment to ethics drives us to feature only vendors and freelancers that contribute meaningfully to our customers' lives.",
      image: aboutUs4,
      direction: "ltr",
      bgColor: "bg-light"
    }
  ];

  const serviceCards = [
    {
      icon: "bi-basket",
      title: "Product Requests",
      description: "Looking for a specific product that isn't available on our marketplace? Let us know, and we'll help you find it."
    },
    {
      icon: "bi-people",
      title: "Freelance Services",
      description: "Access top vetted professionals for tutoring, landscaping, carpentry, web development, and more."
    },
    {
      icon: "bi-shop",
      title: "Custom Online Shops",
      description: "Get a fully customized online store with innovative features, owned and managed by you."
    },
    {
      icon: "bi-laptop",
      title: "Business Websites",
      description: "Need a professional showcase website for your business? We've got you covered."
    },
    {
      icon: "bi-credit-card",
      title: "POS Solutions",
      description: "Get a POS machine for your physical store with competitive transaction fees."
    },
    {
      icon: "bi-house",
      title: "Rental Inquiries",
      description: "If you're a tourist or tenant, we can help you find a rental that fits your needs and budget."
    }
  ];

  const accordionData = [
    {
      header: "What do you do?",
      body:
        "At Montreal Haven, we're more than just a marketplace—we're a thriving hub for quality, convenience, and community. We connect trusted vendors, skilled artisans, and top freelancers with customers across the Greater Montreal Area.\n\nBeyond shopping, we provide a range of tailored solutions for both individuals and businesses, helping you find everything from freelance expertise to customized online stores, rental opportunities, and cutting-edge POS systems.",
    },
    {
      header: "How do you vet vendors and service providers?",
      body:
        "At Montreal Haven, we take the time to carefully vet each vendor and service provider to ensure they meet our quality standards. Our process includes:\n• Quality Assessment: We review the products and services offered to ensure they meet our expectations for reliability and excellence.\n• Verification: Vendors and service providers must provide relevant credentials, professional experience, and, when applicable, customer reviews or references.\n• Ongoing Monitoring: We continuously assess performance and customer feedback to maintain high standards across our marketplace.\n\nOur goal is to connect customers with trusted vendors and service providers who offer high-quality products and services.",
    },
    // {
    //   header: "What is your company assurance?",
    //   body:
    //     "At Montreal Haven, we are committed to providing our clients with the highest level of service and assurance. In the unlikely event that a client does not receive their product, we guarantee full reimbursement, ensuring that our customers are never left without a solution.\n\nFurthermore, all our listed products adhere to the highest safety standards and comply with city regulations, ensuring that every item meets the legal and regulatory requirements for quality and safety.",
    // },
    {
      header: "What is your refund policy?",
      body:
        "At Montreal Haven, we strive to ensure a smooth shopping experience. However, if an order is placed from outside the Montreal Metropolitan Area, the following refund policy applies:\n• Customers who place an order from outside our service area (Greater Montreal Area) will be eligible for a refund.\n• Transaction fees incurred during the payment process are non-refundable and will be deducted from the total refund amount.\n• Refunds will be processed using the original payment method. Processing times may vary depending on your financial institution.\n\nFor any questions or assistance, please contact our support team at support@montrealhaven.com."
    },
    {
      header: "How can I join the delivery team as a driver or delivery dispatcher?",
      body:
      "You can send an email to delivery@montrealhaven.com, and we'll evaluate if you're a good fit for our delivery team. We also have an opening for a delivery dispatcher to manage and redirect orders. We are also currently developing a feature that will allow drivers to register directly on our site and fulfill orders around Montreal, similar to UberConnect. Stay tuned for more updates!"
    }
  ];

  return (
    <div className="about-page">
      <section className="hero-section text-center py-5 bg-[#0e3e75] text-white">
        <Container>
          <h1 className="display-4 fw-bold mb-4">About Montreal Haven</h1>
          <p className="lead mb-0">Empowering local businesses and connecting Montrealers with high-quality products and services</p>
        </Container>
      </section>

      {sectionData.map((item, index) => (
        <AboutUsSection key={index} {...item} />
      ))}

      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center fw-bold mb-5 position-relative section-heading">
            Our Services
            <span className="heading-underline mx-auto"></span>
          </h2>
          <Row>
            {serviceCards.map((card, index) => (
              <ServiceCard key={index} {...card} />
            ))}
          </Row>
        </Container>
      </section>

      <section className="py-5 bg-white">
        <Container>
          <h2 className="text-center fw-bold mb-5 position-relative section-heading">
            Frequently Asked Questions
            <span className="heading-underline mx-auto"></span>
          </h2>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Accordion defaultActiveKey="0" className="faq-accordion">
                {accordionData.map((item, index) => (
                  <CustomAccordionItem key={index} data={item} eventKey={index.toString()} />
                ))}
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>

      <CompanyAssuranceSection />

      <section className="py-5 bg-[#0e3e75] text-white text-center">
        <Container>
          <h3 className="mb-4">Ready to join the Montreal Haven community?</h3>
          <p className="mb-4">Discover authentic local products and services or showcase your business to Montrealers.</p>
          <button className="btn btn-light btn-lg px-4" onClick={() => navigate('/Products')}>Visit Marketplace</button>
        </Container>
      </section>
    </div>
  );
}

export default AboutUsScreen;