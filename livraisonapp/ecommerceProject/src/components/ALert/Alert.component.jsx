import React, { useEffect } from "react";
import Swal from "sweetalert2";
import "./Alert.scss";
import { toast } from "react-toastify";
import { Slide, Zoom, Flip, Bounce } from "react-toastify";
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
};

export const AlertOK = ({ title, description, icon, show, onConfirm }) => {
  useEffect(() => {
    if (show) {
      Swal.fire({
        title,
        icon,
        text: description,
        showConfirmButton: true,
        confirmButtonText: "OK",
        confirmButtonColor: "#3B71CA",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          onConfirm();
        }
      });
    }
  }, [show]);

  return null;
};

export const ConfirmAlert = ({ title, icon, show, onConfirm, onCancel }) => {
  useEffect(() => {
    if (show) {
      Swal.fire({
        title,
        icon,
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc3545",
      }).then((result) => {
        if (result.isConfirmed) {
          onConfirm();
        } else {
          onCancel();
        }
      });
    }
  }, [show]);

  return null;
};

export const AutoCloseAlert = ({ title, show, alertTime }) => {
  let timerInterval;
  useEffect(() => {
    if (show) {
      Swal.fire({
        title: title,
        timer: alertTime,
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
        }
      });
    }
  }, [show]);
};

export default Alert;
