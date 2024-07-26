import React from 'react';
import './PostInput.css';

const PostInput = ({ title, setTitle, description, setDescription }) => {
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  return (
    <div className="description-input">
      <label htmlFor="title">Title</label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={handleTitleChange}
        placeholder="Enter title"
      />
      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        value={description}
        onChange={handleDescriptionChange}
        placeholder="Write a short description..."
      ></textarea>
    </div>
  );
};

export default PostInput;
