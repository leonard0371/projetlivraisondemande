import React, { useState } from "react";
import "./ImageGallery.scss";
import config from "../../config";
const ImageGallery = ({ images }) => {
  // console.log(images, 'fasdkfljasjfas')
  const [currentIndex, setCurrentIndex] = useState(0);
const API_URL = import.meta.env.VITE_APP_API_URL;

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  
  const handlePrevClick = () => {
    
    setCurrentIndex((prevIndex) =>
    {
      // console.log('previous prevIndex', prevIndex)
      // console.log('image length', images.length)
    //  return prevIndex > 0 ? prevIndex - 1 : images.length - 1
    return prevIndex > 0 ? prevIndex - 1 : images[0].length - 1
    }
    );
  };

const handleNextClick = () => {
  setCurrentIndex((prevIndex) => {

    // const newIndex = prevIndex < images.length - 1 ? prevIndex + 1 : 0;
    const newIndex = prevIndex < images[0].length - 1 ? prevIndex + 1 : 0;
    // console.log('next prevIndex', prevIndex);
    // console.log('images length', images.length);
    // console.log('newIndex after next click', newIndex);
    return newIndex;
  });
};

  return (
    <div className="image-gallery">
      <div className="main-image-container">
        <div className="main-image">
          <button className="arrow left-arrow" onClick={handlePrevClick}>
            {/* &lt; */}
          </button>
          <img src={images[0] !== undefined ? API_URL+images[0][currentIndex] : ""} alt="Main" />
          <button className="arrow right-arrow" onClick={handleNextClick}>
            {/* &gt; */}
          </button>
        </div>
      </div>
      <div className="thumbnails">
        {images[0] !== undefined &&
        images[0]?.map((image, index) => (
          <img
            key={index}
            src={API_URL+image}
            alt={`Thumbnail ${index}`}
            onClick={() => handleThumbnailClick(index)}
            className={index === currentIndex ? "active" : ""}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
