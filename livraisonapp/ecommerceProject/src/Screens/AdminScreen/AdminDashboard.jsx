import React, { useEffect, useState } from "react";
import "./Admin.scss";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Cards from "../../components/Cards/Cards";
// import productImage from "../../assets/product.jpg";
// import productImage2 from "../../assets/product2.jpg";
import Grid from "../../components/Grid/Grid";
import Button from "../../components/Input/Button";
import { FaEye } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { endPoints } from "../../api/api";
import { useAddData, useDeleteData, useGetAllData } from "../../api/apiCalls";
import AddSingleProduct from "../../components/AddProduct/AddSingleProduct";
import { FormProvider, useForm } from "react-hook-form";
import TextArea from "../../components/TextArea/TextArea";
import InputField from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import AddVendorComponent from "../Vendor/AddVendor.component";
import { IoHome } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { setIsAuthenticated } from "../../redux/reducers/patientSlice";
import { IoMdLogOut } from "react-icons/io";
import TabComponent from "../../components/TabComponent/TabComponent";
import VendorManagement from "./VendorManagement";
import UserManagement from "./UserManagement";
import PendingRequests from "./PendingRequests";
import PaymentProcess from "./PaymentProcess";
import AdminWallet from "./AdminWallet";

function AdminDashboard() {
const [InActiveVendor,setInActiveVendor] = useState({})
const [refetchVendors,setRefetchVendors] = useState(false)
  const tabsData = [
    {
      defaultActiveKey:{},
      title:"Wallet",
      content:<AdminWallet/>,
      eventKey:"Wallet"
    },
    {
      defaultActiveKey:{},
      title:"Vendors",
      content:<VendorManagement setInActiveVendor={setInActiveVendor} setRefetchVendors={setRefetchVendors}/>,
      eventKey:"Vendor"
    },
    {
      defaultActiveKey:{},
      title:"Users",
      content:<UserManagement/>,
      eventKey:"User"
    },
    {
      defaultActiveKey:{},
      title:"Requests",
      content:<PendingRequests refetchVendors={refetchVendors} GetAllVendor={InActiveVendor} setRefetchVendors={setRefetchVendors}/>,
      eventKey:"Requests"
    },

    {
      defaultActiveKey:{},
      title:"Payment Vendor",
      content:<PaymentProcess refetchVendors={refetchVendors} GetAllVendor={InActiveVendor} setRefetchVendors={setRefetchVendors}/>,
      eventKey:"Payment"
    }

    // {
    //   defaultActiveKey: {},
    //   title: "Payment Vendor",
    //   content: (
    //     <Elements stripe={stripePromise}>
    //       <PaymentProcess 
    //         refetchVendors={refetchVendors} 
    //         GetAllVendor={InActiveVendor} 
    //         setRefetchVendors={setRefetchVendors} 
    //       />
    //     </Elements>
    //   ),
    //   eventKey: "Payment"
    // }
    
    
  ]
  return (
    <>
      <Container fluid style={{ overflowX: "hidden" }}>
        <TabComponent tabData={tabsData}/>
      </Container>
    </>
  );
}

export default AdminDashboard;
