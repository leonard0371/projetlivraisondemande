import React, { useEffect, useState } from "react";
import { Col, Container, Pagination, Row } from "react-bootstrap";
import Cards from "../../components/Cards/Cards";
import { useDeleteData, useGetAllData } from "../../api/apiCalls";
import { endPoints } from "../../api/api";
// import productImage from "../../assets/product.jpg";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { savePatientData } from "../../redux/reducers/patientSlice";

const ITEMS_PER_PAGE = 10;

function VendorProducts() {
  const GetAllProducts = useGetAllData(
    "GetAllProducts",
    endPoints.getAllProducts
  );
  const [productData, setProductData] = useState([]);

  const totalPages = Math.ceil(productData?.length / ITEMS_PER_PAGE);
const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentProducts = productData?.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
//   const deleteProduct = (params) => {
//     // console.log(params?.data, "dafsddfjaskasdf");
//     setDeletedProductID(params.data._id);
//     setIsDeleteDocument(true);
//   };
//   const deleteProducts = useDeleteData(
//     [{ paramName: "id", paramValue: DeletedProductID }],
//     ["DeleteProduct"],
//     endPoints.DeleteProduct,
//     isDeleteDocument
//   );
  useEffect(() => {
    // console.log(GetAllProducts?.data, "fsadflkasdflasjkdfsja");
    if (GetAllProducts?.data) {
      setProductData(() => {
        return GetAllProducts?.data?.map((product) => {
          return {
            id: product?._id,
            name: product?.name,
            price: product?.price,
            image: productImage,
            data:product
          };
        });
      });
    }
  }, [GetAllProducts?.data, GetAllProducts?.isFetching]);
  const handleClickProduct = (product) => {
    // console.log(product, 'afdsjfhjkafhafjkafhks')
    // dispatch(saveProductDetail(product))
    dispatch(savePatientData(product))
    // dispatch(saveProductDetail('helo'))

  }
  return (
    <Container fluid className="products-container p-4">
      <div>
        <Row className="mt-4">
          {currentProducts?.map((product, index) => (
            <Col key={index} xs={12} sm={6} md={3} lg={3}>
              <Link to="/product" onClick={() => handleClickProduct(product)}>
                <Cards
                  image={product.image}
                  ProductName={product.name}
                  price={product.price}
                  showButtons={true}
                  data={product?.data}
                />
              </Link>
            </Col>
          ))}
        </Row>

        <Pagination className="mt-2" style={{ marginLeft: "20%" }}>
          <Pagination.First
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages).keys()].map((number) => (
            <Pagination.Item
              key={number + 1}
              active={number + 1 === currentPage}
              onClick={() => handlePageChange(number + 1)}
            >
              {number + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </Container>
  );
}

export default VendorProducts;
