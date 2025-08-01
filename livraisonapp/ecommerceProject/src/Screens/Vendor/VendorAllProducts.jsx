import React, { useEffect, useState } from "react";
import "./Vendor.scss";
import { ButtonGroup, Col, Container, Dropdown, Row } from "react-bootstrap";
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
import { formatPrice } from "../../utilitaire/utils";
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
  setErrorAlert,
  setIsAuthenticated,
  setSuccessAlert,
} from "../../redux/reducers/patientSlice";
import SideNavComponent from "../../components/SideBar/SideNav";
import SideBar from "../../components/SideBar/SideBar";
import VendorProducts from "./VendorProducts";
import config from "../../config";
import { IoHome } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import ReactLoading from "react-loading";
import { FaChevronDown } from "react-icons/fa";
import Button2 from "react-bootstrap/Button";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { MdInventory } from "react-icons/md";


const VendorAllProducts = () => {
  const [gridRows, setGridRows] = useState([]);
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const [vendorData, setVendorData] = useState([]);
  const [addProduct, setAddProduct] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [editProduct, setEditProduct] = useState(false);
  const [isDeleteDocument, setIsDeleteDocument] = useState(false);
  const [uploadedFileID, setUploadedFilID] = useState(0);
  const [DeletedProductID, setDeletedProductID] = useState(0);
  const [screenWidth, setscreenWidth] = useState(window.innerWidth);
  const [show, setShow] = useState(false);
  const [file, setFile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formDisable, setFormDisable] = useState(false)
  const [productImages,setProductImages] = useState({})
  const dispatch = useDispatch();

  const getAllCategories = useGetAllData(
    "getAllCategories",
    endPoints.getAllCategories
  );


  
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
  // //console.log(testUrl, 'testUrltestUrltestUrl')
  const currentLogin = useSelector((e) => e.currentUser.user);
  const vendorId = localStorage.getItem("vendorID");
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files;
    setImage(URL.createObjectURL(file[0]));
    // //console.log(image, "filefilefile");
    setFile(file);
  };
    //console.log(file,'file length test')

  const methods = useForm();
  const addUpdateProduct = useAddData("addUpdateProduct");
  // const { vendorId } = useVendor();
  const getProductsByVendorID = useGetDataByID(
    vendorId,
    "getVendorData",
    endPoints.getProductsByVendorId
    // isEnabled
  );

  // //console.log(getProductsByVendorID?.data,"dsdadasdadasfaga")

  const handleSubmit = methods.handleSubmit(async (sendData) => {
    setFormDisable(true);

    // const formattedPrice = parseFloat(sendData.price.replace(",", ".")).toFixed(2);

    const formattedPrice = parseFloat(String(sendData.price).replace(",", ".")).toFixed(2);
    const priceAsNumber = Number(formattedPrice);


    const formData = new FormData();
    setIsLoading(true);
    Object.keys(file).forEach((key) => {
      formData.append("productImage", file[key]);
    });

    formData.append(
      "product",
      JSON.stringify({
        description: sendData.description,
        features: sendData.features,
        name: sendData.name,
        // price: sendData.price,
        price: priceAsNumber,
        category: sendData.category,
        subcategory: sendData.subcategory,
        quantity: sendData.quantity,
      })
    );
    formData.append("vendorId", sendData.vendorId);
    const response = await addUpdateProduct.mutateAsync({
      sendData: formData,
      endPoint: endPoints.saveorUpdateProducts,
    });
    
    if (response?.status === 200) {
      dispatch(setSuccessAlert(true));
      dispatch(setAlertTitle("Product Created Successfully"));
      setIsLoading(false);
      setAddProduct(false);
      setFormDisable(false)
      getProductsByVendorID.refetch();
    } else {
      dispatch(setErrorAlert(true));
      dispatch(setAlertTitle("Something Went Wrong"));
      setFormDisable(false)
      setIsLoading(false);
      //console.log(response,'response upload  product');

      dispatch(setErrorAlert(true));
      dispatch(setAlertTitle(file?.length > 4?"Cannot add more than 4 images for a single product":response.message));
      // dispatch(setErrorAlert(true));
      // dispatch(setAlertTitle("Something Went Wrong"));
    }
  });

  const handleUpdate = methods.handleSubmit(async (sendData) => {

    setFormDisable(true);
    setIsLoading(true);
    const formData = new FormData();
    Object.keys(file).forEach((key) => {
      formData.append("productImage", file[key]);
      // //console.log(file[key], "filekey");
    });
    const formattedPrice = parseFloat(String(sendData.price).replace(",", ".")).toFixed(2);
    const priceAsNumber = Number(formattedPrice);
    console.log('price as number', priceAsNumber)

    

    formData.append(
      "product",
      JSON.stringify({
        _id: sendData._id,
        description: sendData.description,
        features: sendData.features,
        vendorId: sendData.vendorId,
        subcategory: sendData.subcategory,
        name: sendData.name,
        price: priceAsNumber,
        category: sendData.category,
        quantity: sendData.quantity,
      })
    );
    formData.append("vendorId", sendData.vendorId);
    // sendData.price = +sendData.price;
    const response = await addUpdateProduct.mutateAsync({
      sendData: formData,
      endPoint: endPoints.UpdateSingleProduct,
    });
    if (response?.status === 200) {
      setIsLoading(false);
      setFormDisable(false);
      dispatch(setSuccessAlert(true));
      dispatch(setAlertTitle("Product Updated Successfully"));
      setAddProduct(false);
      getProductsByVendorID.refetch();
      setEditProduct(false);
      // getProductsByVendorID.refetch();
    } else {
      setFormDisable(false);
      setIsLoading(false);
      dispatch(setErrorAlert(true));
      dispatch(setAlertTitle(file?.length > 4 ? "Cannot add more than 4 images for a single product":response.message));
      // dispatch(setErrorAlert(true));
      // dispatch(setAlertTitle("Something Went Wrong"));
    }
  });

  const handleView = (params) => {
    setEditProduct(true);
    setAddProduct(true);
    methods.reset(params.data);
    console.log(params?.data,'asdsadsadsadsadad')
    // setFile({});
    setImages(params?.data?.images);
    console.log(images,'imagesimages')
  };
  // console.log(file[key],'sadsadsadasddasd')

  const deleteProduct = (params) => {
    setIsLoading(true);
    setDeletedProductID(params.data._id);
    setIsDeleteDocument(true);
  };

  useEffect(() => {
    if (isDeleteDocument) {
      setIsDeleteDocument(false);
    }
  }, [isDeleteDocument]);

  const deleteProducts = useDeleteData(
    [{ paramName: "id", paramValue: DeletedProductID }],
    ["DeleteProduct"],
    endPoints.DeleteProduct,
    isDeleteDocument
  );
  const handleProductDetails = (product) => {
    dispatch(savePatientData(product));
    navigate("/product");
  };

  useEffect(() => {
    if (deleteProducts?.data) {
      setIsDeleteDocument(false);
      setDeletedProductID(0);
      getProductsByVendorID.refetch();
      dispatch(setSuccessAlert(true));
      dispatch(setAlertTitle("Product Deleted Successfully"));
      setIsLoading(false);
    }
  }, [deleteProducts?.data]);

  const gridColumns = [
    // {
    //   field: "thumbnail",
    //   headerName: "image",
    //   flex: 1,
    //   cellStyle: () => ({
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "start",
    //   }),
    //   cellRenderer: (params) => (
    //     params?.data?.Inbound && <i onClick={() => setInboundModal(true)}>
    // ),
    // },
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
      field: "category",
      headerName: "Category",
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
              <a onClick={() => navigate("/product")}>
                <FaEye />
              </a>
            </Col> */}
            <Col>
              <a onClick={() => handleView(params)}>
              <span style={{cursor:"pointer"}}> <MdOutlineEdit /></span>

              </a>
            </Col>
            <Col>
              <a onClick={() => deleteProduct(params)}>
                <RiDeleteBin5Line />
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
    // {
    //   field: "thumbnail",
    //   headerName: "image",
    //   flex: 1,
    //   cellStyle: () => ({
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "start",
    //   }),
    //   cellRenderer: (params) => (
    //     params?.data?.Inbound && <i onClick={() => setInboundModal(true)}>
    // ),
    // },
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
      field: "View",
      headerName: "Actions",
      cellRenderer: (params) => (
        <>
          <Row>
            {/* <Col>
              <a onClick={() => navigate("/product")}>
                <FaEye />
              </a>
            </Col> */}
            <Col>
              <a onClick={() => handleView(params)}>
              <span style={{cursor:"pointer"}}> <MdOutlineEdit /></span>
              </a>
            </Col>
            <Col>
              <a onClick={() => deleteProduct(params)}>
              <span style={{cursor:"pointer"}}><RiDeleteBin5Line /></span>
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
    if (getProductsByVendorID?.data) {
      setVendorData(() => {
        return getProductsByVendorID?.data?.map((product) => {

          // console.log("Product Price:", product?.price); 
          const formattedPrice = product?.price?.$numberDecimal;
          return {
            _id: product?._id,
            name: product?.name,
            // price: product?.price,
            price: formatPrice(product?.price),
            features: product?.features,
            description: product?.description,
            images: product?.images,
            thumbnail: API_URL + product?.images[0],
            vendorId: product?.vendorId,
            category: product?.category,
            subcategory: product?.subcategory,
            quantity: product?.quantity,
          };
        });
      });
    }
  }, [getProductsByVendorID?.data, getProductsByVendorID?.isFetching]);

  const addproducts = () => {
    // setAddProduct(true);
  };

  const handleViewProduct = () => {
    setAddProduct(false);
    setEditProduct(false);
    setFile({});
  };

  const AddNewProduct = () => {
    setAddProduct(true);
    setFile({});
    methods.reset({
      vendorId: vendorId,
    });
  };
  // const [width, setWidth] = useState(window.innerWidth);
  // const [sideBar, setSideBar] = useState(width <= 900 ? false : true);

  const [expanded, setExpanded] = useState(true);
  const [activeKey, setActiveKey] = useState(1);
  // //console.log(activeKey, "asdfklajfkls");
  const tabsData = [
    {
      key: 1,
      title: "Dashboard",
      component: <VendorProducts />,
    },
    {
      key: 2,
      title: "Orders",
      component: <h1>Orders</h1>,
    },
  ];
  useEffect(() => {
    const handleResize = () => {
      setwidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // const handleFileUpload = async (event) => {
  //   const file = event.target.files[0];
  //   const response = await uploadFile.mutateAsync(file);
  //   if (response) {
  //   } else {
  //   }
  // };
  // const categories = getAllCategories?.data.categories;
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    if (getAllCategories?.data?.categories) {
      const arrr = [];
      Object.entries(getAllCategories?.data?.categories)?.map((cateory) => {
        arrr.push(cateory[0]);
      });
      setCategories(arrr);
      // // //console.log(er,'dasfsafasfa')
    }
  }, [getAllCategories?.data?.categories]);

  console.log(categories, "asdasddsadsasd");
  // //console.log(
  //   getAllCategories?.data?.categories[methods.watch("category")],
  //   "dsdsfsdffsdfdsfd"
  // );
  const logout = () => {
    navigate("/");
    dispatch(setIsAuthenticated(false));
    dispatch(setSuccessAlert(true));
    dispatch(setAlertTitle("Vendor Logged Out"));
    localStorage.clear();
  };
  //console.log(file.length, "sadsadasdsadasd");
  return (
    <>
    {/* <p>f6awf4a6f4g6aw4g6a4ga4wg64awg4</p> */}
      <AlertOK
        title={"Important"}
        description={"Confirm Product Deletion"}
        icon={"warning"}
        show={show}
        onConfirm={() => setShowIntervention(false)}
      />
      {/* <ToastContainer />
      <Alert title={'Product Added Successfully'} icon="success" show={true} /> */}
      <Container fluid style={{ overflow: "hidden" }}>
        <Row>
          <div className="mt-1">
            <div className="filter-bar-vendor">
              <Row>
                {screenWidth > 800 && (
                  <Col md={8} lg={8} sm={8} xs={8}>
                    <h3 className="mt-2 heading" style={{marginLeft: "10px", color: "#AA2F33"}}>Vendor Dashboard</h3>
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
                          <Dropdown>
                            {addProduct ? (
                              <Button2
                                variant="danger"
                                onClick={handleViewProduct}
                                className="m-2"
                              >
                                {" "}
                                View Product
                              </Button2>
                            ) : (
                              <Button2
                                variant="danger"
                                onClick={AddNewProduct}
                                className="m-2"
                              >
                                {" "}
                                Add Product
                              </Button2>
                            )}
                            {/* <Dropdown.Toggle
                              split
                              variant="danger"
                              id="dropdown-split-basic"
                            ></Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item onClick={logout}>
                                <span>Logout</span>
                              </Dropdown.Item>
                            </Dropdown.Menu> */}
                          </Dropdown>
                        </Col>
                        {/* </Row> */}
                        {/* <Row> */}
                        {/* </Row> */}
                      </>
                      {/* )} */}
                    </Row>
                  </span>
                </Col>
              </Row>
            </div>
            <div className="mt-2 grid-container">
              {addProduct ? (
                <>
                  <Container fluid className="product-form mt-4 mb-4">
                    <FormProvider {...methods}>
                    <fieldset disabled={formDisable}>
                      <Row>
                        <Col sm={10} md={10} lg={10} xl={10}>
                          <h4 className="mb-2">
                            {editProduct ? "Edit Product" : "Add a Product"}
                          </h4>
                        </Col>
                      </Row>
                      <form onSubmit={handleSubmit}>
                        <Row>
                          {" "}
                          {images?.length > 0 &&
                            editProduct &&
                            images?.map((image,i) => {
                              return (
                                <Col key={i} sm={2} md={2} lg={2} xl={2}>
                                  <img
                                    src={API_URL + image}
                                    style={{ height: "150px", width: "180px" }}
                                  />
                                </Col>
                              );
                            })}
                        </Row>
                        <Row>
                          <Col
                            sm={6}
                            md={6}
                            lg={6}
                            xl={6}
                            className="mt-4 mb-2"
                          >
                            <InputField
                              id="productImages"
                              type="file"
                              name="images"
                              accept=".png,.jpg"
                              multiple={true}
                              onChange={handleFileUpload}
                              required={true}
                              // maxLength={4}
                            />
                            {file.length > 4 && (
                            <span style={{fontSize : "13px",color:"red"}}>Cannot add more than 4 images for a single product</span>)}
                          </Col>
                          <Col
                            sm={6}
                            md={6}
                            lg={6}
                            xl={6}
                            className=" "
                            style={{ marginTop: "10px" }}
                          >
                            <InputField
                              id="quantity"
                              name="quantity"
                              placeholder="Enter Quantity of Product"
                              defaultValue=""
                              type="number"
                              label={"Product Quantity"}
                            />
                          </Col>
                          <Col
                            sm={6}
                            md={6}
                            lg={6}
                            xl={6}
                            className=""
                            style={{ display: "none" }}
                          >
                            <InputField
                              id="vendorId"
                              name="vendorId"
                              placeholder="Vendor ID"
                              value={vendorId}
                              disabled={true}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col sm={6} md={6} lg={6} xl={6}>
                            <InputField
                              id="name"
                              name="name"
                              placeholder="Enter Product Name"
                              defaultValue=""
                              required={true}
                              label={"Product Name"}
                            />
                          </Col>
                          <Col sm={6} md={6} lg={6} xl={6}>
                            <InputField
                              id="price"
                              name="price"
                              placeholder="Enter Price of Product(CA$)"
                              defaultValue=""
                              type="number"
                              label={"Product Price(CA$)"}
                              required
                            />
                          </Col>
                          <Col sm={6} md={6} lg={6} xl={6}>
                            <Select
                              id="Category"
                              name="category"
                              placeholder="   ---Select Category---  "
                              defaultValue=""
                              required={true}
                              labelKey="categories"
                              options={categories}
                              label={"Select Category"}
                              // type="number"
                            />
                          </Col>
                          <Col sm={6} md={6} lg={6} xl={6}>
                            <Select
                              id="Category"
                              name="subcategory"
                              placeholder="   ---Select Sub-Category---  "
                              defaultValue=""
                              required={true}
                              labelKey="categories"
                              options={
                                getAllCategories?.data?.categories[
                                  methods.watch("category")
                                ]
                              }
                              label={"Select Sub-Category"}
                              // type="number"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col sm={12} md={12} lg={12} xl={12}>
                            <TextArea
                              id="description"
                              rows="3"
                              name="description"
                              placeholder="Enter Product Description"
                              label={"Product Description"}
                              maxLength={350}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col sm={12} md={12} lg={12} xl={12}>
                            <TextArea
                              id="features"
                              rows="3"
                              name="features"
                              placeholder="Enter Product Features"
                              label={"Product Features"}
                              maxLength={350}
                            />
                          </Col>
                        </Row>
                        <Row>
                        <Col sm={2} md={2} lg={2} xl={2} className="ps-3">
                          {editProduct ? (
                            <Button
                              text={"Update"}
                              onClick={handleUpdate}
                              isLoading={isLoading}
                            />
                          ) : (
                            <Button
                              text={"Create"}
                              onClick={handleSubmit}
                              isLoading={isLoading}
                            />
                          )}
                        </Col>
                        </Row>
                        {/* <DevTool control={methods.control} /> */}
                      </form>
                      </fieldset>
                    </FormProvider>
                  </Container>
                </>
              ) : (
                <>
                  <div>
                    <Grid
                      noRowsMessage={"No products added"}
                      rows={vendorData}
                      column={
                        screenWidth < 800 ? mobilegridColumns : gridColumns
                      }
                      gridHeight="auto"
                      isLoading={getProductsByVendorID?.isFetching || isLoading}
                    />
                    {/* )} */}
                  </div>
                </>
              )}
            </div>
          </div>
        </Row>
      </Container>
    </>
  );
}

export default VendorAllProducts;
