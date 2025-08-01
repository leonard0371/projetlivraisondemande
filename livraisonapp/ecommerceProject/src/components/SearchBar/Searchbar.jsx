import React, { useState } from 'react';
import { Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { IoSearchSharp } from 'react-icons/io5';
import './SearchBar.scss';

const SearchBar = ({ onSearch, onClick, onChange, value }) => {
  // Remove dependency on categories prop to avoid the error

  const handleSearch = (e) => {
    e.preventDefault();
    if (onClick) onClick();
  };

  return (
    <Form className="d-flex mt-4" onSubmit={handleSearch}>
      <InputGroup>
        <FormControl
          placeholder="Search by Product Name"
          aria-label="Search"
          aria-describedby="basic-addon2"
          value={value || ''}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onClick) {
              e.preventDefault();
              onClick();
            }
          }}
        />
        <Button
          className='searchButton'
          onClick={onClick}
          type="submit"
        >
          <IoSearchSharp />
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchBar;