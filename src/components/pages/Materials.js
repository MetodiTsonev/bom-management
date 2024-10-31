import React from "react";
import Button from "../Button";
import Table from "../Table";
import "./Materials.css";

const Materials = () => {
  const data = [
    { id: 1, name: "Material 1", quantity: 10 },
    { id: 2, name: "Material 2", quantity: 20 },
    { id: 3, name: "Material 3", quantity: 30 },
  ];

  return (
    <div>
        <h1>Materials</h1>
        <div className="container">
            <div className="left-column">
                <Table data={data} />
            </div>
            <div className="right-column">
                <Button label="Add" onClick={() => alert("Button clicked")} type="add" />
                <Button label="Delete" onClick={() => alert("Button clicked")} type="delete" />
                <Button label="Edit" onClick={() => alert("Button clicked")} type="edit" />
                <Button label="View" onClick={() => alert("Button clicked")} type="view" />
            </div>
        </div>
    </div>
  );
}

export default Materials;