import React, { useState, useEffect } from "react";
import "./ProductForm.css"


const ProductForm = ({formObject}) => {
    const [formData, setFormData] = useState({
        id: formObject.PRODUCT_ID,
        name: formObject.PRODUCT_NAME,
        description: formObject.PRODUCT_DESCRIPTION,
        materialId: null,
        materialName: null,
        bomQty: null
    });

    useEffect(() => {
        fetch(`http://localhost:5001/api/products/${formData.id}/materials`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.length > 0) {
                    const material = data[0]; // Assuming only one material is returned
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        materialId: material.MATERIAL_ID,
                        materialName: material.MATERIAL_NAME,
                        bomQty: material.BOM_QTY,
                    }));
                } else {
                    console.warn("No material found for the product.");
                }
            })
            .catch(error => console.error("Error fetching materials for product:", error));
    }, [formData.id]);

    useEffect(() => {
        console.log("Form data:", formData); // Debugging log
    }, [formObject]);


    return (
        <div className="form">
            <h1>{formData.name}</h1>
            {formData.materialId ? (
            <div>
                    <div className="field">
                        <span className="text">Material ID: {formData.materialId} </span>
                    </div>
                    <div className="field">
                        <span className="text">Material Name: {formData.materialName}</span>
                    </div>
                    <div className="field">
                        <span className="text">Quantity: {formData.bomQty}</span>
                    </div>
                </div>
            ) : (
                <h1 className="error">Product not found in BOM!</h1>
            )}
        </div>
    );
}

export default ProductForm;