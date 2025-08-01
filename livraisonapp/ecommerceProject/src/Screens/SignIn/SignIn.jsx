import React, { useEffect, useState } from "react";
import "./SignIn.scss";
import SignInBg from "../../assets/vieuxport.jpg";
import { Col, Row } from "react-bootstrap";
import NavBar from "../../components/Navbar/Navbar";
import { FormProvider, useForm } from "react-hook-form";
import InputField from "../../components/Input/Input";
import Button from "../../components/Input/Button";
import { useAddData, useGetAllData } from "../../api/apiCalls";
import { endPoints } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useVendor } from "../../api/VendorContext";
import { useDispatch, useSelector } from "react-redux";
import {
  saveUserData,
  setAlertTitle,
  setErrorAlert,
  setIsAuthenticated,
  setSuccessAlert,
} from "../../redux/reducers/patientSlice";
import { setUserDtails } from "../../redux/reducers/userSlice";
import ReactLoading from "react-loading";
import { useQueryClient } from "react-query";
import { clearCart, setIsEnabled } from "../../redux/reducers/cartSlice";
import { setShowNavbar } from "../../redux/reducers/projectSlice";

function SignIn() {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const methods = useForm();
  const signUpMethods = useForm();
  // const [isEnabled,setIsEnabled] = useState(false)
  const navigate = useNavigate();
  const Token = localStorage.getItem("Token");
  const loginWithRoles = useAddData("loginWithRoles");
  const saveOrUpdateUser = useAddData("saveOrUpdateUser");
  const { setVendorId } = useVendor();
  const [count, setCount] = useState(1);
  const dispatch = useDispatch();
  const showNavbar = useSelector((e) => e.project.showNavbar);
  const userData = useSelector((e) => e.show.userData);
  const items = useSelector((e) => e.cart.items);
  const userCart = useSelector((e) => e.cart.userCart);
  console.log(items, "6wa4f65af4aw5f");
  const addproductstoCart = useAddData("addproductstoCart");

  //API GET VENDOR CALL
  const GetAllVendor = useGetAllData("GetAllVendor", endPoints.getAllVendor);
  // //console.log(loginWithRoles?.isLoading,"dwadw76")

  const handleSubmit = methods.handleSubmit(async (sendData) => {
    setIsLoading(true);
    const response = await loginWithRoles.mutateAsync({
      sendData: sendData,
      endPoint: endPoints.loginWithRoles,
    });
    // //console.log(response,"978459/786")
    if (response?.status === 200) {
      // //console.log(response?.data, 'responseresponse')
      dispatch(clearCart());
      dispatch(setUserDtails(response?.data?.user));
      const userRole = response?.data?.user.role;
      if (userRole === "admin") {
        setIsLoading(false);
        dispatch(setIsAuthenticated(true));
        dispatch(setSuccessAlert(true));
        dispatch(setAlertTitle("Logged in Successfully"));
        localStorage.setItem("AdminID", response?.data?.user.id);
        localStorage.setItem("Token", response?.data?.token);
        localStorage.setItem("Role", response?.data?.user?.role);
        localStorage.setItem("LoggedUser", JSON.stringify(response?.data));
        // //console.log(response?.data?.user?.role,'responseresponseresponse')
        dispatch(setShowNavbar(false));
        //console.log(showNavbar,"45698741852258963")
        navigate("/admindashboard");
      } else if (userRole === "vendor") {
        navigate("/vendordashboard");
        dispatch(setShowNavbar(false));
        //console.log(showNavbar,"45698741258963")
        localStorage.setItem("vendorID", response?.data?.user.id);
        localStorage.setItem("Token", response?.data?.token);
        localStorage.setItem("Role", response?.data?.user?.role);
        localStorage.setItem("LoggedUser", JSON.stringify(response?.data));
        dispatch(setIsAuthenticated(true));
        // //console.log(response?.data.token,'vendorIdvendorIdvendorId')
        dispatch(setSuccessAlert(true));
        dispatch(setAlertTitle("Logged In As Vendor"));
        setIsLoading(false);
      } else if (userRole === "user") {
        dispatch(saveUserData(response?.data));
        setIsLoading(false);
        dispatch(setIsEnabled(true));
        //console.log(response?.data,"984653219dwada")
        dispatch(setSuccessAlert(true));
        dispatch(setAlertTitle("Logged In As User"));
        localStorage.setItem("userId", response?.data?.user.id);
        localStorage.setItem("Token", response?.data?.token);
        localStorage.setItem("Role", response?.data?.user?.role);
        localStorage.setItem("LoggedUser", JSON.stringify(response?.data));
        dispatch(setIsAuthenticated(true));
        const LoggedUser = JSON.parse(localStorage.getItem("LoggedUser"));

        const newSendData = {
          userId: LoggedUser ? LoggedUser.user.id : "",
          products: items.map((product) => {
            return {
              productId: product?.productId,
              price: product?.price,
              quantity: product?.quantity,
              name: product?.name,
              subTotal: product?.subTotal,
            };
          }),
          // queryClient.invalidateQueries('getUserCart');
        };
        if (items?.length > 0) {
          const response = await addproductstoCart.mutateAsync({
            sendData: newSendData,
            endPoint: endPoints.addProductsToCart,
          });
          if (response?.status === 200) {
            // setIsLoading(false);
            queryClient.invalidateQueries("getUserCart");
          } else {
            dispatch(setErrorAlert(true));
            dispatch(
              setAlertTitle(
                "Failed to add products to cart due to insufficient quantity"
              )
            );
          }
        }
      } else if (userRole === "driver") {
        // Only set role and token, do not set userId or run cart logic
        localStorage.setItem("Token", response?.data?.token);
        localStorage.setItem("Role", userRole);
        localStorage.setItem("LoggedUser", JSON.stringify(response?.data));
        dispatch(setIsAuthenticated(true));
        dispatch(setSuccessAlert(true));
        dispatch(setAlertTitle("Logged In As Driver"));
        setIsLoading(false);
        navigate("/driverdashboard");
        return;
      }
      // Only set userId and run cart logic if not driver
      if (userRole !== "driver") {
        localStorage.setItem("userId", response?.data?.user.id);
        // ... existing cart logic ...
      }
    } else if (response?.response?.status === 400) {
      setIsLoading(false);
      dispatch(setErrorAlert(true));
      // //console.log(response,"6dwa4d6aw4d")
      dispatch(setAlertTitle(response?.response?.data?.error));
    } else {
      setIsLoading(false);
    }
  });

  //console.log(userData,"6dwad6d4af6awf")

  const handleSignUp = signUpMethods.handleSubmit(async (sendData) => {
    sendData.role = "user";
    setIsLoading(true);
    const response = await saveOrUpdateUser.mutateAsync({
      sendData: sendData,
      endPoint: endPoints.saveOrUpdateUser,
    });
    if (response?.status === 200) {
      navigate("/login");
      setIsLoading(false);
      signUpMethods.reset({});
      setIsSignInForm(!isSignInForm);
      dispatch(setSuccessAlert(true));
      dispatch(setAlertTitle("Registered Successfully"));
    } else if (response?.status === 400) {
      // //console.log(response,'data4646546541653')
      setIsLoading(false);
      dispatch(setErrorAlert(true));
      dispatch(setAlertTitle(response?.response?.data?.error));
    } else {
      setIsLoading(false);
      dispatch(setErrorAlert(true));
      // //console.log(response,'response?.dataresponse?.data')
      dispatch(setAlertTitle(response?.response?.data?.error));
      // dispatch(setAlertTitle("Inactive"))
    }
  });

  const toggleForm = () => {
    setIsSignInForm(!isSignInForm);
    signUpMethods.reset({});
  };
  const screenSize = window.innerWidth;
  const inputStyle = "w-full border-t-0 border-x-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 px-0 py-2 text-gray-700 placeholder-gray-500";
  const errorStyle = "text-red-500 text-sm mt-1";

return (
    <div 
      className="min-h-screen w-full"
      style={{
        backgroundImage: `url(${SignInBg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "top",
      }}
    >
      <div className="flex justify-center items-start pt-20">
        <div className="bg-white rounded-2xl p-8 w-[500px] shadow-lg">
          {isSignInForm ? (
            <>
              <h2 className="text-2xl font-normal mb-8">Sign In</h2>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <div className="relative">
                      <InputField
                        id="Email"
                        name="email"
                        type="email"
                        placeholder="Enter your Email"
                        defaultValue=""
                        tabIndex={1}
                        required={true}
                        className={inputStyle}
                      />
                    </div>
                    <div className={errorStyle}>This field is required</div>
                  </div>

                  <div>
                    <div className="relative">
                      <InputField
                        id="Password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        defaultValue=""
                        tabIndex={2}
                        required={true}
                        className={inputStyle}
                      />
                    </div>
                    <div className={errorStyle}>This field is required</div>
                  </div>

                  <div className="flex justify-center mt-8">
                    <button
                      type="submit"
                      // className="bg-[#00378F] text-white px-12 py-2 rounded hover:bg-[#1362bd]"
                      className="bg-[#64B5F6] text-white px-12 py-2 rounded hover:bg-[#1663a1]"

                    >
                      Sign In
                    </button>
                  </div>

                  <div className="text-center mt-6">
                    <p className="text-gray-600">New to Montreal Haven?</p>
                    <button
                      type="button"
                      onClick={toggleForm}
                      className="mt-4 bg-black text-white px-8 py-2 rounded hover:bg-gray-800 w-full"
                    >
                      Create Your Montreal Haven Account
                    </button>
                  </div>
                </form>
              </FormProvider>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-normal mb-8">Sign Up</h2>
              <FormProvider {...signUpMethods}>
                <form onSubmit={handleSignUp} className="space-y-6">
                  <div>
                    <div className="relative">
                      <InputField
                        id="Name"
                        name="firstName"
                        placeholder="Enter your Username"
                        defaultValue=""
                        tabIndex={1}
                        required
                        className={inputStyle}
                      />
                    </div>
                    <div className={errorStyle}>This field is required</div>
                  </div>

                  <div>
                    <div className="relative">
                      <InputField
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your Email"
                        defaultValue=""
                        tabIndex={2}
                        required
                        className={inputStyle}
                      />
                    </div>
                    <div className={errorStyle}>This field is required</div>
                  </div>

                  <div>
                    <InputField
                      id="contactNumber"
                      name="contactNumber"
                      type="number"
                      placeholder="Enter Contact Number"
                      defaultValue=""
                      tabIndex={3}
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <div className="relative">
                      <InputField
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        defaultValue=""
                        tabIndex={4}
                        required
                        className={inputStyle}
                      />
                    </div>
                    <div className={errorStyle}>This field is required</div>
                  </div>

                  <div className="flex justify-end items-center space-x-4 mt-8">
                    <button
                      type="button"
                      onClick={toggleForm}
                      className="bg-black text-white px-8 py-2 rounded hover:bg-gray-800"
                    >
                      Login
                    </button>
                    <button
                      type="submit"
                      // className="bg-[#00378F] text-white px-8 py-2 rounded hover:bg-[#1362bd]"
                      className="bg-[#64B5F6] text-white px-12 py-2 rounded hover:bg-[#1663a1]"
                      disabled={isLoading}
                    >
                      Register
                    </button>
                  </div>
                </form>
              </FormProvider>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default SignIn;
