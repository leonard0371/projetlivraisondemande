import React, { useEffect, useState } from 'react'
import "./Admin.scss";
import { Tabs, Tab, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useGetAllData } from "../../api/apiCalls";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useQueryClient } from 'react-query';
import VendorTabContent from './VendorTabContent';
import { endPoints } from "../../api/api";
import { MdSend } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import {
  setAlertTitle,
  setErrorAlert,
  setSuccessAlert,
} from "../../redux/reducers/patientSlice";


const PaymentProcess = ({ refetchVendors ,setRefetchVendors}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const queryClient = useQueryClient() 
  const methods = useForm();

  
  const [screenWidth, setscreenWidth] = useState(window.innerWidth);
  const [vendorPaymentData, setVendorPaymentData]  = useState([])
  const [activeTab, setActiveTab] = useState("vendorUnpaid");

  const [showModal, setShowModal] = useState(false);
  const [selectedParams, setSelectedParams] = useState(null);

  const GetAllVendor = useGetAllData("GetAllVendor", endPoints.getAllVendor);
  const GetAllVendorUnPaid = useGetAllData("GetAllVendorUnpaid", endPoints.getAllVendorUnPaid);  
  const API_URL = import.meta.env.VITE_APP_API_URL;
  






  useEffect(() => {
    const handleResize = () => {
      setscreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  
  const filterVendorUnpaid = GetAllVendorUnPaid?.data?.filter(
    // (item) => item.IsActive === false || item.IsActive === null
    (item) => item.status === 'unpaid' 
  );
  // console.log('filter vendor unpaid', filterVendorUnpaid)

    useEffect(() => {
      if (GetAllVendorUnPaid?.data?.length> 0) {
        const filteredData = GetAllVendorUnPaid.data
        .filter((item) => {
          if(activeTab === "vendorUnpaid") return item.status === "unpaid";
          if(activeTab === "vendorpending") return item.status === "pending";
          if(activeTab === "vendorpaid") return item.status === "paid";
          return false;
        })
        .map((item) => ({
          _id: item?._id,
          orderId: item?.orderId,
          vendorId: item?.vendorId,
          amount: item?.amount?.$numberDecimal,
          status: item?.status,
          email: item?.vendor?.email,
          data: item,
        }));

        setVendorPaymentData(filteredData)
      }
    }, [GetAllVendorUnPaid?.data, activeTab]);

  const handleView = (params) => {
    console.log('params', params.data)
    setSelectedParams(params.data);  // Tu récupères les infos utiles ici
    setShowModal(true);
   
   
  };
  
  // const handleConfirmPayment = async () => {
  //   try {
  //   const response = await fetch(API_URL + '/api/stripe/pay-vendor', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       orderId: selectedParams?.orderId,
  //       vendorId: selectedParams?.vendorId,
  //     }),
  //   });

  //   const result = await response.json();
  //   console.log('result', result)

  //   if (!response.ok) {
  //     // Message d'erreur ou information
  //     alert(result.message || result.details || 'Une erreur est survenue.');

  //     // Affiche si un email a été envoyé pour l'onboarding
  //     if (result.onboardingLink) {
  //       alert("Un email d'onboarding a déjà été envoyé au vendeur.");
  //     }
  //   } else {
  //     // Paiement effectué avec succès
  //     alert(result.message || 'Paiement effectué avec succès.');
  //   }

  //   } catch (err) {
  //     console.error('Erreur réseau ou serveur', err);
  //     alert("Une erreur réseau est survenue. Veuillez réessayer plus tard.");
  //   }
  // }

  const handleConfirmPayment = async () => {
  
    try {
      const response = await fetch(API_URL + '/api/stripe/pay-vendor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: selectedParams?.orderId,
          vendorId: selectedParams?.vendorId,
        }),
      });
  
      const result = await response.json();
      console.log('result', result);
  
      if (!response.ok) {
        dispatch(setErrorAlert(true));
        dispatch(setAlertTitle(result.message || result.details || "Une erreur est survenue."));
  
        if (result.onboardingLink) {
        
          dispatch(setAlertTitle(result.message || "Email envoyé."));
        }

        // Réinitialisation après 5 secondes
        setTimeout(() => {
          dispatch(setErrorAlert(false));
          dispatch(setAlertTitle(""));
        }, 5000);
        
      } else {
        dispatch(setSuccessAlert(true));
        dispatch(setAlertTitle(result.message || "Paiement effectué avec succès."));

        setTimeout(() => {
          dispatch(setSuccessAlert(false));
          dispatch(setAlertTitle(""));
        }, 5000);
      
      }
    } catch (err) {
      console.error('Erreur réseau ou serveur', err);
      dispatch(setErrorAlert(true));
      dispatch(setAlertTitle("Une erreur réseau est survenue. Veuillez réessayer plus tard."));
    }
  };


  const gridColumns = [
    {
      field: "orderId", headerName: "Order Id", flex: 1,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }),
    },
    {
      field: "vendorId", headerName: "Vendor Id", flex: 1,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }),
    },
    {
      field: "amount", headerName: "Montant", flex: 1,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }),
    },

    {
      field: "status", headerName: "Status", flex: 1,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }),
    },
    
    ...(activeTab === "vendorUnpaid"
      ? [
      {
        field: "View", headerName: "Send Money",
        cellRenderer: (params) => (
          <div className="flex items-center justify-start">
            <a onClick={() => handleView(params)} className="cursor-pointer text-blue-500 hover:text-blue-700 mt-3 ml-6">
              <MdSend size={15} />
            </a>
          </div>
        ),
        flex: 1,
      }
      
    ]
    : []
    )

    ,
  ];
  const mobileGridColumns = [
    {
      field: "orderId",
      headerName: "Order Id",
      flex: 1,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }),
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }),
    },

   ...(activeTab === "vendorUnpaid"
    ? [
      {
        field: "View",
        headerName: "Send Money",
        cellRenderer: (params) => (
          <>
            <Row>
              <Col>
                <a onClick={() => handleView(params)}>
                <span style={{cursor:"pointer"}}> <MdSend /></span>
                </a>
              </Col>
  
            </Row>{" "}
          </>
        ),
        flex: 1,
        cellStyle: () => ({
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
        }),
      }]
    :[]),
  ];

  const handleSelectTab = (k) => {
    setActiveTab(k);
  };

  return (
    <div>
      {/* <Tabs defaultActiveKey="vendorUnpaid" id="vendor-tabs" className="mb-3"> */}
      <Tabs activeKey={activeTab} onSelect={handleSelectTab} id="vendor-tabs" className="mb-3">
        
      <Tab
          eventKey="vendorUnpaid"
          title={
            <h3 className="mt-2 heading" style={{ color: "#AA2F33" , fontWeight: "400"  }}>
             Unpaid
            </h3>
          }
        >
          <VendorTabContent
            rows={vendorPaymentData}
            columns={screenWidth > 768 ? gridColumns : mobileGridColumns}
            isGridLoading={GetAllVendor?.isFetching}
          />
        </Tab>
  
        {/* <Tab eventKey="vendorpending" title="Pending"> */}
        <Tab
          eventKey="vendorpending"
          title={
            <h3 className="mt-2 heading" style={{ color: "#AA2F33" , fontWeight: "400" }}>
             Pending
            </h3>
          }
        >
          <VendorTabContent          
            rows={vendorPaymentData}
            columns={screenWidth > 768 ? gridColumns : mobileGridColumns}
            isGridLoading={GetAllVendor?.isFetching}
          />
        </Tab>

        {/* <Tab eventKey="vendorpaid" title="Paid"> */}
        <Tab
          eventKey="vendorpaid"
          title={
            <h3 className="mt-2 heading" style={{ color: "#AA2F33" , fontWeight: "400"  }}>
             Paid
            </h3>
          }
        >
          <VendorTabContent         
            rows={vendorPaymentData}
            columns={screenWidth > 768 ? gridColumns : mobileGridColumns}
            isGridLoading={GetAllVendor?.isFetching}
          />
        </Tab>
  
      </Tabs>

      {showModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
      
      <h2 className="text-xl font-bold mb-4">Send Money Confirmation</h2>
      
      {/* Informations principales */}
      <div className="mb-4">
      <p><strong>Email Vendeur:</strong> {selectedParams?.email}</p>
        <p><strong>Amount:</strong> ${selectedParams?.amount?.$numberDecimal || selectedParams?.amount}</p> 
      </div>

    {/* Liste des Items améliorée */}
<div className="mb-6">
  <h3 className="text-xl font-bold mb-4 text-gray-700">Items</h3>
  <div className="grid grid-cols-1 gap-4 max-h-80 overflow-y-auto pr-2">
    {selectedParams?.data.items?.map((item, index) => (
      <div key={item._id || index} className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition duration-200 bg-white">
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold text-gray-800">{item.name}</p>
          <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <p>Price:</p>
          <p>${item.price?.$numberDecimal || item.price}</p>
        </div>
      </div>
    ))}
  </div>
</div>


      {/* Boutons */}
      <div className="flex justify-end space-x-4 mt-6">
        <button 
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          // onClick={() => {
          //   // Logique pour envoyer l'argent ici
          //   setShowModal(true);
          // }}
          onClick={handleConfirmPayment}
        >
          Confirm
        </button>
      </div>

    </div>
  </div>
)}

    </div>
  );
}
export default PaymentProcess