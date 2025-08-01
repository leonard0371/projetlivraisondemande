import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import Alert from '../Toast/Alert';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeScreen from '../../Screens/HomeScreen';
import ProductDetails from '../../Screens/ProductDetails/ProductDetails';
import AboutUsScreen from '../../Screens/AboutUs/AboutUsScreen';
import VendorSignUp from '../../Screens/Vendor/VendorSignUp';
import SignIn from '../../Screens/SignIn/SignIn';
import ContactUs from '../../Screens/ContactUs/ContactUs';
import CartScreen from '../../Screens/Cart/CartScreen';
import VendorDashboard from '../../Screens/Vendor/VendorDashboard';
import AdminDashboard from '../../Screens/AdminScreen/AdminDashboard';
import VendorProducts from '../../Screens/AdminScreen/VendorProducts';

import { setErrorAlert, setSuccessAlert } from '../../redux/reducers/patientSlice';
import GuardedRoute from '../GuardedRoute/GuardedRoute';
import { roles } from '../../Enums';
import NavBar from '../Navbar/Navbar';

const Layout = () => {
    const alertTitle = useSelector((e) => e.show.alertTitle);
    const successAlert = useSelector((e) => e.show.successAlert);
    const errorAlert = useSelector((e) => e.show.errorAlert);

    const AdminID = localStorage.getItem("AdminID")
    const dispatch = useDispatch()

    const userRole =  localStorage.getItem("Role")
    const currentRole = userRole ? userRole : "UnAuthUser";

    // console.log('successAlert:', successAlert);
    // console.log(userRole,'userRoleuserRoleuserRole')
    // const isAuthenticated = () => {
    //     const token = localStorage.getItem("token");
    //     return !!token;
    // };
    useEffect(() => {
        if (successAlert) {
            dispatch(setSuccessAlert(false))
        }
    }, [successAlert])
    useEffect(() => {
        if (errorAlert) {
            dispatch(setErrorAlert(false))
        }
    }, [errorAlert])
    // console.log(AdminID, 'conditioncheck')

    return (
        <>
            <ToastContainer />
            <Alert title={alertTitle} icon="success" show={successAlert} />
            <Alert title={alertTitle} icon="error" show={errorAlert} />
            {/* <BrowserRouter> */}
                <Routes>
                    {roles[currentRole].map((route, index) => {
                        {/* console.log(route,'routerouteroute') */}
                   
                        return (
                            <Route key={index} path={route.path} element={<route.element />} />
                        )
                    })}

                </Routes>
                <NavBar/>
            {/* </BrowserRouter> */}
        </>
    )
}

export default Layout