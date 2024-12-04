import React, { useState, useEffect } from "react";
import './ViewForm.css';

const ViewForm = ({ onClose, viewObject }) => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        measure: '',
        priceDate: ''
    });

    useEffect(() => {
        if (viewObject) {
            console.log("View object data in form:", viewObject); // Debugging log
            setFormData({
                id: viewObject.MATERIAL_ID || '',
                name: viewObject.MATERIAL_NAME || '',
                description: viewObject.MATERIAL_DESCRIPTION || '',
                measure: viewObject.MATERIAL_MEASURE || '',
                priceDate: viewObject.priceDate ? viewObject.priceDate.split('T')[0] : '' // Format date to yyyy-MM-dd
            });
        }
    }, [viewObject]);
    return (
        <div className="popup-form">
            <h1>View Material</h1>
            <div className="container">
                <div className="left-column">
                    <h1>Material info</h1>
                    <form>
                        <label>
                            ID:
                            <input
                                type="text"
                                name="id"
                                value={formData.id}
                                readOnly/>
                        </label>
                        <label>
                            Name:
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                readOnly/>
                        </label>
                        <label>
                            Description:
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                readOnly/>
                        </label>
                        <label>
                            Measure:
                            <input type="text"
                                   name="measure"
                                   value={formData.measure}
                                   readOnly/>
                        </label>
                        <label>
                            Price Date:
                            <input type="date"
                                   name="priceDate"
                                   value={formData.priceDate}
                                   readOnly/>
                        </label>
                    </form>
                </div>
                <div className="right-column">
                    <h1>Product list</h1>
                    {/* TODO add the products, that contain the material in this side of the table */}
                </div>
            </div>
            <button type="button" onClick={onClose}>Close</button>
        </div>
    );
};

export default ViewForm;