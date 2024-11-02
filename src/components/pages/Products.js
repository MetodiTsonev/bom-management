import React from 'react';

import Description from '../Description';
import Table from '../Table';
import Search from '../Search';
import Button from '../Button';

import './PageStyle.css';


function Products() {
  const data = [
    { id: 1, name: 'Product 1', amount: 100 },
    { id: 2, name: 'Product 2', amount: 200 },
    { id: 3, name: 'Product 3', amount: 300 },
  ];
  return (
    <div>
      <Description text="Products" description="The products page is used for configuring product details" />
      <div className="container">
        <div className="left-column">
          <Table data={data} />
        </div>
        <div className="right-column">
          <div className="searchField">
            <Search />
            <Button label="Go" onClick={() => alert('Search clicked')} type="search" />
          </div>
          <Button label="Add" onClick={() => alert('Add clicked')} type="add" />
          <Button label="Edit BOM Specs" onClick={() => alert('Edit clicked')} type="delete" />
          <Button label="View Production Cost" onClick={() => alert('View clicked')} type="edit" />
        </div>
      </div>
    </div>
  );
}

export default Products;
