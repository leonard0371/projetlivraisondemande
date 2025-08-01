import React, { useEffect, useState } from "react";
import "./Card.scss";
import { Col, Row } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import { useAddData, useDeleteData, useGetAllData } from "../../api/apiCalls";
import { endPoints } from "../../api/api";
import { useDispatch } from "react-redux";
import { savePatientData } from "../../redux/reducers/patientSlice";
import { useNavigate } from "react-router-dom";
// import productImage from '../../assets/product2.jpg'
// import noImage from '../../assets/image-not-found.png'

function Cards({
  price,
  ProductName,
  image,
  onClick,
  showButtons = false,
  data
}) {
  const [isDeleteDocument, setIsDeleteDocument] = useState(false);
  const [DeletedProductID, setDeletedProductID] = useState(0);
  const [productData, setProductData] = useState([]);
  const addUpdateProduct = useAddData("addUpdateProduct");

  const deleteProduct = () => {
    // console.log(data, "dafsddfjaskasdf");
    setDeletedProductID(data._id);
    setIsDeleteDocument(true);
  };
  const dispatch = useDispatch();
  const navigate = useNavigate()
  // const GetAllProducts = useGetAllData(
  //   "GetAllProducts",
  //   endPoints.getAllProducts
  // );
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
      // GetAllProducts.refetch();
    }
  }, [deleteProducts?.data]);
  // useEffect(() => {
  //   // console.log(GetAllProducts?.data, "fsadflkasdflasjkdfsja");
  //   if (GetAllProducts?.data) {
  //     setProductData(() => {
  //       return GetAllProducts?.data?.map((product) => {
  //         return {
  //           id: product?._id,
  //           name: product?.name,
  //           price: product?.price,
  //           image: productImage,
  //           data:product
  //         };
  //       });
  //     });
  //   }
  // }, [GetAllProducts?.data, GetAllProducts?.isFetching]);
  const handleClickProduct = (product) => {
    // console.log(product, 'afdsjfhjkafhafjkafhks')
    // dispatch(saveProductDetail(product))
    dispatch(savePatientData(product))
    navigate('/product');
    // dispatch(saveProductDetail('helo'))

  }
  const handleError = (event) => {
    event.target.src = noImage;
  };
  return (
    <div>
      <div className="card-main mb-2" onClick={onClick}>
        <img className="card-img-top" src={image} alt="image"onError={handleError} />
        <div className="">
          <Row>
            <Col>
              <h5 className="card-title">{ProductName}</h5>
              <p className="card-text lead"><span style={{fontWeight :450}}>CA$
                </span>{" " + price}</p>
            </Col>
            {showButtons &&(
            <Col className="mt-2 card-buttons">
            <Row>
              {/* <Col className = "button" onClick={()=>handleClickProduct(product)}><FaEye /></Col> */}
              {/* <Col md={3} sm={3} lg={3} className = "button" ><MdOutlineEdit /></Col> */}
              <Col md={3} sm={3} lg={3} className = "button" onClick={deleteProduct}><RiDeleteBin5Line /></Col>
            </Row>
            </Col>
            )}
          </Row>
        </div>
      </div>
    </div>
  );
}

export default Cards;
