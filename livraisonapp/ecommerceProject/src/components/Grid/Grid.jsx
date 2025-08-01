import React, { useEffect, useMemo, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import "./Grid.scss";
import Skeleton from "react-loading-skeleton";

const Grid = ({
  column,
  rows,
  pageIndex = 1,
  totalPage = 1,
  HasPreviousPage,
  HasNextPage,
  handlePage,
  gridHeight = "260px",
  patientScreenHieght = false,
  noRowsMessage = "No Rows To Show",
  gridSearchFilter,
  isLoading = false,
}) => {
  const defaultColDef = useMemo(() => {
    return {
      initialWidth: 100,
      sortable: true,
      resizable: false,
      filter: false,
    };
  }, []);

  const [gridColumns, setGridColumns] = useState(column);
  const [gridRows, setGridRows] = useState(rows);
  const [currentPage, setCurrentPage] = useState(1); 

  useEffect(() => {
    if (isLoading) {
      setGridColumns(
        column.map((col) => ({
          ...col,
          cellRenderer: () => <Skeleton width={"100%"} height={20} duration={1.5} />,
        }))
      );

      setGridRows([...Array(10)].map(() => ({}))); 
    } else {
      setGridColumns(column);
      setGridRows(rows);
    }
  }, [isLoading, rows, column]);

  const handlePaginationChange = (params) => {
    setCurrentPage(params.api.paginationGetCurrentPage() + 1); 
  };

  return (
    <>
      <div
        className={`${
          patientScreenHieght ? "patientScreen" : ""
        } ag-theme-alpine grid-div`}
        style={{
          height: `${gridHeight}`,
          width: "100%",
          backgroundColor: "#ffffff",
        }}
      >
        <AgGridReact
          rowData={gridRows}
          columnDefs={gridColumns}
          defaultColDef={defaultColDef}
          overlayNoRowsTemplate={noRowsMessage}
          pagination={true}
          paginationPageSize={10} 
          onPaginationChanged={handlePaginationChange} 
          paginationPageSizeSelector={false}
          autoGroupColumnDef={{
            minWidth: 200,
          }}
        ></AgGridReact>

      </div>
    </>
  );
};

export default Grid;
