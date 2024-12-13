import React, { useEffect, useState } from "react";
import './AddProductForm.css';

const AddProductForm = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        materials: [],
        expences: [],
    });
    const [materialsGroup, setMaterialsGroup] = useState([]);
    const [expencesGroup, setExpencesGroup] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const materialsResponse = await fetch('http://localhost:5001/api/data');
                const materialsData = await materialsResponse.json();
                setMaterialsGroup(materialsData);

                const expencesResponse = await fetch('http://localhost:5001/api/expences');
                const expencesData = await expencesResponse.json();
                setExpencesGroup(expencesData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const addMaterial = (e) => {
        const materialId = Number(e.target.value);
        const material = materialsGroup.find((m) => m.MATERIAL_ID === materialId);

        if (material && !formData.materials.find((m) => m.id === materialId)) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                materials: [...prevFormData.materials, { id: materialId, name: material.MATERIAL_NAME, measure: material.MATERIAL_MEASURE, qty: '' }]
            }));
        }
    };

    const updateMaterialQty = (index, value) => {
        const updatedMaterials = [...formData.materials];
        updatedMaterials[index].qty = Number(value);
        setFormData((prevFormData) => ({
            ...prevFormData,
            materials: updatedMaterials
        }));
        console.log(formData.materials);
    };

    const addExpence = (e) => {
        const expenceId = Number(e.target.value);
        const expence = expencesGroup.find((ex) => ex.EXPENCE_ID === expenceId);

        if (expence && !formData.expences.find((ex) => ex.id === expenceId)) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                expences: [...prevFormData.expences, { id: expenceId, name: expence.EXPENCE_NAME, price: '' }]
            }));
        }
    };

    const updateExpencePrice = (index, value) => {
        const updatedExpences = [...formData.expences];
        updatedExpences[index].price = Number(value);
        setFormData((prevFormData) => ({
            ...prevFormData,
            expences: updatedExpences
        }));
        console.log(formData.expences);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // Submit the entire formData object
    };


    return (
        <div className="popup-form">
            <h1 className="form-title">Add Product</h1>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-container">
                    <div className="lhs">
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
                            Materials:
                            <select onChange={addMaterial} value="">
                                <option value="" disabled>Select a material</option>
                                {materialsGroup.map((material) => (
                                    <option key={material.MATERIAL_ID} value={material.MATERIAL_ID}>
                                        {material.MATERIAL_NAME}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Expences:
                            <select onChange={addExpence} value="">
                                <option value="" disabled>Select an expence</option>
                                {expencesGroup.map((expence) => (
                                    <option key={expence.EXPENCE_ID} value={expence.EXPENCE_ID}>
                                        {expence.EXPENCE_NAME}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="rhs">
                        {/* TODO adds only the input field, without the context label */}
                        <h2>Materials</h2>
                        <div className="materials-group">
                            {formData.materials.map((material, index) => (
                                <div key={material.id} className="material-row">
                                    <label>
                                        {material.name}
                                        <input
                                            type="number"
                                            placeholder={material.measure}
                                            value={material.qty}
                                            onChange={(e) => updateMaterialQty(index, e.target.value)}
                                            required
                                        />
                                    </label>
                                </div>
                            ))}
                        </div>

                        <h2>Expences</h2>
                        <div className="expenses-group">
                        {formData.expences.map((expence, index) => (
                            <div key={expence.id} className="expense-row">
                                <label>
                                    {expence.name}
                                    <input
                                        type="number"
                                        placeholder="Enter price"
                                        value={expence.price}
                                        onChange={(e) => updateExpencePrice(index, e.target.value)}
                                        required
                                    />
                                </label>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
                <div className="button-group">
                    <button type="submit">Save</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default AddProductForm;