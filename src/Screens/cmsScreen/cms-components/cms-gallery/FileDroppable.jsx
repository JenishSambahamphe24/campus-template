// import React, { useRef, useState } from 'react';
// import { DndContext, useDroppable } from '@dnd-kit/core';
// import { IconButton } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import { CircularProgress } from '@mui/material';

// const FileDroppable = ({ allowMultiple = true, onImagesChange, name, placeholder, required = false }) => {
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState(false)
//   const [images, setImages] = useState([]);
//   const inputRef = useRef(null);
//   const { setNodeRef } = useDroppable({ id: 'droppable' });

//   const handleDrop = (event) => {
//     event.preventDefault();
//     setUploading(true);
//     const droppedFiles = Array.from(event.dataTransfer.files);
//     const newImages = allowMultiple
//       ? [...images, ...droppedFiles]
//       : droppedFiles.slice(0, 1);
//     setImages(newImages);
//     if (onImagesChange) onImagesChange(newImages);
//     setUploading(false)
//   };

//   const handleInputChange = (event) => {
//     setUploading(true);
//     const selectedImages = Array.from(event.target.files);
//     const newImages = allowMultiple
//       ? [...images, ...selectedImages]
//       : selectedImages.slice(0, 1);

//     setImages(newImages);
//     if (onImagesChange) onImagesChange(newImages);
//     setUploading(false)
//   };

//   const handleClick = () => {
//     inputRef.current.click();
//   };

//   const handleRemoveImage = (index) => {
//     const newImages = images.filter((_, i) => i !== index);
//     setImages(newImages);
//     if (onImagesChange) onImagesChange(newImages);
//   };

//   return (
//     <div>
//       <DndContext>
//         <div
//           ref={setNodeRef}
//           onDrop={handleDrop}
//           onDragOver={(event) => event.preventDefault()}
//           onClick={handleClick}
//           style={{
//             border: '2px dashed #ccc',
//             padding: '10px',
//             textAlign: 'center',
//             cursor: 'pointer',
//             marginBottom: '10px',
//           }}
//         >
//           {placeholder}
//         </div>
//       </DndContext>
//       <input
//         required={required}
//         name={name}
//         ref={inputRef}
//         type="file"
//         multiple={allowMultiple}
//         accept="image/*"
//         onChange={handleInputChange}
//         style={{ display: 'none' }}
//       />
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
//         {images.map((image, index) => (
//           <div key={index} style={{ position: 'relative', width: '60px', height: '60px' }}>
//             <img
//               src={URL.createObjectURL(image)}
//               alt={`preview ${index}`}
//               style={{
//                 width: '100%',
//                 height: '100%',
//                 objectFit: 'cover',
//                 borderRadius: '8px',
//               }}
//             />
//             <IconButton
//               size="small"
//               onClick={() => handleRemoveImage(index)}
//               style={{
//                 position: 'absolute',
//                 top: '-10px',
//                 right: '-10px',
//                 backgroundColor: 'rgba(255, 255, 255, 0.8)',
//               }}
//             >
//               <CloseIcon fontSize="small" />
//             </IconButton>
//           </div>
//         ))}
//         {uploading && (
//           <div style={{ textAlign: 'center', padding: '20px' }}>
//             <CircularProgress /> 
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FileDroppable;
import React, { useRef, useState } from 'react';
import { DndContext, useDroppable } from '@dnd-kit/core';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CircularProgress } from '@mui/material';

const FileDroppable = ({ 
  allowMultiple = true, 
  onImagesChange, 
  name, 
  placeholder, 
  required = false 
}) => {
  const [uploading, setUploading] = useState(false);
  const [touched, setTouched] = useState(false);
  const [images, setImages] = useState([]);
  const inputRef = useRef(null);
  const { setNodeRef } = useDroppable({ id: 'droppable' });

  const showError = required && touched && images.length === 0;

  const handleDrop = (event) => {
    event.preventDefault();
    setTouched(true);
    setUploading(true);
    const droppedFiles = Array.from(event.dataTransfer.files);
    const newImages = allowMultiple
      ? [...images, ...droppedFiles]
      : droppedFiles.slice(0, 1);
    setImages(newImages);
    if (onImagesChange) onImagesChange(newImages);
    setUploading(false);
  };

  const handleInputChange = (event) => {
    setTouched(true);
    setUploading(true);
    const selectedImages = Array.from(event.target.files);
    const newImages = allowMultiple
      ? [...images, ...selectedImages]
      : selectedImages.slice(0, 1);
    
    setImages(newImages);
    if (onImagesChange) onImagesChange(newImages);
    setUploading(false);
  };

  const handleClick = () => {
    setTouched(true);
    inputRef.current.click();
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (onImagesChange) onImagesChange(newImages);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  return (
    <div>
      <DndContext>
        <div
          ref={setNodeRef}
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
          onClick={handleClick}
          onBlur={handleBlur}
          className={`relative border-2 border-dashed p-4 text-center cursor-pointer mb-3 ${
            showError ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          {placeholder}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </div>
      </DndContext>

      <input
        required={required}
        name={name}
        ref={inputRef}
        type="file"
        multiple={allowMultiple}
        accept="image/*"
        onChange={handleInputChange}
        onBlur={handleBlur}
        className="hidden"
        aria-invalid={showError}
        aria-describedby={showError ? `${name}-error` : undefined}
      />

      <div className="flex flex-wrap gap-2">
        {images.map((image, index) => (
          <div key={index} className="relative w-16 h-16">
            <img
              src={URL.createObjectURL(image)}
              alt={`preview ${index}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <IconButton
              size="small"
              onClick={() => handleRemoveImage(index)}
              className="absolute -top-2 -right-2 bg-white/80 hover:bg-white"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        ))}
        
        {uploading && (
          <div className="flex items-center justify-center p-4">
            <CircularProgress size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDroppable;