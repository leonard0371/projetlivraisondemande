import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
 
const CheckBox = ({
  id,
  onChange,
  label,
  value,
  name,
  onClick,
  defaultChecked,
  disabled = false,
  
}) => {
  const { register, setValue,watch } = useFormContext();
  
  return (
    <div className="checkbox-style">
      <input
        id={id}
        type="checkbox"
        name={name}
        onClick={onClick}        
        checked={value}
        defaultChecked={defaultChecked}
        {...register(name)}
        disabled={disabled}
        onChange={onChange}
        className={`${disabled ? 'disabled-checkbox' : ''}`}
      />
      <label htmlFor={id} className="checkbox-label">
        {label}
      </label>
    </div>
  );
};
 
export default CheckBox;
