import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import Table from "../../components/Table";
import Search from "../../components/Search";
import Description from "../../components/Description";
import "../PageStyle.css";
import MaterialForm from "./MaterialForm";
import ViewForm from "./ViewForm";

const Materials = () => {
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isViewVisible, setIsViewVisible] = useState(false);

  const headers = {ID: `MATERIAL_ID`, Name: `MATERIAL_NAME`, Description: `MATERIAL_DESCRIPTION`, Measure: 'MATERIAL_MEASURE'};

  const fetchData = () => {
    fetch('http://localhost:5001/api/data')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Fetched data:", data); // Log to verify data
        setData(data);
        setFilteredData(data);
      })
      .catch(error => console.error("Error fetching materials:", error));
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
      const materialId = data[selectedRow].MATERIAL_ID;

      fetch(`http://localhost:5001/api/data/${materialId}`)
        .then(async response => {
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch material data: ${errorText}`);
          }
          return response.json();
        })
        .then(materialData => {
          console.log("Fetched material data for editing:", materialData); // Debugging log
          setEditData(materialData);  // Set the fetched data for editing
          setIsEditVisible(true);     // Open the form
        })
        .catch(error => console.error("Error fetching material data for edit:", error));
    } else {
      alert("Please select a row to edit");
    }
  };


  const handleView = () => {
    if (selectedRow !== null) {
      setIsViewVisible(true);
    }
    else {
      alert("Please select a row to view");
    }
  }

  const handleClear = () => {
    setFilteredData(data);
    setSearchValue(''); //TODO doesn't work
  }

  const handleSearch = () => {
    setFilteredData(data.filter(row =>
        Object.values(row).some(value =>
            value.toString().toLowerCase().includes(searchValue.toLowerCase())
        )
    ));
  }

  return (
    <div>
      <Description text='Materials' description='The material page is used for configuring material details' />
      <div className="container">
        <div className="left-column">
          <Table data={filteredData} onRowSelect={setSelectedRow} headers={headers}/>
          <Button label = "Clear filters" onClick={handleClear} type="clear"/>
        </div>
        <div className="right-column">
          <div className="searchField">
            <Search onSearch={setSearchValue} />
            <Button label="Go" onClick={handleSearch} type="search" />
          </div>
          <Button label="Add" onClick={handleAdd} type="add" />
          <Button label="Delete" onClick={handleDelete} type="delete" />
          <Button label="Edit" onClick={handleEdit} type="edit" />
          <Button label="View" onClick={handleView} type="view" />
        </div>
      </div>
      {isAddVisible && <MaterialForm onClose={handleClose} onSubmit={handleSubmit} editObject={null} />}
      {isEditVisible && <MaterialForm onClose={handleClose} onSubmit={handleSubmit} editObject={editData} />}
      {isViewVisible && <ViewForm onClose={handleClose} viewObject={data[selectedRow]} />}
    </div>
  );
};

export default Materials;
