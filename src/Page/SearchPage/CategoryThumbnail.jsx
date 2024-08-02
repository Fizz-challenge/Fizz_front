import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryThumbnail = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${category.title}`);
  };

  return (
    <div className="category-thumbnail" onClick={handleClick}>
      <div className="category-thumbnail-skeleton"></div>
      <div className="category-title">{category.title}</div>
    </div>
  );
};

export default CategoryThumbnail;
