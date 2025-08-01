import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FormProvider } from 'react-hook-form';
import Button from "../../components/Input/Button";
import Grid from "../../components/Grid/Grid";

const VendorTabContent = ({
  rows,
  columns,
  isGridLoading,
}) => {
  return (
    <>
      <div className="mt-2 grid-container">      
          <Grid
            noRowsMessage="No Rows To Show"
            rows={rows}
            column={columns}
            isLoading={isGridLoading}
          />
        
      </div>
    </>
  );
};

export default VendorTabContent;
