import React, { useEffect, useState } from "react";
import "./Vendor.scss";
import {
  ButtonGroup,
  Col,
  Container,
  Dropdown,
  Modal,
  Row,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Cards from "../../components/Cards/Cards";
// import productImage from "../../assets/product.jpg";
// import productImage2 from "../../assets/product2.jpg";
import Grid from "../../components/Grid/Grid";
import Button from "../../components/Input/Button";
import { FaEye, FaWallet, FaTruck } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { endPoints } from "../../api/api";
import {
  useAddData,
  useDeleteData,
  useGetAllData,
  useGetDataByID,
} from "../../api/apiCalls";
import AddSingleProduct from "../../components/AddProduct/AddSingleProduct";
import { FormProvider, useForm } from "react-hook-form";
import TextArea from "../../components/TextArea/TextArea";
import InputField from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import { useVendor } from "../../api/VendorContext";
import { DevTool } from "@hookform/devtools";
import axios from "axios";
import AlertOK from "../../components/Toast/Alert";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  savePatientData,
  setAlertTitle,
  setIsAuthenticated,
  setSuccessAlert,
  setErrorAlert,
} from "../../redux/reducers/patientSlice";
import SideNavComponent from "../../components/SideBar/SideNav";
import SideBar from "../../components/SideBar/SideBar";
import VendorProducts from "./VendorProducts";
import config from "../../config";
import { IoClose, IoHome } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import ReactLoading from "react-loading";
import { FaChevronDown } from "react-icons/fa";
import Button2 from "react-bootstrap/Button";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { MdInventory } from "react-icons/md";
import Modals from "../../components/Modal/Modals";

const VendorSoldProducts = () => {
  //   const [gridRows, setGridRows] = useState([]);
  //   const [editProduct, setEditProduct] = useState(false);
  //   const [vendorData, setVendorData] = useState([]);
  //   const [addProduct, setAddProduct] = useState(false);
  //   const [file, setFile] = useState({});
  //   const [images, setImages] = useState([]);
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const [vendorSoldData, setVendorSoldData] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [screenWidth, setscreenWidth] = useState(window.innerWidth);
  const [show, setShow] = useState(false);
  const [soldProduct, setSoldProduct] = useState({});
  const [totalRevenue, setTotalRevenue] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedProductForDelivery, setSelectedProductForDelivery] = useState({});
  const [deliveryFormData, setDeliveryFormData] = useState({
    pickupAddress: '',
    deliveryAddress: '',
    clientName: '',
    clientPhoneNumber: '',
    productDetails: ''
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //   const getAllCategories = useGetAllData(
  //     "getAllCategories",
  //     endPoints.getAllCategories
  //   );

  const screenSize = window.innerWidth;
  useEffect(() => {
    const handleResize = () => {
      setscreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // console.log(testUrl, 'testUrltestUrltestUrl')
  const currentLogin = useSelector((e) => e.currentUser.user);
  const vendorId = localStorage.getItem("vendorID");

  const SoldProductsByVendorId = useGetDataByID(
    vendorId,
    "SoldProductsByVendorId",
    endPoints.getSoldProductsByVendorId,
    isEnabled
  );
  // console.log(isEnabled, "DWADAWD");

  useEffect(() => {
    // setVendorData(()=>{
    //     return
    // })
    if (SoldProductsByVendorId?.data && SoldProductsByVendorId?.isFetched) {
      setIsEnabled(false);
    }
  }, [SoldProductsByVendorId?.data]);

  // console.log(SoldProductsByVendorId, "8564984");

  const handleView = (params) => {
    setShow(true);
    // console.log(params?.data,"78465313");
    setSoldProduct(params?.data);
  };

  const handleDeliveryRequest = (params) => {
    setSelectedProductForDelivery(params?.data);
    setDeliveryFormData({
      pickupAddress: '',
      deliveryAddress: '',
      clientName: '',
      clientPhoneNumber: '',
      productDetails: `${params?.data?.name} - Qty: ${params?.data?.quantity}`
    });
    setShowDeliveryModal(true);
  };

  const handleDeliverySubmit = async () => {
    try {
      const token = localStorage.getItem('Token');
      const response = await axios.post(`${config.apiUrl}/api/deliveries`, deliveryFormData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 201) {
        dispatch(setSuccessAlert(true));
        dispatch(setAlertTitle("Delivery request created successfully!"));
        setShowDeliveryModal(false);
        setDeliveryFormData({
          pickupAddress: '',
          deliveryAddress: '',
          clientName: '',
          clientPhoneNumber: '',
          productDetails: ''
        });
      }
    } catch (error) {
      console.error('Error creating delivery request:', error);
      dispatch(setErrorAlert(true));
      dispatch(setAlertTitle("Failed to create delivery request"));
    }
  };
    // console.log(soldProduct,"46446541")

  const gridColumns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }),
    },
    {
      field: "price",
      headerName: "Price(CAD)",
      flex: 1,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }),
    },
    {
      field: "View",
      headerName: "Actions",
      cellRenderer: (params) => (
        <>
          <Row>
            <Col>
              <a onClick={() => handleView(params)} style={{ marginRight: '10px', cursor: 'pointer' }}>
                <span style={{ color: "#AA2F33" }}>View</span>
              </a>
              <a onClick={() => handleDeliveryRequest(params)} style={{ cursor: 'pointer' }}>
                <FaTruck style={{ color: "#28a745", fontSize: "16px" }} title="Request Delivery" />
              </a>
            </Col>
          </Row>
        </>
      ),
      flex: 1,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }),
    },
  ];
  const mobilegridColumns = [
    {
      field: "name",
      headerName: "name",
      flex: 1,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }),
    },
    {
      field: "price",
      headerName: "price(CAD)",
      flex: 1,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }),
    },
    {
      field: "View",
      headerName: "Actions",
      cellRenderer: (params) => (
        <>
          <Row>
            <Col>
              <a onClick={() => handleView(params)} style={{ marginRight: '10px', cursor: 'pointer' }}>
                <span style={{ color: "#AA2F33" }}>View</span>
              </a>
              <a onClick={() => handleDeliveryRequest(params)} style={{ cursor: 'pointer' }}>
                <FaTruck style={{ color: "#28a745", fontSize: "16px" }} title="Request Delivery" />
              </a>
            </Col>
          </Row>
        </>
      ),
      flex: 1,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }),
    },
  ];

  useEffect(() => {
    // console.log(SoldProductsByVendorId?.data?.products[0].products,"rtydddddufwafioiuy")
    if (SoldProductsByVendorId?.data) {
      setTotalRevenue(SoldProductsByVendorId?.data?.calcPercentage.toFixed(1));
      setVendorSoldData(() => {

        return SoldProductsByVendorId?.data?.products
          .map((item) => {
            // console.log(item, "sdaasdsadsadsa");
            return item.products.map((product) => {
              // console.log(product, "sadsadsadsadsadsasadsdasddas");
              return {
                // Wallet : soldProducts?.data?.calcPercentage,
                name: product.name,
                price: product.price,
                quantity: product.quantity,
                Total: "CAD$" + " " + product.quantity * product.price,
                productId: product.productId,
              };
            });
          })
          .flat();
      });
    }
  }, [SoldProductsByVendorId?.data, SoldProductsByVendorId?.isFetching]);

  

  //   const handleViewProduct = () => {
  //     setAddProduct(false);
  //     setEditProduct(false);
  //   };

  //   const AddNewProduct = () => {
  //     setAddProduct(true);
  //     methods.reset({
  //       vendorId: vendorId,
  //     });
  //   };
  // const [sideBar, setSideBar] = useState(width <= 900 ? false : true);

  //   const [expanded, setExpanded] = useState(true);
  //   const [activeKey, setActiveKey] = useState(1);
  // console.log(activeKey, "asdfklajfkls");
  //   const tabsData = [
  //     {
  //       key: 1,
  //       title: "Dashboard",
  //       component: <VendorProducts />,
  //     },
  //     {
  //       key: 2,
  //       title: "Orders",
  //       component: <h1>Orders</h1>,
  //     },
  //   ];

  //     useEffect(() => {
  //         const handleResize = () => {
  //       setwidth(window.innerWidth);
  //     };

  //     window.addEventListener("resize", handleResize);

  //     return () => {
  //       window.removeEventListener("resize", handleResize);
  //     };
  //   }, []);

  const [width, setWidth] = useState(window.innerWidth);

  const logout = () => {
    navigate("/");
    dispatch(setIsAuthenticated(false));
    dispatch(setSuccessAlert(true));
    dispatch(setAlertTitle("Vendor Logged Out"));
    localStorage.clear();
  };
  //   console.log(categories, "sadsadsad");
  return (
    <>
      {/* <ToastContainer />
      <Alert title={'Product Added Successfully'} icon="success" show={true} /> */}
      <Container fluid style={{ overflow: "hidden" }}>
        <Row>
          <div className="mt-4">
            <div className="filter-bar-vendor">
              <Row>
                {screenWidth > 800 && (
                  <Col md={8} lg={8} sm={8} xs={8}>
                    <h3
                      className="mt-2 heading"
                      style={{ marginLeft: "10px", color: "#AA2F33" }}
                    >
                      Vendor Dashboard
                    </h3>
                  </Col>
                )}
                <Col md={8} lg={4} sm={8} xs={8}>
                  <span className={`${screenWidth < 800 ? "mb-2" : "mb-4"}`}>
                    <Row>
                      <>
                        <Col
                          sm={6}
                          md={8}
                          lg={6}
                          xl={6}
                          style={{
                            marginLeft: screenWidth < 768 ? "70%" : "50%",
                          }}
                        >
                        </Col>
                      </>
                    </Row>
                  </span>
                </Col>
              </Row>
            </div>
            <div className="tats-bar-vendor">
              <Row>
                <Col sm={10} md={10} lg={6} xl={6}>
                  <div className="stats-cards">
                    <Row>
                      <Col sm={10} md={10} lg={6} xl={6}>
                        <div className="stats-icon">
                          <FaWallet
                            color="orange"
                            style={{ fontSize: "40px", margin: "5px" }}
                          />
                        </div>
                      </Col>
                      <Col sm={10} md={10} lg={6} xl={6}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                          }}
                        >
                          <h3>{"Total Revenue: CA$ " + totalRevenue}</h3>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                      <p style={{marginLeft: "60%"}}>{`(After deducting 3% of Montreal Fee)`}</p>
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col sm={10} md={10} lg={6} xl={6}>
                  <div className="stats-cards">
                    <Row>
                      <Col sm={10} md={10} lg={6} xl={6}>
                        <div className="stats-icon">
                          <MdInventory
                            color="green"
                            style={{ fontSize: "35px", margin: "5px" }}
                          />
                        </div>
                      </Col>
                      <Col sm={10} md={10} lg={6} xl={6}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                          }}
                        >
                          <h3>{"Total Product Sold: "+vendorSoldData?.length}</h3>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="mt-2 grid-container">
              <>
                <div>
                  <Grid
                    noRowsMessage={"No products added"}
                    rows={vendorSoldData}
                    column={screenWidth < 800 ? mobilegridColumns : gridColumns}
                    gridHeight="auto"
                    isLoading={SoldProductsByVendorId?.isFetching || isLoading}
                  />
                </div>
                <Modal show={show} size="lg" centered>
                  <Modal.Header>
                    <Modal.Title>Products Details</Modal.Title>
                    <IoClose
                      onClick={() => setShow(false)}
                      className="cross-icon"
                    />
                  </Modal.Header>

                  <Modal.Body>
                    <Row>
                      <Col md={9} sm={9} lg={9}>
                        <Row className="mt-2">
                          <Col md={3} sm={3} lg={3}>
                            <h6>Product : </h6>
                          </Col>
                          <Col md={3} sm={3} lg={3}>
                            <p>{soldProduct?.name}</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={3} sm={3} lg={3}>
                            <h6>Price : </h6>
                          </Col>
                          <Col md={3} sm={3} lg={3}>
                            <p>
                              {"CA$" +
                                " " +
                                soldProduct?.price}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={3} sm={3} lg={3}>
                            <h6>Quantity : </h6>
                          </Col>
                          <Col md={3} sm={3} lg={3}>
                            <p>{soldProduct?.quantity}</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={3} sm={3} lg={3}>
                            <h6>Total : </h6>
                          </Col>
                          <Col md={3} sm={3} lg={3}>
                            <p>{soldProduct?.Total}</p>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Modal.Body>
                </Modal>
                {/* Delivery Request Modal */}
                <Modal show={showDeliveryModal} size="md" centered onHide={() => setShowDeliveryModal(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Request Delivery</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form onSubmit={e => { e.preventDefault(); handleDeliverySubmit(); }}>
                      <div className="mb-3">
                        <label className="form-label">Pickup Address</label>
                        <input
                          type="text"
                          className="form-control"
                          value={deliveryFormData.pickupAddress}
                          onChange={e => setDeliveryFormData({ ...deliveryFormData, pickupAddress: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Delivery Address</label>
                        <input
                          type="text"
                          className="form-control"
                          value={deliveryFormData.deliveryAddress}
                          onChange={e => setDeliveryFormData({ ...deliveryFormData, deliveryAddress: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Client Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={deliveryFormData.clientName}
                          onChange={e => setDeliveryFormData({ ...deliveryFormData, clientName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Client Phone Number</label>
                        <input
                          type="text"
                          className="form-control"
                          value={deliveryFormData.clientPhoneNumber}
                          onChange={e => setDeliveryFormData({ ...deliveryFormData, clientPhoneNumber: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Product Details</label>
                        <textarea
                          className="form-control"
                          value={deliveryFormData.productDetails}
                          onChange={e => setDeliveryFormData({ ...deliveryFormData, productDetails: e.target.value })}
                          required
                        />
                      </div>
                      <div className="d-flex justify-content-end">
                        <button type="button" className="btn btn-secondary me-2" onClick={() => setShowDeliveryModal(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-success">
                          Request Delivery
                        </button>
                      </div>
                    </form>
                  </Modal.Body>
                </Modal>
              </>
            </div>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default VendorSoldProducts;
