import React, { useState, useEffect } from 'react';
import Description from '../Description';
import Table from '../Table';
import Search from '../Search';
import Button from '../Button';

import './PageStyle.css';

function Expenses() {
  const [data, setData] = useState([]); // State for expense data
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpense, setSelectedExpense] = useState(null); // For editing
  const [showModal, setShowModal] = useState(false); // For Add/Edit modal

  // Fetch data from the database
  useEffect(() => {
    fetch('/api/expenses')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching expenses:', error));
  }, []);

  // Add Expense
  const handleAdd = () => {
    setSelectedExpense(null); // Clear selection for a new entry
    setShowModal(true);
  };

  // Edit Expense
  const handleEdit = (expense) => {
    setSelectedExpense(expense); // Populate selected expense
    setShowModal(true);
  };

  // Delete Expense
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      fetch(`/api/expenses/${id}`, { method: 'DELETE' })
        .then(() => {
          setData(data.filter((expense) => expense.EXPENCE_ID !== id));
        })
        .catch((error) => console.error('Error deleting expense:', error));
    }
  };

  // Save (Add/Edit) Expense
  const handleSave = (expense) => {
    if (expense.EXPENCE_ID) {
      // Edit existing expense
      fetch(`/api/expenses/${expense.EXPENCE_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      })
        .then(() => {
          setData(
            data.map((item) =>
              item.EXPENCE_ID === expense.EXPENCE_ID ? expense : item
            )
          );
          setShowModal(false);
        })
        .catch((error) => console.error('Error editing expense:', error));
    } else {
      // Add new expense
      fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      })
        .then((response) => response.json())
        .then((newExpense) => {
          setData([...data, newExpense]);
          setShowModal(false);
        })
        .catch((error) => console.error('Error adding expense:', error));
    }
  };

  // Filtered data for search
  const filteredData = data.filter((expense) =>
    expense.EXPENCE_NAME.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Description text="Expenses" description="The expenses page is used for configuring expense details" />
      <div className="container">
        <div className="left-column">
          <Table
            data={filteredData}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
        <div className="right-column">
          <div className="searchField">
            <Search
              placeholder="Search expenses..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button label="Go" onClick={() => {}} type="search" />
          </div>
          <Button label="Add" onClick={handleAdd} type="add" />
          <Button
            label="Delete"
            onClick={() => alert('Please select an item to delete')}
            type="delete"
          />
          <Button
            label="Edit"
            onClick={() => alert('Please select an item to edit')}
            type="edit"
          />
        </div>
      </div>

      {showModal && (
        <ExpenseModal
          expense={selectedExpense}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// Modal Component for Add/Edit Expense
function ExpenseModal({ expense, onSave, onClose }) {
  const [name, setName] = useState(expense?.EXPENCE_NAME || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ EXPENCE_ID: expense?.EXPENCE_ID, EXPENCE_NAME: name });
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <h2>{expense ? 'Edit Expense' : 'Add Expense'}</h2>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default Expenses;