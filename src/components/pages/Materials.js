import React from "react";

import Button from "../Button";
import Table from "../Table";
import Search from "../Search";
import Description from "../Description";

import "./PageStyle.css";
import MaterialForm from "./MaterialForm";
import ViewForm from "./ViewForm";

const Materials = () => {
  const initialData = [
    { id: 1, name: "Material 1", description: 'material1', amount: 10 },
    { id: 2, name: "Material 2", description: 'material2', amount: 20 },
    { id: 3, name: "Material 3", description: 'material3', amount: 30 },
  ];

  const [isAddVisible, setIsAddVisible] = React.useState(false);
  const [isViewVisible, setIsViewVisible] = React.useState(false);
  const [isEditVisible, setIsEditVisible] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [data, setData] = React.useState(initialData);

  const handleAdd = () => {
    setIsAddVisible(true);
  }

  const handleClose = () => {
    setIsAddVisible(false);
    setIsEditVisible(false);
    setIsViewVisible(false);
  }

  const handleSubmit = (formData) => {
    if(isAddVisible) {
      setData(prevData => [...prevData, formData]);
      setIsAddVisible(false);
    }

    else if(isEditVisible) {
      setData(prevData => prevData.map((row, i) => i === selectedRow ? formData : row));
      setIsEditVisible(false);
    }
  }

  const [selectedRow, setSelectedRow] = React.useState(null);
  const handleDelete = () => {
    if (selectedRow !== null){
      setData(prevData => prevData.filter((_, i) => i !== selectedRow));
      setSelectedRow(null);
    }
    else {
      alert("Please select a row to delete");
    }
  }

  const handleEdit = () => {
    if (selectedRow !== null){
      setIsEditVisible(true);
    }
    else {
      alert("Please select a material to edit");
    }
  }

  const handleSearch = () => {
    setData(data.filter(row =>
      Object.values(row).some(value =>
        value.toString().toLowerCase().includes(searchValue.toLowerCase())
      )
    ));
  };
  
  const handleClear = () => { 
    setSearchValue('');
    setData(initialData);
  }

  const handleView = () => {
    if (selectedRow !== null){
      setIsViewVisible(true);
    }
    else {
      alert("Please material a row to view");
    }
  }

  return (
    <div>
        <Description text = 'Materials' description= 'The material page is used for configuring material details' />
        <div className="container">
            <div className="left-column">
                <Table data={data} onRowSelect={setSelectedRow}/>
                <a href="#" onClick={handleClear} className="clear">Clear filters</a>
            </div>
            <div className="right-column">
                <div className="searchField">
                    <Search onSearch={setSearchValue} />
                    <Button label="Go" onClick={handleSearch} type="search" />
                </div>
                <Button label="Add" onClick = {handleAdd} type="add" />
                <Button label="Delete" onClick={handleDelete} type="delete" />
                <Button label="Edit" onClick={handleEdit} type="edit" />
                <Button label="View" onClick={handleView} type="view" />
            </div>
        </div>
        {isAddVisible && <MaterialForm onClose={handleClose} onSubmit={handleSubmit} editObject={null} />}
        {isEditVisible && <MaterialForm onClose={handleClose} onSubmit={handleSubmit} editObject={data[selectedRow]} />}
        {isViewVisible && <ViewForm onClose={handleClose} viewObject={data[selectedRow]} />}
    </div>
  );
}

export default Materials;