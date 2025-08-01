export const formatPrice = (price) => {
    if (typeof price === "object" && price?.$numberDecimal) {
      return parseFloat(price.$numberDecimal).toFixed(2);
    }
    return parseFloat(price).toFixed(2);
  };
  