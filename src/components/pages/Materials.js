import React, { useEffect, useState } from "react";
import Button from "../Button";
import Table from "../Table";
import Search from "../Search";
import Description from "../Description";
import "./PageStyle.css";
import MaterialForm from "./MaterialForm";

const Materials = () => {
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchData = () => {
    fetch('http://localhost:5001/api/data')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setFilteredData(data);
      })
      .catch(error => console.error("Error fetching materials:", error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => setIsAddVisible(true);

  const handleClose = () => {
    setIsAddVisible(false);
    setIsEditVisible(false);
  };

  const handleSubmit = (material) => {
    fetchData(); // Refresh data after adding or updating a material
    handleClose(); // Close the form
  };

  const handleDelete = () => {
    if (selectedRow !== null) {
      const materialId = data[selectedRow].MATERIAL_ID;
      fetch(`http://localhost:5001/api/data/${materialId}`, {
        method: 'DELETE'
      })
      .then(() => {
        fetchData(); // Refresh data after deletion
        setSelectedRow(null);
      })
      .catch(error => console.error("Error deleting material:", error));
    } else {
      alert("Please select a row to delete");
    }
  };

  const handleEdit = () => {
    if (selectedRow !== null) {
      setIsEditVisible(true); // Open form in edit mode
    } else {
      alert("Please select a row to edit");
    }
  };

  return (
    <div>
      <Description text='Materials' description='The material page is used for configuring material details' />
      <div className="container">
        <div className="left-column">
          <Table data={filteredData} onRowSelect={setSelectedRow} />
          <button onClick={() => setFilteredData(data)} className="clear">Clear filters</button>
        </div>
        <div className="right-column">
          <div className="searchField">
            <Search onSearch={setSearchValue} />
            <Button label="Go" onClick={() => setFilteredData(data.filter(row =>
              Object.values(row).some(value =>
                value.toString().toLowerCase().includes(searchValue.toLowerCase())
              )
            ))} type="search" />
          </div>
          <Button label="Add" onClick={handleAdd} type="add" />
          <Button label="Delete" onClick={handleDelete} type="delete" />
          <Button label="Edit" onClick={handleEdit} type="edit" />
          <Button label="View" onClick={() => alert("View clicked")} type="view" />
        </div>
      </div>
      {isAddVisible && <MaterialForm onClose={handleClose} onSubmit={handleSubmit} editObject={null} />}
      {isEditVisible && <MaterialForm onClose={handleClose} onSubmit={handleSubmit} editObject={data[selectedRow]} />}
    </div>
  );
};

export default Materials;
