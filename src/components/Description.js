import React from "react";
import './Description.css';

const Title = ({text, description}) => {
    return (
        <div class="description">
            <div class="title">{text}</div>
            <div class="descriptionText">{description}</div>
        </div>
    );
};

export default Title;