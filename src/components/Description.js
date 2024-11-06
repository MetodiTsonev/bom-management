import React from "react";
import './Description.css';

const Title = ({text, description}) => {
    return (
        <div className="description">
            <div className="title">{text}</div>
            <div className="descriptionText">{description}</div>
        </div>
    );
};

export default Title;