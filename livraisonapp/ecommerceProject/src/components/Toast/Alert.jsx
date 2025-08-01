import React, { useEffect } from 'react'
import { toast } from "react-toastify";
import { Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Alert = ({ title, icon, show }) => {
    useEffect(() => {
        if (show) {
            toast[icon](title, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Slide,
            });
        }
    }, [show]);

    return null;
}

export default Alert