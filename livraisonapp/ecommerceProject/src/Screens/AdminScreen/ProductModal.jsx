import React, { useEffect, useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import { RxCross2 } from "react-icons/rx";
import { endPoints } from "../../api/api";
import { useGetDataByID } from "../../api/apiCalls";
import ReactLoading from "react-loading";

const ProductModal = ({ show, setShow, data }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [productData, setProductData] = useState([]);
  const [productId, setProductId] = useState(data?.productId);
  const API_URL = import.meta.env.VITE_APP_API_URL;
  // console.log(data, "datadata");
  const getProductById = useGetDataByID(
    data?.productId,
    ["GetProductById", data?.productId],
    endPoints.productsById,
    show
  );
  useEffect(() => {
    if (getProductById?.data) {
      setIsEnabled(false);
      //   setProductId("")
    }
  }, [getProductById?.data]);
  //   const [productInfo, setProductInfo] = useState({
  //     name: '',
  //     price: 0,
  //     quantity: 0,
  //     vendorName: '',
  //     vendorEmail: '',
  //   });

  //   const productName = getProductById?.data.product[0].name;
  //   const productPrice = getProductById?.data?.product[0].price;
  //   const productQuantity = getProductById?.data?.product[0].quantity;
  //   const vendorName = getProductById?.data?.vendor.name;
  //   const vendorEmail = getProductById?.data?.vendor.email;

  //   setProductInfo({
  //     name: productName,
  //     price: productPrice,
  //     quantity: productQuantity,
  //     vendorName: vendorName,
  //     vendorEmail: vendorEmail,
  //   });
  //   console.log(getProductById?.data?.product[0].price, "ProductInfo");
  const closeModal = () => {
    setProductId("");
    setShow(false);
  };
  return (
    <div>
      <Modal show={show} size="lg" centered>
        <Modal.Header>
          <span onClick={closeModal} style={{cursor:"pointer"}}>
            <RxCross2 />
          </span>
        </Modal.Header>
        <Modal.Body>
          {getProductById?.isFetching ? (
            <div style={{ marginLeft: "40%" }} className="mt-3">
              <ReactLoading
                type={"spinningBubbles"}
                color={"#AA2F33"}
                height={40}
                width={40}
              />
            </div>
          ) : (
            <Row>
              <Col md={3} sm={3} lg={3}>
                <div className="ms-3 mt-2">
                  <img
                    width="150px"
                    src={`${API_URL}${getProductById?.data?.product[0].images[0]}`}
                  />
                </div>
              </Col>
              <Col md={9} sm={9} lg={9}>
                <Row className="mt-2">
                  <Col md={3} sm={3} lg={3}>
                    <h6>Product : </h6>
                  </Col>
                  <Col md={3} sm={3} lg={3}>
                    <p>{getProductById?.data?.product[0].name}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={3} sm={3} lg={3}>
                    <h6>Price : </h6>
                  </Col>
                  <Col md={3} sm={3} lg={3}>
                    <p>
                      {"CA$" + " " + getProductById?.data?.product[0].price}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col md={3} sm={3} lg={3}>
                    <h6>Quantity : </h6>
                  </Col>
                  <Col md={3} sm={3} lg={3}>
                    <p>{getProductById?.data?.product[0].quantity}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={3} sm={3} lg={3}>
                    <h6>Vendor Name :</h6>
                  </Col>
                  <Col md={3} sm={3} lg={3}>
                    <p>{getProductById?.data?.vendor?.name}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={3} sm={3} lg={3}>
                    <h6>Vendor Email :</h6>
                  </Col>
                  <Col md={3} sm={3} lg={3}>
                    <p>{getProductById?.data?.vendor?.email}</p>
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductModal;
