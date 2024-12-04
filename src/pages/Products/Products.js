import React, {useEffect, useState} from 'react';

import Description from '../../components/Description';
import Table from '../../components/Table';
import Search from '../../components/Search';
import Button from '../../components/Button';

import '../PageStyle.css';
import ProductForm from "./ProductForm";

function Products() {
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const headers = {ID: `PRODUCT_ID`, Name: `PRODUCT_NAME`, Description: `PRODUCT_DESCRIPTION`};

  const fetchData = () => {
    fetch('http://localhost:5001/api/products')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log("Fetched data:", data); // Log to verify data
          setData(data);
          setFilteredData(data);
        })
        .catch(error => console.error("Error fetching products:", error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = () => {
    setFilteredData(data.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchValue.toLowerCase())
      )
    ));
  }

  const handleClear = () => {
    setFilteredData(data);
  }

  return (
    <div>
      <Description text="Products" description="The products page is used for configuring product details" />
      <div className="container">
        <div className="left-column">
          <div className="searchField">
            <Search onSearch={setSearchValue}/>
            <Button label="Go" onClick={handleSearch} type="search"/>
          </div>
          <Table data={filteredData} onRowSelect={setSelectedRow} headers={headers}/>
          <Button label="Clear filters" onClick={handleClear} type="clear"/>
        </div>
        <div className="right-column">
          {selectedRow !== null && <ProductForm formObject={data[selectedRow]}/>}
        </div>
      </div>
    </div>
  );
}

export default Products;
