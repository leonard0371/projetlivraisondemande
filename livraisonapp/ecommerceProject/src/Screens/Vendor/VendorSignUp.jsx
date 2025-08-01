import React from "react";
import HeaderComponent from "../../components/Header Component/HeaderComponent";
// import Input from '../../components/Input/Input'
import { FormProvider, useForm } from "react-hook-form";
import InputField from "../../components/Input/Input";
import NavBar from "../../components/Navbar/Navbar";
import AddVendor from "./AddVendor";

function VendorSignUp() {
const methods = useForm();

    return (
    <>
      <div>
        {/* <NavBar/> */}
        <div className="mt-4">
        <HeaderComponent />
        </div>
        <FormProvider {...methods}>
          <AddVendor/>
        </FormProvider>
      </div>
    </>
  );
}

export default VendorSignUp;
