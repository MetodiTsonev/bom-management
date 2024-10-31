import React from 'react';
import './Table.css';

const Table = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No data to display</p>;
  }

  // Dynamically get column headers from the first data object keys
  const headers = Object.keys(data[0]);

  return (
    <table className="table">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
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