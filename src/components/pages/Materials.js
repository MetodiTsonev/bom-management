import React from "react";

import Button from "../Button";
import Table from "../Table";
import Search from "../Search";
import Description from "../Description";

import "./PageStyle.css";
import AddMaterialForm from "./AddMaterialForm";

const Materials = () => {
  const [isFormVisible, setIsFormVisible] = React.useState(false);

  const [data, setData] = React.useState([
    { id: 1, name: "Material 1", description: 'material1' ,amount: 10 },
    { id: 2, name: "Material 2", description: 'material2' ,amount: 20 },
    { id: 3, name: "Material 3", description: 'material3' ,amount: 30 },
  ]);

  const handleAdd = () => {
    setIsFormVisible(true);
  }

  const handleClose = () => {
    setIsFormVisible(false);
  }

  const handleSubmit = (formData) => {
    setData(prevData => [...prevData, formData]);
    setIsFormVisible(false);
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
                <Button label="Edit" onClick={() => alert("Edit clicked")} type="edit" />
                <Button label="View" onClick={() => alert("View clicked")} type="view" />
            </div>
        </div>
        {isFormVisible && <AddMaterialForm onClose={handleClose} onSubmit={handleSubmit} />}
    </div>
  );
}

export default Materials;