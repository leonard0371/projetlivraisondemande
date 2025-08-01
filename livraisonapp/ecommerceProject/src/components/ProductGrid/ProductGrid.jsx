import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../redux/reducers/cartSlice';
import { setSuccessAlert, setAlertTitle, setErrorAlert } from '../../redux/reducers/patientSlice';
import { useQueryClient } from 'react-query';
import { useAddData } from "../../api/apiCalls";
import { endPoints } from "../../api/api";
import './ProductGrid.scss';

const ProductGrid = ({ productData = [], handleClickProduct, API_URL }) => {
  const LoggedUser = JSON.parse(localStorage.getItem("LoggedUser"));
  const userData = useSelector((e) => e.show.userData);
  const userId = localStorage.getItem("userId");
  const [count, setCount] = useState(1);
  const queryClient = useQueryClient();
  const addproductstoCart = useAddData("addproductstoCart");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    handleClickProduct(product);
    navigate('/product');
  };

  const handleAddToCart = async (e, product) => {
    console.log('product icon', product)
    e.preventDefault();
    e.stopPropagation();

    const addDataCart = {
      userId: LoggedUser ? LoggedUser.user.id : "",
      products: [
        {
          productId: product.id,
          vendorId: product.vendorId,
          price: product.price,
          quantity: count,
          name: product.name,
          subTotal: product.price * count,
        },
      ],
    };

    if (userId !== null && userData) {
      setIsLoading(true);
      try {
        const response = await addproductstoCart.mutateAsync({
          sendData: addDataCart,
          endPoint: endPoints.addProductsToCart,
        });

        if (response?.status === 200) {
          queryClient.refetchQueries("getUserCart");
          queryClient.refetchQueries('GetProductById');
          dispatch(setSuccessAlert(true));
          dispatch(setAlertTitle("Product Added to Cart"));
        } else {
          dispatch(setErrorAlert(true));
          dispatch(setAlertTitle(response?.response?.data?.error || "Failed to add product to cart"));
        }
      } catch (error) {
        dispatch(setErrorAlert(true));
        dispatch(setAlertTitle("Error adding product to cart"));
      } finally {
        setIsLoading(false);
      }
    } else {
      const productObject = {
        productId: product.id,
        price: product.price,
        quantity: 1,
        name: product.name,
        images: product.image && product.image.length > 0 ? product.image[0] : null,
        objectId: product.id
      };
      
      const filteredProductObject = Object.fromEntries(
        Object.entries(productObject).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      );
      
      if (Object.keys(filteredProductObject).length > 0) {
        dispatch(addToCart(filteredProductObject));
      }
      
      navigate("/login");
      dispatch(setSuccessAlert(true));
      dispatch(setAlertTitle("Please Login/Sign-Up to Add Products in Cart"));
    }
  };

  if (!productData?.length) {
    return (
      <div className="empty-products-container">
        <p className="empty-products-text">No Products Found</p>
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      {productData.map((product, index) => (
        <div 
          key={index}
          className="product-card"
          onClick={() => handleProductClick(product)}
        >
          <div className="product-image-wrapper">
            {product.image && product.image.length > 0 ? (
              <img
                src={`${API_URL}${product.image[0]}`}
                alt={product.name}
                className="product-image"
              />
            ) : (
              <div className="no-image-placeholder">
                No Image
              </div>
            )}
          </div>
          
          <div className="product-info">
            <h3 className="product-title">
              {product.name}
            </h3>
            <div className="product-price-actions">
              <span className="product-price">
                ${product.price}
              </span>
              <button 
                className={`add-to-cart-btn ${isLoading ? 'loading' : ''}`}
                onClick={(e) => handleAddToCart(e, product)}
                disabled={isLoading}
              >
                <ShoppingCart size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;