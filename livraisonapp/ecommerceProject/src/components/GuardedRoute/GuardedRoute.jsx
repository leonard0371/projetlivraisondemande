import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
// import { getRole, isAuthenticated } from "../../api/auth/useLogin";

const GuardedRoute = ({
  role = "admin",
  redirectPath = "/login",
  children,
  condition
}) => {
    // const [isAuthenticated,setIsAuthenticated] = useState(false)
    const isAuthenticated = useSelector((e)=>e.show.isAuthenticated)
// console.log(isAuthenticated,'isAuthenticatedisAuthenticated')
const Token = localStorage.getItem("Token")
// console.log(Token,'vendorTokenvendorToken')

  if (condition) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default GuardedRoute;
