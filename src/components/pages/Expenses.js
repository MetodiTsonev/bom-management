import React from 'react';

import Title from '../Description';
import Table from '../Table';
import Search from '../Search';
import Button from '../Button';

import './PageStyle.css';

function Expenses() {
  const data = [
    { id: 1, name: 'Expense 1', amount: 100 },
    { id: 2, name: 'Expense 2', amount: 200 },
    { id: 3, name: 'Expense 3', amount: 300 },
  ];
  return (
    <div>
      <Title text="Expenses" description="The expenses page is used for configuring expense details" />
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
          <Button label="Delete" onClick={() => alert('Delete clicked')} type="delete" />
          <Button label="Edit" onClick={() => alert('Edit clicked')} type="edit" />
        </div>
      </div>
    </div>
  );
}

export default Expenses;
