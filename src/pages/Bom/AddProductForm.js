import React, { useEffect, useState } from "react";
import './AddProductForm.css';

const AddProductForm = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        materials: [],
        expenses: [],
    });
    const [materialsGroup, setMaterialsGroup] = useState([]);
    const [expensesGroup, setExpensesGroup] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const materialsResponse = await fetch('http://localhost:5001/api/data');
                const materialsData = await materialsResponse.json();
                setMaterialsGroup(materialsData);

                const expensesResponse = await fetch('http://localhost:5001/api/expences');
                const expensesData = await expensesResponse.json();
                setExpensesGroup(expensesData);
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
                materials: [...prevFormData.materials, { id: materialId, name: material.MATERIAL_NAME, measure: material.MEASURE, qty: '' }]
            }));
        }  
    };

    const updateMaterialQty = (index, value) => {
        const updatedMaterials = [...formData.materials];
        updatedMaterials[index].qty = value;
        setFormData((prevFormData) => ({
            ...prevFormData,
            materials: updatedMaterials
        }));
    };

    const addExpense = (e) => {
        const expenseId = Number(e.target.value);
        const expense = expensesGroup.find((ex) => ex.EXPENCE_ID === expenseId);

        if (expense && !formData.expenses.find((ex) => ex.id === expenseId)) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                expenses: [...prevFormData.expenses, { id: expenseId, name: expense.EXPENSE_NAME, price: '' }]
            }));
        }
    };

    const updateExpensePrice = (index, value) => {
        const updatedExpenses = [...formData.expenses];
        updatedExpenses[index].price = value;
        setFormData((prevFormData) => ({
            ...prevFormData,
            expenses: updatedExpenses
        }));
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
                            Expenses:
                            <select onChange={addExpense} value="">
                                <option value="" disabled>Select an expense</option>
                                {expensesGroup.map((expense) => (
                                    <option key={expense.EXPENCE_ID} value={expense.EXPENCE_ID}>
                                        {expense.EXPENCE_NAME}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="rhs">
                        {/* TODO adds only the input field, without the context label */}
                        <h2>Materials</h2>
                        <div className="materials-group">
                            {formData.materials.map((index, material) => (
                                <div key={material.id} className="material-row">
                                    <label>
                                        {material.name}
                                        <input
                                        type="number"
                                        placeholder="Enter quantity"
                                        value={material.qty}
                                        onChange={(e) => updateMaterialQty(index, e.target.value)}
                                        required
                                        />
                                        {material.measure}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <h2>Expenses</h2>
                        <div className="expenses-group">
                            {formData.expenses.map((index, expense) => (
                                <div key={expense.id} className="expense-row">
                                    <label>
                                        {expense.name} 
                                        <input
                                            type="number"
                                            placeholder="Enter price"
                                            value={expense.price}
                                            onChange={(e) => updateExpensePrice(index, e.target.value)}
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