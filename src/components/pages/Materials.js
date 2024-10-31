import React from "react";

import Button from "../Button";
import Table from "../Table";
import Search from "../Search";
import Title from "../Description";

import "./Materials.css";

const Materials = () => {
  const data = [
    { id: 1, name: "Material 1", quantity: 10 },
    { id: 2, name: "Material 2", quantity: 20 },
    { id: 3, name: "Material 3", quantity: 30 },
  ];

  return (
    <div>
        <Title text = 'Materials' description= 'The material page is used for configuring material details' />
        <div className="container">
            <div className="left-column">
                <Table data={data} />
            </div>
            <div className="right-column">
                <div className="searchField">
                    <Search />
                    <Button label="Go" onClick={() => alert("Search clicked")} type="search" />
                </div>
                <Button label="Add" onClick={() => alert("Add clicked")} type="add" />
                <Button label="Delete" onClick={() => alert("Delete clicked")} type="delete" />
                <Button label="Edit" onClick={() => alert("Edit clicked")} type="edit" />
                <Button label="View" onClick={() => alert("View clicked")} type="view" />
            </div>
        </div>
    </div>
  );
}

export default Materials;