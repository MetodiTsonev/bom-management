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
  const [viewData, setViewData] = useState(null);

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
  
      // Step 1: Fetch products associated with the material
      fetch(`http://localhost:5001/api/materials/${materialId}/products`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch products for material: ${response.status}`);
          }
          return response.json();
        })
        .then(products => {
          // Step 2: Check if there are any products
          if (products.length > 0) {
            alert(`Cannot delete material. It is associated with ${products.length} products.`);
          } else {
            // Step 3: If no products, proceed with deletion
            fetch(`http://localhost:5001/api/data/${materialId}`, {
              method: 'DELETE'
            })
            .then(() => {
              fetchData(); // Refresh data after deletion
              setSelectedRow(null);
              alert("Material deleted successfully.");
            })
            .catch(error => console.error("Error deleting material:", error));
          }
        })
        .catch(error => console.error("Error checking products for material:", error));
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
      const materialId = data[selectedRow].MATERIAL_ID;

      fetch(`http://localhost:5001/api/materials/${materialId}/products`)
        .then(async (response) => {
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch products for material: ${errorText}`);
          }
          return response.json();
        })
        .then((products) => {
          console.log("Fetched products for material:", products); // Debugging log
          setIsViewVisible(true);
          setViewData({ ...data[selectedRow], products }); // Pass material and its products
        })
        .catch((error) => console.error("Error fetching products for material:", error));
    } else {
      alert("Please select a row to view");
    }
  };

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

  return (
    <div>
      <Description text='Materials' description='The material page is used for configuring material details' />
      <div className="container">
        <div className="left-column">
          <Table data={filteredData} onRowSelect={setSelectedRow} headers={headers}/>
        </div>
        <div className="right-column">
          <div className="searchField">
            <Search value={searchValue} onSearch={handleSearch} />
          </div>
          <Button label="Add" onClick={handleAdd} type="add" />
          <Button label="Delete" onClick={handleDelete} type="delete" />
          <Button label="Edit" onClick={handleEdit} type="edit" />
          <Button label="View" onClick={handleView} type="view" />
        </div>
      </div>
      {isAddVisible && <MaterialForm onClose={handleClose} onSubmit={handleSubmit} editObject={null} />}
      {isEditVisible && <MaterialForm onClose={handleClose} onSubmit={handleSubmit} editObject={editData} />}
      {isViewVisible && <ViewForm onClose={handleClose} viewObject={viewData} />}
    </div>
  );
};

export default Materials;
