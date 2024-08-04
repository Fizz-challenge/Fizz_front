import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './CategoryThumbnail.css';
import iconMapping from './IconMapping';

const CategoryThumbnail = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${category.categoryId}/${category.title}`);
  };

  return (
    <div className="category-thumbnail" onClick={handleClick}>
      <div className="category-thumbnail-icon">
        {iconMapping[category.title]}
      </div>
      <div className="category-info">
        <h3 className="category-title">{category.title}</h3>
        <p className="category-description">{category.description}</p>
      </div>
    </div>
  );
};

CategoryThumbnail.propTypes = {
  category: PropTypes.shape({
    categoryId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default CategoryThumbnail;
