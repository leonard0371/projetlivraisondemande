import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useAddData, useDeleteData, useGetAllData, useGetDataByID } from '../../api/apiCalls';
import { endPoints } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useVendor } from '../../api/VendorContext';
import { Col, Row } from 'react-bootstrap';
import Button from '../../components/Input/Button';
import Grid from '../../components/Grid/Grid';
import config from '../../config';

const VendorProducts = () => {
    const [gridRows, setGridRows] = useState([]);
    const [vendorData, setVendorData] = useState([]);
    const [addProduct, setAddProduct] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const [editProduct, setEditProduct] = useState(false);
    const [isDeleteDocument, setIsDeleteDocument] = useState(false);
    const [uploadedFileID, setUploadedFilID] = useState(0);
    const [DeletedProductID, setDeletedProductID] = useState(0);
    const [file, setFile] = useState({});
    const [images, setImages] = useState([]);
    const dispatch = useDispatch()
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const getAllCategories = useGetAllData(
        "getAllCategories",
        endPoints.getAllCategories
    );
    // console.log(images, "images");
    const navigate = useNavigate();
    // const GetAllProducts = useGetAllData(
    //   "GetAllProducts",
    //   endPoints.getAllProducts
    // );
    const handleFileUpload = async (event) => {
        const file = event.target.files;

        setFile(file);
    };
    const methods = useForm();
    const addUpdateProduct = useAddData("addUpdateProduct");
    const { vendorId } = useVendor();
    const getProductsByVendorID = useGetDataByID(
        vendorId,
        "getVendorData",
        endPoints.getProductsByVendorId
        // isEnabled
    );

    const handleSubmit = methods.handleSubmit(async (sendData) => {
        const formData = new FormData();
        Object.keys(file).forEach((key) => {
            formData.append("productImage", file[key]);
        });

        formData.append(
            "product",
            JSON.stringify({
                description: sendData.description,
                features: sendData.features,
                name: sendData.name,
                price: sendData.price,
                category: sendData.category,
                quantity: sendData.quantity
            })
        );
        formData.append("vendorId", sendData.vendorId);
        const response = await addUpdateProduct.mutateAsync({
            sendData: formData,
            endPoint: endPoints.saveorUpdateProducts,
        });
        if (response?.status === 200) {
            dispatch(setSuccessAlert(true));
            dispatch(
                setAlertTitle("Product Created Successfully")
            );
            setAddProduct(false);
            getProductsByVendorID.refetch();
        } else {
            // dispatch(setErrorAlert(true));
            // dispatch(setAlertTitle("Something Went Wrong"));

        }
    });

    const handleUpdate = methods.handleSubmit(async (sendData) => {
        const formData = new FormData();
        Object.keys(file).forEach((key) => {
            formData.append("productImage", file[key]);
        });

        formData.append(
            "product",
            JSON.stringify({
                description: sendData.description,
                features: sendData.features,
                // vendorId: sendData.vendorId,
                name: sendData.name,
                price: sendData.price,
                category: sendData.category,
                quantity: sendData.quantity
            })
        );
        formData.append("vendorId", sendData.vendorId);
        // sendData.price = +sendData.price;
        const response = await addUpdateProduct.mutateAsync({
            sendData: formData,
            endPoint: endPoints.UpdateSingleProduct,
        });
        if (response?.status === 200) {
            dispatch(setSuccessAlert(true));
            dispatch(
                setAlertTitle("Product Updated Successfully")
            );
            setAddProduct(false);
            getProductsByVendorID.refetch();
            setEditProduct(false);
            getProductsByVendorID.refetch();
        } else {
            // dispatch(setErrorAlert(true));
            // dispatch(setAlertTitle("Something Went Wrong"));
        }
    });

    const handleView = (params) => {
        setEditProduct(true);
        setAddProduct(true);
        methods.reset(params.data);
        setImages(params?.data?.images);
    };

    const deleteProduct = (params) => {
        setDeletedProductID(params.data._id);
        setIsDeleteDocument(true);
    };
    useEffect(() => {
        if (isDeleteDocument) {
            setIsDeleteDocument(false);
        }
    }, [isDeleteDocument])
    const deleteProducts = useDeleteData(
        [{ paramName: "id", paramValue: DeletedProductID }],
        ["DeleteProduct"],
        endPoints.DeleteProduct,
        isDeleteDocument
    );

    useEffect(() => {
        if (deleteProducts?.data) {
            setIsDeleteDocument(false);
            setDeletedProductID(0);
            getProductsByVendorID.refetch();
            dispatch(setSuccessAlert(true));
            dispatch(
                setAlertTitle("Product Deleted Successfully")
            );
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
            field: "description",
            headerName: "description",
            flex: 1,
            cellStyle: () => ({
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
            }),
        },
        {
            field: "features",
            headerName: "features",
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
                            <a onClick={() => navigate("/product")}>
                                <FaEye />
                            </a>
                        </Col>
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
                    return {
                        _id: product?._id,
                        name: product?.name,
                        price: product?.price,
                        features: product?.features,
                        description: product?.description,
                        images: product?.images,
                        // thumbnail: "http://192.169.176.214:3001" + product?.images[0],
                        thumbnail: API_URL + product?.images[0],
                        vendorId: product?.vendorId,
                        category: product?.category,
                        quantity: product?.quantity
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
    };

    const AddNewProduct = () => {
        setAddProduct(true);
        methods.reset({
            vendorId: vendorId,
        });
    };
    return (

        <div className="">
            <div className="filter-bar" style={{ marginLeft: '0px' }}>
                <Row>
                    <Col md={9} lg={9} sm={9}>
                        <h3 className="mt-2 heading">Vendor Dashboard</h3>
                    </Col>
                    <Col md={3} lg={3} sm={3}>
                        <span className="mb-4">
                            {addProduct ? (
                                <Button
                                    text={"View Products"}
                                    width="250px"
                                    onClick={handleViewProduct}
                                />
                            ) : (
                                <Button
                                    text={"Add New Product"}
                                    width="250px"
                                    onClick={AddNewProduct}
                                />
                            )}
                        </span>
                    </Col>
                </Row>
            </div>
            <div className="mt-2 grid-container" style={{ marginLeft: '0px' }}>
                {addProduct ? (
                    <>
                        <Container fluid className="product-form mt-4 mb-4">
                            <FormProvider {...methods}>
                                <h4 className="mb-2">Add a Product</h4>
                                <form onSubmit={handleSubmit}>
                                    <Row>
                                        {" "}
                                        {images?.length > 0 &&
                                            images?.map((image) => {
                                                return (
                                                    <img
                                                        src={API_URL + image}
                                                        style={{ height: "150px", width: "150px" }}
                                                    />
                                                );
                                            })}
                                    </Row>
                                    <Row>
                                        <Col sm={6} md={6} lg={6} xl={6} className="mt-4 mb-2">
                                            <InputField
                                                id="productImages"
                                                type="file"
                                                name="images"
                                                accept=".png,.jpg"
                                                multiple={true}
                                                onChange={handleFileUpload}
                                                required={true}
                                                label={'Product Images'}
                                            />
                                        </Col>

                                        <Col sm={6} md={6} lg={6} xl={6} className="" style={{ display: 'none' }}>
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
                                                label={'Product Name'}
                                            />
                                        </Col>
                                        <Col sm={6} md={6} lg={6} xl={6}>
                                            <InputField
                                                id="price"
                                                name="price"
                                                placeholder="Enter Price of Product"
                                                defaultValue=""
                                                type="number"
                                                label={'Product Price'}
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
                                                options={getAllCategories?.data.categories}
                                                label={'Select Category'}
                                            // type="number"
                                            />
                                        </Col>
                                        <Col sm={6} md={6} lg={6} xl={6} className=" " style={{ marginTop: '35px' }} >
                                            <InputField
                                                id="quantity"
                                                name="quantity"
                                                placeholder="Enter Quantity of Product"
                                                defaultValue=""
                                                type="number"
                                                label={'Product Quantity'}
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
                                                label={'Product Description'}
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
                                                label={'Product Features'}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        {editProduct ? (
                                            <Button text={"Update"} onClick={handleUpdate} />
                                        ) : (
                                            <Button text={"Create"} onClick={handleSubmit} />
                                        )}
                                    </Row>
                                    {/* <DevTool control={methods.control} /> */}
                                </form>
                            </FormProvider>
                        </Container>
                    </>
                ) : (
                    <Grid
                        noRowsMessage="No Rows To Show"
                        rows={vendorData}
                        column={gridColumns}
                    />
                )}
            </div>
        </div>

    )
}

export default VendorProducts