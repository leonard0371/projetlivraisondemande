// import { useState } from "react";
import TabComponent from "../../components/TabComponent/TabComponent";
import "./Vendor.scss";
// import AdminWallet from "../AdminScreen/AdminWallet";
// import VendorManagement from "../AdminScreen/VendorManagement";
import { Container } from "react-bootstrap";
// import VendorSoldProducts from "./";
import VendorAllProducts from "./VendorAllProducts";
import VendorSoldProducts from "./VendorSoldProducts";

// import React from 'react'
const tabsData = [
  {
    defaultActiveKey:{},
    title:"Products",
    content:<VendorAllProducts />,
    eventKey:"VendorAllProducts"
  },
  {
    defaultActiveKey:{},
    title:"Solds",
    content:<VendorSoldProducts/>,
    eventKey:"VendorSoldProducts"
  },
]

const VendorDashboard = () => {
  return (
    <>
    <Container fluid style={{ overflowX: "hidden" }}>
      <TabComponent tabData={tabsData}/>
    </Container>
  </>
  )
}

export default VendorDashboard