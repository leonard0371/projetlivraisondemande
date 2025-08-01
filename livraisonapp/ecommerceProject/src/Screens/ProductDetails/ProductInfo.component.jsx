import { Card, Col, Row } from "react-bootstrap";
import Button from "../../components/Input/Button";
import React, { useEffect, useState } from "react";
import "./ProductDetails.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  setAlertTitle,
  setErrorAlert,
} from "../../redux/reducers/patientSlice";
import { useGetDataByID } from "../../api/apiCalls";
import { endPoints } from "../../api/api";
import ReactLoading from "react-loading";
import { formatPrice } from "../../utilitaire/utils";

function ProductInfo({
  increment,
  decrement,
  buyBtn,
  cartBtn,
  count,
  isloading,
  setQuantityAlert,
  quantityALert,
}) {
  
  const vendorID = localStorage.getItem("vendorID");
  //  const [quantityALert,setQuantityAlert] = useState(false)
  // const [currentStock, setCurrentStock] = useState("")
  const value = useSelector((e) => e.show.value);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState({});
  const userCart = useSelector((e) => e.cart.userCart);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(value?.id){
      setShow(true);
    }
  },[value?.id])

  const getProductById = useGetDataByID(
    value?.id,
    ["GetProductById", value?.id],
    endPoints.productsById,
    show
    // (value?.id) ? true : false
  );

  // console.log(getProductById?.data?.product,"faw4g8a6g4agwa6");

  // console.log(productData?.name, "valueproductInfo");
  
  
  // console.log(getProductById?.isFetching,"aw5g4a6ga4ga")
  useEffect(() => {
    // console.log(getProductById?.isFetching,"AFWAGAGAGWAG")
    // setShow(false);
    if (getProductById?.data) {
      console.log('data test', getProductById?.data)
      
      setProductData(()=>{
        return getProductById?.data?.product?.map((item)=>{
          return{
            // id: item?.id,
            name: item?.name,
            price: formatPrice(item?.price),
            category: item?.category,
            subcategory : item?.subcategory,
            description: item?.description,
            features : item?.features,
            quantity : item?.quantity
          }
        })
      })
    }
    setIsLoading(getProductById?.isFetching);
  }, [getProductById?.data, getProductById?.isFetching, getProductById?.isLoading]);

  console.log(productData?.name, "valueproductInfo");
 
  const filterProductId = userCart?.filter(
    (item) => item?.productId === value?.id
  );
  return (
    <>
    {/* {() ?} */}
    {isLoading ? (
        <div style={{ marginLeft: "45%" }} className="mt-5">
          <ReactLoading
            type={"spinningBubbles"}
            color={"#AA2F33"}
            height={60}
            width={60}
          />
        </div>
      ):(<>
        <h2>{productData[0]?.name}</h2>
      <p style={{ fontSize: "14px", fontWeight: "400", color: "#AA2F33" }}>
        {productData[0]?.category + " > " + productData[0]?.subcategory}
      </p>

      <h4 style={{ fontWeight: "300", marginTop: "10px" }}>
        <span style={{ fontWeight: "500", fontSize: "30px" }}>
          {"CA$" + " " + productData[0]?.price}
        </span>
      </h4>

      <Card
        style={{ width: "90%", backgroundColor: "transparent" }}
        className="mb-2"
      >
        <Card.Title className="ms-3 mt-2">Description</Card.Title>
        <Card.Body>{productData[0]?.description}</Card.Body>
      </Card>
      {/* <p></p> */}

      <div>
        <p style={{ fontSize: "14px" }}>Quantity</p>
        {/* <div className="counter"> */}
        <Row>
          <Col xs={2} md={2} lg={2}>
            <Row className="counter mt-2">
              <Col xs={2} md={2} lg={2}>
                <div onClick={increment} className="counterBtn">
                  +
                </div>
              </Col>
              <Col xs={2} md={2} lg={2}>
                {count}
              </Col>
              <Col xs={2} md={2} lg={2}>
                <div className="counterBtn" onClick={decrement}>
                  -
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={9} md={9} lg={9}>
            {vendorID === null && (
              <div className="">
                <Button
                  text={
                    productData[0]?.quantity === 0 ? "Out of Stock" : "Add to Cart"
                  }
                  width={"100%"}
                  onClick={cartBtn}
                  disabled={productData[0]?.quantity === 0 || isloading}
                  isLoading={isloading}
                />
              </div>
            )}
          </Col>
        </Row>
        <div className="m-2">
          <h6>
            Only
            <span style={{ color: "#AA2F33" }}>
              {" " + productData[0]?.quantity + " "}
            </span>
            left in Stock
          </h6>
        </div>
      </div>
      </>)}
    </>
  );
}
export default ProductInfo;
