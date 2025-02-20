import React, { useState, useEffect } from 'react';
import { NativeSelect, Typography, Stack, FormControl, Grid, Button, TextField, FormLabel, Radio, RadioGroup, Paper, InputLabel, FormControlLabel, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FileDroppable from './FileDroppable';
import { useNavigate, useParams } from 'react-router-dom';
import { getGalleryById, updateGalleryById } from './galleryApii';
import { toast } from 'react-toastify';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;


function EditGallery() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        galleryType: '',
        galleryName: '',
        galleryDescription: '',
        thumbnailImage: null,
        videoUrl: '',
        sliderImage: null,
        status: null,
        multipleImage: null,
    })
    const [idString, setIdString] = useState('')
    const [fetchedThumbnail, setFetchedThumbnail] = useState(null)
    const [fetchedMultipleImage, setFetchedMultipleImage] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                try {
                    const data = await getGalleryById(id);
                    setFormData((prev) => ({
                        ...prev,
                        ...data,
                        thumbnailImage: null,
                        multipleImage: null
                    }))
                    setFetchedThumbnail(data.thumbnailImage);
                    setFetchedMultipleImage(data.multipleImage || [])
                    if (data.uuid) {
                        setIdString(data.uuid)
                    } else {
                        setIdString(null)
                    }
                } catch (error) {
                    console.error('Error fetching gallery data:', error);
                    toast.error('Failed to fetch gallery data');
                }
            }
            const data = await getGalleryById(id)
            setFormData(data)
        };
        fetchData()
    }, [id])

    const handleMultipleImageChange = (images) => {
        const newImages = images.map((image) => ({
            name: image.name,
            type: image.type,
            value: image,
        }));
        setFormData((prev) => ({
            ...prev,
            multipleImage: [...prev.multipleImage, ...newImages],
        }));
    };

    const handleRemoveMultipleImage = (index) => {
        setFetchedMultipleImage(prev => prev.filter((_, i) => i !== index));

        setFormData(prev => ({
            ...prev,
            multipleImage: prev.multipleImage.filter((_, i) => i !== index)
        }));
    };

    const handleImageChange = (updatedFile, type) => {
        setFormData((prev) => ({
            ...prev,
            [type]: updatedFile[0] || null,
        }));
        setFetchedThumbnail(null)
    };

    const handleRemoveFetchedImage = () => {
        setFetchedThumbnail(null);
        setFormData((prev) => ({
            ...prev,
            thumbnailImage: null,
        }));
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = new FormData();
        if (formData.thumbnailImage) {
            updatedData.append('thumbnailImage', formData.thumbnailImage);
        } else if (fetchedThumbnail) {
            updatedData.append('thumbnailImage', fetchedThumbnail);
        }
        if (idString) {
            // updatedData.append('uuid', idString);
        }
        updatedData.append('galleryType', formData.galleryType || '');
        updatedData.append('galleryName', formData.galleryName || '');
        updatedData.append('galleryDescription', formData.galleryDescription || '');
        updatedData.append('videoUrl', formData.videoUrl || '');
        updatedData.append('status', formData.status || '');
        updatedData.append('sliderImage', formData.sliderImage || null);

        if (formData.multipleImage) {
            formData.multipleImage.forEach((image) => {
                if (typeof image === 'string') {
                    updatedData.append('multipleImage[]', image);
                } else {
                    updatedData.append('multipleImage[]', image.value);
                }
            });
        }
        try {
            await updateGalleryById(id, updatedData);
            toast.success('Gallery  updated successfully');
            setTimeout(() => {
                navigate('/admin/viewGallery');
            }, 900);
        } catch (error) {
            console.error('Error updating gallery:', error);
            toast.error('Failed to update gallery');
        }
    };
    return (
        <Grid container className='lg:px-[15rem] pb-10'>
            <h1 className='text-center pb-3 text-2xl  mx-auto'> Edit Gallery </h1>
            <Stack component={Paper} width='100%' elevation='5' padding='20px' direction='column' rowGap='10px'>
                <form onSubmit={handleSubmit}>
                    <Grid container mx='auto' spacing='10px' padding='10px 23px 10px 5px' >
                        <Grid item sm={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel variant="standard" >
                                    Gallery Type
                                </InputLabel>
                                <NativeSelect
                                    defaultValue={formData.galleryType}
                                    name='galleryType'
                                    value={formData.galleryType}
                                    inputProps={{
                                        name: 'galleryType'
                                    }}
                                    size='small'
                                    onChange={handleChange}
                                >
                                    <option value='Image'>Image</option>
                                    <option value='Video'>Video</option>
                                    <option value='Slider'>Slider</option>
                                </NativeSelect>
                            </FormControl>
                        </Grid>

                        <Grid item sm={12} md={9}>
                            <TextField
                                variant='standard'
                                fullWidth
                                size='small'
                                label='Gallery Name'
                                name='galleryName'
                                value={formData.galleryName}
                                InputLabelProps={{
                                    shrink: true
                                }}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item sm={12} md={6}>
                            <TextField
                                InputLabelProps={{
                                    shrink: true
                                }}
                                size='small'
                                disabled={formData.galleryType !== 'Image' && formData.galleryType !== 'Slider'}
                                name='galleryDescription'
                                value={formData.galleryDescription}
                                fullWidth
                                onChange={handleChange}
                                label={formData.galleryType === 'Slider' ? "Image Description" : "Thumbnail Caption"}
                            />
                        </Grid>
                        {
                            formData.galleryType === 'Video' && (

                                <Grid item sm={12} md={6}>
                                    <TextField
                                        fullWidth
                                        size='small'
                                        onChange={handleChange}
                                        name='videoURL'
                                        value={formData.videoUrl}
                                        label='Video URL'
                                        disabled={formData.galleryType !== 'Video'}
                                    />
                                </Grid>
                            )
                        }
                      
                        <Grid item sm={12} md={6}>
                            <FormControl>
                                <div className='flex '>
                                    <FormControl size='small'>
                                        <FormLabel size='small' id="demo-row-radio-buttons-group-label">Activation status ?</FormLabel>
                                        <RadioGroup
                                            row
                                            name="status"
                                            value={formData.status === 'false' ? false : true}
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel value={true} control={<Radio size='small' />} label="Active" />
                                            <FormControlLabel value={false} control={<Radio size='small' />} label="Inactive" />
                                        </RadioGroup>
                                    </FormControl>

                                </div>
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={4} >
                            <Typography>Thumbnail Image</Typography>
                            <FileDroppable
                                name="thumbnailImage"
                                allowMultiple={false}
                                placeholder='Thumbnail image'
                                onImagesChange={(updatedFiles) => handleImageChange(updatedFiles, 'thumbnailImage')}
                            />
                            {fetchedThumbnail && (
                                <div style={{ position: 'relative', marginTop: '5px', width: '60px', height: '60px' }}>
                                    <img src={`${IMAGE_URL}/${fetchedThumbnail}`} alt="Fetched" style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} />
                                    <IconButton
                                        size="small"
                                        onClick={handleRemoveFetchedImage}
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
                            )}
                        </Grid>
                        {
                            formData.galleryType === 'Image' && (
                                <Grid item sm={12} md={8}>
                                    <Typography>Gallery Images</Typography>
                                    <FileDroppable
                                        name='multipleImage'
                                        placeholder='Gallery images'
                                        allowMultiple={true}
                                        onImagesChange={(updatedFiles) => handleMultipleImageChange(updatedFiles, 'multipleImage')}
                                    />
                                    {fetchedMultipleImage.length > 0 && (
                                        <Grid container spacing='5px' className='flex  mt-1' >
                                            {fetchedMultipleImage.map((item, index) => (
                                                <Grid xs={2} item key={index} className='w-full h-[70px] relative wrap'>
                                                    <img src={`${IMAGE_URL}/${idString}/${item}`} style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} />
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleRemoveMultipleImage(index)}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-2px',
                                                            right: '-4px',
                                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                        }}
                                                    >
                                                        <CloseIcon sx={{ fontSize: '13px', color: 'black' }} />
                                                    </IconButton>
                                                </Grid>
                                            ))
                                            }
                                        </Grid>
                                    )}
                                </Grid>
                            )
                        }
                        <Grid item sm={12} md={12}>
                            <Button
                                size='small'
                                type='submit'
                                variant='contained'
                            >
                                Update Gallery
                            </Button>
                        </Grid>
                    </Grid>
                </form >
            </Stack>
        </Grid>
    )
}

export default EditGallery