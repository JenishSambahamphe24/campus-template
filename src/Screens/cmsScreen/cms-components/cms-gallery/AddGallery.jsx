import  { useState } from 'react';
import {
    TextField, MenuItem, Select, InputLabel, Button, Grid, FormControl, Typography, Paper,
    RadioGroup, FormLabel, Radio, FormControlLabel
} from '@mui/material';
import FileDroppable from './FileDroppable';
import { addGallery } from './galleryApii';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../../../../Components/ImageUpload';


function AddGallery() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        galleryType: '',
        galleryName: '',
        galleryDescription: '',
        thumbnailImage: null,
        videoUrl: '',
        audioFile: null,
        status: true,
        multipleImage: null,
    });

    const handleImageSelect = (file) => {
        setFormData(prev => ({
            ...prev,
            thumbnailImage: file
        }))
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'status' ? JSON.parse(value) : value,
        }));
    };

    const handleFileUpload = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        setFormData(prev => ({
            ...prev,
            [name]: file,
        }));
    };
    const handleMultipleImageUpload = (images) => {
        const newImages = images.map((image) => ({
            name: image.name,
            type: image.type,
            value: image,
        }));
        setFormData((prev) => ({ ...prev, multipleImage: newImages }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.galleryName || !formData.galleryType) {
            toast.error('Please fill all required fields');
            return;
        }
    
        const payload = new FormData();
        payload.append('galleryType', formData.galleryType);
        payload.append('galleryName', formData.galleryName);
        payload.append('galleryDescription', formData.galleryDescription);
        payload.append('thumbnailImage', formData.thumbnailImage);
        payload.append('videoUrl', formData.videoUrl);
        payload.append('audioFile', formData.audioFile);
        payload.append('status', formData.status);
    
        // Append multiple images only if gallery type is 'Image' and there are images
        if (formData.galleryType === 'Image' && formData.multipleImage) {
            formData.multipleImage.forEach((image) => {
                payload.append('multipleImage', image.value);
            });
        }
    
        try {
            const newGallery = await addGallery(payload);
            console.log(newGallery);
            toast.success('Gallery added successfully', { autoClose: 400 });
            setTimeout(() => {
                navigate('/admin/viewGallery');
            }, 1000);
        } catch (error) {
            console.error('Error adding gallery:', error);
            toast.error('Error adding gallery');
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <Typography variant='h5' textAlign='center'>
                Add New Gallery
            </Typography>

            <Grid container component={Paper} elevation={6} width='70%' mx='auto' my='2rem' spacing={2} pr={2} pt='1rem' pb='2rem'>
                <Grid item md={2}>
                    <FormControl size='small' fullWidth>
                        <InputLabel size='small'>Gallery Type</InputLabel>
                        <Select
                            name='galleryType'
                            value={formData.galleryType}
                            onChange={handleChange}
                            label="Gallery Type"
                            size="small"
                        >
                            <MenuItem value='Image'>Image Gallery</MenuItem>
                            <MenuItem value='Audio'>Audio Gallery</MenuItem>
                            <MenuItem value='Video'>Video Gallery</MenuItem>
                            <MenuItem value='Slider'>Slider</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item md={6}>
                    <TextField
                        fullWidth
                        size='small'
                        label={formData.galleryType === 'Slider' ? "Slider Name" : "Gallery Name"}
                        name='galleryName'
                        value={formData.galleryName}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item md={4}>
                    <ImageUpload
                        name='thumbnailImage'
                        label= {formData.galleryType === 'Slider' ? 'Slider Image': 'ThumbnailImage Image'}
                        disabled={formData.galleryType !== 'Image' && formData.galleryType !== 'Slider'}
                        required={formData.galleryType === 'Image' }
                        onImageSelect={handleImageSelect}
                    />
                </Grid>
                <Grid item md={12}>
                    <TextField
                        fullWidth
                        size='small'
                        label={formData.galleryType === 'Slider' ? "Slider description" : "Gallery description"}
                        name='galleryDescription'
                        value={formData.galleryDescription}
                        onChange={handleChange}
                        disabled={formData.galleryType !== 'Image' && formData.galleryType !== 'Slider'}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item md={6}>
                    <TextField
                        fullWidth
                        size='small'
                        name='videoUrl'
                        value={formData.videoUrl}
                        onChange={handleChange}
                        label='Video URL'
                        disabled={formData.galleryType !== 'Video'}
                    />
                </Grid>
                <Grid item md={6}>
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        size="small"
                        fullWidth
                        label="Audio File"
                        type="file"
                        name='audioFile'
                        disabled={formData.galleryType !== 'Audio'}
                        inputProps={{
                            accept: '.mp3, .wav, .ogg'
                        }}

                        onChange={handleFileUpload}
                    />
                </Grid>
                {
                    formData.galleryType === 'Image' && (
                        <Grid item md={12}>
                            <FileDroppable
                                placeholder=' upload gallery images'
                                name='multipleImage'
                                allowMultiple={true}
                                onImagesChange={handleMultipleImageUpload}
                            />
                        </Grid>
                    )
                }
                <Grid item md={6}>
                    <FormControl>
                        <FormLabel id="status">Status</FormLabel>
                        <RadioGroup row value={formData.status} onChange={handleChange} name="status">
                            <FormControlLabel value={true} control={<Radio size="small" />} label="Active" />
                            <FormControlLabel value={false} control={<Radio size="small" />} label="Inactive" />
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Grid item md={12} textAlign='center'>
                    <Button type='submit' variant='contained'>
                        Add Gallery
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}

export default AddGallery;
