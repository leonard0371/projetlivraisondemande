import React, { useEffect, useState } from "react";
// import "./Select.scss";
import { Controller, get, useFormContext } from "react-hook-form";
import { InputPicker, SelectPicker } from "rsuite";
import { useSelector } from "react-redux";
import 'rsuite/InputPicker/styles/index.css';

const SearchSelect = ({
  id,
  handleChange = () => null,
  value,
  label,
  required = false,
  optional = false,
  options,
  placeholder,
  labelSide,
  name,
  isDisabled = false,
  readOnly = false,
  isCustomFormSelect = false,
  disableField,
  handleClean,
  width,
  container = false,
  defaultValue,
  cleanable = true,
  tabIndex,
  className
}) => {
  // const allOptions = options ? [...options] : [];
  const allOptions = options && options?.map((item, index) => ({
    label: item ,
    value:  item 
  }));
  const [focusColor, setFocusColor] = useState(false);
  const[showLabel,setShowLabel]=useState("");
  const handelFocus = (e) => {
    setFocusColor(true);
  };
  const handelBlur = () => {
    setFocusColor(false);
  };
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const error = get(errors, name);


  // const handleChange=(val)=>{
  //   const objectofOption=allOptions?.findIndex((item)=>item.value===val)
  //   // console.log(allOptions[objectofOption]?.label,"objectofOption")
  //   setShowLabel(allOptions[objectofOption]?.label)
  // }  
// useEffect(()=>{
  const callLookupName=(val)=>{
  // const objectofOption=allOptions?.findIndex((item)=>item.value===val)
  const objectvalue= document?.getElementById(`${id}-describe`)?.innerHTML;
 // console.log (objectvalue,"objectofOption")
 setShowLabel(objectvalue)

   
  
  }

  useEffect(()=>{
    
  },[showLabel,callLookupName])

// },[value])

  return (
    <div className={`select-container mt-4 mb-4 ${labelSide ? "label-side" : ""}`}>
      <label
        className={`labelColor selectLabel d-flex justify-content-between ${focusColor ? 'focused-label' : ''}`}
        htmlFor={id}
      >
        <span>
          {
            <>
              {label}
              {required && <sup className="ms-1 text-danger fw-bold">*</sup>}
              {optional && <sup className="ms-1 text-primary fw-bold">*</sup>}
            </>
          }
        </span>
        {error && (
          <span className="text-danger error-message">
            {/* <i className="align-self-center"><AiOutlineWarning /></i> */}
            <span className="align-self-center pt-1">{error?.message}</span>
          </span>
        )}
      </label>
      <Controller
        control={control}
        // defaultValue={0}
        name={name}
        rules={{
          // validating required check
          validate: (val) => {
            if (required) {
              return val == 0 || !val ? "Required" : true;
            } else {
              return true;
            }
          },
        }}
        render={({ field: { onChange, value, ref } }) => {
          return (
            <span title={showLabel} className="p-0 m-0" style={{width:"100%"}}>
            <InputPicker
              cleanable={cleanable}
              className={className}
              // on={e => {
              //   if (e.code === "Backspace" && !cleanable) {
              //     debugger;
              //     e.preventDefault();
              //   }
              // }}
              defaultValue={defaultValue}
              placement="autoVerticalStart"
              // title={showLabel}
            // aria-labelledby  ={showLabel}
              data={allOptions}
              onEnter={handelFocus}
              onExit={handelBlur}
              onMouseEnter={(e)=>callLookupName(e)}
             
              onChange={onChange}
            //   {
            //     (val) => {
            //     if (val === null) {
            //       val = 0;
            //       onChange(value);
            //       handleChange(value);
            //       // // console.log(val, "dasdkbsajdkajs");
            //     }
            //     onChange(val);
            //     handleChange(val);
            //     // // console.log(val, "dasdkbsajdkajs");
            //   }}
              id={id}
              // value={value}
              // defaultValue={0}
              value={value}
              disabled={disableField}
              placeholder={placeholder ? placeholder : "-- select --"}
              onClean={handleClean}
              tabIndex={tabIndex}
              style={{
                width: "100%",
              }}
            />
          </span>
          );
        }}
      />
    </div>
  );
};

export default SearchSelect;
