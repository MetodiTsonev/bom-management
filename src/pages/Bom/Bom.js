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

  const headers = {Product: `PRODUCT_ID`, Material: `MATERIAL_ID`, Quantity: `BOM_QTY`};

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
};

const handleSubmit = async (formData) => {
  try {
      console.log('Submitting form data:', formData);

      const response = await fetch('http://localhost:5001/api/products/add', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
      });

      if (!response.ok) {
          const errorMessage = await response.json();
          throw new Error(`Failed to add product: ${errorMessage.error}`);
      }

      console.log('Product added successfully.');
      fetchData(); // Refresh the data table
      handleClose(); // Close the form
  } catch (error) {
      console.error('Error submitting form data:', error.message);
      alert(`Error: ${error.message}`);
  }
};

const handleClear = () => {
  setSearchValue(''); // Clear the search input
  setFilteredData(data); // Reset the filtered data
  setSelectedRow(null); // Clear selected row
}

const handleSearch = (searchInput) => {
  setSearchValue(searchInput); // Update the `searchValue` state
  setFilteredData(
    data.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchInput.toLowerCase())
      )
    )
  );
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
          <Search value={searchValue} onSearch={handleSearch} />
        </div>
        <Button label="Add" onClick={handleAdd} type="add" />
        <Button label="Delete" onClick={handleDelete} type="delete" />
      </div>
    </div>
    {isAddVisible && <AddProductForm onClose={handleClose} onSubmit={handleSubmit} />}
  </div>
);
};

export default Bom;