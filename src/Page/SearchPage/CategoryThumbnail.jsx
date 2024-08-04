import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './CategoryThumbnail.css';

const CategoryThumbnail = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${category.name}`);
  };

  return (
    <div className="category-thumbnail" onClick={handleClick}>
      <div className="category-thumbnail-skeleton"></div>
      <div className="category-info">
        <h3 className="category-title">{category.name}</h3>
        <p className="category-description">{category.description}</p>
      </div>
    </div>
  );
};

CategoryThumbnail.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default CategoryThumbnail;
