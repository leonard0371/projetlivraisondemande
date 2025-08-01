import React, { useEffect, useState } from 'react'
import Grid from '../../components/Grid/Grid'
import "./Admin.scss";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Cards from "../../components/Cards/Cards";
// import productImage from "../../assets/product.jpg";
// import productImage2 from "../../assets/product2.jpg";
// import Grid from "../../components/Grid/Grid";
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
import { setShowNavbar } from '../../redux/reducers/projectSlice';
// import { ConfirmAlert } from '../../components/ALert/Alert.component';

const UserManagement = () => {
    const [gridRows, setGridRows] = useState([]);
    const [UserData, setUserData] = useState([]);
    const [addProduct, setAddProduct] = useState(false);
    const [editProduct, setEditProduct] = useState(false);
    const [isDeleteDocument, setIsDeleteDocument] = useState(false);
    const [uploadedFileID, setUploadedFilID] = useState(0);
    const [DeletedProductID, setDeletedProductID] = useState(0);
    const [showPassword, setShowPassword] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [showAlert,setShowAlert] =useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [formDisable, setFormDisable] = useState(false);
    // console.log(addProduct, "fdaskfhaskdfhasdjkfhadsjkfhkasdjf");
    const GetAllUsers = useGetAllData(
        "GetAllUsers",
        endPoints.getAllUsers
    );
    const methods = useForm();
    const saveOrUpdateUser = useAddData("saveOrUpdateUser");
    const updateUser = useAddData("updateUser")
    const handleSubmit = methods.handleSubmit(async (sendData) => {
        setFormDisable(true);
        setIsLoading(true)
        const response = await saveOrUpdateUser.mutateAsync({
            sendData: sendData,
            endPoint: endPoints.saveOrUpdateUser,
        });
        if (response?.status === 200) {
            setFormDisable(false);
            setAddProduct(false);
            GetAllUsers.refetch();
            setIsLoading(false)
            setEditProduct(false);
            dispatch(setSuccessAlert(true))
            dispatch(setAlertTitle("User Added Successfully"))
        } else {
            setFormDisable(false);
            setEditProduct(false);
            setIsLoading(false)
            dispatch(setErrorAlert(true));
            dispatch(setAlertTitle(response?.response?.data?.error));
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
        setIsLoading(true)
        const response = await updateUser.mutateAsync({
            sendData: sendData,
            endPoint: endPoints.updateUser,
        });
        if (response?.status === 200) {
            setFormDisable(false);
            GetAllUsers.refetch();
            setIsLoading(false)
            setAddProduct(false);
            // GetAllProducts.refetch();
            setEditProduct(false);
            dispatch(setSuccessAlert(true))
            dispatch(setAlertTitle("User Updated Successfully"))
        } else {
            setFormDisable(false);
            setIsLoading(false)
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
      const deleteUser = useDeleteData(
        [{ paramName: "id", paramValue: DeletedProductID }],
        ["deleteUser"],
        endPoints.deleteUser,
        isDeleteDocument
      );
      useEffect(() => {
        if (deleteUser?.data) {
          setIsDeleteDocument(false);
          setDeletedProductID(0);
          GetAllUsers.refetch();
          dispatch(setSuccessAlert(true))
          dispatch(setAlertTitle("User Deleted Successfully"))

        }
      }, [deleteUser?.data]);
    const gridColumns = [
        {
            field: "firstName",
            headerName: "Name",
            flex: 1,
            cellStyle: () => ({
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
            }),
        },
        {
            field: "contact",
            headerName: "Contact No.",
            flex: 1,
            cellStyle: () => ({
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
            }),
        },
        {
            field: "role",
            headerName: "Role",
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
            headerName: "Name",
            flex: 1,
            cellStyle: () => ({
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
            }),
        },
        {
            field: "role",
            headerName: "Role",
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

    useEffect(() => {
        if (GetAllUsers?.data) {
            setUserData(() => {
                return GetAllUsers?.data?.map((product) => {
                    return {
                        _id: product?._id,
                        firstName: product?.firstName,
                        lastName: product?.lastName,
                        email: product?.email,
                        contact: product?.contactNumber,
                        role: product?.role,
                        data: product
                    };
                });
            });
        }
    }, [GetAllUsers?.data]);
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
    const handleViewUsers = () => {
        setAddProduct(false);
        setEditProduct(false);
        methods.reset({})
    };
    const AddNewUser = () => {
        setAddProduct(true);
        setShowPassword(true);
        methods.reset({
        });
    };
//     const logout = () => {
//         dispatch(setShowNavbar(true));
//         navigate("/");
//     dispatch(setIsAuthenticated(false))
//     dispatch(setSuccessAlert(true));
//     dispatch(setAlertTitle("Admin Logged Out"));
//   localStorage.clear();
//     }
    const roles = [
        'user', 'admin'
    ]
    return (
        <div>
            {/* <div>
            <ConfirmAlert
            title="Confirm Delete User?"
            icon="warning"
            show={showAlert}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
            </div> */}
            <div className="">
                <div className="filter-bar">
                    <Row>
                        <Col md={9} lg={9} sm={9}>
                            <h3 className="mt-2 heading" style={{ color: "#AA2F33" }}>Admin Dashboard</h3>
                        </Col>
                        <Col md={3} lg={3} sm={3}>
                            <Row>
                                <Col>
                                    <span className="mb-4">
                                        {addProduct ? (
                                            <Button
                                                text={"View Users"}
                                                width="250px"
                                                onClick={handleViewUsers}
                                            />
                                        ) : (
                                            <Button
                                                text={"Add New User"}
                                                width="250px"
                                                onClick={AddNewUser}
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
                                    <Row>
                                        <Col md={6} lg={6} sm={6}>
                                            <InputField
                                                id="firstName"
                                                name="firstName"
                                                placeholder="Enter Name"
                                                defaultValue=""
                                                required={true}
                                            />
                                        </Col>
                                        <Col md={6} lg={6} sm={6}>
                                            <InputField
                                                id="email"
                                                name="email"
                                                type='email'
                                                placeholder="Enter Email"
                                                defaultValue=""
                                                required={true}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6} lg={6} sm={6} className='mt-4'>
                                            <InputField
                                                id="contactNumber"
                                                name="contactNumber"
                                                placeholder="Enter Contact no"
                                                defaultValue=""
                                                type='phone'
                                                // required={true}
                                                maxLength={11}                                            
                                            />
                                        </Col>
                                        <Col sm={6} md={6} lg={6} xl={6}>
                                            <Select
                                                id="role"
                                                name="role"
                                                placeholder="   ---Select User Role---  "
                                                defaultValue=""
                                                required={true}
                                                labelKey="roles"
                                                options={roles}

                                            />
                                        </Col>
                                    </Row>
                                    {showPassword && (
                                        <Row>
                                            <InputField
                                                name={"password"}
                                                type='password'
                                                id="password"
                                                placeholder='Enter Password'
                                                required={true}
                                            />
                                        </Row>
                                    )}
                                    <Row>
                                        {editProduct ? (
                                            <Button text={"Update"} onClick={handleUpdate} isLoading={isLoading} />
                                        ) : (
                                            <Button text={"Create"} onClick={handleSubmit} isLoading={isLoading} />
                                        )}
                                    </Row>
                                    </fieldset>
                                </FormProvider>
                            </Container>
                        </>
                    ) : (
                        <Grid
                            noRowsMessage="No Rows To Show"
                            rows={UserData}
                            column={screenWidth > 768 ? gridColumns : mobileGridColumns}
                            isLoading={GetAllUsers?.isFetching || deleteUser.isLoading}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserManagement