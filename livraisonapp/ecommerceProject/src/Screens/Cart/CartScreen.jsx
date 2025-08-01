import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import './Cartscreen.scss';
import InputField from '../../components/Input/Input';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, clearCart, setCart } from '../../redux/reducers/cartSlice';
import NavBar from '../../components/Navbar/Navbar';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { endPoints } from '../../api/api';
import { defaultAPi, useAddData, useGetDataByID } from '../../api/apiCalls';
import TextArea from '../../components/TextArea/TextArea';
import Button from '../../components/Input/Button';
import { loadStripe } from '@stripe/stripe-js';
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import Alerts from '../../components/Alerts';
import config from '../../config';
import { formatPrice } from '../../utilitaire/utils';

function CartScreen() {
  const methods = useForm();
  const dispatch = useDispatch();
  const cartItems = useSelector((e) => e.cart.items);
  const [products, setProducts] = useState([]);
  const currentLogin = useSelector((e) => e.currentUser.user);
  const addCheckout = useAddData("saveCheckout");
  const API_URL = import.meta.env.VITE_APP_API_URL;
  // const handleSubmit = methods.handleSubmit(async (sendData) => {
  //   const response = await addCheckout.mutateAsync({
  //     sendData: sendData,
  //     endPoint: endPoints.saveCheckout,
  //   });
  //   if (response?.status === 200) {
  //   } else {
  //     // dispatch(setErrorAlert(true));
  //     // dispatch(setAlertTitle("Something Went Wrong"));
  //   }
  // });
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  const items = useSelector((e) => e.cart.items);
  // console.log(items, 'itemsitemsitems')
  const [showswalFire, setShowSwalFire] = useState(false);
  const totalCheckout = items.reduce((n, { subTotal }) => n + subTotal, 0);
  // const productsItem=items?.foreach((item)=>
  // {
  //   delete item.images
  // }
  // )
  const productItems = items?.length > 0 && items.map((item) => {
    return {
      name: item?.name,
      price: formatPrice(item?.price),
      productId: item?.productId,
      quantity: item?.quantity,
      subTotal: item?.subTotal,
    };
  })

  // console.log(productItems?.length <= 0 || productItems?.length = undefined,"adsadsad32")
  // const productArray = [
  //   {
  //     name: "Product 1",
  //     price: 19.99,
  //     quantity: 2
  //   },
  //   {
  //     name: "Product 2",
  //     price: 29.99,
  //     quantity: 1
  //   }
  //   // Add more products as needed
  // ];
  // const handlePayments = async()=>{
  //   // const stripe = await loadStripe("pk_test_51PU61CP01WS8hQJviDSikHejg3Iibouwu0XkuinrSQQbvBxpoemQ5i3MG3lkacgghl4l7GLlxdnuSbAlkqIr9J6200DBnb5AxR");

  //   // const body = {
  //   //     products:items
  //   // }
  //   // const headers = {
  //   //     "Content-Type":"application/json"
  //   // }
  //   // const response = await fetch("/create-checkout-session",{
  //   //     method:"POST",
  //   //     headers:headers,
  //   //     body:JSON.stringify(body)
  //   // });

  //   // const session = await response.json();

  //   // const result = stripe.redirectToCheckout({
  //   //     sessionId:session.id
  //   // });

  //   // if(result.error){
  //   //     // console.log(result.error);
  //   // }

  //   axios.post(`${url}/create-checkout-session`, {
  //     items,
  //     // userId: ,
  //   })
  //   .then((response) => {
  //     if (response.data.url) {
  //       window.location.href = response.data.url;
  //     }
  //   })
  //   .catch((err) => // console.log(err.message));

  // console.log(items, "responseresponseresponseresponse")

  // };
  const handlePayments = async () => {
    //   const body = {
    //     products:items
    // }

    try {

      const response = await fetch(API_URL + '/api/stripe/create-checkout-session', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productItems }),
        // Add body if you need to send data to the backend
        // body: JSON.stringify({ productId: 'your-product-id' }),
      });
      // // console.log(response,"responseresponse")

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { url } = await response.json();
      window.location.href = url; // Redirect to Stripe Checkout
    }
    catch (error) {
      // console.error('Error:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleRemoveitem = (Id) => {
    const filterItems = items?.filter((product) => product.productId !== Id)
    dispatch(setCart(filterItems))
    setShowSwalFire(true);
  }
  const screenSize = window.innerWidth;
  // console.log(screenSize, 'screenSizescreenSize')

  const role = localStorage.getItem("Role");
  if (role === "driver") {
    return <div style={{ marginTop: "100px", textAlign: "center" }}>Drivers do not have a shopping cart.</div>;
  }

  return (
    <>
      {/* <NavBar /> */}
      <Container fluid style={{ marginTop: "70px" }}>
        <Alerts title={"Product Deleted Successfuly!"} icon={"success"} show={showswalFire} />
        <section className="vh-100">
          <Container fluid className="h-100">
            <Row className="row d-flex justify-content-center align-items-center h-100">
              <Col>
                <p>
                  <span className="h2">Shopping Cart </span>
                  <span className="h4">
                    ({productItems?.length > 0 ? productItems?.length : "No"} item(s) in your cart)
                  </span>
                </p>

                <Card className=" mb-4">
                  {items?.map((product, key) => {
                    // console.log(product,'productproductproduct')
                    return (
                      <div key={key} className="card-body p-4">

                        <div className="row align-items-center">
                          {screenSize < 800 ? (
                            <>
                              <Row>
                                <Col sm={2} md={2} lg={2} xs={2}>
                                  <img src={`${API_URL}${product?.images}`}
                                    className="img-fluid" alt="Product image" />
                                </Col>
                                <Col sm={2} md={2} lg={2} xs={4} className=" d-flex justify-content-center">
                                  <div>
                                    {/* <p className="small text-muted mb-4 pb-2">Name</p> */}
                                    <p className="lead fw-bold fs-normal mb-0">{product?.name}</p>
                                  </div>
                                </Col>
                                <Col sm={1} md={1} lg={1} xs={6} className=" d-flex justify-content-center">
                                  <div>
                                    {/* <p className="small text-muted mb-4 pb-2">Price</p> */}
                                    <p className="lead fw-bold mb-0">CA$ {formatPrice(product?.price)}</p>
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col sm={1} md={1} lg={1} xs={6} className=" d-flex justify-content-center">
                                  <div>
                                    <span className="small text-muted mb-4 pb-2">Quantity : </span>
                                    <span className="lead fw-normal mb-0">{product?.quantity}</span>
                                  </div>
                                </Col>

                                <Col sm={1} md={1} lg={1} xs={2} className=" d-flex justify-content-center">
                                  <div>
                                    {/* <p className="small text-muted mb-4 pb-2">Total</p> */}
                                    {/* <p className="lead fw-normal mb-0">${product?.subTotal}</p> */}
                                  </div>
                                </Col>

                                <Col sm={1} md={1} lg={1} xs={2} className=" d-flex justify-content-center">
                                  <div>
                                    {/* <p className="small text-muted mb-4 pb-2">Remove Item</p> */}

                                    <MdDelete size={"25px"} color='red' onClick={() => handleRemoveitem(product?.productId)} />
                                    {/* <Button text={"Remove"} onClick={()=>handleRemoveitem(product?.id)}/> */}
                                  </div>
                                </Col>
                              </Row>
                            </>
                          ) : (
                            <>
                              <Col sm={2} md={2} lg={2} xs={2}>
                                <img src={`${API_URL}${product?.images}`}
                                  className="img-fluid" alt="Product image" />
                              </Col>
                              <Col sm={2} md={2} lg={2} xs={2} className=" d-flex justify-content-center">
                                <div>
                                  <p className="small text-muted mb-4 pb-2">Name</p>
                                  <p className="lead fw-normal mb-0">{product?.name}</p>
                                </div>
                              </Col>

                              <Col sm={1} md={1} lg={1} xs={1} className=" d-flex justify-content-center">
                                <div>
                                  <p className="small text-muted mb-4 pb-2">Quantity</p>
                                  <p className="lead fw-normal mb-0">{product?.quantity}</p>
                                </div>
                              </Col>
                              <Col sm={1} md={1} lg={1} xs={1} className=" d-flex justify-content-center">
                                <div>
                                  <p className="small text-muted mb-4 pb-2">Price</p>
                                  <p className="lead fw-normal mb-0">${formatPrice(product?.price)}</p>
                                </div>
                              </Col>
                              <Col sm={1} md={1} lg={1} xs={1} className=" d-flex justify-content-center">
                                <div>
                                  <p className="small text-muted mb-4 pb-2">Total</p>
                                  <p className="lead fw-normal mb-0">${product?.subTotal}</p>
                                </div>
                              </Col>

                              <Col sm={1} md={1} lg={1} xs={1} className=" d-flex justify-content-center">
                                <div>
                                  <p className="small text-muted mb-4 pb-2">Remove Item</p>

                                  <MdDelete size={"25px"} color='red' onClick={() => handleRemoveitem(product?.productId)} />
                                  {/* <Button text={"Remove"} onClick={()=>handleRemoveitem(product?.id)}/> */}
                                </div>
                              </Col>
                            </>
                          )}
                        </div>

                      </div>
                    )
                  })}

                </Card>

                <Card className=" mb-5">
                  <div className="card-body p-4">
                    <div className="float-end">
                      <p className="mb-0 me-5 d-flex align-items-center">
                        <span className="small text-muted me-2">
                          Order total:
                        </span>{" "}
                        <span className="lead fw-normal">${totalCheckout}</span>
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="d-flex justify-content-end mb-4">
                  {items?.length > 0 && (
                    <button
                      type="button"
                      data-mdb-button-init
                      data-mdb-ripple-init
                      className="btn btn-light btn-sm me-2"
                      onClick={handleClearCart}
                    >
                      Empty Cart
                    </button>
                  )}
                  <button
                    type="button"
                    data-mdb-button-init
                    data-mdb-ripple-init
                    className="btn btn-primary btn-sm"
                    onClick={(e) => handlePayments(e)}
                    disabled={productItems?.length == 0 || productItems.length === undefined}
                  >
                    Checkout
                  </button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </Container>
    </>
  );
}

export default CartScreen;
