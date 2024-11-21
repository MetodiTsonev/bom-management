import React, { useState } from 'react';
import './Table.css';

const Table = ({ data, onRowSelect }) => {
  const [selectedRow, setSelectedRow] = useState(null);

  if (!data || data.length === 0) {
    return <p>No data to display</p>;
  }

  const headers = {ID: `MATERIAL_ID`, Name: `MATERIAL_NAME`, Description: `MATERIAL_DESCRIPTION`, Measure: 'MATERIAL_MEASURE'}; //Object.keys(data[0]);

  const handleRowClick = (rowIndex) => {
    setSelectedRow(rowIndex);
    onRowSelect(rowIndex);
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th></th>
          {Object.keys(headers).map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} onClick={() => handleRowClick(rowIndex)} className={selectedRow === rowIndex ? 'selected' : ''}>
            <td>
              <input
                type="radio"
                name="rowSelection"
                checked={selectedRow === rowIndex}
                onChange={() => handleRowClick(rowIndex)}
              />
            </td>
            {Object.keys(headers).map((header) => (
              <td key={header}>{row[headers[header]]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
