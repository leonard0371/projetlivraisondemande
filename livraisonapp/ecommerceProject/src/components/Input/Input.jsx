import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import "./Input.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const InputField = ({
  id,
  label,
  name,
  defaultValue = "",
  // pattern = "",
  // oninput = "",
  disabled = false,
  autoFocus = false,
  tabIndex,
  placeholder = "",
  type = "text",
  onChange,
  onKeyPress = "",
  accept,
  multiple,
  required = false,
  maxLength = 50,
  max = 11,
}) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const [value, setValueState] = useState(watch(name) || defaultValue);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [limit, setLimit] = useState(false);

  useEffect(() => {
    register(name, {
      required: required ? "This field is required" : false,
      pattern:
        type === "email"
          ? {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            }
          : type === "phone"
          ? {
              // value: /^\(\d{3}\) \d{3}-\d{4}$/,
              // message: "Invalid phone number. Use format: (XXX) XXX-XXXX",

              value:/^\d{10}$/,
              message: "Invalid phone number. Use format: (XXX) XXX-XXXX",
            }
          : undefined,
      minLength:
        type === "password"
          ? {
              value: 6,
              message: "Password must be at least 6 characters long",
            }
          : undefined,
    });
  }, [register, name, required, type]);


  const handleChange = (e) => {
    const { type: inputType, files, value: inputValue } = e.target;

    if (inputType === "file") {
      const fileList = multiple ? Array.from(files) : files[0];
      setValue(name, files);
      setValueState(
        multiple ? Array.from(files).map((file) => file) : files[0]
      );
    }
    // } else if (type === "phone") {
    //   const formattedValue = formatPhoneNumber(inputValue);
    //   setValue(name, formattedValue);
    //   setValueState(formattedValue);
    // else {
    //   setValue(name, inputValue);
    //   setValueState(inputValue);
    // }

    else {
      const processedValue = type === "number" ? parseFloat(inputValue) : inputValue;
      setValue(name, processedValue);
      setValueState(processedValue);
    }

    if (onChange) {
      onChange(e);
    }
  };

  const handleKeyDown = (event) => {
    if (type === "phone") {
      // Allow only digits, backspace, arrow keys, and tab
      if (
        !/^\d$/.test(event.key) &&
        !["Backspace", "ArrowLeft", "ArrowRight", "Tab"].includes(event.key)
      ) {
        event.preventDefault();
      }
    } else if (type === "number") {
      // Permettre un seul point décimal et empêcher les caractères autres que des chiffres ou le point
      if (
        (event.key === "." && value.includes(".")) ||  // Un seul point autorisé
        ["e", "E", "+", "-"].includes(event.key) // Interdire e, E, +, -
      ) {
        event.preventDefault();
      }
    
      // if (
      //   invalidKeys.includes(event.key) ||
      //   (isNaN(event.key) &&
      //     !["Backspace", "ArrowLeft", "ArrowRight", "Tab"].includes(event.key))
      // ) {
      //   event.preventDefault();
      // }
    }
  };

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const handleInput = (e) => {
    if (type === "file") {
      if (e.target.files.length >= maxLength) {
        setLimit(true);
      } else {
        setLimit(false);
      }
    } else {
      if (e.target.value.length >= maxLength) {
        setLimit(true);
      } else {
        setLimit(false);
      }
    }
  };

  return (
    <div className="input-field">
      <span className="d-flex justify-content-start">
        {label && <label htmlFor={id}>{label}</label>}
        {required && (
          <sup style={{ color: "red", paddingTop: "12px", paddingLeft: "5px" }}>
            *
          </sup>
        )}
      </span>
      <div className="password-wrapper">
        <input
          id={id}
          name={name}
          type={
            type === "password" && isPasswordVisible
              ? "text"
              : type === "phone"
              ? "tel"
              : type
          }
          value={type === "file" ? undefined : value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          tabIndex={tabIndex}
          accept={type === "file" ? accept : undefined}
          multiple={multiple}
          onChange={handleChange}
          onInput={handleInput}
          className={`form-control ${disabled ? "disabled-input" : ""} ${
            errors[name] ? "input-error" : ""
          }`}
          autoComplete="off"
          onKeyDown={handleKeyDown}
          maxLength={type === "phone" ? 10 : maxLength}
          inputMode={
            type === "phone" || type === "number" ? "numeric" : undefined
          }
          onWheel={(e) => e.target.blur()}
        />
        {type === "password" && (
          <button
            type="button"
            className="toggle-password"
            onClick={handleTogglePasswordVisibility}
            tabIndex={tabIndex}
          >
            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
      {errors[name] && <p className="error-message">{errors[name].message}</p>}
      {limit && (
        <span style={{ color: "red" }}>
          Max length is {maxLength} characters
        </span>
      )}
    </div>
  );
};

export default InputField;
