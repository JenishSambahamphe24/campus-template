import React, { useState } from 'react';
import { TextField, Box, LinearProgress, Typography } from '@mui/material';

function FileUpload({ name, label, disabled, required, onFileSelect }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return; // Exit if no file is selected
    onFileSelect(file);
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    // Simulate file upload progress
    const intervalId = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 10;
        } else {
          clearInterval(intervalId);
          setUploading(false);
          return 100;
        }
      });
    }, 200);
  };

  return (
    <Box>
      <TextField
        fullWidth
        size="small"
        disabled={disabled}
        required={required}
        name={name}
        onChange={handleFileUpload}
        label={label}
        type="file"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          accept: "application/pdf, application/vnd.ms-excel, application/msword",
        }}
      />
      {uploading && (
        <Box mt={2}>
          <LinearProgress variant="determinate" value={progress} />
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography fontSize='12px'>Uploading... {progress}%</Typography >
            <Typography fontSize='12px'> {progress}%</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default FileUpload;
