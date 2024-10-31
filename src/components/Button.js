import React from 'react';
import './Button.css'

const Button = ({ label, onClick, type}) => {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${type}`}
      style={{ margin: '0 5px' }}
    >
      {label}
    </button>
  )
};

export default Button;