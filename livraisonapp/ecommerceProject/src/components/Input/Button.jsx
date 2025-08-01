
import "./button.scss";
import ReactLoading from 'react-loading';
import { useContext, useEffect, useState } from "react";

const Button = ({
  text,
  onClick,
  width = "120px",
  size,
  disabled,
  tabIndex,
  onFocus,
  isSecondary,
  isLoading=false,
  borderRadius,
  fontSize
}) => {
  const [hideButton, setHideButton] = useState(false);
  return (
    <div>
      <button
        className={`${disabled || isLoading ? "disabled-button mt-2" : 'button-styling mt-2'}`}
        style={{ width: width,borderRadius : borderRadius }}
        onClick={onClick}
        disabled={disabled}
        tabIndex={tabIndex}
        onFocus={onFocus}
        fontSize={fontSize}
        type="submit"
      >
        {isLoading?
        <div className="d-flex justify-content-center">
       <ReactLoading type={"bars"} color={"white"} height={30} width={30} />
       </div>
       : 
       <div  style={{color: disabled ? "lightgrey" : "white"}}>
        {text}
        </div>
       }
        {/* {text} */}
      </button>
    </div>
  );
};

export default Button;
