import React from "react";
import './ViewForm.css';

const ViewForm = ({ onClose, viewObject }) => {
    return (
        <div className="popup-form">
            <h1>View Material</h1>
            <div className="container">
                <div className="left-column">
                    <form>
                        <label>
                            ID:
                            <input 
                            type="text" 
                            name="id" 
                            value={viewObject.id} 
                            readOnly />
                        </label>
                        <label>
                            Name:
                            <input 
                            type="text" 
                            name="name" 
                            value={viewObject.name} 
                            readOnly />
                        </label>
                        <label>
                            Description:
                            <input 
                            type="text" 
                            name="description" 
                            value={viewObject.description} 
                            readOnly />
                        </label>
                        <label>
                            Measure:
                            <input type="text" 
                            name="measure" 
                            value={viewObject.measure} 
                            readOnly />
                        </label>
                        <label>
                            Price Date:
                            <input type="date" 
                            name="priceDate" 
                            value={viewObject.priceDate} 
                            readOnly />
                        </label>
                        <button type="button" onClick={onClose}>Close</button>
                    </form>
                </div>
                <div className="right-column">
                    {/* TODO
                    add the products, that contain the material in this side of the table */}
                </div>
            </div>
        </div>
    );
};

export default ViewForm;