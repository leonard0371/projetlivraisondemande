import React, { useEffect, useState } from "react";
import { Col, Container, Row, Pagination, Badge, Button } from "react-bootstrap";
import Categories from "../../components/Categories/Categories";
import SearchBar from "../../components/SearchBar/Searchbar";
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import { useNavigate } from "react-router-dom";
import { useAddData, useGetAllData, useGetDataByID } from "../../api/apiCalls";
import { endPoints } from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { savePatientData } from "../../redux/reducers/patientSlice";
import ReactLoading from "react-loading";
import { RxCross1 } from "react-icons/rx";
import { saveCategoryValue } from "../../redux/reducers/patientSlice";
import { setIsEnabled } from "../../redux/reducers/cartSlice";
import { setSuccessAlert, setAlertTitle } from '../../redux/reducers/patientSlice';
import { formatPrice } from "../../utilitaire/utils";
import { useLocation } from 'react-router-dom';
import PaymentSuccessModal from "../../components/Modal/PaymentSuccessModal";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import "./Products.scss";

const ITEMS_PER_PAGE = 30;

function Products() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categoryValue = useSelector((e) => e.show.categoryValue);
  const API_URL = import.meta.env.VITE_APP_API_URL;
  
  const [productData, setProductData] = useState([]);
  const [categoryenabled, setCategoryEnabled] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [productsEnabled, setProductsEnabled] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [expandedCategories, setExpandedCategories] = useState({});
  // Initialize categoriesCollapsed as true to start collapsed
  const [categoriesCollapsed, setCategoriesCollapsed] = useState(true);

  // Get all categories
  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllData(
    "getAllCategories", 
    endPoints.getAllCategories
  );

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

   //<Riv>
  
   const location = useLocation();

   useEffect(() => {
     const searchParams = new URLSearchParams(location.search);
     const success = searchParams.get("success");
     const orderId = searchParams.get("orderId");

     console.log("Success:", success, "OrderId:", orderId);

     // Si le succès est "true" et qu'il y a un orderId, on affiche la modal
     if (success === "true" && orderId) {
       if (!showModal) {
         setShowModal(true); // Ouvre la modal si elle n'est pas déjà ouverte
         console.log("Modal ouverte");

         // Récupérer les détails de la commande
         fetch(`${API_URL}/api/stripe/orders/${orderId}`)
           .then((res) => res.json())
           .then((data) => setOrderDetails(data))
           .catch((err) => console.error("Erreur récupération commande :", err));
       }
      
     } else {
       // Si success n'est pas "true" ou qu'il manque l'orderId, on ferme la modal
       setShowModal(false);
       console.log("Modal fermée");
     }
   }, [location.search]); // N'ajoute pas `showModal` dans les dépendances si tu veux éviter les boucles infinies

 

 //</Riv>

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (categoryenabled) {
      setCategoryEnabled(false);
    }
  }, [categoryenabled]);

  useEffect(() => {
    if (categoryValue) {
      setCategoryEnabled(true);
      // Auto-expand the categories section when a filter is applied
      setCategoriesCollapsed(false);
    }
  }, [categoryValue]);

  const GetAllProducts = useGetAllData(
    "GetAllProducts",
    endPoints.getAllProducts,
    productsEnabled && categoryValue === ""
  );

  const getProductsByCategory = useGetDataByID(
    categoryValue,
    "getProductByCategory",
    endPoints.getProductsByCategory,
    categoryenabled
  );

  const searchProductsByName = useGetDataByID(
    inputValue,
    "searchProductsByName",
    endPoints.searchProductsByName,
    searchEnabled
  );

  useEffect(() => {
    dispatch(setIsEnabled(true));
    if (getProductsByCategory?.data) {
      setCategoryEnabled(false);
      setProductsEnabled(false);
      setSearchEnabled(false);
      setProductData(() => {
        return getProductsByCategory?.data?.map((product) => ({
          id: product?._id,
          name: product?.name,
          price: formatPrice(product?.price),
          image: product?.images,
          vendorId: product?.vendorId,
          data: product
        }));
      });
    }
  }, [getProductsByCategory?.data, getProductsByCategory?.isFetching]);

  useEffect(() => {
    if (searchProductsByName?.data) {
      setCategoryEnabled(false);
      setProductsEnabled(false);
      setSearchEnabled(false);
      setProductData(() => {
        return searchProductsByName?.data?.map((product) => ({
          id: product?._id,
          name: product?.name,
          price: formatPrice(product?.price),
          image: product?.images,
          vendorId: product?.vendorId,
          data: product
        }));
      });
    }
  }, [searchProductsByName?.data, searchProductsByName?.isFetching]);

  useEffect(() => {
    if (GetAllProducts?.data && categoryValue === "") {
      setCategoryEnabled(false);
      setProductsEnabled(false);
      setSearchEnabled(false);
      dispatch(saveCategoryValue(""));
      setProductData(() => {
        return GetAllProducts?.data?.map((product) => ({
          id: product?._id,
          name: product?.name,
          price: formatPrice(product?.price),
          image: product?.images,
          vendorId: product?.vendorId,
          data: product
        }));
      });
    }
  }, [GetAllProducts?.data, GetAllProducts?.isFetching]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const totalPages = Math.ceil(productData?.length / ITEMS_PER_PAGE);
  
  const paginatedProducts = productData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleClickProduct = (product) => {
    dispatch(savePatientData(product));
  };

  const removeFilter = () => {
    dispatch(saveCategoryValue(""));
    GetAllProducts?.refetch();
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      setSearchEnabled(true);
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSelectCategory = (subcategory) => {
    dispatch(saveCategoryValue(subcategory));
  };

  // Toggle for the entire categories section
  const toggleCategoriesSection = () => {
    setCategoriesCollapsed(!categoriesCollapsed);
  };

  // Render parent categories and subcategories
  const renderCategories = () => {
    if (!categoriesData || !categoriesData.categories) return null;

    return Object.entries(categoriesData.categories).map(([category, subcategories], index) => (
      <div key={index} className="category-section">
        <div 
          className="category-header"
          onClick={() => toggleCategory(category)}
        >
          <span>{category}</span>
          <span className="toggle-icon">
            {expandedCategories[category] ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </span>
        </div>
        
        {expandedCategories[category] && (
          <div className="subcategories-container">
            {Array.isArray(subcategories) && subcategories.length > 0 ? (
              <Row className="subcategories-row">
                {subcategories.map((subcategory, subIndex) => (
                  <Col key={subIndex} xs={6} sm={4} md={3} lg={2} className="mb-2">
                    <Button
                      variant={categoryValue === subcategory ? "primary" : "outline-secondary"}
                      size="sm"
                      className="subcategory-button w-100"
                      onClick={() => handleSelectCategory(subcategory)}
                    >
                      {subcategory}
                    </Button>
                  </Col>
                ))}
              </Row>
            ) : (
              <p className="no-subcategories">No subcategories found</p>
            )}
          </div>
        )}
      </div>
    ));
  };

  return (
    <Container fluid className="products-page">

      
      {/* Affichage du modal */}
      
      {/* <Riv> */}
      <PaymentSuccessModal 
          showModal={showModal} 
          onCloseModal={() => setShowModal(false)}  // Ferme la modal
          orderDetails={orderDetails} 
        />      
      {/* </Riv> */}

      <Row>
        <Col sm={12} md={12} lg={12} xl={12}>
          <div className="content-container" style={{ marginTop: screenWidth < 800 ? "10%" : "6%" }}>
            {/* Search Bar */}
            <div className="search-container mb-4">
              <SearchBar
                onChange={handleInputChange}
                onClick={handleSearch}
                value={inputValue}
              />
            </div>
            
            {/* Categories with toggle button */}
            <div className="categories-container mb-4">
              <div className="categories-header d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <h5 className="m-0">Categories</h5>
                  <button 
                    className="toggle-categories-btn ms-2"
                    onClick={toggleCategoriesSection}
                    aria-label={categoriesCollapsed ? "Expand categories" : "Collapse categories"}
                  >
                    {categoriesCollapsed ? <FaChevronRight size={14} /> : <FaChevronDown size={14} />}
                  </button>
                </div>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => {
                    dispatch(saveCategoryValue(""));
                    GetAllProducts?.refetch();
                  }}
                >
                  View All Products
                </Button>
              </div>
              
              {/* Conditionally render category content based on collapsed state */}
              {!categoriesCollapsed && (
                <>
                  {categoriesLoading ? (
                    <div className="text-center py-3">
                      <ReactLoading
                        type="spinningBubbles"
                        color="#AA2F33"
                        height={30}
                        width={30}
                      />
                    </div>
                  ) : (
                    renderCategories()
                  )}
                </>
              )}
            </div>
            
            {/* Active Filters */}
            {categoryValue && (
              <div className="active-filters mb-4">
                <h6>Active Filter:</h6>
                <Badge bg="secondary" className="filter-badge">
                  {categoryValue}
                  <button className="remove-filter" onClick={removeFilter}>
                    <RxCross1 size={12} />
                  </button>
                </Badge>
              </div>
            )}

            {/* Loading Indicator or Products */}
            {GetAllProducts?.isFetching ||
            getProductsByCategory?.isFetching ||
            searchProductsByName?.isFetching ? (
              <div className="loading-container">
                <ReactLoading
                  type="spinningBubbles"
                  color="#AA2F33"
                  height={60}
                  width={60}
                />
              </div>
            ) : (
              <>
                {/* Product Grid */}
                <ProductGrid 
                  productData={paginatedProducts}
                  handleClickProduct={handleClickProduct}
                  API_URL={API_URL}
                />
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination-container mt-4">
                    <Pagination>
                      <Pagination.First
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                      />
                      <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      />
                      {[...Array(totalPages)].map((_, number) => (
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
                )}
              </>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Products;