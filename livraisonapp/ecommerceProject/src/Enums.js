import AboutUsScreen from "./Screens/AboutUs/AboutUsScreen"
import AdminDashboard from "./Screens/AdminScreen/AdminDashboard"
import ContactUs from "./Screens/ContactUs/ContactUs"
import HomeScreen from "./Screens/HomeScreen"
import ProductDetails from "./Screens/ProductDetails/ProductDetails"
import SignIn from "./Screens/SignIn/SignIn"
import VendorDashboard from "./Screens/Vendor/VendorDashboard"
import VendorSignUp from "./Screens/Vendor/VendorSignUp"
import Products from "./Screens/Products/Products"
import DriverRegistration from "./Screens/DriverRegistration";
import DriverDashboard from "./Screens/DriverDashboard";

export const roles = {
    UnAuthUser: [
      { path: "/", element: HomeScreen },
      { path: "about", element: AboutUsScreen },
      { path: "/contact", element: ContactUs },
      { path: "/login", element: SignIn },
      { path: "/vendor", element: VendorSignUp },
      { path: "/product", element: ProductDetails },
      { path: "/products", element: Products },
      { path: "/driver-registration", element: DriverRegistration },
      { path: "/driverdashboard", element: DriverDashboard },
      { path: "*", element: HomeScreen },
    ],
    user: [
      { path: "/", element: HomeScreen },
      { path: "about", element: AboutUsScreen },
      { path: "/contact", element: ContactUs },
      { path: "/product", element: ProductDetails },
      {path: "/products", element: Products},
      { path: "*", element: HomeScreen },
    ],
    vendor: [
      { path: "/", element: HomeScreen },
      { path: "about", element: AboutUsScreen },
      { path: "/contact", element: ContactUs },
      { path: "/vendordashboard", element: VendorDashboard },
      { path: "/product", element: ProductDetails },
      {path: "/products", element: Products},
      { path: "*", element: VendorDashboard },
    ],
    admin: [
      { path: "/admindashboard", element: AdminDashboard },
      { path: "/", element: HomeScreen },
      { path: "*", element: AdminDashboard },
    ],
    driver: [
      { path: "/", element: HomeScreen },
      { path: "/driverdashboard", element: DriverDashboard },
      { path: "/driver-registration", element: DriverRegistration },
      { path: "*", element: DriverDashboard },
    ],
  };

  // export const userRoles ={
  //   admin: ,
  //   vendor: ,
  //   user: ,
  // }
  