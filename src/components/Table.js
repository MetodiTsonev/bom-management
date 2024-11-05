import React, { useState } from 'react';
import './Table.css';

const Table = ({ data, onRowSelect }) => {
  const [selectedRow, setSelectedRow] = useState(null);

  if (!data || data.length === 0) {
    return <p>No data to display</p>
  }

  // Dynamically get column headers from the first data object keys
  const headers = Object.keys(data[0]);

  const handleRowClick = (rowIndex) => {
    setSelectedRow(rowIndex);
    onRowSelect(rowIndex);
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th></th> {/* No header needed here */}
          {headers.map((header) => (
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
            {headers.map((header) => (
              <td key={header}>{row[header]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;