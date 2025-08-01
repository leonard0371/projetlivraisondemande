// import React from 'react'

import { useEffect } from "react";

// const Alerts = () => {
//   return (
//     <>
      
//     </>
//   )
// }

// export default Alerts
// const Alert  = Swal.mixin({
//     toast: true,
//     position: "top-end",
//     showConfirmButton: false,
//     timer: 2000,
//     timerProgressBar: true,
//     didOpen: (toast) => {
//       toast.onmouseenter = Swal.stopTimer;
//       toast.onmouseleave = Swal.resumeTimer;
//     }
//   });
   

//         Alert.fire({
//           icon: "success",
//           title: "Product Added Successfuly!",
//         });

 
//   export default Alert;


  // const Alert = ({ title, icon, show }) => {
  //   useEffect(() => {
  //     if (show) {
  //       toast[icon](title, {
  //         position: "top-right",
  //         autoClose: 2000,
  //         hideProgressBar: true,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "colored",
  //         transition: Slide,
  //       });
  //     }
  //   }, [show]);
  
  //   return null;
  // };

  import React from 'react'
  
  const Alerts = ({icon,title,show}) => {
    if(show)
      {
          // export default Alerts
    const Alert  = Swal.mixin({
      toast: show,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
     
    
          Alert.fire({
            icon: icon,
            title: title,
          });
      }
    
    
    return (
      <div>
        
      </div>
    )
  }
  
  export default Alerts
  