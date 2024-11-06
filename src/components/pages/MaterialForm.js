import React, { useState, useEffect } from 'react';
import './MaterialForm.css';

const MaterialForm = ({ onClose, onSubmit, editObject }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    measure: '',
    price: '',
    priceDate: ''
  });

  // Populate form data when editing an existing material
  useEffect(() => {
    if (editObject) {
      setFormData({
        id: editObject.MATERIAL_ID || '',
        name: editObject.MATERIAL_NAME || '',
        description: editObject.MATERIAL_DESCRIPTION || '',
        measure: editObject.MATERIAL_MEASURE || '',
        price: editObject.PRICE_PRICE || '',
        priceDate: editObject.PRICE_DATE || ''
      });
    }
  }, [editObject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editObject
        ? `http://localhost:5001/api/data/${formData.id}` // Edit endpoint
        : 'http://localhost:5001/api/materials'; // Add endpoint
      const method = editObject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        onSubmit(result); // Trigger parent component to refresh data
        onClose(); // Close the form
      } else {
        alert(editObject ? 'Failed to update material.' : 'Failed to add material.');
      }
    } catch (error) {
      console.error(editObject ? 'Error updating material:' : 'Error adding material:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="popup-form">
      <h1>{editObject ? 'Edit Material' : 'Add Material'}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          ID:
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            required
            disabled={!!editObject} // Disable ID field when editing
          />
        </label>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Measure:
          <input
            type="text"
            name="measure"
            value={formData.measure}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Price Date:
          <input
            type="date"
            name="priceDate"
            value={formData.priceDate}
            onChange={handleChange}
            required
          />
        </label>
        <div className="buttons">
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default MaterialForm;
