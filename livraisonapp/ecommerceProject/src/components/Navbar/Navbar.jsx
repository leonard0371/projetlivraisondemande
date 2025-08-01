import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { TiShoppingCart } from 'react-icons/ti';
import { Tooltip } from 'rsuite';
import { Whisper, Badge } from 'rsuite';
import { BiUser } from 'react-icons/bi';
import { useDispatch, useSelector } from "react-redux";
import "./Navbar.scss";
import logoImage from '../../assets/haven-logo-navbar.png';
import { formatPrice } from '../../utilitaire/utils';
import Button from "../Input/Button";
import {
  saveUserData,
  setAlertTitle,
  setIsAuthenticated,
  setSuccessAlert,
} from "../../redux/reducers/patientSlice";
import CartToolTip from "../../Screens/Cart/CartToolTip";
import {
  addToCart,
  setCartItems,
  clearCart,
  setIsEnabled,
} from "../../redux/reducers/cartSlice";
import { useGetDataByID } from "../../api/apiCalls";
import { endPoints } from "../../api/api";

function NavBar({ onClick }) {
  const cartItems = useSelector((e) => e.cart.userCart);
  const isAuthenticated = useSelector((e) => e.show.isAuthenticated);
  const userData = useSelector((e) => e.show.userData);
  const [userInfo, setUserInfo] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [userCart, setUserCart] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const isEnabled = useSelector((e) => e.cart.isEnabled);
  const isLoading = useSelector((e) => e.cart.isLoading);

  useEffect(() => {
    if (isEnabled) {
      dispatch(setIsEnabled(false));
    }
  }, [isEnabled]);

  const dispatch = useDispatch();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const userId = localStorage.getItem("userId");
  const LoggedUser = localStorage.getItem("LoggedUser");
  const role = localStorage.getItem("Role");

  const items = useSelector((e) => e.cart.items);

  const getUserCart = useGetDataByID(
    userId,
    ["getUserCart", userId],
    endPoints.getCartbyId,
    isEnabled && !!userId && role !== "driver"
  );

  useEffect(() => {
    if (role !== "driver" && !!userId) {
      const arr = [];
      getUserCart?.data?.map((product) => {
        product?.products?.map((singleProduct) => {
          singleProduct["objectId"] = singleProduct?._id;
          arr.push(singleProduct);
        });
      });
      const cartArr = arr.filter((item) => item.productId !== null);
      dispatch(clearCart());
      cartArr?.map((data) => {
        return dispatch(
          addToCart({
            productId: data.productId._id,
            price: formatPrice(data.productId.price),
            quantity: data.quantity,
            name: data.productId.name,
            images: data.productId.images[0],
            objectId: data?.objectId,
            vendorId: data?.vendorId,
          })
        );
      });
      setUserCart(() => {
        const newState = [];
        return cartArr.reduce((acc, current) => {
          const existingProduct = acc.find(
            (item) => item.productId === current.productId._id
          );
          if (existingProduct) {
            existingProduct.quantity += current.quantity;
          } else {
            acc.push({
              productId: current.productId._id,
              price: formatPrice(current.productId.price),
              quantity: current.quantity,
              name: current.productId.name,
              images: current.productId.images[0],
              objectId: current?.objectId,
              vendorId: current?.vendorId,
            });
          }
          return acc;
        }, newState);
      });
      dispatch(addToCart(userCart));
    } else {
      setUserCart(items);
    }
  }, [userData, isAuthenticated, getUserCart?.data]);

  useEffect(() => {
    setCartCount(userCart.length);
    dispatch(setCartItems(userCart));
  }, [userCart]);

  useEffect(() => {
    if (items?.length > 0) {
      const cart = items.filter((item) => item.productId !== undefined);
      setUserCart(cart);
    }
  }, [items]);

  const vendorId = localStorage.getItem("vendorID");
  
  useEffect(() => {
    if (LoggedUser !== null) {
      const retreiveData = JSON.parse(LoggedUser).user;
      setUserInfo(retreiveData);
    }
  }, [LoggedUser]);
  
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const SignOut = () => {
    dispatch(saveUserData({}));
    dispatch(setSuccessAlert(true));
    dispatch(setAlertTitle("User Logged Out"));
    dispatch(setIsAuthenticated(false));
    dispatch(clearCart());
    localStorage.removeItem("userId");
    localStorage.removeItem("Token");
    localStorage.clear();
  };

  const userToolTip = (
    <Tooltip arrow={false} className="tooltipsStyle">
      {Object.keys(userInfo).length !== 0 ? (
        <>
          Username : <span>{userInfo?.firstName}</span>
          <br />
          Email : <span>{userInfo?.email}</span>
          <div className="ms-4">
            <Button text={"Sign Out"} onClick={SignOut} />
          </div>
        </>
      ) : (
        <></>
      )}
    </Tooltip>
  );
  
  const cartToolTip = (
    <Tooltip
      arrow={false}
      className={`${cartCount > 0 ? "cartToolTip" : "emptyCartToolTip"}`}
    >
      <h6> Shopping Cart</h6>
      <CartToolTip
        userCart={userCart}
        setUserCart={setUserCart}
        getUserCart={getUserCart}
      />
    </Tooltip>
  );
  
  const Token = localStorage.getItem("Token");
  
  const handleNavLinkClick = () => {
    if (screenWidth < 992) {
      setExpanded(false);
    }
  };

  return (
    <Navbar
      fixed="top"
      className="mobile-navbar"
      expand="lg"
      expanded={expanded}
      onToggle={(expanded) => setExpanded(expanded)}
    >
      <Container>
        <Navbar.Brand>
          {role !== "admin" && role !== "vendor" && (
            <NavLink 
              to="/" 
              onClick={onClick} 
              className="navbar-brand-link"
            >
              
            <img 
              src={logoImage} 
              alt="MontrealHaven Logo" 
              style={{ 
                maxHeight: '40px', 
                maxWidth: '250px', 
                width: 'auto', 
                objectFit: 'contain' 
              }}
            />

            </NavLink>
          )}
        </Navbar.Brand>
        
        <div className="d-flex align-items-center order-lg-last mobile-nav-actions">
          {role !== "admin" && role !== "vendor" && role !== "driver" && (
            <Whisper
              speaker={cartToolTip}
              trigger="click"
              placement={screenWidth < 992 ? "bottomEnd" : "bottomEnd"}
              controlId="control-id-cart"
            >
              <span className="cart-icon-wrapper">
                <Badge className="loading" content={userCart?.length}>
                  <TiShoppingCart size="24px" color="white" />
                </Badge>
              </span>
            </Whisper>
          )}
          
          {Token !== null && role ? (
            <Whisper
              speaker={userToolTip}
              trigger="hover"
              placement="bottom"
              controlId="control-id-user"
              delayClose={2000}
            >
              <span className="user-info">
                <BiUser size="24px" color="white" />
                {screenWidth > 576 && (
                  <span className="user-name">{userInfo?.firstName}</span>
                )}
              </span>
            </Whisper>
          ) : (
            <NavLink 
              to="/login" 
              className="login-button"
              onClick={handleNavLinkClick}
            >
              Login
            </NavLink>
          )}
          
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav" 
            className="navbar-toggler-custom ms-2"
          />
        </div>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {role !== "admin" && role !== "vendor" && (
              <>
                <NavLink 
                  to="/Products" 
                  className="nav-link" 
                  onClick={handleNavLinkClick}
                >
                  Marketplace
                </NavLink>
                {role !== "user" && (
                  <NavLink 
                    to="/vendor" 
                    className="nav-link" 
                    onClick={handleNavLinkClick}
                  >
                    Start Selling
                  </NavLink>
                )}
                <NavLink 
                  to="/contact" 
                  className="nav-link" 
                  onClick={handleNavLinkClick}
                >
                  Service Hub
                </NavLink>
                <NavLink 
                  to="/about" 
                  className="nav-link" 
                  onClick={handleNavLinkClick}
                >
                  Our Story
                </NavLink>
                {role !== "driver" && (
                  <NavLink
                    to="/driver-registration"
                    className="nav-link"
                    onClick={handleNavLinkClick}
                  >
                    Driver Registration
                  </NavLink>
                )}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;