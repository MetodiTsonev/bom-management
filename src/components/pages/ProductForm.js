import React, { useState, useEffect } from "react";
import "./ProductForm.css"

const ProductForm = ({onClose, onSubmit, editObject}) => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: ''
    })

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    useEffect(() => {
        if (editObject) {
            console.log("Edit object data in form:", editObject); // Debugging log
            setFormData({
                id: editObject.PRODUCT_ID || '',
                name: editObject.PRODUCT_NAME || '',
                description: editObject.PRODUCT_DESCRIPTION || ''
            });
        }
    }, [editObject]);

    useEffect(() => {
        console.log("Form data:", formData); // Debugging log
    }, [editObject]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editObject
                ? `http://localhost:5001/api/data/${formData.id}` // Edit endpoint
                : 'http://localhost:5001/api/products'; // Add endpoint
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
                alert(editObject ? 'Failed to update product.' : 'Failed to add product.');
            }
        } catch (error) {
            console.error(editObject ? 'Error updating product:' : 'Error adding product:', error);
            alert('An error occurred. Please try again.');
        }
    }

    return (
        <div className="popup-form">
            <h1>{editObject ? 'Edit Product' : 'Add Product'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="container">
                    <div className={`left-column`}>
                        <h1>Product info</h1>
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
                    </div>
                    <div className={"right-column"}>
                        <h1>Materials list</h1>
                        {/*TODO add table of materials*/}
                    </div>
                </div>
                <div className="buttons">
                    <button type="submit" onClick={onSubmit}>Save</button>
                    <button type="button" onClick={onClose}>Cancel</button> {/*TODO does not close*/}
                </div>
            </form>
        </div>
    );
}

export default ProductForm;