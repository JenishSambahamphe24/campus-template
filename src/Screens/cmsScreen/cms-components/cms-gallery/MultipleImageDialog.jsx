import { useState, useEffect } from 'react';
import { Typography, Box, Dialog, DialogContent, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import ImageUpload from '../../../../Components/ImageUpload';
import { addMultipleImage } from './galleryApii';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    height: 'auto',
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function MultipleImageDialog({ handleClose, open, id }) {
    const [formData, setFormData] = useState({
        galleryId: id,
        image: null, 
    });

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            galleryId: id,
        }));
    }, [id]);

    const handleImageChange = (imgFile) => {
        setFormData((prev) => ({
            ...prev,
            image: imgFile, 
        }));
    };

    const handleSubmit = async () => {
        if (!formData.image) {
            toast.error('Please upload an image before submitting.');
            return;
        }

        const dataToSend = new FormData();
        dataToSend.append('galleryId', formData.galleryId);
        dataToSend.append('image', formData.image);

        try {
            await addMultipleImage(id, dataToSend);
            toast.success('Images added successfully!');
            setTimeout(() => {
                handleClose();
            }, 900);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Error adding images to the gallery');
        }
    };

    return (
        <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
            <DialogContent>
                <Box mt="10px">
                    <Typography>
                        Please Drag and drop or select images you want to upload to this Gallery.
                    </Typography>
                    <Box>
                    <ImageUpload
                        name='ppImage'
                        label='Member Image'
                        disabled={false}
                        required={true}
                        onImageSelect={handleImageChange}
                    />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: '10px' }} mx="auto">
                        <Button onClick={handleSubmit} color="error" size="small" variant="outlined">
                            Add
                        </Button>
                        <Button sx={{ marginLeft: '20px' }} color="primary" onClick={handleClose} size="small" variant="outlined">
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </BootstrapDialog>
    );
}

