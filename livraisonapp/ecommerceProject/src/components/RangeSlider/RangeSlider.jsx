import React, { useState } from 'react';

const RangeSlider = () => {
  const [price, setPrice] = useState(1);

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  return (
    <div className="price-range ms-1">
      <label>Price</label>
      <input
        type="range"
        min="1"
        max="2600"
        value={price}
        onChange={handlePriceChange}
      />
      <span>{price}</span>
    </div>
  );
};

export default RangeSlider;
