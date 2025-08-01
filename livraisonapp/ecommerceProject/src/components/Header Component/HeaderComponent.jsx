import React from "react";
import { Col, Container } from "react-bootstrap";
import "./Header.scss";
// import vendorBg from "../../assets/vendor-signup1.png";
import Button from "../Input/Button";

// function HeaderComponent() {
//   return (
//     <>
//       <div className="header" style={{ backgroundImage: `url(${vendorBg})` }}>
//         <div className="text-container">
//           <h4 style={{ fontSize: "45px", fontWeight: 450, lineHeight: "5px" }}>
//             Create a
//           </h4>
//           <h2 style={{ fontSize: "80px", letterSpacing: "2px" }}>VENDOR</h2>
//           <h2
//             style={{ fontSize: "50px", lineHeight: "7px", marginBottom: "10%" }}
//           >
//             ACCOUNT
//           </h2>
//           {/* <p>
//             Contrary to popular belief, Lorem Ipsum is not simply random text.
//             It has roots in a piece of classical Latin literature from 45 BC,
//             making it over 2000 years old.
//           </p> */}

//           {/* <div>
//             {" "}
//             <Button text={"Sign Up"} />
//           </div> */}
//         </div>
//       </div>
//     </>
//   );
// }

function HeaderComponent() {
  return (
    <div className="header">
      <div className="overlay"></div>
      <div className="text-container">
        <h4>Create a</h4>
        <h2>VENDOR</h2>
        <h2>ACCOUNT</h2>
      </div>
    </div>
  );
}


export default HeaderComponent;
