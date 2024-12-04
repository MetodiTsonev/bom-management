// src/pages/BOM.js
import React, { useState, useEffect } from 'react';
import Description from '../../components/Description';
import Table from '../../components/Table';
import Search from '../../components/Search';
import Button from '../../components/Button';
import '../PageStyle.css';

function Bom() {
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bomItems, setBomItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch products and materials
  useEffect(() => {
    // Fetch products
    fetch('http://localhost:5001/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));

    // Use the new endpoint for materials
    fetch('http://localhost:5001/api/bom/materials')
      .then(res => res.json())
      .then(data => setMaterials(data))
      .catch(error => console.error('Error fetching materials:', error));
  }, []);

  // Fetch BOM items when product is selected
  useEffect(() => {
    if (selectedProduct) {
      fetch(`http://localhost:5001/api/bom/${selectedProduct.PRODUCT_ID}`)
        .then(res => res.json())
        .then(data => setBomItems(data))
        .catch(error => console.error('Error fetching BOM:', error));
    }
  }, [selectedProduct]);

  const productHeaders = {
    'ID': 'PRODUCT_ID',
    'Name': 'PRODUCT_NAME',
    'Description': 'PRODUCT_DESCRIPTION'
  };

  const bomHeaders = {
    'Material ID': 'MATERIAL_ID',
    'Material Name': 'MATERIAL_NAME',
    'Quantity': 'BOM_QTY',
    'Price': 'PRICE_PRICE',
    'Total': 'TOTAL_COST'
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.PRODUCT_NAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.PRODUCT_ID.toString().includes(searchTerm)
  );

  const handleProductSelect = (index) => {
    setSelectedProduct(filteredProducts[index]);
  };

  const handleAdd = () => {
    if (!selectedProduct) {
      alert('Please select a product first');
      return;
    }
    setShowModal(true);
  };

  const handleDelete = (index) => {
    if (!selectedProduct || !bomItems[index]) return;

    const materialId = bomItems[index].MATERIAL_ID;

    if (window.confirm('Are you sure you want to delete this material from BOM?')) {
      fetch(`http://localhost:5001/api/bom/${selectedProduct.PRODUCT_ID}/${materialId}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {
            setBomItems(bomItems.filter((_, i) => i !== index));
          } else {
            throw new Error('Failed to delete');
          }
        })
        .catch(error => console.error('Error deleting BOM item:', error));
    }
  };

  const calculateTotalCost = () => {
    return bomItems.reduce((total, item) => {
      const itemTotal = item.BOM_QTY * (item.PRICE_PRICE || 0);
      return total + itemTotal;
    }, 0).toFixed(2);
  };

  return (
    <div>
      <Description
        text="Bill of Materials"
        description="Manage product specifications and material requirements"
      />
      <div className="container">
        <div className="left-column">
          <Search
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
          />
          <Table
            data={filteredProducts}
            headers={productHeaders}
            onRowSelect={handleProductSelect}
          />
        </div>
        <div className="right-column">
          {selectedProduct && (
            <>
              <h3>BOM for {selectedProduct.PRODUCT_NAME}</h3>
              <Table
                data={bomItems.map(item => ({
                  ...item,
                  TOTAL_COST: (item.BOM_QTY * (item.PRICE_PRICE || 0)).toFixed(2)
                }))}
                headers={bomHeaders}
                onRowSelect={(index) => console.log('Selected BOM item:', bomItems[index])}
              />
              <div className="total-cost">
                <strong>Total Cost: ${calculateTotalCost()}</strong>
              </div>
              <div className="button-group">
                <Button onClick={handleAdd} label="Add Material" />
                <Button onClick={() => handleDelete(selectedProduct)} label="Delete Material" />
              </div>
            </>
          )}
        </div>
      </div>

      {showModal && (
        <BomModal
          materials={materials}
          onSave={(bomItem) => {
            fetch(`http://localhost:5001/api/bom/${selectedProduct.PRODUCT_ID}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(bomItem)
            })
              .then(res => res.json())
              .then(newBomItem => {
                setBomItems([...bomItems, newBomItem]);
                setShowModal(false);
              })
              .catch(error => {
                console.error('Error adding BOM item:', error);
                alert('Failed to add material to BOM');
              });
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

function BomModal({ materials, onSave, onClose }) {
  const [formData, setFormData] = useState({
    MATERIAL_ID: '',
    BOM_QTY: 1
  });

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Material to BOM</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
        }}>
          <div className="form-group">
            <label>Material:</label>
            <select
              value={formData.MATERIAL_ID}
              onChange={(e) => setFormData({
                ...formData,
                MATERIAL_ID: e.target.value
              })}
              required
            >
              <option value="">Select a material</option>
              {materials.map(material => (
                <option key={material.MATERIAL_ID} value={material.MATERIAL_ID}>
                  {material.MATERIAL_NAME}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              step="0.001"
              min="0.001"
              value={formData.BOM_QTY}
              onChange={(e) => setFormData({
                ...formData,
                BOM_QTY: parseFloat(e.target.value)
              })}
              required
            />
          </div>
          <div className="button-group">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Bom;
