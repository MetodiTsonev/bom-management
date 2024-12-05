import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import Table from "../../components/Table";
import Search from "../../components/Search";
import Description from "../../components/Description";
import AddProductForm from "./AddProductForm";
import "../PageStyle.css";

const Bom = () => {
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isViewVisible, setIsViewVisible] = useState(false);

  const headers = {PRODUCT_ID: `PRODUCT_ID`, MATERIAL_ID: `MATERIAL_ID`, BOM_QTY: `BOM_QTY`};

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
};

const handleClose = () => {
  setIsAddVisible(false);
  setIsViewVisible(false);
};

const handleSubmit = () => {
  fetchData(); // Refresh data after adding or updating a material
  handleClose(); // Close the form
};

const handleDelete = () => {
  if (selectedRow !== null) {
    const { PRODUCT_ID, MATERIAL_ID} = data[selectedRow];
    fetch(`http://localhost:5001/api/bom/${PRODUCT_ID}/${MATERIAL_ID}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      fetchData(); // Refresh data after deletion
    })
    .catch(error => console.error("Error deleting BOM:", error));
  } else {
    console.error("No row selected for deletion");
  }
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

return (
  <div>
    <Description text='Bill of Materials' description='The Bom Page is used to create Products and its specifications.'/>
    <div className="container">
      <div className="left-column">
        <Table data={data} onRowSelect={setSelectedRow} headers={headers}/>
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
    {isAddVisible && <AddProductForm onClose={handleClose} onSubmit={handleSubmit} />}
  </div>
);
};

export default Bom;