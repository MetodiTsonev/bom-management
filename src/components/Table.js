import React, { useState } from 'react';
import './Table.css';

const Table = ({ data, onRowSelect, headers = {} }) => {
  const [selectedRow, setSelectedRow] = useState(null);

  if (!data || data.length === 0) {
    return <p>No data to display</p>;
  }

  const handleRowClick = (rowIndex) => {
    setSelectedRow(rowIndex);
    if (onRowSelect) {
      onRowSelect(rowIndex);
    }
  };

  // If no headers provided, create them from first data row
  const effectiveHeaders = Object.keys(headers).length === 0 && data.length > 0
    ? Object.keys(data[0]).reduce((acc, key) => ({ ...acc, [key]: key }), {})
    : headers;

  return (
    <table className="table">
      <thead>
        <tr>
          <th></th>
          {Object.keys(effectiveHeaders).map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            onClick={() => handleRowClick(rowIndex)}
            className={selectedRow === rowIndex ? 'selected' : ''}
          >
            <td>
              <input
                type="radio"
                name="rowSelection"
                checked={selectedRow === rowIndex}
                onChange={() => handleRowClick(rowIndex)}
              />
            </td>
            {Object.keys(effectiveHeaders).map((header) => (
              <td key={header}>{row[effectiveHeaders[header]]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
