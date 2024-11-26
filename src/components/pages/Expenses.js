import React, { useState, useEffect } from 'react';
import Description from '../Description';
import Table from '../Table';
import Search from '../Search';
import Button from '../Button';
import ExpenceForm from './ExpenceForm';
import ViewForm from "./ViewForm";
import './PageStyle.css';

function Expenses() {
  const [data, setData] = useState([]);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [isViewVisible, setIsViewVisible] = useState(false);

  const headers = {ID: `EXPENCE_ID`, Name: `EXPENCE_NAME`};

  const fetchExpences = () => {
    fetch('http://localhost:5001/api/expences')
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
      .catch(error => console.error("Error fetching expence:", error));
  };

  useEffect(() => {
    fetchExpences();
  }, []);

  const handleSearch = () => {
    setFilteredData(data.filter(row =>
        Object.values(row).some(value =>
            value.toString().toLowerCase().includes(searchValue.toLowerCase())
        )
    ));
  }

  const handleClose = () => {
    setIsAddVisible(false);
    setIsViewVisible(false);
    setSelectedRow(null);
  };


  const handleSubmit = (material) => {
    fetchExpences(); // Refresh data after adding or updating a material
    handleClose(); // Close the form
  };

  const handleAdd = () => {
    setIsAddVisible(true);
  };

  const handleDelete = () => {
    if (selectedRow !== null) {
      const expenceId = data[selectedRow].EXPENCE_ID;
      fetch(`http://localhost:5001/api/data/${expenceId}`, {
        method: 'DELETE'
      })
      .then(() => {
        fetchExpences(); // Refresh data after deletion
        setSelectedRow(null);
      })
      .catch(error => console.error("Error deleting expence:", error));
    } else {
      alert("Please select a row to delete");
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

  return (
    <div>
      <Description text='Expences' description='The expences page is used for displaying expence details' />
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
          <Button label="View" onClick={handleView} type="view" />
        </div>
      </div>
      {isAddVisible && <ExpenceForm onClose={handleClose} onSubmit={handleSubmit}/>}
      {isViewVisible && <ViewForm onClose={handleClose} viewObject={data[selectedRow]} />}
    </div>
  );
};

export default Expenses;
