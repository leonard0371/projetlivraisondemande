import React, { createContext, useState, useContext } from 'react';

const VendorContext = createContext(null);

export const VendorProvider = ({ children }) => {
  const [vendorId, setVendorId] = useState(null);

  return (
    <VendorContext.Provider value={{ vendorId, setVendorId }}>
      {children}
    </VendorContext.Provider>
  );
};

export const useVendor = () => useContext(VendorContext);
