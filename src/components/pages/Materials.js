import React from "react";

import Button from "../Button";
import Table from "../Table";
import Search from "../Search";
import Description from "../Description";

import "./PageStyle.css";
import MaterialForm from "./MaterialForm";

const Materials = () => {
  const [isAddVisible, setIsAddVisible] = React.useState(false);
  const [isEditVisible, setIsEditVisible] = React.useState(false);

  const [data, setData] = React.useState([
    { id: 1, name: "Material 1", description: 'material1' ,amount: 10 },
    { id: 2, name: "Material 2", description: 'material2' ,amount: 20 },
    { id: 3, name: "Material 3", description: 'material3' ,amount: 30 },
  ]);

  const handleAdd = () => {
    setIsAddVisible(true);
  }

  const handleClose = () => {
    setIsAddVisible(false);
    setIsEditVisible(false);
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
      alert("Please select a row to edit");
    }
  }

  return (
    <div>
        <Description text = 'Materials' description= 'The material page is used for configuring material details' />
        <div className="container">
            <div className="left-column">
                <Table data={data} onRowSelect={setSelectedRow}/>
            </div>
            <div className="right-column">
                <div className="searchField">
                    <Search />
                    <Button id-='search' label="Go" onClick={() => alert("Search clicked")} type="search" />
                </div>
                <Button label="Add" onClick = {handleAdd} type="add" />
                <Button label="Delete" onClick={handleDelete} type="delete" />
                <Button label="Edit" onClick={handleEdit} type="edit" />
                <Button label="View" onClick={() => alert("View clicked")} type="view" />
            </div>
        </div>
        {isAddVisible && <MaterialForm onClose={handleClose} onSubmit={handleSubmit} editObject={null} />}
        {isEditVisible && <MaterialForm onClose={handleClose} onSubmit={handleSubmit} editObject={data[selectedRow]} />}
    </div>
  );
}

export default Materials;