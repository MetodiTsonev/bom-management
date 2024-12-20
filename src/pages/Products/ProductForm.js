import React, { useState, useEffect } from "react";
import "./ProductForm.css";

const ProductForm = ({ formObject }) => {
  const [formData, setFormData] = useState({
    id: formObject.PRODUCT_ID,
    name: formObject.PRODUCT_NAME,
    description: formObject.PRODUCT_DESCRIPTION,
    materials: []
  });

  useEffect(() => {
    setFormData({
      id: formObject.PRODUCT_ID,
      name: formObject.PRODUCT_NAME,
      description: formObject.PRODUCT_DESCRIPTION,
      materials: [] // Reset materials to refetch them for the new product
    });
  }, [formObject]);

    const [totalCost, setTotalCost] = useState(null); // State to store total cost

    // Fetch materials for the product
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
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        materials: data.map(material => ({
                            materialId: material.MATERIAL_ID,
                            materialName: material.MATERIAL_NAME,
                            bomQty: material.BOM_QTY
                        }))
                    }));
                } else {
                    console.warn("No material found for the product.");
                }
            })
            .catch(error => console.error("Error fetching materials for product:", error));
    }, [formData.id]);

    // Fetch total cost for the product
    useEffect(() => {
        fetch(`http://localhost:5001/api/products/${formData.id}/total-cost`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setTotalCost(data.totalProductionCost); // Set the total production cost
            })
            .catch(error => console.error("Error fetching total cost for product:", error));
    }, [formData.id]);

    return (
        <div className="form">
            <h1>{formData.name}</h1>
            <div className="horizontal-scroll-field">
                {formData.materials.length > 0 ? (
                    formData.materials.map((material, index) => (
                        <div className="info-box" key={index}>
                            <div className="field">
                                <span className="text">Material ID: {material.materialId}</span>
                            </div>
                            <div className="field">
                                <span className="text">Material Name: {material.materialName}</span>
                            </div>
                            <div className="field">
                                <span className="text">Quantity: {material.bomQty}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <h1 className="error">Product not found in BOM!</h1>
                )}
            </div>
            {totalCost !== null ? (
                <h2>Total cost: {totalCost.toFixed(2)} BGN</h2>
            ) : (
                <h2>Loading total cost...</h2>
            )}
        </div>
    );
};

export default ProductForm;