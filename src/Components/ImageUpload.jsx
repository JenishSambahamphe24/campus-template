import React, { useState } from 'react';
import { TextField, Box, LinearProgress, Typography } from '@mui/material';

function ImageUpload({ name, label, disabled, required, onImageSelect }) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        onImageSelect(file);
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

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
        }, 100);
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
                    accept: '.png, .jpg, .jpeg'
                }}
            />
            {uploading && (
                <Box mt={2}>
                    <LinearProgress variant="determinate" value={progress} />
                    <Box display="flex" justifyContent="space-between" mt={1}>
                        <Typography fontSize='12px'>Uploading... {progress}%</Typography >
                        <Typography fontSize='12px'>{progress}%</Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default ImageUpload;
