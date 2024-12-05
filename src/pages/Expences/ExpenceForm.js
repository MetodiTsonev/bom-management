import React, { useState } from 'react';
import "./ExpenceForm.css";

const ExpenceForm = ({onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        id: '',
        name: ''
    });

    const handleChange = (e) => {
        const { name } = e.target;
        setFormData({
            ...formData,
            [name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = 'http://localhost:5001/api/expences'; // Add endpoint
            const method = 'POST';

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
                alert('Failed to add expence.');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    }

    return (
        <div className="popup-form">
            <h1>Add Expence</h1>
            <form onSubmit={handleSubmit}>
                <div className="container">
                    <div className={`left-column`}>
                        <h1>Expence info</h1>
                        <label>
                            ID:
                            <input
                                type="text"
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                                required
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
                    </div>
                </div>
                <div className="buttons">
                    <button type="submit">Save</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default ExpenceForm;