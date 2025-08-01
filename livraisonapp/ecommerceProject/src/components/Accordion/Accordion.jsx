import React from "react";
import { Accordion, Card } from "react-bootstrap";

function FAQAccordion({ data, index }) {
  const isRefundPolicy = data.header.includes("refund policy");

  return (
    <Accordion className="mb-3">
      <Card className="accordion-item border-0 shadow-sm">
        <Accordion.Toggle as={Card.Header} eventKey={`${index}`} className="accordion-button fw-bold p-4">
          {data.header}
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={`${index}`}>
          <Card.Body className="p-4">
            {isRefundPolicy ? (
              <div className="refund-policy">
                <p className="mb-3">
                  At Montreal Haven, we strive to ensure a smooth shopping experience. However, if an order is placed from outside the <strong>Montreal Metropolitan Area</strong>, the following refund policy applies:
                </p>
                <ul className="ps-4 mb-3">
                  <li className="mb-2">
                    Customers who place an order from outside our service area (Greater Montreal Area) will be eligible for a refund.
                  </li>
                  <li className="mb-2">
                    <strong>Transaction fees</strong> incurred during the payment process are <strong>non-refundable</strong> and will be deducted from the total refund amount.
                  </li>
                  <li className="mb-2">
                    Refunds will be processed using the original payment method. Processing times may vary depending on your financial institution.
                  </li>
                </ul>
                <p className="mb-0">
                  For any questions or assistance, please contact our support team via our <a href="/contact" className="text-primary fw-bold">Contact Us</a> page.
                </p>
              </div>
            ) : (
              <div className="text-muted">
                {data.body.includes("•") ? (
                  <>
                    {data.body.split("•")[0]}
                    <ul className="mt-3">
                      {data.body
                        .split("•")
                        .slice(1)
                        .map((item, i) => (
                          <li key={i} className="mb-2">{item.trim()}</li>
                        ))}
                    </ul>
                  </>
                ) : (
                  data.body
                )}
              </div>
            )}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

export default FAQAccordion;