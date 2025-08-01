import React, { useEffect, useState } from "react";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
// import Img1 from "../../assets/product.jpg";
// import Img2 from "../../assets/product2.jpg";
import { Col, Container, Row } from "react-bootstrap";
import NavBar from "../../components/Navbar/Navbar";
import "./ProductDetails.scss";
import Button from "../../components/Input/Button";
import TabComponent from "../../components/TabComponent/TabComponent";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/reducers/cartSlice";
import { useNavigate } from "react-router-dom";
import { useAddData, useGetDataByID } from "../../api/apiCalls";
import { endPoints } from "../../api/api";
import { useVendor } from "../../api/VendorContext";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import Alert from "../../components/Alerts";
import Alerts from "../../components/Alerts";
import { IoIosArrowBack } from "react-icons/io";
import ProductInfo from "./ProductInfo.component";
import ReactLoading from "react-loading";
import {
  setAlertTitle,
  setErrorAlert,
  setSuccessAlert,
} from "../../redux/reducers/patientSlice";
import { useQueryClient } from "react-query";


function ProductDetails() {
  const currentLogin = useSelector((e) => e.currentUser.user);
  // console.log(currentLogin, "asdasdasdasdasdasd");
  const userData = useSelector((e) => e.show.userData);
  // console.log(userData, "asdasdasdasdasdasd");
  // const updatedCartItems = useSelector(state => state.cart.items);
  const [quantityALert, setQuantityAlert] = useState(false);
  const items = useSelector((state) => state.cart.items);
  const userCart = useSelector((e) => e.cart.userCart);
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const [count, setCount] = useState(1);
  const [showswalFire, setShowSwalFire] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const productDetail = useSelector((e) => e.show.productDetail);
  const screenSize = window.innerWidth;
  const value = useSelector((e) => e.show.value);
  const LoggedUser = JSON.parse(localStorage.getItem("LoggedUser"));
  const queryClient = useQueryClient();
  // const [show, setShow] = useState(false);
  // const [productData, setProductData] = useState({});
  // const [productId, setProductId] = useState(value?.id);

  // useEffect(()=>{
  //   if(value?.id){
  //     setShow(true);
  //   }
  // },[value?.id])

  // const getProductById = useGetDataByID(
  //   value?.id,
  //   ["GetProductById", value?.id],
  //   endPoints.productsById,
  //   show
  //   // (value?.id) ? true : false
  // );

  // // console.log(getProductById?.data?.product,"faw4g8a6g4agwa6");

  // useEffect(() => {
  //   if (getProductById?.data) {
  //     setShow(false);
  //     setProductData(()=>{
  //       return getProductById?.data?.product?.map((item)=>{
  //         return{
  //           // id: item?.id,
  //           name: item?.name,
  //           price: item?.price,
  //           category: item?.category,
  //           subcategory : item?.subcategory,
  //           description: item?.description,
  //           features : item?.features,
  //           quantity : item?.quantity
  //         }
  //       })
  //     })
  //   }
  // }, [getProductById?.data, getProductById?.isFetching]);

  // console.log(productData,"fawfagawgwagawgwa")

  // const handleView = (params) => {
  //   // console.log(params?.data, "dawdwadawdawdadawdwadwadadawdwadwa");
  //   setShow(true);
  //   setProductData(params?.data);
  //   setProductId()
  // };

  // const userCart = useSelector(e => e.cart.userCart);
  // console.log(userCart[1]?.productId,"fa8f7da68awg46")
  // console.log(value?.data?.quantity,"6wa4gag6")

  // const filterProductId = userCart?.filter((item) => item?.productId===value?.id);
  // console.log(filterProductId[0].quantity,"f6aw4fa6wf4afw4f6a4gwafff6g4");

  // if(value?.data?.quantity < filterProductId[0]?.quantity){
  //   console.log("insufficient stock");
  // }

  console.log(LoggedUser, "LoggedUserLoggedUser123456");
  const navigate = useNavigate();
  const increment = () => {
    if (count < value?.data?.quantity) setCount(count + 1);
  };
  const decrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
  useEffect(() => {
    if (Object.keys(value).length === 0) {
      navigate("/");
    }
  }, [value]);

  const addproductstoCart = useAddData("addproductstoCart");
  // console.log("valuevaluevfsadfaalue", value)

  const handleAddToCart = async (handleCase) => {
    // console.log('value', value.vendorId)
    setIsLoading(true);
    const productObject = {
      productId: value.id,
      vendorId: value.vendorId,
      name: value.name,
      price: value.price,
      quantity: count,
      subTotal: value?.price * count,
      images: value?.image[0],
    };
    console.log(productObject, "productObjectproductObject");

    const newSendData = {
      userId: LoggedUser ? LoggedUser.user.id : "",
      products: [
        {
          productId: value.id,
          vendorId: value.vendorId,
          price: value.price,
          quantity: count,
          name: value.name,
          subTotal: value.price * count,
        },
      ],
    };

    console.log('newSendDatanewSendData', newSendData)
    if (userId !== null && userData) {
      const response = await addproductstoCart.mutateAsync({
        sendData: newSendData,
        endPoint: endPoints.addProductsToCart,
      });

      if (response?.status === 200) {
        setIsLoading(false);
        queryClient.refetchQueries("getUserCart");
        queryClient.refetchQueries('GetProductById');
        setQuantityAlert(false);
        // console.log(response?.status?.data,"fwafafwafwaf")
        dispatch(setSuccessAlert(true));
        dispatch(setAlertTitle("Product Added to Cart"));
      } else {
        setIsLoading(false);
        dispatch(setErrorAlert(true));
        // console.log(response?.response?.data,"fwafafwafwaf")
        dispatch(setAlertTitle(response?.response?.data?.error));
      }
    } else {
      const filteredProductObject = Object.fromEntries(
        Object.entries(productObject).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      );
      console.log(filteredProductObject, "86d4awd68a4");
      if (Object.keys(filteredProductObject).length > 0) {
        dispatch(addToCart(filteredProductObject));
        // console.log(items,"6468dwa74daw6")
      }
      navigate("/login");
      dispatch(setSuccessAlert(true));
      dispatch(setAlertTitle("Please Login/Sign-Up to Add Products in Cart "));
    }
  };

  return (
    <>
      {isLoading ? (
        <div style={{ marginLeft: "45%" }} className="mt-5">
          <ReactLoading
            type={"spinningBubbles"}
            color={"#AA2F33"}
            height={60}
            width={60}
          />
        </div>
      ) : (
        <>
          <Container fluid>
            {/* <NavBar /> */}
  
            <Alerts
              title={"Product Added Successfully!"}
              icon={"success"}
              show={showswalFire}
            />
  
            <Row style={{ marginTop: "4%" }}>
              <div className="back-arrow mt-5" style={{ cursor: "pointer" }}>
                <IoIosArrowBack
                  color="grey"
                  size={30}
                  onClick={() => navigate(-1)}
                />
              </div>
              <Col xs={12} md={5} lg={6}>
                <ImageGallery images={[value?.image]} />
              </Col>
              {screenSize < 800 ? (
                <Row className="ms-3 mt-2">
                  <ProductInfo
                    increment={increment}
                    decrement={decrement}
                    isloading={isLoading}
                    buyBtn={() => handleAddToCart("buy")}
                    cartBtn={() => handleAddToCart("cart")}
                    count={count}
                  />
                </Row>
              ) : (
                <Col xs={6} md={6} lg={6}>
                  <ProductInfo
                    increment={increment}
                    decrement={decrement}
                    isloading={isLoading}
                    setQuantityAlert={setQuantityAlert}
                    quantityALert={quantityALert}
                    buyBtn={() => handleAddToCart("buy")}
                    cartBtn={() => handleAddToCart("cart")}
                    count={count}
                  />
                </Col>
              )}
            </Row>
          </Container>
        </>
      )}
    </>
  );
  
}

export default ProductDetails;
