import React, {useState, useEffect} from "react";
import './ExpenceViewForm.css';

const ExpenceViewForm = ({onClose, viewObject}) => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
    });

    useEffect(() => {
        if (viewObject) {
            console.log("View object data in form:", viewObject); // Debugging log
            setFormData({
                id: viewObject.EXPENCE_ID || '',
                name: viewObject.EXPENCE_NAME || '',
            });
        }
    }, [viewObject]);

    return (
        <div className="popup-form">
            <h1>View Expence</h1>
            <div className="container">
                <div className="left-column">
                    <h1>Expence info</h1>
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
                    </form>
                </div>
            </div>
            <button type='button' onClick={onClose}>Close</button>
        </div>
    );
};

export default ExpenceViewForm;