import React, { useEffect, useState } from "react";
import Grid from "../../components/Grid/Grid";
import "./Admin.scss";
import { Col, Container, Row } from "react-bootstrap";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsAuthenticated,
  setAlertTitle,
  setSuccessAlert,
} from "../../redux/reducers/patientSlice";
// import {  useGetAllData } from "../api/apiCalls";
// import { endPoints } from "../api/api";
import { useGetAllData, useGetDataByID } from "../../api/apiCalls";
import { endPoints } from "../../api/api";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdInventory, MdOutlineEdit } from "react-icons/md";
import ProductModal from "./ProductModal";
import "./Admin.scss";
import { FaWallet } from "react-icons/fa";
import { setShowNavbar } from "../../redux/reducers/projectSlice";

const AdminWallet = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [soldData, setSoldData] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [show, setShow] = useState(false);
  const [productData, setProductData] = useState({});
  // const jsonData = useGetAllData("jsonPlaceHolderData", endPoints.posts);
  const soldProducts = useGetAllData(
    "soldProducts",
    endPoints.soldproducts,
    isEnabled
  );

  // console.log(soldProducts?.data?.calcPercentage, "dwad68468456");

  useEffect(() => {
    if (soldProducts?.data) {
      setIsEnabled(false);
      setSoldData(() => {
        return soldProducts?.data?.products
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
  }, [soldProducts?.data]);

  // console.log(soldData, "dwadadada");

  // const productsById = useGetDataByID({});

  const handleView = (params) => {
    // console.log(params?.data, "dawdwadawdawdadawdwadwadadawdwadwa");
    setShow(true);
    setProductData(params?.data);
  };

  const gridColumns = [
    {
      field: "name",
      headerName: "Product Name",
      flex: 1,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }),
    },
    {
      field: "price",
      headerName: "Price",
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
      field: "Total",
      headerName: "Amount",
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
              <a onClick={() => handleView(params)}>
                {/* <MdOutlineEdit /> */}
                <span style={{ color: "#AA2F33" , cursor:"pointer"}}>view</span>
              </a>
            </Col>
          </Row>{" "}
          {/* <a className="column-row-action">View</a> */}
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

  const showNavbar = useSelector(e => e.project.showNavbar)
  // const logout = () => {
  //   dispatch(setShowNavbar(true));
  //   console.log(showNavbar,"97452dawd")
  //   navigate("/");
  //   dispatch(setIsAuthenticated(false));
  //   localStorage.clear();
  //   dispatch(setSuccessAlert(true));
  //   dispatch(setAlertTitle("Admin Logged Out"));
  // };

  // const soldProducts = useGetAllData("soldProducts", endPoints.soldProducts);

  // useEffect(() => {
  //   if (soldProducts.data) {
  //     //   handleCheckOutItems();
  //     //   setStripeEnabled(false);
  //     // setSessionIds(null);
  //   }
  // }, [soldProducts.data]);

  return (
    <div>
      <ProductModal show={show} setShow={setShow} data={productData} />
      <div className="">
        <div className="filter-bar">
          <Row>
            <Col md={9} lg={9} sm={9}>
              <h3 className="mt-2 heading" style={{ color: "#AA2F33"}}>
                Admin Dashboard
              </h3>
            </Col>
            <Col md={3} lg={3} sm={3}>
              {/* <Row>
                <Col className="mt-2" style={{ cursor: "pointer" , marginLeft:"60%"}}>
                  <IoMdLogOut size={"30px"} onClick={logout} />
                </Col>
              </Row> */}
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
                          {/* <FaMoneyBillTrendUp
                            style={{
                              fontSize: "45px",
                              margin: "5px",
                              color: "#85BB65",
                            }}
                          /> */}
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
                        <h3 className="ms-2">{"Total Products Sold: " + soldData?.length} </h3>
                        </div>
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
                            style={{ fontSize: "45px", margin: "5px" }}
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
                          {/* <h2>Total Product Sold: </h2> */}
                          {/* <h3>{"Total Product Sold: "+vendorSoldData?.length}</h3> */}
                          <h4>Total Revenue: </h4>
                          <h5 className="ms-2">{"CA$" + soldProducts?.data?.calcPercentage.toFixed(2)}</h5>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                      <p style={{marginLeft: "60%"}}>{`(After Adding 3% from Vendors Revenue)`}</p>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </div>
        <div className="mt-2 grid-container">
          <Grid
            noRowsMessage="No Rows To Show"
            rows={soldData}
            column={gridColumns}
            isLoading={soldData?.isFetching || soldData?.isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminWallet;
