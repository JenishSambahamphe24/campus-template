import React, { useRef, useState } from 'react';
import { DndContext, useDroppable } from '@dnd-kit/core';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const FileDroppableForFile = ({ allowMultiple = false, onFilesChange, name }) => {
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);
  const { setNodeRef } = useDroppable({ id: 'droppable' });

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    const acceptedFiles = droppedFiles.filter(file =>
      ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
    );

    const newFiles = allowMultiple
      ? [...files, ...acceptedFiles]
      : acceptedFiles.slice(0, 1); // Only take the first file if not allowing multiple
    setFiles(newFiles);
    if (onFilesChange) onFilesChange(newFiles);
  };

  const handleInputChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const acceptedFiles = selectedFiles.filter(file =>
      ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
    );

    const newFiles = allowMultiple
      ? [...files, ...acceptedFiles]
      : acceptedFiles.slice(0, 1); // Only take the first file if not allowing multiple

    setFiles(newFiles);
    if (onFilesChange) onFilesChange(newFiles);
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (onFilesChange) onFilesChange(newFiles);
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
          Drag and drop {allowMultiple ? 'files' : 'a file'} here
        </div>
      </DndContext>
      <input
        name={name}
        ref={inputRef}
        type="file"
        accept=".pdf,.xlsx,.docx"
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {files.map((file, index) => (
          <div
            key={index}
            className="relative mt-1 bg-gray-200 p-2 rounded-md inline-flex items-center"
            style={{ paddingRight: '50px' }}
          >
            <p className="text-sm">{file.name}</p>

            <IconButton
              size="small"
              onClick={() => handleRemoveFile(index)}
              style={{
                position: 'absolute',
                top: '3px',
                right: '3px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileDroppableForFile;
