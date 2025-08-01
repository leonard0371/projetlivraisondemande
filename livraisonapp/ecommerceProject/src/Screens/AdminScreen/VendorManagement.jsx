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
import {
  setAlertTitle,
  setErrorAlert,
  setIsAuthenticated,
  setSuccessAlert,
} from "../../redux/reducers/patientSlice";
import { IoMdLogOut } from "react-icons/io";
import { useQueryClient } from "react-query";
import { setShowNavbar } from "../../redux/reducers/projectSlice";

const VendorManagement = ({
  setInActiveVendor,
  refetchVendors,
  setRefetchVendors,
}) => {
  const [gridRows, setGridRows] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [addProduct, setAddProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(false);
  const [isDeleteDocument, setIsDeleteDocument] = useState(false);
  const [uploadedFileID, setUploadedFilID] = useState(0);
  const [DeletedProductID, setDeletedProductID] = useState(0);
  const [showPassword, setShowPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formDisable, setFormDisable] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // console.log(addProduct, "fdaskfhaskdfhasdjkfhadsjkfhkasdjf");
  // console.log(GetAllVendor?.data, "9380498304");
  // console.log(addUpdateVendor?.isLoading,"isLoadingisLoading")
  // console.log(filterVendor, "dwad49846");
  const GetAllVendor = useGetAllData("GetAllVendor", endPoints.getAllVendor);
  const inActiveVendors = GetAllVendor?.data?.filter(
    (item) => item.IsActive === false || item.IsActive === null
  );
  const methods = useForm();
  const addUpdateVendor = useAddData("addUpdateVendor");
  const role = localStorage.getItem("Role");

  const filterVendor = GetAllVendor?.data?.filter(
    (vendor) => vendor?.IsActive === true
  );

  useEffect(() => {
    if (refetchVendors) {
      GetAllVendor.refetch();
      setRefetchVendors(false);
    }
  }, [refetchVendors]);

  const handleSubmit = methods.handleSubmit(async (sendData) => {
    setFormDisable(true);
    sendData.IsActive = true;
    sendData.role = "vendor";
    setIsLoading(true);
    const response = await addUpdateVendor.mutateAsync({
      sendData: sendData,
      endPoint: endPoints.saveorUpdateVendor,
    });
    if (response?.status === 200) {
      setFormDisable(false);
      setIsLoading(false);
      setAddProduct(false);
      // GetAllVendor.refetch();
      queryClient.invalidateQueries("GetAllVendor");
      setEditProduct(false);
      dispatch(setSuccessAlert(true));
      dispatch(setAlertTitle("Vendor Added Successfully"));
    } else {
      setFormDisable(false);
      setIsLoading(false);
      setEditProduct(false);
      dispatch(setErrorAlert(true));
      dispatch(setAlertTitle("Something Went Wrong"));
    }
  });
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
    setFormDisable(true);
    // sendData.price = +sendData.price;
    // setIsLoading(true);
    const response = await addUpdateVendor.mutateAsync({
      sendData: sendData,
      endPoint: endPoints.updateVendor,
    });
    if (response?.status === 200) {
      setFormDisable(false);
      GetAllVendor.refetch();
      // setIsLoading(false);
      setAddProduct(false);
      // GetAllProducts.refetch();
      setEditProduct(false);
      dispatch(setSuccessAlert(true));
      dispatch(setAlertTitle("Vendor Updated Successfully"));
    } else {
      setFormDisable(false);
      setIsLoading(false);
      dispatch(setErrorAlert(true));
      dispatch(setAlertTitle("Something Went Wrong"));
    }
  });
  const handleView = (params) => {
    setEditProduct(true);
    // console.log(params, "afsdjkfhksjahfaksjhfsakfjahsf");
    setAddProduct(true);
    methods.reset(params.data.data);
    // console.log(params.data, "sssssssssss");
    setShowPassword(false);
  };
  const deleteVendor = (params) => {
    // console.log(params?.data, "dafsddfjaskasdf");
    setDeletedProductID(params.data._id);
    setIsDeleteDocument(true);
  };
  const deleteVendors = useDeleteData(
    [{ paramName: "id", paramValue: DeletedProductID }],
    ["deleteVendor"],
    endPoints.deleteVendor,
    isDeleteDocument
  );
  useEffect(() => {
    if (deleteVendors?.data) {
      setIsDeleteDocument(false);
      setDeletedProductID(0);
      GetAllVendor.refetch();
    }
  }, [deleteVendors?.data]);

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
            <Col>
              <a onClick={() => deleteVendor(params)}>
              <span style={{cursor:"pointer"}}><RiDeleteBin5Line /></span>
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
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
      }),
    },
    //   cellRenderer: (params) => {
    //     const Usage = params.data.Usage;
    //     if (Usage?.length > 20) {
    //       return <span title={Usage}>{Usage?.substring(0, 17)}...</span>;
    //     } else {
    //       return <span title={Usage}>{Usage}</span>;
    //     }
    //   },

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
            <Col>
              <a onClick={() => deleteVendor(params)}>
              <span style={{cursor:"pointer"}}><RiDeleteBin5Line /></span>
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

  useEffect(() => {
    if (GetAllVendor?.data) {
      setInActiveVendor(inActiveVendors);
      setVendorData(() => {
        return filterVendor?.map((product) => {
          return {
            _id: product?._id,
            companyName: product?.companyName,
            firstName: product?.firstName,
            lastName: product?.lastName,
            email: product?.email,
            data: product,
            status: product?.IsActive,
          };
        });
      });
    }
  }, [GetAllVendor?.data, GetAllVendor?.isFetching]);
  // console.log(inActiveVendors, "inActiveVendorsinActiveVendors");
  // useEffect(() => {
  //   // if (productData) {
  //   //   setGetAlcoholEnabled(false);
  //   setGridRows(() => {
  //     return productData.map((vendor) => {
  //       return {
  //         name: vendor.name,
  //         price: vendor.price,
  //         description: vendor.description,
  //         // AllComments: vendor.AllComments,
  //         vendorData: vendor,
  //       };
  //     });
  //   });
  //   // }
  // }, []);
  const addproducts = () => {
    // setAddProduct(true);
  };
  const handleViewProduct = () => {
    setAddProduct(false);
    setEditProduct(false);
  };
  const AddNewProduct = () => {
    setAddProduct(true);
    setShowPassword(true);
    methods.reset({
      firstName: "",
    });
  };
  // const logout = () => {
  //   dispatch(setShowNavbar(true));
  //   navigate("/");
  //   dispatch(setIsAuthenticated(false));
  //   localStorage.clear();
  //   dispatch(setSuccessAlert(true));
  //   dispatch(setAlertTitle("Admin Logged Out"));
  // };
  return (
    <div>
      <div className="">
        <div className="filter-bar">
          <Row>
            <Col md={9} lg={9} sm={9}>
              <h3 className="mt-2 heading" style={{ color: "#AA2F33" }}>
                Admin Dashboard
              </h3>
            </Col>
            <Col md={3} lg={3} sm={3}>
              <Row>
                <Col>
                  <span className="mb-4">
                    {addProduct ? (
                      <Button
                        text={"View Vendors"}
                        width="250px"
                        onClick={handleViewProduct}
                      />
                    ) : (
                      <Button
                        text={"Add New Vendor"}
                        width="250px"
                        onClick={AddNewProduct}
                      />
                    )}
                  </span>
                </Col>
                {/* <Col className="mt-2" style={{ cursor: "pointer" }}>
                  <IoMdLogOut size={"30px"} onClick={logout} />
                </Col> */}
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
                  <AddVendorComponent
                    setShowPassword={setShowPassword}
                    showPassword={showPassword}
                  />

                  <Row>
                    {editProduct ? (
                      <Button
                        text={"Update"}
                        onClick={handleUpdate}
                        isLoading={addUpdateVendor?.isLoading}
                      />
                    ) : (
                      <Button
                        text={"Create"}
                        onClick={handleSubmit}
                        isLoading={isLoading}
                      />
                    )}
                  </Row>
                  </fieldset>
                </FormProvider>
              </Container>
            </>
          ) : (
            <Grid
              noRowsMessage="No Rows To Show"
              rows={vendorData}
              column={screenWidth > 768 ? gridColumns : mobileGridColumns}
              isLoading={GetAllVendor?.isFetching || GetAllVendor?.isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorManagement;
