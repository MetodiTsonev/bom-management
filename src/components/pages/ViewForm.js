import React from "react";
import './ViewForm.css';

const ViewForm = ({ onClose, viewObject }) => {
    return (
        <div className="popup-form">
            <h1>View Material</h1>
            <form>
                <label>
                    ID:
                    <input type="text" name="id" value={viewObject.id} readOnly />
                </label>
                <label>
                    Name:
                    <input type="text" name="name" value={viewObject.name} readOnly />
                </label>
                <label>
                    Description:
                    <input type="text" name="description" value={viewObject.description} readOnly />
                </label>
                <label>
                    Amount:
                    <input type="text" name="amount" value={viewObject.amount} readOnly />
                </label>
                <button type="button" onClick={onClose}>Close</button>
            </form>
        </div>
    );
};

export default ViewForm;