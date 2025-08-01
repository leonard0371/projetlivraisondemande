import React, { useState } from "react";
import './textarea.scss'
import { useFormContext } from "react-hook-form";

function TextArea({ name, id, rows, maxLength, minLength, placeholder, required = false, label }) {
  const [limit, setLimit] = useState(false);
  const { register,
    formState: { errors },
    watch,
  } = useFormContext();
  const handleInput = (e) => {
    if(e.target.value.length >= maxLength){
      setLimit(true);
    }
    else{
      setLimit(false);
    }
  }
  // {console.log(maxLength,"d6wa46f8a4f6a8f4")}
  return (
    <div className="text-area">
      {label && <label htmlFor={id}>{label}</label>}
      <textarea
        className="form-control"
        name={name}
        id={id}
        data-limit-rows="true"
        rows={rows}
        {...register(name, {
          required: {
            value: required,
            message: "Required",
          },
        })}
        maxLength={maxLength}
        minLength={minLength}
        style={{maxHeight: "180px"}}
        placeholder={placeholder}
        onInput={handleInput}
      ></textarea>
      {limit && <span style={{color: "red"}}>Max lenght is {maxLength} characters</span>}
    </div>
  );
}

export default TextArea;
