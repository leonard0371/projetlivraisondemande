import React, { useState } from "react";
import "./Categories.scss";
import { useGetAllData } from "../../api/apiCalls";
import { endPoints } from "../../api/api";
import { useDispatch } from "react-redux";
import { saveCategoryValue } from "../../redux/reducers/patientSlice";
import Button from "../Input/Button";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";

const renderCategories = (categories, dispatch, toggleDropdown, dropdownState,setShowCategories) => {
  if (!categories || typeof categories !== 'object') return null;
const categoryClick = (subcategory)=>{
  dispatch(saveCategoryValue(subcategory))
  setShowCategories(false)
}
  return Object.entries(categories).map(([category, subcategories], index) => (
    <li key={index} className="category-item" style={{ padding: "8px" }}>

      <span onClick={() => toggleDropdown(category)} className="d-flex justify-content-between categories-item">
        {category}
        <span className={`dropdown-arrow ${dropdownState[category] ? 'open' : ''}`}>
          {/* &#9662; */}
          {!dropdownState[category] ? <IoIosArrowDown /> : <IoIosArrowUp />}
        </span>
      </span>
      {dropdownState[category] && (
        <ul className="subcategory-list">
          {Array.isArray(subcategories) && subcategories.length > 0 ? (
            subcategories.map((subcategory, subIndex) => (
              <li key={subIndex} className="subcategory-item" onClick={() => categoryClick(subcategory)}>
                {subcategory}
              </li>
            ))
          ) : typeof subcategories === "object" && subcategories !== null ? (
            renderCategories(subcategories, dispatch, toggleDropdown, dropdownState)
          ) : null}
        </ul>
      )}
    </li>
  ));
};

function Categories({ onClick, setShowCategories }) {
  const { data, isLoading, error } = useGetAllData("getAllCategories", endPoints.getAllCategories);
  const dispatch = useDispatch();
  const [dropdownState, setDropdownState] = useState({});
  const screenSize = window.innerWidth;
  // const [showCategories,setShowCategories] = useState(false)

  const toggleDropdown = (category) => {
    setDropdownState((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading categories: {error.message}</div>;
  }

  return (
    <div className="category-side-menu mt-4">
      {screenSize < 800 && (
        <div className="d-flex flex-row-reverse bd-highlight p-2" onClick={() => setShowCategories(false)}>
          <RxCross1 color="red" stroke="3"/>
        </div>
      )}
      {/* <h2>Categories</h2> */}
      {/* <div className="ms-3 mb-4 mt-2">
        <Button text={"View All Products"} width={"90%"} onClick={onClick} />
      </div> */}
      <ul className="list-styles">
        {data && data.categories ? renderCategories(data.categories, dispatch, toggleDropdown, dropdownState,setShowCategories) : <li>No categories found</li>}
      </ul>
    </div>
  );
}

export default Categories;
