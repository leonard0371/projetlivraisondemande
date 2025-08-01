import React, { useEffect, useState } from 'react'
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
import { setAlertTitle, setErrorAlert, setIsAuthenticated, setSuccessAlert } from "../../redux/reducers/patientSlice";
import { IoMdLogOut } from "react-icons/io";
import CheckBox from '../../components/Checkbox/Checkbox';
import { DevTool } from '@hookform/devtools';
import { useQueryClient } from 'react-query';

const PendingRequests = ({ refetchVendors ,setRefetchVendors}) => {
  const [gridRows, setGridRows] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [addProduct, setAddProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(false);
  const [isDeleteDocument, setIsDeleteDocument] = useState(false);
  const [uploadedFileID, setUploadedFilID] = useState(0);
  const [DeletedProductID, setDeletedProductID] = useState(0);
  const [showPassword, setShowPassword] = useState(true);
  // const [accountStatus, setAccountStatus] = useState("");
  const [formDisable, setFormDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate();
  //console.log(GetAllVendor, "fdaskfhaskdfhasdjkfhadsjkfhkasdjf");
  const queryClient = useQueryClient()

  // const inActiveVendors = GetAllVendor?.data?.filter((item)=>item.IsActive === false)
  const methods = useForm();
  const addUpdateVendor = useAddData("updateVendorStatus");
  const GetAllVendor = useGetAllData("GetAllVendor", endPoints.getAllVendor);
  
// console.log(GetAllVendors,"wa6f4ag6awg4ag")

  const [screenWidth, setscreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setscreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleUpdate = methods.handleSubmit(async (sendData) => {
    // sendData.price = +sendData.price;
    setFormDisable(true)
    setIsLoading(true);
    sendData.IsActive = sendData.IsActive === "Accept" ? true : (sendData.IsActive === "Reject" ? false : null);
    delete sendData?.data;
    // console.log(sendData,"65A4F6AWF4A646");
    const response = await addUpdateVendor.mutateAsync({
      sendData: sendData,
      endPoint: endPoints.updateVendor,
    });
    if (response?.status === 200) {
      setFormDisable(false)
      setRefetchVendors(true)
      // GetAllVendor.refetch();
      setIsLoading(false)
      setAddProduct(false);
      dispatch(setSuccessAlert(true))
      dispatch(setAlertTitle("Vendor Updated Successfully"))
      queryClient.invalidateQueries('GetAllVendor');
      // GetAllVendor.refetch();
      setEditProduct(false);
    } else {
      setFormDisable(false)
      setIsLoading(false)
      dispatch(setErrorAlert(true));
      dispatch(setAlertTitle("Something Went Wrong"));
    }
  });

  const handleView = (params) => {
    // console.log(params.data.data, "afsdjkfhksjahfaksjhfsakfjahsf");
    // const accountStatus = params.data.data.IsActive === true ? "Accept" : "Reject" ? "Pending" : "";
    let status;
    if(params.data.IsActive === true){
      // setAccountStatus("Accept");
      status="Accept";
    }
    else if(params.data.IsActive === false){
      // setAccountStatus("Reject");
      status="Reject";
    }
    else{
      // setAccountStatus("Pending");
      status="Pending";
    }
    // console.log(params.data.data.IsActive,status, 'accountStatusaccountStatus')
    // console.log(accountStatus)
    
    methods.reset({
      ...params?.data,
      ...params?.data?.data,
      IsActive: status,
    });
    setEditProduct(true);
    setAddProduct(true);
    setShowPassword(false);
  };

  const deleteVendor = (params) => {
    // //console.log(params?.data, "dafsddfjaskasdf");
    setDeletedProductID(params.data._id);
    setIsDeleteDocument(true);
  };



  const gridColumns = [
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }),
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }),
    },
    {
      field: "companyName",
      headerName: "Company Name",
      flex: 1,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }),
      //   cellRenderer: (params) => {
      //     const Usage = params.data.Usage;
      //     if (Usage?.length > 20) {
      //       return <span title={Usage}>{Usage?.substring(0, 17)}...</span>;
      //     } else {
      //       return <span title={Usage}>{Usage}</span>;
      //     }
      //   },
    },

    {
      field: "email",
      headerName: "Email",
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
            {/* <Col>
              <a onClick={() => navigate("/vendor-products")}>
                <FaEye />
              </a>
            </Col> */}
            <Col>
              <a onClick={() => handleView(params)}>
               <span style={{cursor:"pointer"}}> <MdOutlineEdit /></span>
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
  const mobileGridColumns = [
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }),
    },
    // {
    //   field: "lastName",
    //   headerName: "Last Name",
    //   flex: 1,
    //   cellStyle: () => ({
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "start",
    //   }),
    // },
    {
      field: "companyName",
      headerName: "Company Name",
      flex: 1,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }),
      //   cellRenderer: (params) => {
      //     const Usage = params.data.Usage;
      //     if (Usage?.length > 20) {
      //       return <span title={Usage}>{Usage?.substring(0, 17)}...</span>;
      //     } else {
      //       return <span title={Usage}>{Usage}</span>;
      //     }
      //   },
    },

    // {
    //   field: "email",
    //   headerName: "Email",
    //   flex: 1,
    //   cellStyle: () => ({
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "start",
    //   }),
    // },
    {
      field: "View",
      headerName: "Actions",
      cellRenderer: (params) => (
        <>
          <Row>
            {/* <Col>
              <a onClick={() => navigate("/vendor-products")}>
                <FaEye />
              </a>
            </Col> */}
            <Col>
              <a onClick={() => handleView(params)}>
              <span style={{cursor:"pointer"}}> <MdOutlineEdit /></span>
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

  // console.log(GetAllVendors,"dwa5f4aw68faf4aw8f4g8awg")

const filterVendor = GetAllVendor?.data?.filter(
    (item) => item.IsActive === false || item.IsActive === null
  );

  useEffect(() => {
    console.log(GetAllVendor?.data,"dwada5fw7")
    if (GetAllVendor?.data?.length>0) {
      setVendorData(() => {
        return filterVendor?.map((product) => {
          // console.log(product,"waf684a6ga")
          // if(product.IsActive === false || product.IsActive === null){
            // console.log(product,"waf684a6ga5454")
            return {
              _id: product?._id,
              companyName: product?.companyName,
              firstName: product?.firstName,
              lastName: product?.lastName,
              email: product?.email,
              data: product
            };
        });
      });
    }
  }, [GetAllVendor?.data,GetAllVendor?.isFetching ]);

  const handleViewProduct = () => {
    setAddProduct(false);
    setEditProduct(false);
  };
  const AddNewProduct = () => {
    setAddProduct(true);
    setShowPassword(true);
    methods.reset({
      firstName: ""
    });
  };
  // const logout = () => {
  //   navigate("/");
  //   dispatch(setIsAuthenticated(false))
  //   localStorage.clear();
  //   dispatch(setSuccessAlert(true));
  //   dispatch(setAlertTitle("Admin Logged Out"));
  // }
  const optionss= [
    "Accept", "Reject", "Pending"
  ]
  return (
    <div>
      <div className="">
        <div className="filter-bar">
          <Row>
            <Col md={9} lg={9} sm={9}>
              <h3 className="mt-2 heading" style={{ color: "#AA2F33" }}>Vendor Requests</h3>
            </Col>
            <Col md={3} lg={3} sm={3}>
              <Row>
                <Col>
                  <span className="mb-4">
                    {addProduct && (
                      <Button
                        text={"View Requests"}
                        width="250px"
                        onClick={handleViewProduct}
                      />
                    )}
                  </span>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div className="mt-2 grid-container">
          {addProduct ? (
            <>
              {/* <AddSingleProduct/> */}
              <Container fluid className="product-form mt-4 mb-4">
                <FormProvider {...methods}>
                <fieldset disabled={formDisable}>
                  <Row>
                    <Col md={6} lg={6}>
                      <Select
                        id="IsActive"
                        name="IsActive"
                        placeholder="Account Status"
                        defaultValue=""
                        required={true}
                        labelKey="IsActive"
                        options={optionss}
                        label={"Select Account Status"}
                      // type="number"
                      />
                    </Col>
                  </Row>
                  <AddVendorComponent setShowPassword={setShowPassword} showPassword={showPassword} />

                  <Row>
                    {/* {editProduct ? ( */}
                    <Button text={"Update"} onClick={handleUpdate} isLoading={isLoading} />
                  </Row>
                  </fieldset>
                </FormProvider>
                {/* <DevTool control={methods.control} /> */}
              </Container>
            </>
          ) : (
            <Grid
              noRowsMessage="No Rows To Show"
              rows={vendorData}
              column={screenWidth > 768 ? gridColumns : mobileGridColumns}
              isLoading={GetAllVendor?.isFetching}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default PendingRequests