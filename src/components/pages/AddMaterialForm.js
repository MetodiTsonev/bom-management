import React, { useState } from 'react';
import './AddMaterialForm.css';

const AddMaterialForm = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        amount: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <div className="popup-form">
            <h1>Add Material</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    ID:
                    <input type="text" name="id" value={formData.id} onChange={handleChange} required />
                </label>
                <label>
                    Name:
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </label>
                <label>
                    Description:
                    <input type="text" name="description" value={formData.description} onChange={handleChange} required />
                </label>
                <label>
                    Amount:
                    <input type="text" name="amount" value={formData.amount} onChange={handleChange} required />
                </label>
                <div className="buttons">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default AddMaterialForm;