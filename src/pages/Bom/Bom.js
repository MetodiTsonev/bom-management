import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import Table from "../../components/Table";
import Search from "../../components/Search";
import Description from "../../components/Description";
import "../PageStyle.css";

const Bom = () => {
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isViewVisible, setIsViewVisible] = useState(false);

  const headers = {PRODUCT_ID: `PRODUCT ID`, MATERIAL_ID: `MATERIAL ID`, BOM_QTY: `QUANTITY`};

  const fetchData = () => {
    fetch('http://localhost:5001/api/bom')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Fetched data:', data); // Log to verify data
      setData(data);
      setFilteredData(data);
  })
  .catch(error => console.error("Error fetching BOM:", error));
};

useEffect(() => {
  fetchData(); // Fetch data on component mount
}, []);

const handleAdd = () => {
  setIsAddVisible(true);
  setEditData(null); // Ensure no edit data is set when adding new material
};

const handleClose = () => {
  setIsAddVisible(false);
  setIsEditVisible(false);
  setIsViewVisible(false);
  setEditData(null);
};

const handleSubmit = () => {
  fetchData(); // Refresh data after adding or updating a material
  handleClose(); // Close the form
};

const handleDelete = () => {
  // TODO: DELETE FUNCTIONALITY
};

const handleView = () => {
  // TODO: VIEW FUNCTIONALITY
};

const handleClear = () => {
  setFilteredData(data);
  setSearchValue(''); //TODO doesn't work
};

const handleSearch = () => {
  const search = searchValue.toLowerCase();
  const filtered = data.filter(row => {
    return Object.values(row).some(value => {
      return String(value).toLowerCase().includes(search);
    });
  });
  setFilteredData(filtered);
};

const handleRowClick = (index) => {
  // TODO: SELECT ROW FUNCTIONALITY
};

return (
  <div>
    <Description text='Bill of Materials' description='The Bom Page is used to create Products and its specifications.'/>
    <div className="container">
      <div className="left-column">
        <Table data={filteredData} onRowSelect={setSelectedRow} headers={headers}/>
        <Button label="Clear filters" onClick={handleClear} type="clear"/>
      </div>
      <div className="right-column">
        <div className="searchField">
          <Search onSearch={setSearchValue} />
          <Button label="Go" onClick={handleSearch} type="search" />
        </div>
        <Button label="Add" onClick={handleAdd} type="add" />
        <Button label="Delete" onClick={handleDelete} type="delete" />
        <Button label="View" onClick={handleView} type="view" />
      </div>
    </div>
  </div>
);
};

export default Bom;