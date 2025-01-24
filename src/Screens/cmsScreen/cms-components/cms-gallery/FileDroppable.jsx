import React, { useRef, useState } from 'react';
import { DndContext, useDroppable } from '@dnd-kit/core';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {CircularProgress} from '@mui/material';

const FileDroppable = ({ allowMultiple = true, onImagesChange, name, placeholder }) => {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const inputRef = useRef(null);
  const { setNodeRef } = useDroppable({ id: 'droppable' });

  const handleDrop = (event) => {
    event.preventDefault();
    setUploading(true);
    const droppedFiles = Array.from(event.dataTransfer.files);
    const newImages = allowMultiple
      ? [...images, ...droppedFiles]
      : droppedFiles.slice(0, 1); 
    setImages(newImages);
    if (onImagesChange) onImagesChange(newImages);
    setUploading(false)
  };

  const handleInputChange = (event) => {
    setUploading(true); 
    const selectedImages = Array.from(event.target.files);
    const newImages = allowMultiple
      ? [...images, ...selectedImages]
      : selectedImages.slice(0, 1); 

    setImages(newImages);
    if (onImagesChange) onImagesChange(newImages);
    setUploading(false)
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (onImagesChange) onImagesChange(newImages);
  };

  return (
    <div>
      <DndContext>
        <div
          ref={setNodeRef}
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
          onClick={handleClick}
          style={{
            border: '2px dashed #ccc',
            padding: '10px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '10px',
          }}
        >
         {placeholder}
        </div>
      </DndContext>
      <input
        name={name}
        ref={inputRef}
        type="file"
        multiple={allowMultiple}
        accept="image/*"
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {images.map((image, index) => (
          <div key={index} style={{ position: 'relative', width: '60px', height: '60px' }}>
            <img
              src={URL.createObjectURL(image)}
              alt={`preview ${index}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
            <IconButton
              size="small"
              onClick={() => handleRemoveImage(index)}
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        ))}
        {uploading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <CircularProgress /> {/* Add a loader component here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDroppable;
